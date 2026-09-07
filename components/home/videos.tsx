import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { VideoEmbed } from "@/components/ui/video-embed";
import { videos } from "@/lib/data";

/**
 * Surgical technique and patient-education videos, migrated from the live homepage's
 * Elementor video widgets. Every player is click-to-load — see components/ui/video-embed.tsx.
 *
 * Three across. The homepage carries five videos in total; the export attaches two of them
 * to sections 7 and 8, which render them inline (see lib/data.ts `homeInlineVideos`), and
 * these three to the gallery. All five still render, each where the live page had it.
 */
export function Videos() {
  const items = videos.home;
  if (!items?.length) return null;

  return (
    <section className="border-t border-border py-20 lg:py-24" id="videos">
      <Container>
        <SectionHeading
          layout="split"
          index="05"
          eyebrow="Watch"
          title="Surgical technique & patient education"
          description="Recorded procedures, explainers and interviews — from the operating theatre and the consulting room."
        />
        <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((v, i) => (
            <Reveal key={`${v.id}-${i}`} delay={(i % 3) * 0.05}>
              <VideoEmbed video={v} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
