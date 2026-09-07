import type { Metadata } from "next";
import { JsonLd, StoredJsonLd } from "@/components/seo/json-ld";
import { getDocByFileSlug, metadataFromDoc } from "@/lib/content";
import { Hero } from "@/components/home/hero";
import { About } from "@/components/home/about";
import { Expertise } from "@/components/home/expertise";
import { WhyChoose } from "@/components/home/why-choose";
import { Conditions } from "@/components/home/conditions";
import { Testimonials } from "@/components/home/testimonials";
import { Awards } from "@/components/home/awards";
import { Resources } from "@/components/home/resources";
import { Videos } from "@/components/home/videos";
import { Faqs } from "@/components/home/faqs";
import { BookAppointment } from "@/components/home/book-appointment";
import { ThreePillars } from "@/components/home/three-pillars";
import { TrustStats } from "@/components/home/trust-stats";
import { FortisInstitute } from "@/components/home/fortis-institute";
import { AppointmentCTA } from "@/components/home/appointment-cta";
import { AwardsGallery } from "@/components/awards-gallery";

const doc = getDocByFileSlug("index")!;

export const metadata: Metadata = metadataFromDoc(doc);

export default function HomePage() {
  return (
    <>
      {/* Stored capture (BreadcrumbList/Organization/WebPage/WebSite + FAQPage) plus the
          Physician entity the capture lacks — see components/seo/json-ld.tsx. */}
      <StoredJsonLd schema={doc.schema} />
      <JsonLd />
      {/*
        Section order follows the live WordPress page (home-content.json `order`), which is
        also the order of the target design:
          1 hero · 2 three pillars · 3 doctor bio · 4 book appointment · 5 awards carousel
          6 conditions · 7 why choose (+video) · 8 Fortis Institute (+video) · 9 honours
          10 video gallery · 11 blog · 12 FAQs · 13 reviews
        <TrustStats> and <Expertise> are ours, not the export's — see the notes below.
      */}
      <Hero />
      <ThreePillars />
      {/* Moved out of <Hero> when it became a full-bleed banner; nothing dropped. */}
      <TrustStats />
      <About />
      <BookAppointment />
      {/* Live section 5 — "Sits immediately after the appointment form" (home-content.json). */}
      <AwardsGallery className="border-t border-border py-16 lg:py-20" />
      <Conditions />
      {/* Not an export section — the live homepage had no expertise block. Kept because it
          carries the only homepage links into /brain-surgery/ and /spine-surgery/, and sits
          beside Conditions, the content it belongs with. */}
      <Expertise />
      <WhyChoose />
      <FortisInstitute />
      <Awards />
      <Videos />
      <Resources />
      <Faqs />
      <Testimonials />
      <AppointmentCTA />
    </>
  );
}
