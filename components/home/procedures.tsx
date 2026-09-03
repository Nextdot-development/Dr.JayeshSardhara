import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { procedures } from "@/lib/data";

export function Procedures() {
  return (
    <section className="py-24 lg:py-32" id="procedures">
      <Container>
        <SectionHeading
          index="04"
          eyebrow="Surgical Procedures"
          title="An index of what we do"
          description="A full range of advanced brain and spine procedures — many performed through keyhole and endoscopic approaches for a gentler recovery."
        />

        <div className="mt-14 border-t border-navy-900/12 dark:border-white/12">
          {procedures.map((p, i) => (
            <Reveal key={p.name} delay={(i % 6) * 0.04}>
              <Link
                href={p.category === "Brain" ? "/brain-surgery" : "/spine-surgery"}
                className="group grid grid-cols-1 items-baseline gap-x-8 gap-y-2 border-b border-navy-900/12 py-7 transition-colors hover:bg-surface/60 dark:border-white/12 sm:grid-cols-[3rem_1fr_auto]"
              >
                <span className="font-display text-lg font-medium tabular-nums text-teal-700/60 dark:text-teal-300/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-xl font-medium text-navy-900 transition-transform duration-300 group-hover:translate-x-1 dark:text-white">
                    {p.name}
                  </h3>
                  <p className="mt-1.5 max-w-xl text-sm text-muted">{p.desc}</p>
                </div>
                <div className="flex items-center gap-6 text-sm text-muted sm:justify-end">
                  <span className="uppercase tracking-wider">{p.category}</span>
                  <span className="hidden sm:inline">{p.duration}</span>
                  <ArrowUpRight className="h-5 w-5 text-navy-300 transition-colors group-hover:text-teal-600 dark:text-white/30 dark:group-hover:text-teal-300" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
