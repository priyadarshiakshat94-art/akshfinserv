import Link from "next/link";
import { Section, SectionHeading } from "@/components/site/section";
import { FadeIn } from "@/components/motion/fade-in";

const STEPS = [
  {
    n: "01",
    title: "Assessment",
    body: "We map every account, policy and loan you hold onto one page. You see the whole picture before we suggest anything.",
  },
  {
    n: "02",
    title: "Execution",
    body: "We place the plan through NJ's platform. You approve every transaction and see it in your own login the same day.",
  },
  {
    n: "03",
    title: "Tracking",
    body: "A written review every six months. A call within a day when markets, tax rules or your life change sharply.",
  },
];

export function HowWeWorkStrip() {
  return (
    <Section className="pt-0 lg:pt-0">
      <SectionHeading
        eyebrow="How we work"
        title="Three steps. The third one never ends."
        aside={
          <Link
            href="/how-we-work"
            className="text-ink underline decoration-line-hover underline-offset-4 hover:decoration-gold"
          >
            See the full process
          </Link>
        }
      />
      <ol className="grid border-t border-line md:grid-cols-3">
        {STEPS.map((s, i) => (
          <FadeIn
            key={s.n}
            as="li"
            delay={i * 0.05}
            className="border-b border-line py-10 md:border-b-0 md:border-l md:px-10 md:first:border-l-0 md:first:pl-0"
          >
            <span className="display-num text-[4rem] text-gold">{s.n}</span>
            <h3 className="mt-6 text-2xl text-ink">{s.title}</h3>
            <p className="mt-3 max-w-[22rem] text-ink-secondary">{s.body}</p>
          </FadeIn>
        ))}
      </ol>
    </Section>
  );
}
