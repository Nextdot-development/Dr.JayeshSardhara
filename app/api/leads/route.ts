import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { CMS_ENABLED, SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/supabase/config";

/**
 * Persist a patient enquiry.
 *
 * Runs on the server so the validation below cannot be skipped by a crafted request and
 * so the stored record is built from cleaned input, not from whatever the browser sent.
 *
 * It does NOT send the notification email. That goes straight from the browser to
 * FormSubmit, because FormSubmit refuses requests originating from cloud IPs and this
 * site runs on Vercel — a server-side relay was tried and failed in production for
 * exactly that reason. The form calls this route first and the email second, so a lead
 * is never lost to an email failure.
 *
 * The PUBLISHABLE key is used, not a service-role key. The `leads_anon_insert` policy
 * grants anon INSERT and nothing else: this route can file an enquiry and cannot read
 * one back. A service-role key here would be able to read every patient record in the
 * project, which is precisely the thing worth not having in a web process.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const LIMITS = {
  name: 120,
  phone: 40,
  email: 160,
  service: 80,
  preferred_date: 40,
  message: 4000,
  source: 60,
  source_path: 200,
} as const;

type Field = keyof typeof LIMITS;

function clean(value: unknown, field: Field): string {
  if (typeof value !== "string") return "";
  // Strip control characters; trim; cap at the column's working length.
  return value.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, LIMITS[field]);
}

/** Matches the form's own rule, so a direct POST cannot store something the UI rejects. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  if (!CMS_ENABLED) {
    // Same rollback switch the rest of the CMS honours: with Supabase unconfigured the
    // site still works, the enquiry just is not stored. The caller still sends the email.
    console.error("[leads] Supabase is not configured; the enquiry was not stored.");
    return NextResponse.json({ ok: false, error: "Lead storage is not configured." }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object") throw new Error("not an object");
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  // Honeypot. Answer 200 so the bot believes it succeeded and does not retry, and
  // store nothing.
  if (clean(body.company, "name")) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const submissionId = clean(body.submission_id, "name");
  if (!UUID_RE.test(submissionId)) {
    return NextResponse.json({ ok: false, error: "Missing submission id." }, { status: 400 });
  }

  const name = clean(body.name, "name");
  const phone = clean(body.phone, "phone");
  const email = clean(body.email, "email");

  if (!name || !phone) {
    return NextResponse.json({ ok: false, error: "Name and phone are required." }, { status: 400 });
  }
  if (email && !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "That email address looks wrong." }, { status: 400 });
  }

  const row = {
    submission_id: submissionId,
    name,
    phone,
    email: email || null,
    service: clean(body.service, "service") || null,
    preferred_date: clean(body.preferred_date, "preferred_date") || null,
    message: clean(body.message, "message") || null,
    source: clean(body.source, "source") || "appointment-form",
    source_path: clean(body.source_path, "source_path") || null,
  };

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });

    /**
     * A plain INSERT, not an upsert, and the unique constraint on `submission_id` is what
     * makes a retry safe: the second attempt collides and is reported as success.
     *
     * Upsert was the obvious choice and is wrong here. Postgres treats
     * `INSERT ... ON CONFLICT DO UPDATE` as needing UPDATE permission as well as INSERT,
     * even when nothing actually conflicts — so every submission was rejected by RLS
     * (42501) until this became a plain insert. Granting anon UPDATE would have fixed the
     * symptom and let any visitor rewrite existing leads, including their status.
     */
    const { error } = await supabase.from("leads").insert(row);

    if (error) {
      // 23505 = unique violation on submission_id. The enquiry is already recorded, so a
      // retry of the same submission has done its job; reporting failure would only
      // prompt the patient to send a third copy.
      if (error.code === "23505") {
        return NextResponse.json({ ok: true, duplicate: true });
      }
      console.error("[leads] insert failed:", error.message);
      return NextResponse.json({ ok: false, error: "We could not record your request." }, { status: 502 });
    }
  } catch (err) {
    console.error("[leads] could not reach Supabase:", err);
    return NextResponse.json({ ok: false, error: "We could not record your request." }, { status: 502 });
  }

  // Deliberately returns no lead data — the public caller has no business reading rows
  // back, and the RLS policy would not allow it anyway.
  return NextResponse.json({ ok: true });
}
