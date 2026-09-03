import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { conditions } from "@/lib/data";

export function Conditions() {
  const groups = [
    { ...conditions.brain, href: "/brain-surgery" },
    { ...conditions.spine, href: "/spine-surgery" },
  ];

  return (
    <section className="border-y border-border bg-surface/50 py-24 lg:py-32" id="conditions">
      <Container>
        <SectionHeading
          index="03"
          eyebrow="Conditions We Treat"
          title="Common Neurological Conditions We Address"
          description="Every condition is met with an accurate diagnosis and a tailored, evidence-based plan."
        />

        <div className="mt-16 grid gap-x-16 gap-y-12 lg:grid-cols-2">
          {groups.map((g) => (
            <Reveal key={g.title}>
              <div>
                <div className="flex items-baseline justify-between border-b border-navy-900/15 pb-4 dark:border-white/15">
                  <h3 className="font-display text-2xl font-medium text-navy-900 dark:text-white">{g.title}</h3>
                  <Link
                    href={g.href}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:gap-2.5 dark:text-teal-300"
                  >
                    View all <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <ul>
                  {g.items.map((it) => (
                    <li
                      key={it.name}
                      className="flex flex-col gap-1 border-b border-border py-4 last:border-b-0 sm:flex-row sm:items-baseline sm:gap-5"
                    >
                      <span className="font-medium text-navy-900 dark:text-white sm:min-w-[9rem]">{it.name}</span>
                      <span className="text-sm text-muted">{"long" in it ? it.long : it.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
