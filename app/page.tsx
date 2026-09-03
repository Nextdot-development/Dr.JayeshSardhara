import type { Metadata } from "next";
import { StoredJsonLd } from "@/components/seo/json-ld";
import { getDocByFileSlug, metadataFromDoc } from "@/lib/content";
import { Hero } from "@/components/home/hero";
import { TrustStrip } from "@/components/home/trust-strip";
import { About } from "@/components/home/about";
import { Expertise } from "@/components/home/expertise";
import { WhyChoose } from "@/components/home/why-choose";
import { Conditions } from "@/components/home/conditions";
import { Procedures } from "@/components/home/procedures";
import { Testimonials } from "@/components/home/testimonials";
import { Awards } from "@/components/home/awards";
import { Resources } from "@/components/home/resources";
import { Videos } from "@/components/home/videos";
import { Faqs } from "@/components/home/faqs";
import { AwardsGallery } from "@/components/home/awards-gallery";
import { BookAppointment } from "@/components/home/book-appointment";
import { ThreePillars } from "@/components/home/three-pillars";
import { AppointmentCTA } from "@/components/home/appointment-cta";

const doc = getDocByFileSlug("index")!;

export const metadata: Metadata = metadataFromDoc(doc);

export default function HomePage() {
  return (
    <>
      <StoredJsonLd schema={doc.schema} />
      <Hero />
      <ThreePillars />
      <TrustStrip />
      <About />
      <BookAppointment />
      <AwardsGallery />
      <Expertise />
      <WhyChoose />
      <Conditions />
      <Procedures />
      <Testimonials />
      <Awards />
      <Resources />
      <Videos />
      <Faqs />
      <AppointmentCTA />
    </>
  );
}
