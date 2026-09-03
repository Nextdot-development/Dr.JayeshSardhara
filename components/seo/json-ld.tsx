import { doctor, siteUrl, locations } from "@/lib/data";

export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: doctor.name,
    honorificSuffix: "MCh (Neurosurgery)",
    medicalSpecialty: ["Neurosurgery", "Spine Surgery"],
    description: doctor.intro,
    url: siteUrl,
    telephone: doctor.phoneRaw,
    email: doctor.email,
    priceRange: "₹₹₹",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: doctor.rating,
      reviewCount: doctor.reviews,
    },
    address: locations.map((l) => ({
      "@type": "PostalAddress",
      name: l.name,
      streetAddress: l.address,
      addressLocality: "Mumbai",
      addressCountry: "IN",
    })),
    availableService: [
      "Brain Tumor Surgery",
      "Spine Surgery",
      "Endoscopic Skull Base Surgery",
      "Minimally Invasive Spine Surgery",
      "Deep Brain Stimulation",
    ].map((s) => ({ "@type": "MedicalProcedure", name: s })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Emits the JSON-LD captured from the live WordPress site, byte-for-byte.
 *
 * Migrated pages render THIS instead of <JsonLd /> above. The two are never merged or
 * deduped: the stored graph is what the page is already indexed with, and the generated
 * one is a different (richer) shape for the new template-only routes.
 */
export function StoredJsonLd({ schema }: { schema: string[] }) {
  return (
    <>
      {schema.map((json, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: json }}
        />
      ))}
    </>
  );
}
