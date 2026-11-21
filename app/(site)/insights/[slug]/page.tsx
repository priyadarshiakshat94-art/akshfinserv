import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ArticleJsonLd, BreadcrumbJsonLd } from "next-seo";
import { getAllInsights, getInsightBySlug, getTeamBySlug } from "@/lib/content";
import { Markdown } from "@/lib/mdx";
import { seoMetadata } from "@/lib/seo";
import { publicFileExists } from "@/lib/assets";
import { CATEGORY_LABEL, fmtDate } from "@/lib/format";
import { Section, SectionHeading } from "@/components/site/section";
import { CtaBand } from "@/components/site/cta-band";
import { InsightCard } from "@/components/site/insight-card";
import { SITE_URL } from "@/lib/site";
import { GUIDE_SECTIONS, guideHref } from "@/lib/family-guide";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllInsights().map((i) => ({ slug: i.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getInsightBySlug((await params).slug);
  if (!p) return {};
  const meta = seoMetadata(p.seo, {
    title: p.title,
    description: p.excerpt,
    path: `/insights/${p.slug}`,
    image: publicFileExists(p.coverImage) ? p.coverImage : undefined,
  });
  return {
    ...meta,
    openGraph: { ...meta.openGraph, type: "article", publishedTime: p.publishedAt },
  };
}

export default async function InsightPage({ params }: Props) {
  const p = getInsightBySlug((await params).slug);
  if (!p) notFound();

  const author = getTeamBySlug(p.author);
  const related = (p.related ?? []).map(getInsightBySlug).filter((r) => r !== null);
  const hasCover = publicFileExists(p.coverImage);

  return (
    <>
      <article>
        <header className="page-fade mx-auto w-full max-w-[1320px] px-5 pb-12 pt-12 sm:px-8 lg:pt-20">
          <Link href="/insights" className="inline-flex items-center gap-2 text-sm text-ink-secondary hover:text-ink">
            <ArrowLeft className="size-4" strokeWidth={1.5} />
            All insights
          </Link>
          <div className="mt-10 flex flex-wrap items-center gap-3 text-sm">
            <Link
              href={`/insights?category=${p.category}`}
              className="rounded-pill bg-elevated-2 px-3 py-1 text-ink-secondary hover:text-ink"
            >
              {CATEGORY_LABEL[p.category]}
            </Link>
            <span className="text-ink-muted">
              <time dateTime={p.publishedAt.slice(0, 10)}>{fmtDate(p.publishedAt)}</time> · {p.readTime} min read
              {p.updatedAt ? (
                <>
                  {" "}
                  · Last reviewed <time dateTime={p.updatedAt.slice(0, 10)}>{fmtDate(p.updatedAt)}</time>
                </>
              ) : null}
            </span>
            {p.draft ? (
              <span className="rounded-pill border border-current/30 px-3 py-1 text-xs uppercase tracking-[0.14em] text-gold">
                Draft. Not on the live site.
              </span>
            ) : null}
          </div>
          {p.guideSection ? (
            <p className="mt-6 text-sm text-ink-secondary">
              Part of{" "}
              <Link href={guideHref(p.guideSection)} className="text-ink underline decoration-gold underline-offset-4">
                The Family Money Guide: {GUIDE_SECTIONS.find((s) => s.id === p.guideSection)?.label}
              </Link>
            </p>
          ) : null}
          <h1 className="mt-6 max-w-[56rem] text-[clamp(2.4rem,5.4vw,4.5rem)] text-ink">{p.title}</h1>
          <p className="mt-6 max-w-[42rem] text-lg text-ink-secondary">{p.excerpt}</p>
          {author ? (
            <p className="mt-8 text-sm text-ink-muted">
              By{" "}
              <Link href={`/about#${author.slug}`} className="text-ink underline-offset-4 hover:underline">
                {author.name}
              </Link>
              , {author.role}, Aksh Finserv · AMFI-registered Mutual Fund Distributor, ARN-121998
            </p>
          ) : null}
        </header>

        {hasCover ? (
          <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-8">
            <div className="relative aspect-[21/9] overflow-hidden rounded-card bg-elevated">
              <Image src={p.coverImage} alt={p.coverAlt} fill priority sizes="100vw" className="object-cover" />
            </div>
          </div>
        ) : null}

        <div className="mx-auto w-full max-w-[1320px] px-5 py-12 sm:px-8 lg:py-16">
          <div className="max-w-[42rem]">
            <Markdown source={p.body} />

            {p.sources.length ? (
              <section className="mt-14 border-t border-line pt-8" aria-labelledby="sources">
                <h2 id="sources" className="text-xl text-ink">
                  Sources
                </h2>
                <ul className="mt-4 space-y-2 text-sm text-ink-secondary">
                  {p.sources.map((s) => (
                    <li key={s.url}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-ink hover:underline">
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <aside className="mt-12 rounded-card bg-elevated p-6 text-xs leading-relaxed text-ink-muted">
              <p>
                Aksh Finserv is an AMFI-registered Mutual Fund Distributor (ARN-121998). We are not a SEBI-registered
                investment adviser, and this article is general education, not a recommendation to buy, sell or hold any
                product. Any figures are illustrations only.
              </p>
              <p className="mt-2">
                Mutual fund investments are subject to market risks. Read all scheme related documents carefully before
                investing.
              </p>
            </aside>
          </div>
        </div>
        <ArticleJsonLd
          useAppDir
          url={`${SITE_URL}/insights/${p.slug}`}
          title={p.title}
          description={p.excerpt}
          images={hasCover ? [`${SITE_URL}${p.coverImage}`] : []}
          datePublished={p.publishedAt}
          dateModified={p.updatedAt ?? p.publishedAt}
          authorName={author?.name ?? "Aksh Finserv"}
          publisherName="Aksh Finserv"
        />
        <BreadcrumbJsonLd
          useAppDir
          itemListElements={[
            { position: 1, name: "Home", item: SITE_URL },
            { position: 2, name: "Insights", item: `${SITE_URL}/insights` },
            { position: 3, name: p.title, item: `${SITE_URL}/insights/${p.slug}` },
          ]}
        />
      </article>

      {related.length ? (
        <Section className="border-t border-line">
          <SectionHeading eyebrow="Read next" title="Related notes." />
          <div className="grid gap-4 md:grid-cols-3">
            {related.map((r) => (
              <InsightCard key={r.slug} post={{ ...r, authorName: getTeamBySlug(r.author)?.name }} />
            ))}
          </div>
        </Section>
      ) : null}

      {p.cta === "one-page" ? (
        <CtaBand
          title="Could your family's money fit on one page? See yours in two minutes."
          label="Take the One-Page Test"
          href="/one-page"
        />
      ) : (
        <CtaBand title="Questions about your own situation? Talk to the team." />
      )}
    </>
  );
}
