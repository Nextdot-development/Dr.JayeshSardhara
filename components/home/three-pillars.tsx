import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { threePillars } from "@/lib/data";

/**
 * Section 2 of the live WordPress homepage — three icon boxes under the hero.
 * Copy verbatim from the Elementor export; the icons are ours (the export carried
 * Elementor icon classes, not assets).
 */
export function ThreePillars() {
  return (
    <section className="border-b border-border py-12 lg:py-14">
      <Container>
        <div className="grid gap-10 sm:grid-cols-3 sm:gap-8">
          {threePillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <div className="flex items-start gap-5 sm:border-l sm:border-navy-900/12 sm:pl-6 dark:sm:border-white/12">
                <Icon
                  name={p.icon}
                  className="mt-1 h-7 w-7 shrink-0 text-teal-600 dark:text-teal-400"
                />
                <div>
                  <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-teal-700 dark:text-teal-300">
                    {p.title}
                  </h3>
                  <p className="mt-2.5 font-display text-xl font-medium leading-snug text-navy-900 dark:text-white">
                    {p.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
