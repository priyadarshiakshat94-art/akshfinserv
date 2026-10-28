import Link from "next/link";
import { getLatestInsights, getTeamBySlug } from "@/lib/content";
import { Section, SectionHeading } from "@/components/site/section";
import { FadeIn } from "@/components/motion/fade-in";
import { CATEGORY_LABEL, fmtDate } from "@/lib/format";

export function InsightsPreview() {
  const posts = getLatestInsights(3);

  return (
    <Section>
      <SectionHeading
        eyebrow="Insights"
        title="Notes from the Powai desk."
        aside={
          <Link href="/insights" className="text-ink underline decoration-line-hover underline-offset-4 hover:decoration-gold">
            All insights
          </Link>
        }
      />
      <div className="grid gap-4 md:grid-cols-3">
        {posts.map((p, i) => (
          <FadeIn key={p.slug} delay={i * 0.05}>
            <Link
              href={`/insights/${p.slug}`}
              className="card-lift flex h-full min-h-[22rem] flex-col justify-between rounded-card bg-elevated p-8"
            >
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="rounded-pill bg-elevated-2 px-3 py-1 text-ink-secondary">
                    {CATEGORY_LABEL[p.category]}
                  </span>
                  <span className="text-ink-muted">{p.readTime} min read</span>
                </div>
                <h3 className="mt-8 text-[1.6rem] leading-[1.15] text-ink">{p.title}</h3>
                <p className="mt-4 line-clamp-3 text-[0.95rem] text-ink-secondary">{p.excerpt}</p>
              </div>
              <p className="mt-8 text-sm text-ink-muted">
                {getTeamBySlug(p.author)?.name} · {fmtDate(p.publishedAt)}
              </p>
            </Link>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
