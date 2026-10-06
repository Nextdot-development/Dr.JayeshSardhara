"use client";

import { useEffect, useRef } from "react";

/**
 * Page-read progress bar.
 *
 * Not an animation — the bar's position is a readout of where the reader is, so it stayed
 * when GSAP's ScrollTrigger went. A passive scroll listener coalesced into one rAF per
 * frame replaces it.
 *
 * The width is written straight to the element's transform rather than through React
 * state: this fires on every scroll frame, and a re-render per frame would be wasteful for
 * a value nothing else reads.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    const update = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      el.style.transform = `scaleX(${progress})`;
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ transform: "scaleX(0)" }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-navy-600 to-teal-500"
      aria-hidden="true"
    />
  );
}
