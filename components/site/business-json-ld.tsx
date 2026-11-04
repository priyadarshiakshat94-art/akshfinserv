import { BUSINESS, SITE_URL } from "@/lib/site";

// Schema.org description of the business. Hours confirmed by Plabita (Mon–Fri, 9–5). No ratings, reviews or
// coordinates until each is verified.
export function BusinessJsonLd() {
  const a = BUSINESS.address;
  const data = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "@id": `${SITE_URL}/#business`,
    name: BUSINESS.name,
    description:
      "AMFI-registered mutual fund distributor (ARN-121998) in Powai, Mumbai, serving families since 2004. Mutual funds, NPS, insurance and loans against mutual funds.",
    url: SITE_URL,
    logo: `${SITE_URL}/apple-icon.png`,
    image: `${SITE_URL}/apple-icon.png`,
    telephone: BUSINESS.phoneE164,
    contactPoint: [BUSINESS.phoneE164, BUSINESS.phone2E164].map((telephone) => ({
      "@type": "ContactPoint",
      telephone,
      contactType: "customer service",
      areaServed: "IN",
    })),
    email: BUSINESS.email,
    foundingDate: BUSINESS.foundingYear,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:00",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: `${a.line1}, ${a.line2}`,
      addressLocality: a.city,
      addressRegion: a.region,
      postalCode: a.postalCode,
      addressCountry: a.country,
    },
    areaServed: BUSINESS.areaServed.map((name) => ({ "@type": "Place", name })),
    founder: [{ "@type": "Person", name: "Plabita Priyadarshi", jobTitle: "Founder" }],
    identifier: { "@type": "PropertyValue", propertyID: "AMFI ARN", value: BUSINESS.arn },
    knowsAbout: ["Mutual funds", "National Pension System", "Insurance", "Loan against mutual funds"],
    sameAs: BUSINESS.sameAs,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
