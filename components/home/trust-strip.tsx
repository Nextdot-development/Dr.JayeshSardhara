import { recognitions } from "@/lib/data";
import { Container } from "@/components/ui/container";

export function TrustStrip() {
  return (
    <section className="border-b border-border" aria-label="Awards and recognitions">
      <Container className="flex flex-col gap-6 py-9 md:flex-row md:items-center md:gap-12">
        <span className="shrink-0 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-muted">
          Recognition
          <br className="hidden md:block" /> &amp; Affiliations
        </span>
        <div className="hidden h-10 w-px bg-border md:block" />
        <ul className="flex flex-wrap items-center gap-x-10 gap-y-4">
          {recognitions.map((r) => (
            <li key={r.label} className="text-sm">
              <span className="font-medium text-navy-800 dark:text-white/80">{r.label}</span>
              <span className="ml-2 text-xs text-muted">{r.sub}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
