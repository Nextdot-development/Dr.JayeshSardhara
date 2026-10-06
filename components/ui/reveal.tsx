import type { ReactNode } from "react";

/**
 * Layout wrappers that used to fade and rise their children into view.
 *
 * The animation is gone along with GSAP; these now render their children directly. The
 * props are kept so the 20 call sites did not have to change, and so the intent stays
 * visible if motion is ever reintroduced — `delay` and `y` are accepted and ignored.
 *
 * No "use client" and no hooks any more, so these are server components wherever their
 * parent is one, and ship no JavaScript at all.
 */

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Ignored. Retained so existing call sites keep type-checking. */
  delay?: number;
  /** Ignored. Retained so existing call sites keep type-checking. */
  y?: number;
  as?: "div" | "section" | "li" | "article" | "span";
};

export function Reveal({ children, className, as: Tag = "div" }: RevealProps) {
  return <Tag className={className}>{children}</Tag>;
}

export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
