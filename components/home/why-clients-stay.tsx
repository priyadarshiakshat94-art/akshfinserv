import { Section } from "@/components/site/section";
import { FadeIn } from "@/components/motion/fade-in";

const LINES = [
  { not: "Not a call centre.", but: "The founders still pick up the phone." },
  { not: "Not the product of the month.", but: "A plan with dates written on it." },
  { not: "Not a panic call in a crash.", but: "A plan that already assumed one." },
  { not: "Not a new face every year.", but: "Clients whose children now have their own folders with us." },
];

export function WhyClientsStay() {
  return (
    <div className="bg-elevated/40">
      <Section>
        <FadeIn>
          <p className="eyebrow mb-5">Why clients stay for decades</p>
        </FadeIn>
        <ul className="divide-y divide-line border-y border-line">
          {LINES.map((l, i) => (
            <FadeIn
              key={l.not}
              as="li"
              delay={i * 0.05}
              className="grid gap-2 py-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-10 lg:py-10"
            >
              <span className="font-display text-[clamp(1.4rem,2.6vw,2.25rem)] font-light leading-tight tracking-[-0.02em] text-ink-muted">
                {l.not}
              </span>
              <span className="font-display text-[clamp(1.4rem,2.6vw,2.25rem)] font-normal leading-tight tracking-[-0.02em] text-ink">
                {l.but}
              </span>
            </FadeIn>
          ))}
        </ul>
      </Section>
    </div>
  );
}
