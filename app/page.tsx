import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Hero, HeroBackdrop } from "@/components/home/hero";
import { CredibilityRibbon } from "@/components/home/credibility-ribbon";
import { SolvingFor } from "@/components/home/solving-for";
import { HowWeWorkStrip } from "@/components/home/how-we-work-strip";
import { OnePageBand } from "@/components/home/one-page-band";
import { WhyClientsStay } from "@/components/home/why-clients-stay";
import { Testimonials } from "@/components/home/testimonials";
import { Team } from "@/components/home/team";
import { InsightsPreview } from "@/components/home/insights-preview";
import { CalculatorsTeaser } from "@/components/home/calculators-teaser";
import { LeadBlock } from "@/components/home/lead-block";
import type { Metadata } from "next";
import { validateContentGraph } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

const HOME_TITLE = "Aksh Finserv | Mutual funds in Powai, Mumbai, since 2004";
const HOME_DESCRIPTION =
  "AMFI-registered mutual fund distributor in Powai, Mumbai, working with families since 2004. Mutual funds, NPS, insurance and loans against mutual funds.";

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: "/",
    siteName: "Aksh Finserv",
    locale: "en_IN",
    type: "website",
  },
};

// Tells search engines the site's name and that the business below publishes it.
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "Aksh Finserv",
  url: SITE_URL,
  inLanguage: "en-IN",
  publisher: { "@id": `${SITE_URL}/#business` },
};

export default function HomePage() {
  // Fails the build if an author or related slug points at a missing file.
  validateContentGraph();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <main className="grain relative min-h-svh">
        <div className="relative isolate overflow-hidden">
          <HeroBackdrop />
          <SiteHeader />
          <Hero />
        </div>
        <CredibilityRibbon />
        <SolvingFor />
        <HowWeWorkStrip />
        <OnePageBand />
        <WhyClientsStay />
        <Testimonials />
        <Team />
        <InsightsPreview />
        <CalculatorsTeaser />
        <LeadBlock />
      </main>
      <SiteFooter />
    </>
  );
}
