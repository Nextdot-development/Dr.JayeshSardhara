import { NextResponse } from "next/server";
import { siteUrl } from "@/lib/data";

/**
 * Appointment request -> email, relayed through FormSubmit (formsubmit.co).
 *
 * Until this route existed, <AppointmentForm> called preventDefault(), waited 1100ms on a
 * setTimeout and showed "Request received. Our care team will call you shortly." Nothing
 * was sent anywhere; every submission was discarded. On a site whose service list includes
 * "Second Opinion" that is worse than having no form at all, because the patient believes
 * a clinic now holds their details.
 *
 * FormSubmit is called from the server rather than posting the form straight at it. Doing
 * it this way keeps three things that a direct browser POST would give up: the destination
 * address never reaches the client bundle, the validation below still runs on input a
 * crafted request could otherwise skip, and the honeypot is still checked. It also means
 * the form component needs no knowledge of the provider at all.
 *
 * No API key: FormSubmit authorises by emailing the destination a one-time confirmation
 * link the first time an address is used. Until that link is clicked it accepts requests
 * but delivers nothing, so the first real submission is the activation step.
 *
 * The route never reports success it cannot back up: if FormSubmit rejects the send, it
 * returns an error and the form surfaces it with the practice's phone number. A silent
 * failure here reintroduces the original bug in a subtler form.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** The /ajax/ endpoint answers with JSON instead of redirecting to a thank-you page. */
const TO = process.env.APPOINTMENT_TO ?? "nextdot.agency@gmail.com";

/**
 * FormSubmit checks the request's Origin/Referer and refuses anything without one, with
 * the misleading message "Make sure you open this page through a web server". A browser
 * sets those automatically; a server-side fetch sends neither, so without these two
 * headers every relayed submission was rejected before it was even looked at.
 */
const ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? siteUrl;
const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${encodeURIComponent(TO)}`;

const LIMITS = { name: 120, phone: 40, email: 160, service: 80, date: 40, message: 4000 } as const;

type Field = keyof typeof LIMITS;

function clean(value: unknown, field: Field): string {
  if (typeof value !== "string") return "";
  // Strip control characters so nothing can inject extra header-looking lines.
  return value.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, LIMITS[field]);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object") throw new Error("not an object");
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  // Honeypot: a field hidden from people but filled by most naive bots. Answer 200 so the
  // bot sees success and does not retry, while nothing is sent.
  if (clean(body.company, "name")) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, "name");
  const phone = clean(body.phone, "phone");
  const email = clean(body.email, "email");
  const service = clean(body.service, "service");
  const date = clean(body.date, "date");
  const message = clean(body.message, "message");

  // Mirrors the `required` attributes on the form; a POST that skips the browser still
  // has to satisfy them.
  if (!name || !phone) {
    return NextResponse.json({ ok: false, error: "Name and phone are required." }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "That email address looks wrong." }, { status: 400 });
  }

  /**
   * FormSubmit emails whatever keys it is given, using them as the row labels, so the
   * field names below are what the practice reads in the inbox. The `_`-prefixed keys are
   * its own directives, not data.
   */
  const payload = {
    Name: name,
    Phone: phone,
    Email: email || "(not given)",
    Service: service || "(not selected)",
    "Preferred date": date || "(no preference)",
    Message: message || "(none)",
    Submitted: new Date().toISOString(),

    _subject: `Appointment request — ${name}${service ? ` (${service})` : ""}`,
    _template: "table",
    // Off because this request is already server-side; a CAPTCHA here would be answered by
    // the server, not the visitor, so it protects nothing and only risks blocking delivery.
    _captcha: "false",
    // Reply in the inbox goes to the patient. Omitted when they left email blank, since
    // FormSubmit rejects a malformed value outright.
    ...(email ? { _replyto: email } : {}),
  };

  try {
    const res = await fetch(FORMSUBMIT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Origin: ORIGIN,
        Referer: `${ORIGIN}/appointment/`,
      },
      body: JSON.stringify(payload),
    });

    const detail = await res.text().catch(() => "");
    // `success` comes back as the string "true" from the AJAX endpoint, and as a boolean
    // from some responses — both are accepted rather than assuming one shape.
    let ok = res.ok;
    try {
      const parsed = JSON.parse(detail) as { success?: unknown };
      ok = res.ok && (parsed.success === true || parsed.success === "true");
    } catch {
      // Non-JSON body: fall back to the status code alone.
    }

    if (!ok) {
      // The activation state shows up here: until the one-time confirmation link emailed
      // to the destination is clicked, FormSubmit answers with a message saying so.
      console.error("[appointment] FormSubmit rejected the send:", res.status, detail.slice(0, 500));
      return NextResponse.json(
        { ok: false, error: "We could not send your request just now. Please call us instead." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("[appointment] Could not reach FormSubmit:", err);
    return NextResponse.json(
      { ok: false, error: "We could not send your request just now. Please call us instead." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
