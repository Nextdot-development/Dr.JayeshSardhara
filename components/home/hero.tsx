"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

const rise = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

/**
 * Full-bleed hero banner: the WordPress hero background running edge to edge, with the
 * headline sitting on a warm scrim over its left third.
 *
 * The background is the live site's own hero asset (1920x1080, brain + cervical spine
 * imaging). It is dark blue, so the copy is never placed on top of it directly — the
 * gradient below fades the page background across the left ~60% to keep the burgundy
 * headline and the fixed navbar at AA contrast, and lets the imaging show through on the
 * right where nothing overlaps it. `object-right` keeps the spine, not the empty middle,
 * in frame as the viewport narrows.
 */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/wp-content/uploads/2025/01/JAYESH-HOME-PAGE2-1.png"
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="object-cover object-right"
        />
        {/* Legibility scrim. Two stops rather than one so the headline sits on a flat
            wash instead of a visible ramp behind the text itself. */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 via-45% to-background/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
      </div>

      <Container>
        <div className="max-w-2xl py-28 sm:py-32 lg:py-40">
          <motion.p
            variants={rise}
            custom={0}
            initial="hidden"
            animate="show"
            className="flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-teal-700 dark:text-teal-300"
          >
            <span className="h-px w-8 bg-teal-600/50" />
            {/* Live WordPress hero eyebrow, verbatim. */}
            feel the difference with us
          </motion.p>

          <motion.h1
            variants={rise}
            custom={1}
            initial="hidden"
            animate="show"
            className="mt-6 font-display text-[2.6rem] font-medium leading-[1.02] tracking-[-0.02em] text-navy-900 xs:text-[3.1rem] sm:text-6xl lg:text-[4.7rem] dark:text-white"
          >
            {/* Live WordPress H1 was the fragment "Your Health Is", with "Our Priority" in a
                separate <p>. Same words, completed into one heading — see home-content.json
                seo.headingAudit. */}
            Your Health Is
            <br />
            <em className="not-italic text-gradient font-display italic">Our Priority</em>
          </motion.h1>

          <motion.div
            variants={rise}
            custom={2}
            initial="hidden"
            animate="show"
            className="mt-9"
          >
            <Button href="#book_now" size="lg">
              Book An Appointment <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
