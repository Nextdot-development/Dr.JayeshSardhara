import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { awardsGallery } from "@/lib/data";

/**
 * The Elementor image carousel of award photographs from the live WordPress homepage
 * (section 5). Rendered as a static responsive grid: same images, no carousel dependency.
 *
 * Renders on `/` — where the live site had it, immediately after the appointment form —
 * and on /news-awards/. It was moved off the homepage in the 2026-09-04 density pass as
 * a third awards touchpoint; restored 2026-09-04 because home-content.json marks it
 * visible and the brief is to reproduce the live page. The images are unchanged.
 */
export function AwardsGallery({ className }: { className?: string }) {
  return (
    <section className={className ?? "pb-16 lg:pb-20"} aria-label="Award photographs">
      <Container>
        <span className="flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-teal-700 dark:text-teal-300">
          <span className="h-px w-8 bg-teal-600/50" /> Gallery
        </span>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {awardsGallery.map((img, i) => (
            <Reveal key={img.src} delay={(i % 4) * 0.05}>
              <div className="relative aspect-square overflow-hidden border border-navy-900/10 bg-surface-2 dark:border-white/10">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 1024px) 22vw, 45vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
