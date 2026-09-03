import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { whyChooseSardhara } from "@/lib/data";

export function WhyChoose() {
  return (
    <section className="border-y border-border bg-surface/50 py-24 lg:py-32">
      <Container className="grid gap-14 lg:grid-cols-12 lg:gap-20">
        {/* sticky statement */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <div className="flex items-baseline gap-4">
              <span className="font-display text-sm font-medium text-teal-700/70 dark:text-teal-300/70">02</span>
              <Eyebrow>Why Choose Us</Eyebrow>
            </div>
            <h2 className="mt-5 font-display text-[2.05rem] font-medium leading-[1.1] tracking-tight text-navy-900 sm:text-4xl dark:text-white">
              Why Choose Dr. Jayesh Sardhara?
            </h2>
            <p className="mt-5 leading-relaxed text-muted">
              World-class technology and international training, applied with genuine warmth — the reasons thousands
              trust us with their brain and spine health.
            </p>
            <Button href="/about/" variant="secondary" className="mt-8">
              About the surgeon
            </Button>
          </div>
        </div>

        {/* numbered list */}
        <Stagger className="lg:col-span-8">
          <div className="grid sm:grid-cols-2">
            {whyChooseSardhara.map((w, i) => (
              <StaggerItem key={w.label}>
                <div
                  className={`border-t border-navy-900/12 py-8 dark:border-white/12 sm:px-8 ${i % 2 === 1 ? "sm:border-l" : ""}`}
                >
                  <span className="font-display text-sm font-medium tabular-nums text-teal-700/60 dark:text-teal-300/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-display text-xl font-medium text-navy-900 dark:text-white">{w.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{w.body}</p>
                </div>
              </StaggerItem>
            ))}
          </div>
        </Stagger>
      </Container>
    </section>
  );
}
