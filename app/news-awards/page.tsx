import type { Metadata } from "next";
import { StoredJsonLd } from "@/components/seo/json-ld";
import { getDocByFileSlug, metadataFromDoc } from "@/lib/content";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { CtaBand } from "@/components/ui/cta-band";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/section-heading";
import { VideoEmbed } from "@/components/ui/video-embed";
import { AwardsGallery } from "@/components/awards-gallery";
import { awards, doctor, pressCoverage, newsItems, videos } from "@/lib/data";

const doc = getDocByFileSlug("news-awards")!;

export const metadata: Metadata = metadataFromDoc(doc);

const metrics = [
  { value: `${doctor.publications}`, label: "Research Publications" },
  { value: `0${doctor.books}`, label: "Books Authored" },
  { value: `0${doctor.patents}`, label: "Patent Held" },
  { value: "04+", label: "Major Awards" },
];

export default function AwardsPage() {
  return (
    <>
      <StoredJsonLd schema={doc.schema} />
      <PageHero
        eyebrow="Awards & Recognition"
        breadcrumb="Awards"
        title="Recognised for excellence"
        description="A career shaped by national awards, gold medals, research honours and leadership within India's neurosurgical community."
      />

      {/* metrics strip */}
      <section className="border-b border-border">
        <Container>
          <dl className="grid grid-cols-2 sm:grid-cols-4">
            {metrics.map((m, i) => (
              <div
                key={m.label}
                className={`py-10 ${i !== 0 ? "sm:border-l sm:border-border sm:pl-8" : ""} ${i % 2 !== 0 ? "border-l border-border pl-8" : ""} ${i >= 2 ? "border-t border-border sm:border-t-0" : ""}`}
              >
                <dt className="font-display text-4xl font-medium text-navy-900 dark:text-white">{m.value}</dt>
                <dd className="mt-2 text-xs uppercase tracking-wider text-muted">{m.label}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* timeline */}
      <section className="py-20 lg:py-28">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <span className="flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-teal-700 dark:text-teal-300">
                <span className="h-px w-8 bg-teal-600/50" /> Honours & Milestones
              </span>
              <h2 className="mt-5 font-display text-[2rem] font-medium leading-tight text-navy-900 dark:text-white">
                A decade of surgical &amp; academic achievement.
              </h2>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="border-t border-navy-900/12 dark:border-white/12">
              {awards.map((a, i) => (
                <Reveal key={a.title} delay={(i % 6) * 0.05}>
                  <div className="grid grid-cols-1 gap-x-8 gap-y-1 border-b border-navy-900/12 py-7 dark:border-white/12 sm:grid-cols-[6rem_1fr]">
                    <span className="font-display text-lg font-medium tabular-nums text-teal-700/70 dark:text-teal-300/70">
                      {a.year}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-medium text-navy-900 dark:text-white">{a.title}</h3>
                      <p className="mt-1 text-sm text-muted">
                        <span className="uppercase tracking-wider text-teal-700/80 dark:text-teal-300/80">{a.type}</span>
                        <span className="mx-2 text-navy-300 dark:text-white/30">·</span>
                        {a.org}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* leadership band */}
      <section className="pb-8">
        <Container>
          <Reveal className="overflow-hidden rounded-2xl border-t-2 border-teal-500 bg-navy-900 p-10 text-white sm:p-14 dark:bg-navy-950">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:items-center lg:gap-16">
              <h3 className="font-display text-2xl font-medium leading-tight sm:text-3xl">
                Chairman &amp; national leadership
              </h3>
              <p className="text-white/75">
                Beyond individual awards, {doctor.shortName} serves as Chairman of the Young Neurosurgical Forum and the
                Innovation &amp; Patent Cell at the Neurological Society of India — mentoring the next generation of
                neurosurgeons and driving research and innovation across the field.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>


      {/* Award photographs — the Elementor image carousel that used to sit on the
          homepage (live WordPress section 5). Relocated here on 2026-09-04: it was
          the third awards touchpoint on `/`, and this is the awards page. Same
          images, unchanged. See _migration/PAGE-REBUILD.md §6. */}
      <AwardsGallery />

      {/* ── News ──────────────────────────────────────────────────────────────
          Migrated from the live /news-awards/ page. The template had no press
          section at all — see _migration/PAGE-REBUILD.md §6. */}
      <section className="border-t border-border py-20 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow="News"
            title="In the press"
            description="Coverage of the practice, the Fortis Institute of Minimally Invasive Brain & Spine Surgery, and Dr. Sardhara's work in national and medical media."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {pressCoverage.map((item, i) => (
              <Reveal key={`${item.outlet}-${i}`} delay={(i % 5) * 0.04}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col border border-navy-900/10 bg-surface-2 transition-colors hover:border-teal-500/60 dark:border-white/10"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={`${item.outlet} coverage of ${doctor.name}`}
                      fill
                      sizes="(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 90vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                  <span className="px-3 py-3 text-xs uppercase tracking-wider text-muted transition-colors group-hover:text-teal-700 dark:group-hover:text-teal-300">
                    {item.outlet}
                  </span>
                </a>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 grid gap-12 lg:grid-cols-3">
            {newsItems.map((n, i) => (
              <Reveal key={n.title} delay={i * 0.06}>
                <article className="flex h-full flex-col">
                  {n.image && (
                    <div className="relative mb-6 aspect-[16/10] overflow-hidden border border-navy-900/10 bg-surface-2 dark:border-white/10">
                      <Image
                        src={n.image}
                        alt={n.title}
                        fill
                        sizes="(min-width: 1024px) 30vw, 90vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <h3 className="font-display text-xl font-medium leading-snug text-navy-900 dark:text-white">
                    {n.title}
                  </h3>
                  <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">
                    {n.paragraphs.map((para, j) => (
                      <p key={j}>{para}</p>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          {/* Videos migrated from the live /news-awards/ page. */}
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {videos["news-awards"].map((v) => (
              <Reveal key={v.id}>
                <VideoEmbed video={v} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
