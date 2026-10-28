import type { Metadata } from "next";
import { getAllInsights, getTeamBySlug } from "@/lib/content";
import { PageIntro } from "@/components/site/page-intro";
import { Section } from "@/components/site/section";
import { InsightsFilter } from "@/components/site/insights-filter";

export const metadata: Metadata = {
  title: "Insights",
  description: "Market notes, planning maths and client letters from the Aksh Finserv desk in Powai, Mumbai.",
  alternates: { canonical: "/insights" },
};

export default function InsightsPage() {
  const posts = getAllInsights().map(({ slug, title, excerpt, category, readTime, publishedAt, author }) => ({
    slug,
    title,
    excerpt,
    category,
    readTime,
    publishedAt,
    authorName: getTeamBySlug(author)?.name,
  }));

  return (
    <>
      <PageIntro
        eyebrow="Insights"
        title="Notes from the Powai desk."
        lede="What we tell clients when markets move, rules change, or a decision needs numbers. Written by the people who make the calls."
      />
      <Section className="pt-0 lg:pt-0">
        <InsightsFilter posts={posts} />
      </Section>
    </>
  );
}
