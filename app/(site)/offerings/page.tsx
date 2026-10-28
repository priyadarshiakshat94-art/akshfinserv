import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getAllOfferings } from "@/lib/content";
import { PageIntro } from "@/components/site/page-intro";
import { Section } from "@/components/site/section";
import { FadeIn } from "@/components/motion/fade-in";
import { CtaBand } from "@/components/site/cta-band";

export const metadata: Metadata = {
  title: "Offerings",
  description:
    "Mutual funds, equity and ETFs, NPS, loans against mutual funds, and insurance. Five things we do, each tied to a goal date.",
  alternates: { canonical: "/offerings" },
};

export default function OfferingsPage() {
  const offerings = getAllOfferings();

  return (
    <>
      <PageIntro
        eyebrow="Offerings"
        title="Five things we do. Each one answers to a goal with a date on it."
        lede="We do not sell a product and then look for a reason to own it. Every offering below starts in the same review."
      />
      <Section className="pt-0 lg:pt-0">
        <ul className="grid gap-4 md:grid-cols-2">
          {offerings.map((o, i) => (
            <FadeIn as="li" key={o.slug} delay={i * 0.04} className={i === 0 ? "md:col-span-2" : undefined}>
              <Link
                href={`/offerings/${o.slug}`}
                className="card-lift group flex h-full flex-col justify-between gap-12 rounded-card bg-elevated p-8 lg:p-10"
              >
                <div className="flex items-start justify-between gap-6">
                  <span className="display-num text-[2.5rem] text-ink-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-elevated-2 text-ink-secondary transition-colors duration-200 group-hover:bg-gold group-hover:text-ink-dark">
                    <ArrowUpRight className="size-4" strokeWidth={1.5} />
                  </span>
                </div>
                <div>
                  <h2 className="text-[clamp(1.8rem,3vw,2.5rem)] text-ink">{o.title}</h2>
                  <p className="mt-3 max-w-[34rem] text-ink-secondary">{o.oneLinePromise}</p>
                </div>
              </Link>
            </FadeIn>
          ))}
        </ul>
      </Section>
      <CtaBand />
    </>
  );
}
