import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { awardsGallery } from "@/lib/data";

/**
 * Section 5 of the live WordPress homepage — an Elementor image carousel of award photos.
 * Rendered as a static responsive grid: same images, no carousel dependency.
 */
export function AwardsGallery() {
  return (
    <section className="py-16 lg:py-20">
      <Container>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
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
