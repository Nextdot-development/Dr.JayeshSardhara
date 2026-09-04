import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Faq } from "@/components/ui/faq";
import { homeFaqs } from "@/lib/data";

/**
 * Section 12 of the live WordPress homepage.
 *
 * These are the same 7 Q&As already present in the page's stored FAQPage JSON-LD. Rendering
 * them visibly is not optional: FAQPage markup is only permitted for content the user can see.
 * <Faq> keeps every answer mounted and collapses with CSS, so all 7 questions AND all 7
 * answers are in the served markup — see the note in components/ui/faq.tsx.
 *
 * Two columns and collapsed-by-default, for density. Nothing is removed.
 */
export function Faqs() {
  const half = Math.ceil(homeFaqs.length / 2);

  return (
    <section className="border-t border-border py-16 lg:py-20" id="faqs">
      <Container>
        <SectionHeading eyebrow="FAQs" title="Questions patients ask" />
        <div className="mt-8 grid gap-x-14 lg:grid-cols-2">
          <Faq items={homeFaqs.slice(0, half)} />
          <Faq items={homeFaqs.slice(half)} />
        </div>
      </Container>
    </section>
  );
}
