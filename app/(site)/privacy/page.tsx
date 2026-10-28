import type { Metadata } from "next";
import { PageIntro } from "@/components/site/page-intro";
import { Section } from "@/components/site/section";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What Aksh Finserv collects through this website, why, and how to have it removed.",
  alternates: { canonical: "/privacy" },
};

// DRAFT: plain-language summary of what the site actually does. Have it reviewed
// (including DPDP Act 2023 obligations) before launch.
const ITEMS = [
  {
    title: "What we collect",
    body: "When you use a form: your name and mobile number, and if you choose, your email and city. Nothing else is asked for, and we never ask for passwords, PAN or bank details through this site.",
  },
  {
    title: "Why",
    body: "Only to contact you about the request you made. Your details are emailed to our team and kept in our records of enquiries.",
  },
  {
    title: "Who sees it",
    body: "Our advisors. We use an email delivery service and a spam check (Cloudflare Turnstile) to process the form. We do not sell or share your details with anyone for marketing.",
  },
  {
    title: "Analytics",
    body: "We use privacy-respecting site analytics and advertising measurement to understand which pages are useful. These use cookies or similar technology.",
  },
  {
    title: "Removing your details",
    body: "Email plabita@akshfinserv.com and we will delete your enquiry from our records.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageIntro eyebrow="Privacy" title="What this site collects, and why." />
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
