import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { VideoEmbed } from "@/components/ui/video-embed";
import { videos } from "@/lib/data";

/**
 * Surgical technique and patient-education videos, migrated from the live homepage's
 * Elementor video widgets. Every player is click-to-load — see components/ui/video-embed.tsx.
 */
export function Videos() {
  const items = videos.home;
  if (!items?.length) return null;

  return (
    <section className="border-t border-border py-24 lg:py-32" id="videos">
      <Container>
        <SectionHeading
          index="08"
          eyebrow="Watch"
          title="Surgical technique & patient education"
          description="Recorded procedures, explainers and interviews — from the operating theatre and the consulting room."
        />
        <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((v, i) => (
            <Reveal key={`${v.id}-${i}`} delay={(i % 3) * 0.06}>
              <VideoEmbed video={v} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
