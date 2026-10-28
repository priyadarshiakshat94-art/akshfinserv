import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Hero, HeroBackdrop } from "@/components/home/hero";
import { CredibilityRibbon } from "@/components/home/credibility-ribbon";
import { SolvingFor } from "@/components/home/solving-for";
import { HowWeWorkStrip } from "@/components/home/how-we-work-strip";
import { WhyClientsStay } from "@/components/home/why-clients-stay";
import { Testimonials } from "@/components/home/testimonials";
import { Team } from "@/components/home/team";
import { InsightsPreview } from "@/components/home/insights-preview";
import { CalculatorsTeaser } from "@/components/home/calculators-teaser";
import { LeadBlock } from "@/components/home/lead-block";
import { validateContentGraph } from "@/lib/content";
import { LocalBusinessJsonLd } from "next-seo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://akshfinserv.com";

export default function HomePage() {
  // Fails the build if an author or related slug points at a missing file.
  validateContentGraph();

  return (
    <>
      <main className="grain relative min-h-svh">
        <div className="relative isolate overflow-hidden">
          <HeroBackdrop />
          <SiteHeader />
          <Hero />
        </div>
        <CredibilityRibbon />
        <SolvingFor />
        <HowWeWorkStrip />
        <WhyClientsStay />
        <Testimonials />
        <Team />
        <InsightsPreview />
        <CalculatorsTeaser />
        <LeadBlock />
      </main>
      <SiteFooter />
      <LocalBusinessJsonLd
        useAppDir
        type="FinancialService"
        id={`${SITE_URL}/#business`}
        name="Aksh Finserv"
        description="AMFI-registered mutual fund distributor in Powai, Mumbai, serving families since 1998."
        url={SITE_URL}
        address={{
          streetAddress: "363, Powai Plaza, Central Avenue, Hiranandani Gardens",
          addressLocality: "Mumbai",
          addressRegion: "Maharashtra",
          postalCode: "400076",
          addressCountry: "IN",
        }}
      />
    </>
  );
}
