import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/site/section";
import { FadeIn } from "@/components/motion/fade-in";

const GOALS = [
  {
    label: "Retirement",
    line: "Build the income that outlasts your paycheck.",
    detail: "Corpus, withdrawal order, annuity. Planned 15 years out.",
    href: "/calculators/retirement",
  },
  {
    label: "Home",
    line: "Buy the house without breaking the plan.",
    detail: "Down payment bucket, EMI sizing, and when to prepay.",
    href: "/calculators/loan-vs-liquidate",
  },
  {
    label: "Children",
    line: "Fund their choices, not just their fees.",
    detail: "College in India or abroad, priced in the year they leave.",
    href: "/calculators/sip",
  },
  {
    label: "Wealth",
    line: "Make your money work as hard as you did.",
    detail: "Equity, debt and tax, arranged so nothing sits idle.",
    href: "/offerings/mutual-funds",
  },
];

export function SolvingFor() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Start with the goal"
        title="What are you solving for?"
        aside={<p>We do not recommend a single fund until we know what the money is for, and when.</p>}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {GOALS.map((g, i) => (
          <FadeIn key={g.label} delay={i * 0.05}>
            <Link
              href={g.href}
              className="card-lift group flex h-full min-h-[16rem] flex-col justify-between rounded-card bg-elevated p-8 lg:min-h-[19rem] lg:p-10"
            >
              <div className="flex items-start justify-between">
                <span className="text-sm text-ink-secondary">{g.label}</span>
                <span className="grid size-10 place-items-center rounded-full bg-elevated-2 text-ink-secondary transition-colors duration-200 group-hover:bg-gold group-hover:text-ink-dark">
                  <ArrowUpRight className="size-4" strokeWidth={1.5} />
                </span>
              </div>
              <div>
                <p className="font-display text-[clamp(1.6rem,2.6vw,2.25rem)] font-normal leading-[1.1] tracking-[-0.02em] text-ink">
                  {g.line}
                </p>
                <p className="mt-4 text-[0.95rem] text-ink-muted">{g.detail}</p>
              </div>
            </Link>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
