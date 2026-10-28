import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { FAQPageJsonLd } from "next-seo";
import { getAllOfferings, getInsightBySlug, getOfferingBySlug, getTeamBySlug } from "@/lib/content";
import { Markdown } from "@/lib/mdx";
import { seoMetadata } from "@/lib/seo";
import { publicFileExists } from "@/lib/assets";
import { PageIntro } from "@/components/site/page-intro";
import { Section, SectionHeading } from "@/components/site/section";
import { CtaBand } from "@/components/site/cta-band";
import { InsightCard } from "@/components/site/insight-card";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllOfferings().map((o) => ({ slug: o.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const o = getOfferingBySlug((await params).slug);
  if (!o) return {};
  return seoMetadata(o.seo, {
    title: o.title,
    description: o.oneLinePromise,
    path: `/offerings/${o.slug}`,
    image: publicFileExists(o.coverImage) ? o.coverImage : undefined,
  });
}

export default async function OfferingPage({ params }: Props) {
  const o = getOfferingBySlug((await params).slug);
  if (!o) notFound();

  const related = (o.relatedInsights ?? []).map(getInsightBySlug).filter((p) => p !== null);

  return (
    <>
      <PageIntro eyebrow="Offerings" title={o.title} lede={o.oneLinePromise} />

      <Section className="pt-0 lg:pt-0">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-20">
          <Markdown source={o.body} />

          <aside className="h-fit rounded-card border border-line bg-elevated p-8 lg:sticky lg:top-8">
            <p className="eyebrow mb-6">Who it is for</p>
            <ul className="space-y-4">
              {o.whoItIsFor.map((w) => (
                <li key={w} className="flex gap-3 text-ink">
                  <Check className="mt-1 size-4 shrink-0 text-gold" strokeWidth={2} />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Section>

      {o.faqs.length ? (
        <Section className="pt-0 lg:pt-0">
          <SectionHeading eyebrow="Questions" title="What clients ask us first." />
          <div className="divide-y divide-line border-y border-line">
            {o.faqs.map((f) => (
              <details key={f.q} className="group py-6">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-display text-xl text-ink [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span
                    aria-hidden
                    className="mt-1 grid size-7 shrink-0 place-items-center rounded-full border border-line text-ink-secondary transition-transform duration-200 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-[46rem] text-ink-secondary">{f.a}</p>
              </details>
            ))}
          </div>
          <FAQPageJsonLd
            useAppDir
            mainEntity={o.faqs.map((f) => ({ questionName: f.q, acceptedAnswerText: f.a }))}
          />
        </Section>
      ) : null}

      {related.length ? (
        <Section className="pt-0 lg:pt-0">
          <SectionHeading eyebrow="Read next" title="Notes on this from our desk." />
          <div className="grid gap-4 md:grid-cols-3">
            {related.map((p) => (
              <InsightCard key={p.slug} post={{ ...p, authorName: getTeamBySlug(p.author)?.name }} />
            ))}
          </div>
        </Section>
      ) : null}

      <CtaBand />
    </>
  );
}
