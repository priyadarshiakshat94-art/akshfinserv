import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/site/section";
import { FadeIn } from "@/components/motion/fade-in";

const CALCS = [
  {
    href: "/calculators/sip",
    name: "SIP",
    question: "What does ₹10,000 a month become in 15 years?",
    sample: { value: "₹50.5", unit: "lakh" },
    note: "at 12% a year",
  },
  {
    href: "/calculators/retirement",
    name: "Retirement",
    question: "How big does the corpus need to be at 60?",
    sample: { value: "₹7.2", unit: "Cr" },
    note: "for ₹1.2 lakh a month today",
  },
  {
    href: "/calculators/loan-vs-liquidate",
    name: "Loan vs Liquidate",
    question: "Borrow against your funds, or redeem them?",
    sample: { value: "₹16", unit: "k saved" },
    note: "on a ₹6 lakh, 9-month need",
  },
];

export function CalculatorsTeaser() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Calculators"
        title="Run the numbers before you call us."
        aside={<p>Same maths we use in a review. No sign-up, nothing stored.</p>}
      />
      <div className="grid gap-4 md:grid-cols-3">
        {CALCS.map((c, i) => (
          <FadeIn key={c.href} delay={i * 0.05}>
            <Link
              href={c.href}
              className="card-lift group flex h-full flex-col justify-between gap-12 rounded-card bg-elevated p-8"
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-sm text-gold">{c.name}</p>
                  <p className="mt-3 text-lg leading-snug text-ink">{c.question}</p>
                </div>
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-elevated-2 text-ink-secondary transition-colors duration-200 group-hover:bg-gold group-hover:text-ink-dark">
                  <ArrowUpRight className="size-4" strokeWidth={1.5} />
                </span>
              </div>
              <div>
                <p className="flex items-baseline gap-2">
                  <span className="display-num text-[3.5rem] text-ink">{c.sample.value}</span>
                  <span className="font-display text-xl font-light text-ink-muted">{c.sample.unit}</span>
                </p>
                <p className="mt-2 text-sm text-ink-muted">{c.note}</p>
              </div>
            </Link>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
