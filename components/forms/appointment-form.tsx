"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { ButtonAction } from "@/components/ui/button";

const services = [
  "Brain Tumor Surgery",
  "Spine Surgery",
  "Minimally Invasive Spine",
  "Deep Brain Stimulation",
  "General Consultation",
  "Second Opinion",
];

const field =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted/70 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/25";
const label = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted";

export function AppointmentForm() {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    // Front-end demo submission — wire to an API route / CRM in production.
    setTimeout(() => setState("done"), 1100);
  }

  if (state === "done") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-teal-200 bg-teal-500/5 p-6 text-center sm:p-10">
        <CheckCircle2 className="h-14 w-14 text-teal-500" />
        <h3 className="text-xl font-semibold text-navy-900 dark:text-white">Request received</h3>
        <p className="max-w-sm text-sm text-muted">
          Thank you. Our care team will call you shortly to confirm your appointment time.
        </p>
        <ButtonAction variant="secondary" onClick={() => setState("idle")}>
          Book another
        </ButtonAction>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="name" className={label}>Full Name</label>
        <input id="name" name="name" required placeholder="Your name" className={field} />
      </div>
      <div>
        <label htmlFor="phone" className={label}>Phone</label>
        <input id="phone" name="phone" type="tel" required placeholder="+91 …" className={field} />
      </div>
      <div>
        <label htmlFor="email" className={label}>Email</label>
        <input id="email" name="email" type="email" placeholder="you@email.com" className={field} />
      </div>
      <div>
        <label htmlFor="service" className={label}>Service</label>
        <select id="service" name="service" className={field} defaultValue="">
          <option value="" disabled>Select a service</option>
          {services.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="date" className={label}>Preferred Date</label>
        <input id="date" name="date" type="date" className={field} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="message" className={label}>Message (optional)</label>
        <textarea id="message" name="message" rows={3} placeholder="Briefly describe your condition…" className={field} />
      </div>
      <div className="sm:col-span-2">
        <ButtonAction type="submit" size="lg" className="w-full" disabled={state === "loading"}>
          {state === "loading" ? (
            <><Loader2 className="h-5 w-5 animate-spin" /> Sending…</>
          ) : (
            "Request Appointment"
          )}
        </ButtonAction>
        <p className="mt-3 text-center text-xs text-muted">
          By submitting you agree to be contacted about your appointment. Your details stay private.
        </p>
      </div>
    </form>
  );
}
