import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";
import type { z } from "zod";
import {
  insightSchema,
  interviewSchema,
  offeringSchema,
  teamSchema,
  testimonialSchema,
  type Insight,
  type Interview,
  type Offering,
  type TeamMember,
  type Testimonial,
} from "./schemas";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type WithBody<T> = T & { body: string };

// Reads every .md/.mdx file in a collection and validates its frontmatter.
// Any invalid file throws, which fails `next build`.
function loadCollection<S extends z.ZodTypeAny>(
  folder: string,
  schema: S,
): WithBody<z.output<S>>[] {
  const dir = path.join(CONTENT_DIR, folder);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => /\.mdx?$/.test(f))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);
      const parsed = schema.safeParse(data);
      if (!parsed.success) {
        const issues = parsed.error.issues
          .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
          .join("\n");
        throw new Error(`Invalid frontmatter in content/${folder}/${file}\n${issues}`);
      }
      // Testimonials have no slug field; every other collection must match its filename.
      const expectedSlug = file.replace(/\.mdx?$/, "");
      if ("slug" in parsed.data && parsed.data.slug !== expectedSlug) {
        throw new Error(
          `Slug mismatch in content/${folder}/${file}: slug is "${parsed.data.slug}", expected "${expectedSlug}"`,
        );
      }
      return { ...parsed.data, body: content };
    });
}

const byDateDesc = (a: { publishedAt: string }, b: { publishedAt: string }) =>
  Date.parse(b.publishedAt) - Date.parse(a.publishedAt);
const byOrder = (a: { order: number }, b: { order: number }) => a.order - b.order;

// Insights
export const getAllInsights = cache((): WithBody<Insight>[] =>
  loadCollection("insights", insightSchema).sort(byDateDesc),
);
export const getInsightBySlug = (slug: string) =>
  getAllInsights().find((i) => i.slug === slug) ?? null;
export const getLatestInsights = (n: number) => getAllInsights().slice(0, n);

// Team
export const getAllTeam = cache((): WithBody<TeamMember>[] =>
  loadCollection("team", teamSchema).sort(byOrder),
);
export const getTeamBySlug = (slug: string) =>
  getAllTeam().find((t) => t.slug === slug) ?? null;

// Testimonials. Without written consent a quote only renders in development.
export const getAllTestimonials = cache((): Testimonial[] =>
  loadCollection("testimonials", testimonialSchema)
    .filter((t) => t.consentGiven || process.env.NODE_ENV !== "production")
    .sort(byOrder),
);
export const getFeaturedTestimonials = () =>
  getAllTestimonials().filter((t) => t.featured);

// Offerings. Display order is fixed here; unknown slugs go last.
const OFFERING_ORDER = [
  "mutual-funds",
  "equity-and-etfs",
  "nps",
  "loan-against-mutual-funds",
  "insurance",
];
const offeringRank = (slug: string) => {
  const i = OFFERING_ORDER.indexOf(slug);
  return i === -1 ? OFFERING_ORDER.length : i;
};
export const getAllOfferings = cache((): WithBody<Offering>[] =>
  loadCollection("offerings", offeringSchema).sort(
    (a, b) => offeringRank(a.slug) - offeringRank(b.slug),
  ),
);
export const getOfferingBySlug = (slug: string) =>
  getAllOfferings().find((o) => o.slug === slug) ?? null;

// Fund manager interviews
export const getAllInterviews = cache((): WithBody<Interview>[] =>
  loadCollection("fund-manager-interviews", interviewSchema).sort(byDateDesc),
);
export const getInterviewBySlug = (slug: string) =>
  getAllInterviews().find((i) => i.slug === slug) ?? null;

// Cross-collection checks: authors and related slugs must point at real files.
export function validateContentGraph() {
  const insights = getAllInsights();
  const slugs = new Set(insights.map((i) => i.slug));
  const team = new Set(getAllTeam().map((t) => t.slug));
  for (const i of insights) {
    if (!team.has(i.author)) throw new Error(`Insight "${i.slug}": unknown author "${i.author}"`);
    for (const r of i.related ?? [])
      if (!slugs.has(r)) throw new Error(`Insight "${i.slug}": unknown related slug "${r}"`);
  }
  for (const o of getAllOfferings())
    for (const r of o.relatedInsights ?? [])
      if (!slugs.has(r)) throw new Error(`Offering "${o.slug}": unknown related insight "${r}"`);
}
