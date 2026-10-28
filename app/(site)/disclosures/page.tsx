import type { Metadata } from "next";
import { PageIntro } from "@/components/site/page-intro";
import { Section } from "@/components/site/section";

export const metadata: Metadata = {
  title: "Disclosures",
  description: "Registration, commission and risk disclosures for Aksh Finserv, an AMFI-registered mutual fund distributor.",
  alternates: { canonical: "/disclosures" },
};

// DRAFT: have a compliance reviewer confirm this text, the ARN and any insurance licence details before launch.
const ITEMS = [
  {
    title: "Registration",
    body: "Aksh Finserv is an AMFI-registered Mutual Fund Distributor, ARN-XXXXXX. We are not registered with SEBI as an Investment Adviser or Research Analyst.",
  },
  {
    title: "How we are paid",
    body: "We receive trail commission from asset management companies on investments made through us in regular plans. This commission is included in the scheme's total expense ratio. We receive commission from insurers on policies placed through us. Details of commission earned on your holdings are available on request.",
  },
  {
    title: "Market risk",
    body: "Mutual fund investments are subject to market risks. Read all scheme related documents carefully before investing. Past performance does not indicate future returns.",
  },
  {
    title: "Calculators and articles",
    body: "Calculators and articles on this site are for illustration and education. They use assumptions that may not hold, and are not a recommendation to buy, sell or hold any product.",
  },
  {
    title: "Insurance",
    body: "Insurance is the subject matter of solicitation. Read the policy wording and sales brochure carefully before concluding a sale.",
  },
  {
    title: "Client accounts",
    body: "Transactions are executed through NJ India Invest Pvt. Ltd.'s platform. Holdings are held in your own name with the respective fund house or depository.",
  },
];

export default function DisclosuresPage() {
  return (
    <>
      <PageIntro eyebrow="Disclosures" title="What we are, how we are paid, and the risks." />
      <Section className="pt-0 lg:pt-0">
        <dl className="divide-y divide-line border-y border-line">
          {ITEMS.map((i) => (
            <div key={i.title} className="grid gap-3 py-8 md:grid-cols-[16rem_minmax(0,1fr)] md:gap-10">
              <dt className="font-display text-xl text-ink">{i.title}</dt>
              <dd className="max-w-[46rem] text-ink-secondary">{i.body}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </>
  );
}
