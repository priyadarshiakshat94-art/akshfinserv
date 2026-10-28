import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ArticleJsonLd } from "next-seo";
import { getAllInsights, getInsightBySlug, getTeamBySlug } from "@/lib/content";
import { Markdown } from "@/lib/mdx";
import { seoMetadata } from "@/lib/seo";
import { publicFileExists } from "@/lib/assets";
import { CATEGORY_LABEL, fmtDate } from "@/lib/format";
import { Section, SectionHeading } from "@/components/site/section";
import { CtaBand } from "@/components/site/cta-band";
import { InsightCard } from "@/components/site/insight-card";

export const dynamicParams = false;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://akshfinserv.com";

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
              {fmtDate(p.publishedAt)} · {p.readTime} min read
            </span>
          </div>
          <h1 className="mt-6 max-w-[56rem] text-[clamp(2.4rem,5.4vw,4.5rem)] text-ink">{p.title}</h1>
          <p className="mt-6 max-w-[42rem] text-lg text-ink-secondary">{p.excerpt}</p>
          {author ? (
            <p className="mt-8 text-sm text-ink-muted">
              By <span className="text-ink">{author.name}</span>, {author.role}
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
          </div>
        </div>
        <ArticleJsonLd
          useAppDir
          url={`${SITE_URL}/insights/${p.slug}`}
          title={p.title}
          description={p.excerpt}
          images={hasCover ? [`${SITE_URL}${p.coverImage}`] : []}
          datePublished={p.publishedAt}
          authorName={author?.name ?? "Aksh Finserv"}
          publisherName="Aksh Finserv"
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

      <CtaBand title="Want these numbers run on your own portfolio?" />
    </>
  );
}
