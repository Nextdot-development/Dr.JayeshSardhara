"use client";

import { ArrowRight, Star } from "lucide-react";
import { Container } from "@/components/ui/container";
import { googleReviews, doctor } from "@/lib/data";

function GoogleG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

/**
 * Patient stories.
 *
 * Density pass 2026-09-04: was a full-bleed featured quote stacked above a 3-card row
 * (1,240px) showing 4 of the 9 reviews. Now a single scroll-snap row carrying ALL NINE —
 * more content in the markup, in roughly a third of the height. Reviews are real Google
 * reviews traced to the practice's live widget; see lib/data.ts.
 */
export function Testimonials() {
  return (
    <section className="bg-navy-950 py-16 text-white lg:py-20" id="stories">
      <Container>
        <div className="flex flex-col gap-5 border-b border-white/15 pb-7 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-teal-300">
              <span className="font-display normal-case tracking-normal text-white/40">05</span>
              <span className="h-px w-8 bg-teal-400/50" /> Patient Stories
            </span>
            <h2 className="mt-4 max-w-2xl font-display text-[1.9rem] font-medium leading-[1.12] sm:text-[2.4rem]">
              Real journeys. Real recoveries.
            </h2>
          </div>
          <a
            href="/testimonials/"
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-white/80 hover:text-white"
          >
            All Google reviews
            <ArrowRight className="h-4 w-4 text-teal-300 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </Container>

      {/* Horizontal rail. Aligned by living inside the Container and cancelling only its
          right padding with a negative margin — NOT with a 100vw calc, which counts the
          scrollbar the centred container does not and left the cards 5px out at >=1440px. */}
      <Container className="mt-8">
        <div
          className="-mr-5 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 pr-5 sm:-mr-8 sm:pr-8 lg:-mr-10 lg:pr-10 [scrollbar-width:thin]"
          role="region"
          aria-label="Patient reviews from Google"
        >
          {googleReviews.map((t, i) => (
            <figure
              key={`${t.name}-${i}`}
              className="flex w-[19rem] shrink-0 snap-start flex-col border border-white/12 bg-white/[0.04] p-5 sm:w-[21rem]"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-1 text-gold-400">
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <Star key={s} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <GoogleG className="h-4 w-4" />
              </div>
              {/* line-clamp is CSS-only: the full review text stays in the markup, and
                  unabridged copies of all nine live at /testimonials/. */}
              <blockquote className="mt-3 line-clamp-6 flex-1 text-[0.9rem] leading-relaxed text-white/80">
                &ldquo;{t.text}&rdquo;
              </blockquote>
              <figcaption className="mt-4 border-t border-white/10 pt-3 text-sm">
                <span className="font-semibold">{t.name}</span>
                <span className="ml-2 text-white/50">{t.date}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>

      <Container>
        <p className="mt-6 flex items-center gap-2 text-sm text-white/50">
          <GoogleG className="h-4 w-4" />
          Rated <span className="font-semibold text-white">{doctor.rating.toFixed(1)}</span> across {doctor.reviews}{" "}
          Google reviews.
        </p>
      </Container>
    </section>
  );
}
