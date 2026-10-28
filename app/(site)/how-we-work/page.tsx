import type { Metadata } from "next";
import { PageIntro } from "@/components/site/page-intro";
import { Section, SectionHeading } from "@/components/site/section";
import { FadeIn } from "@/components/motion/fade-in";
import { CtaBand } from "@/components/site/cta-band";

export const metadata: Metadata = {
  title: "How we work",
  description:
    "Assessment, execution, tracking. What happens in each step, what you receive, and exactly how Aksh Finserv is paid.",
  alternates: { canonical: "/how-we-work" },
};

const STEPS = [
  {
    n: "01",
    title: "Assessment",
    when: "Week 1 to 2",
    body: "You send statements: mutual funds, EPF, PPF, NPS, policies, loans. We put all of it on one page and ask about the dates that matter: retirement, college, a home, a business exit.",
    youGet: ["A one-page net worth map", "Every goal with a date and a rupee figure", "A list of what overlaps, what is idle, and what is missing"],
  },
  {
    n: "02",
    title: "Execution",
    when: "Week 3 to 4",
    body: "We propose changes in writing, with the reason for each. Nothing moves until you approve it. Transactions go through NJ's platform, and you see each one in your own login the same day.",
    youGet: ["A written plan you can show your family", "SIP and switch instructions, ready to sign", "Insurance cover sized from your numbers"],
  },
  {
    n: "03",
    title: "Tracking",
    when: "Every six months, for as long as you stay",
    body: "A full review twice a year. A call within a day when markets fall sharply, tax rules change, or your life does. As each goal date approaches, we move that money to safer ground year by year.",
    youGet: ["A one-page progress report per goal", "Rebalancing when allocations drift", "Claim support from Sanjiv's team"],
  },
];

const WONT = [
  "Recommend a product before we know what the money is for.",
  "Move your money without your written approval.",
  "Sell insurance as an investment.",
  "Hand you over to a junior after the first meeting.",
];

export default function HowWeWorkPage() {
  return (
    <>
      <PageIntro
        eyebrow="How we work"
        title="Three steps. The third one never ends."
        lede="Most of our clients have been with us for over a decade. That is not loyalty to a fund. It is the six-monthly review they no longer want to do alone."
      />

      <Section className="pt-0 lg:pt-0">
        <ol className="space-y-4">
          {STEPS.map((s, i) => (
            <FadeIn
              as="li"
              key={s.n}
              delay={i * 0.04}
              className="grid gap-8 rounded-card border border-line bg-elevated p-8 lg:grid-cols-[12rem_minmax(0,1fr)_20rem] lg:gap-12 lg:p-10"
            >
              <div>
                <span className="display-num text-[5rem] text-gold">{s.n}</span>
                <p className="mt-3 text-sm text-ink-muted">{s.when}</p>
              </div>
              <div>
                <h2 className="text-[clamp(1.8rem,3vw,2.5rem)] text-ink">{s.title}</h2>
                <p className="mt-4 max-w-[36rem] text-ink-secondary">{s.body}</p>
              </div>
              <div className="rounded-[20px] bg-elevated-2 p-6">
                <p className="eyebrow mb-4">You receive</p>
                <ul className="space-y-3 text-[0.95rem] text-ink">
                  {s.youGet.map((y) => (
                    <li key={y} className="flex gap-3">
                      <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gold" />
                      {y}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </ol>
      </Section>

      <Section className="pt-0 lg:pt-0">
        <div className="grid gap-4 lg:grid-cols-2">
          <FadeIn className="rounded-card bg-surface-light p-8 text-ink-dark lg:p-10">
            <p className="text-sm text-[#5c574f]">How we are paid</p>
            <h2 className="mt-4 text-[clamp(1.8rem,3vw,2.5rem)]">No fee for advice. Here is where our income comes from.</h2>
            <div className="mt-6 space-y-4 text-[#3d3a35]">
              <p>
                We are an AMFI-registered mutual fund distributor. Fund houses pay us a trail commission on regular
                plans, which is included in the scheme&apos;s expense ratio. Insurers pay a commission on policies.
              </p>
              <p>Ask us for the exact figure on any fund or policy you hold through us. We will put it in writing.</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.05} className="rounded-card border border-line bg-elevated p-8 lg:p-10">
            <p className="text-sm text-ink-secondary">What we will not do</p>
            <ul className="mt-6 divide-y divide-line">
              {WONT.map((w) => (
                <li key={w} className="py-4 font-display text-xl leading-snug text-ink first:pt-0">
                  {w}
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </Section>

      <Section className="pt-0 lg:pt-0">
        <SectionHeading eyebrow="First meeting" title="What to bring." />
        <FadeIn>
          <ul className="grid gap-x-10 gap-y-4 text-ink-secondary sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Latest CAS from CAMS or KFintech",
              "EPF and PPF passbooks",
              "NPS statement, if you have one",
              "Every life and health policy document",
              "Loan statements with outstanding amounts",
              "A rough monthly household budget",
            ].map((x) => (
              <li key={x} className="flex gap-3 border-t border-line pt-4">
                <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gold" />
                {x}
              </li>
            ))}
          </ul>
        </FadeIn>
      </Section>

      <CtaBand />
    </>
  );
}
