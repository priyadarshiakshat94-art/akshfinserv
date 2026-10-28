import { z } from "zod";

// Strict frontmatter schemas. Kept CMS-shaped so a later migration is a copy-paste.

const isoDate = z
  .union([z.string(), z.date()])
  .transform((v) => (v instanceof Date ? v.toISOString() : v))
  .refine((v) => !Number.isNaN(Date.parse(v)), "must be an ISO date");

export const seoSchema = z
  .object({
    metaTitle: z.string().max(70).optional(),
    metaDescription: z.string().max(170).optional(),
    ogImage: z.string().optional(),
    noIndex: z.boolean().default(false),
  })
  .strict()
  .default({ noIndex: false });

export const insightCategories = [
  "markets",
  "planning",
  "interviews",
  "client-letters",
  "guides",
] as const;

export const insightSchema = z
  .object({
    title: z.string().min(1).max(120),
    slug: z.string().min(1),
    category: z.enum(insightCategories),
    excerpt: z.string().min(60).max(220),
    coverImage: z.string().startsWith("/images/insights/"),
    coverAlt: z.string(),
    author: z.string().min(1),
    publishedAt: isoDate,
    readTime: z.number().int().positive(),
    related: z.array(z.string()).max(3).optional(),
    seo: seoSchema,
  })
  .strict();

export const teamSchema = z
  .object({
    name: z.string().min(1),
    slug: z.string().min(1),
    role: z.string().min(1),
    shortBio: z.string().max(220),
    credentials: z.array(z.string()),
    photo: z.string().startsWith("/images/team/"),
    photoAlt: z.string(),
    linkedin: z.string().url().optional(),
    order: z.number().default(100),
  })
  .strict();

export const testimonialSchema = z
  .object({
    quote: z.string().min(1).max(400),
    clientName: z.string().min(1),
    clientRole: z.string().optional(),
    city: z.string().default("Mumbai"),
    yearJoined: z.number().int().min(1998).max(new Date().getFullYear()),
    photo: z.string().startsWith("/images/testimonials/").optional(),
    photoAlt: z.string().optional(),
    consentGiven: z.boolean(),
    featured: z.boolean().default(false),
    order: z.number().default(100),
  })
  .strict();

export const offeringSchema = z
  .object({
    title: z.string().min(1),
    slug: z.string().min(1),
    oneLinePromise: z.string().min(1).max(100),
    whoItIsFor: z.array(z.string()).min(3).max(5),
    coverImage: z.string(),
    coverAlt: z.string(),
    faqs: z.array(z.object({ q: z.string(), a: z.string() }).strict()).default([]),
    relatedInsights: z.array(z.string()).optional(),
    seo: seoSchema,
  })
  .strict();

export const interviewSchema = z
  .object({
    managerName: z.string().min(1),
    slug: z.string().min(1),
    managerRole: z.string().optional(),
    amc: z.string().min(1),
    format: z.enum(["text", "video", "audio"]),
    mediaUrl: z.string().url().optional(),
    coverImage: z.string(),
    coverAlt: z.string(),
    summary: z.string().min(1).max(240),
    publishedAt: isoDate,
    seo: seoSchema,
  })
  .strict()
  .refine((d) => d.format === "text" || !!d.mediaUrl, {
    message: "mediaUrl is required for video and audio interviews",
    path: ["mediaUrl"],
  });

export type Insight = z.infer<typeof insightSchema>;
export type TeamMember = z.infer<typeof teamSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
export type Offering = z.infer<typeof offeringSchema>;
export type Interview = z.infer<typeof interviewSchema>;
