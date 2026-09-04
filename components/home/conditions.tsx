import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { conditions } from "@/lib/data";

/** Homepage teaser: 3 per group. The full list of 11 lives at /conditions/. */
const PER_GROUP = 3;

/** Entries carrying migrated WordPress copy lead; the one-line template entries follow. */
function teaser(items: { name: string; desc: string; long?: string }[]) {
  return [...items].sort((a, b) => Number(Boolean(b.long)) - Number(Boolean(a.long))).slice(0, PER_GROUP);
}

/**
 * Density pass 2026-09-04: was two stacked lists side by side, each row running the full
 * column width, which made six entries 1,000px tall. Now one 3-across card grid — the group
 * ("Brain" / "Spine") moves onto the card as a label instead of costing a header row.
 * Same six entries, same migrated copy, nothing truncated.
 */
export function Conditions() {
  const cards = [
    ...teaser(conditions.brain.items).map((it) => ({ ...it, group: "Brain", href: "/brain-surgery/" })),
    ...teaser(conditions.spine.items).map((it) => ({ ...it, group: "Spine", href: "/spine-surgery/" })),
  ];

  return (
    <section className="border-y border-border bg-surface/50 py-16 lg:py-20" id="conditions">
      <Container>
        <SectionHeading
          layout="split"
          index="03"
          eyebrow="Conditions We Treat"
          title="Common Neurological Conditions We Address"
          description="Every condition is met with an accurate diagnosis and a tailored, evidence-based plan."
        />

        <div className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => (
            <Reveal key={c.name} delay={(i % 3) * 0.05}>
              <Link
                href={c.href}
                className="group flex h-full flex-col border-t border-navy-900/15 pt-4 dark:border-white/15"
              >
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-teal-700/80 dark:text-teal-300/80">
                  {c.group}
                </span>
                <h3 className="mt-2 font-display text-lg font-medium text-navy-900 transition-colors group-hover:text-teal-700 dark:text-white dark:group-hover:text-teal-300">
                  {c.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{"long" in c ? c.long : c.desc}</p>
              </Link>
            </Reveal>
          ))}
        </div>

        <Link
          href="/conditions/"
          className="group mt-10 inline-flex items-center gap-2 text-sm font-medium text-navy-800 dark:text-white/80"
        >
          All conditions we treat
          <ArrowRight className="h-4 w-4 text-teal-600 transition-transform group-hover:translate-x-1 dark:text-teal-400" />
        </Link>
      </Container>
    </section>
  );
}
