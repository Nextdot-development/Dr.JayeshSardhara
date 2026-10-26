import Image from "next/image";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { VideoEmbed } from "@/components/ui/video-embed";
import { doctor, aboutVideo } from "@/lib/data";

/**
 * Introduction video and the migrated certificate, paired in one row.
 *
 * The video is 16:9 and the certificate is portrait, so side by side they fill the band
 * that the video alone left half empty on wide screens. Both columns keep their own
 * eyebrow + heading, so each is still a titled subsection rather than one heading
 * spanning two unrelated things.
 *
 * `aria-label` on each column rather than `aria-labelledby`: SectionHeading renders the
 * <h2> and takes no `id`, and it is shared by every page on the site — labelling here
 * avoids reaching into a component this change has no business touching.
 */
export function AboutVideoAndCertificate() {
  return (
    <section className="border-t border-border py-14 lg:py-18">
      <Container>
        <div className="grid items-start gap-14 lg:grid-cols-12 lg:gap-16">
          <section aria-label="About Jayesh Sardhara" className="lg:col-span-7">
            <SectionHeading eyebrow="Video" title="About Jayesh Sardhara" />
            {/* VideoEmbed handles the rest: real poster from YouTube's thumbnail CDN,
                centred play button, and the iframe is only mounted on click. */}
            <Reveal className="mt-10">
              <VideoEmbed video={aboutVideo} />
            </Reveal>
          </section>

          <section aria-label="Certificates" className="lg:col-span-5">
            <SectionHeading eyebrow="Certificates" title="Credentials on record" />
            {/* Capped at 22rem so the portrait scan lands at roughly the video's height
                instead of towering over it.

                `sizes` MUST track that cap. The source is 2480x3509, but with a `sizes`
                hint next/image picks the srcset candidate from the rendered width — the
                old `20rem` was written for the 20rem box this used to sit in, and leaving
                it here would have the browser fetch a narrower file than the box it now
                fills and upscale it. This is the one line that keeps the scan sharp. */}
            <Reveal className="mt-10 max-w-[22rem]">
              <div className="relative aspect-[212/300] overflow-hidden border border-navy-900/10 bg-surface-2 dark:border-white/10">
                <Image
                  src="/wp-content/uploads/2024/02/DOC-20240220-WA0052_240220_202124.jpg"
                  alt={`Certificate awarded to ${doctor.name}`}
                  fill
                  sizes="(min-width: 1024px) 22rem, (min-width: 640px) 20rem, 90vw"
                  className="object-contain"
                />
              </div>
            </Reveal>
          </section>
        </div>
      </Container>
    </section>
  );
}
