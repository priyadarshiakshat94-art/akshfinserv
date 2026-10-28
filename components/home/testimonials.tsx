import { getFeaturedTestimonials } from "@/lib/content";
import { Section, SectionHeading } from "@/components/site/section";
import { FadeIn } from "@/components/motion/fade-in";
import { cn } from "@/lib/utils";

export function Testimonials() {
  // Unconsented quotes are filtered out in production, so this can be empty.
  const items = getFeaturedTestimonials().slice(0, 3);
  if (items.length === 0) return null;

  return (
    <Section>
      <SectionHeading
        eyebrow="Client words"
        title="Some of these families joined when the Sensex was under 5,000."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((t, i) => (
          <FadeIn key={t.clientName} delay={i * 0.05}>
            <figure
              className={cn(
                "card-lift flex h-full flex-col justify-between gap-10 rounded-card p-8 lg:p-9",
                i === 1 ? "bg-surface-light text-ink-dark" : "bg-elevated text-ink",
              )}
            >
              <div>
                {!t.consentGiven ? (
                  <span className="mb-6 inline-block rounded-pill border border-current/20 px-3 py-1 text-[0.7rem] uppercase tracking-[0.14em] opacity-60">
                    Placeholder. Dev only.
                  </span>
                ) : null}
                <blockquote className="font-display text-[1.35rem] font-normal leading-snug tracking-[-0.015em]">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
              </div>
              <figcaption className="flex items-end justify-between gap-4 text-sm">
                <span>
                  <span className="block font-medium">{t.clientName}</span>
                  <span className={i === 1 ? "text-[#5c574f]" : "text-ink-secondary"}>
                    {[t.clientRole, t.city].filter(Boolean).join(", ")}
                  </span>
                </span>
                <span className={cn("whitespace-nowrap", i === 1 ? "text-[#5c574f]" : "text-ink-muted")}>
                  Since {t.yearJoined}
                </span>
              </figcaption>
            </figure>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
