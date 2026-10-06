"use client";

import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { doctor } from "@/lib/data";

export function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);
  const [bubble, setBubble] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    const t = setTimeout(() => setBubble(true), 2600);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(t);
    };
  }, []);

  const href = `https://wa.me/${doctor.whatsapp}?text=${encodeURIComponent(
    "Hello Dr. Sardhara's clinic, I'd like to book a consultation.",
  )}`;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {bubble && visible && (
        <div
          className="relative max-w-[220px] rounded-2xl bg-white px-4 py-3 text-sm shadow-glow ring-1 ring-border dark:bg-navy-800"
        >
          <button
            onClick={() => setBubble(false)}
            aria-label="Dismiss"
            className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-navy-900 text-white dark:bg-teal-500 dark:text-navy-950"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <p className="font-semibold text-navy-900 dark:text-white">Need help? 👋</p>
          <p className="mt-0.5 text-muted">Chat with our care team on WhatsApp.</p>
        </div>
      )}

      {visible && (
        /* whileHover/whileTap became CSS transforms — a hover this small does not need a
           tween, and the transition is compositor-only either way. */
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-glow transition-transform duration-200 hover:scale-[1.08] active:scale-[0.94]"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-40" />
          <MessageCircle className="relative h-7 w-7" fill="currentColor" />
        </a>
      )}
    </div>
  );
}
