import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Faq } from "@/components/ui/faq";
import { homeFaqs } from "@/lib/data";

/**
 * Section 12 of the live WordPress homepage.
 *
 * These are the same 7 Q&As already present in the page's stored FAQPage JSON-LD. Rendering
 * them visibly is not optional: FAQPage markup is only permitted for content the user can see.
 */
export function Faqs() {
  return (
    <section className="border-t border-border py-24 lg:py-32" id="faqs">
      <Container className="max-w-4xl">
        <SectionHeading eyebrow="FAQs" title="Questions patients ask" />
        <div className="mt-12">
          <Faq items={homeFaqs} />
        </div>
      </Container>
    </section>
  );
}
