import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { VideoEmbed } from "@/components/ui/video-embed";
import { videos } from "@/lib/data";

/**
 * Surgical technique and patient-education videos, migrated from the live homepage's
 * Elementor video widgets. Every player is click-to-load — see components/ui/video-embed.tsx.
 *
 * Density pass 2026-09-04: these were already click-to-play facades in a 3-across grid, so
 * 5 items wrapped onto two rows. Widened to 5-across at lg so all five sit on one row.
 * Same five videos, same facades, no player loads until clicked.
 */
export function Videos() {
  const items = videos.home;
  if (!items?.length) return null;

  return (
    <section className="border-t border-border py-16 lg:py-20" id="videos">
      <Container>
        <SectionHeading
          layout="split"
          index="08"
          eyebrow="Watch"
          title="Surgical technique & patient education"
          description="Recorded procedures, explainers and interviews — from the operating theatre and the consulting room."
        />
        <div className="mt-8 grid gap-x-5 gap-y-8 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((v, i) => (
            <Reveal key={`${v.id}-${i}`} delay={(i % 5) * 0.05}>
              <VideoEmbed video={v} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
