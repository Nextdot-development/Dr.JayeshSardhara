"use client";

import { useEffect } from "react";

/**
 * Page scroll lock, shared by the mobile nav panel and the gallery lightbox.
 *
 * Previously this also had to stop Lenis, which drove the window scroll from its own
 * wheel/touch handling and ignored the body's overflow. With smooth scrolling removed the
 * page scrolls natively again, so `overflow: hidden` is the whole mechanism.
 *
 * Reference-counted: two things can be open at once (the lightbox opened from a page whose
 * nav panel is also open), and the first one to close must not release the lock for both.
 */

let depth = 0;
let previousOverflow = "";
let previousPaddingRight = "";

function lock() {
  depth += 1;
  if (depth > 1) return;

  const body = document.body;
  previousOverflow = body.style.overflow;
  previousPaddingRight = body.style.paddingRight;

  // Removing the scrollbar reflows the page a few pixels wider. Reserving its width keeps
  // the content still. Zero on overlay-scrollbar platforms, which is most phones — where
  // the nav panel actually lives.
  const gap = window.innerWidth - document.documentElement.clientWidth;
  if (gap > 0) {
    body.style.paddingRight = `${gap}px`;
    // The header is `fixed`, so body padding does not move it; it pads itself from this.
    document.documentElement.style.setProperty("--scrollbar-gap", `${gap}px`);
  }

  body.style.overflow = "hidden";
}

function unlock() {
  depth = Math.max(0, depth - 1);
  if (depth > 0) return;

  const body = document.body;
  body.style.overflow = previousOverflow;
  body.style.paddingRight = previousPaddingRight;
  document.documentElement.style.removeProperty("--scrollbar-gap");
}

/** Locks page scroll while `active` is true, releasing it on false or unmount. */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    lock();
    return unlock;
  }, [active]);
}
