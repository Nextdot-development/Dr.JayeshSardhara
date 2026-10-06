"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Paging for a native CSS scroll-snap track.
 *
 * The track does the scrolling itself — `overflow-x-auto snap-x snap-mandatory` on the
 * element this hook's ref is attached to. Nothing here moves items or duplicates them;
 * the hook only reads where the track is and scrolls it on request. That keeps drag,
 * touch-flick, keyboard and trackpad behaviour native, and means the carousel still works
 * with JavaScript disabled, just without the controls.
 *
 * Pages are derived from the track's own geometry rather than the item count, so a
 * responsive basis (2-up on phones, 4-up on desktop) reports the right number of pages at
 * every width without the breakpoints being restated here.
 */

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useSnapCarousel(
  count: number,
  { autoplay = 0, paused = false }: { autoplay?: number; paused?: boolean } = {},
) {
  const track = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState(1);
  const [active, setActive] = useState(0);
  /** True while the pointer is over the track or focus is inside it. */
  const [held, setHeld] = useState(false);

  /**
   * Page count from the track's geometry. Measured by ResizeObserver only — it delivers an
   * initial observation on observe(), so there is no synchronous setState in the effect
   * body, which react-hooks/set-state-in-effect would reject.
   */
  useEffect(() => {
    const el = track.current;
    if (!el) return;

    const measure = () => {
      const width = el.clientWidth;
      if (width <= 0) return;
      setPages(Math.max(1, Math.round(el.scrollWidth / width)));
    };

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    // Items can change width without the track doing so (an image finishing decode).
    for (const child of Array.from(el.children)) observer.observe(child);
    return () => observer.disconnect();
  }, [count]);

  /** Active page follows the real scroll position, coalesced to one read per frame. */
  useEffect(() => {
    const el = track.current;
    if (!el) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const width = el.clientWidth || 1;
        const last = Math.max(0, Math.round(el.scrollWidth / width) - 1);
        setActive(Math.min(Math.max(0, Math.round(el.scrollLeft / width)), last));
      });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const goTo = useCallback((page: number) => {
    const el = track.current;
    if (!el) return;
    const width = el.clientWidth;
    el.scrollTo({ left: page * width, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, []);

  /**
   * Autoplay. Off entirely when the interval is 0, while something above has paused it
   * (the lightbox being open), while the pointer or focus is inside the track, when there
   * is only one page, and under prefers-reduced-motion. `document.hidden` is checked per
   * tick so a backgrounded tab does not silently advance.
   */
  useEffect(() => {
    if (!autoplay || paused || held || pages < 2 || prefersReducedMotion()) return;

    const id = window.setInterval(() => {
      const el = track.current;
      if (!el || document.hidden) return;
      const width = el.clientWidth || 1;
      const total = Math.max(1, Math.round(el.scrollWidth / width));
      const next = (Math.round(el.scrollLeft / width) + 1) % total;
      el.scrollTo({ left: next * width, behavior: "smooth" });
    }, autoplay);

    return () => window.clearInterval(id);
  }, [autoplay, paused, held, pages]);

  /** Spread onto the element wrapping the track, so hovering or tabbing in halts autoplay. */
  const holdProps = useMemo(
    () => ({
      onPointerEnter: () => setHeld(true),
      onPointerLeave: () => setHeld(false),
      onFocusCapture: () => setHeld(true),
      onBlurCapture: () => setHeld(false),
    }),
    [],
  );

  return { track, active, pages, goTo, holdProps };
}

const ARROW =
  "inline-flex h-9 w-9 items-center justify-center rounded-full text-navy-800 ring-1 ring-navy-200 transition-colors hover:border-teal-500 hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 disabled:opacity-40 disabled:pointer-events-none dark:text-white/80 dark:ring-white/15";

/**
 * Dots plus prev/next for a `useSnapCarousel` track.
 *
 * Renders nothing when everything already fits on one page — controls for a carousel that
 * cannot move are noise, and at desktop widths a short gallery often does fit.
 *
 * `noun` names the items for screen readers ("Previous photograph", "Go to photograph 2
 * of 3") so the labels read naturally wherever this is reused.
 */
export function CarouselControls({
  active,
  pages,
  onGo,
  noun = "slide",
  className,
}: {
  active: number;
  pages: number;
  onGo: (page: number) => void;
  noun?: string;
  className?: string;
}) {
  if (pages < 2) return null;

  return (
    <div className={cn("mt-6 flex items-center justify-between gap-4", className)}>
      <div className="flex items-center gap-2">
        {Array.from({ length: pages }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onGo(i)}
            aria-label={`Go to ${noun} ${i + 1} of ${pages}`}
            aria-current={i === active ? "true" : undefined}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400",
              i === active ? "w-6 bg-navy-800 dark:bg-teal-300" : "w-1.5 bg-navy-900/20 hover:bg-navy-900/40 dark:bg-white/25",
            )}
          />
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onGo(Math.max(0, active - 1))}
          disabled={active === 0}
          aria-label={`Previous ${noun}`}
          className={ARROW}
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => onGo(Math.min(pages - 1, active + 1))}
          disabled={active === pages - 1}
          aria-label={`Next ${noun}`}
          className={ARROW}
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </div>
  );
}
