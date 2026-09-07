import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { conditions } from "@/lib/data";

/**
 * Section 6 of the live WordPress homepage — four conditions across, each with an icon.
 *
 * These are exactly the four the export carried (Brain Tumor, Spine Injury, Stroke,
 * Sciatica) with their migrated copy, in the export's order. The template one-liners that
 * used to pad this grid to six are not homepage content; the full list of eleven is at
 * /conditions/, linked below.
 */
const CARDS = [
  { group: "brain", name: "Brain Tumors", icon: "Brain", href: "/brain-surgery/" },
  { group: "spine", name: "Spine Injury", icon: "Bone", href: "/spine-surgery/" },
  { group: "brain", name: "Stroke", icon: "Activity", href: "/brain-surgery/" },
  { group: "spine", name: "Sciatica", icon: "HeartPulse", href: "/spine-surgery/" },
] as const;

export function Conditions() {
  const cards = CARDS.map((c) => {
    const item = conditions[c.group].items.find((i) => i.name === c.name)!;
    return { ...c, body: item.long ?? item.desc };
  });

  return (
    <section className="border-y border-border bg-surface/50 py-20 lg:py-24" id="conditions">
      <Container>
        <SectionHeading
          layout="split"
          index="01"
          eyebrow="Conditions We Treat"
          title="Common Neurological Conditions We Address"
          description="Every condition is met with an accurate diagnosis and a tailored, evidence-based plan."
        />

        <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <Reveal key={c.name} delay={(i % 4) * 0.05}>
              <Link
                href={c.href}
                className="group flex h-full flex-col border-t border-navy-900/15 pt-5 dark:border-white/15"
              >
                <Icon
                  name={c.icon}
                  className="h-8 w-8 text-teal-600 transition-colors group-hover:text-teal-700 dark:text-teal-400"
                />
                <h3 className="mt-5 font-display text-xl font-medium text-navy-900 transition-colors group-hover:text-teal-700 dark:text-white dark:group-hover:text-teal-300">
                  {c.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{c.body}</p>
              </Link>
            </Reveal>
          ))}
        </div>

        <Link
          href="/conditions/"
          className="group mt-12 inline-flex items-center gap-2 text-sm font-medium text-navy-800 dark:text-white/80"
        >
          All conditions we treat
          <ArrowRight className="h-4 w-4 text-teal-600 transition-transform group-hover:translate-x-1 dark:text-teal-400" />
        </Link>
      </Container>
    </section>
  );
}
