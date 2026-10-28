import type { Metadata } from "next";

type Seo = { metaTitle?: string; metaDescription?: string; ogImage?: string; noIndex: boolean };

// Maps a content file's `seo` block onto Next metadata, falling back to page values.
export function seoMetadata(
  seo: Seo,
  fallback: { title: string; description: string; path: string; image?: string },
): Metadata {
  const title = seo.metaTitle ?? fallback.title;
  const description = seo.metaDescription ?? fallback.description;
  const image = seo.ogImage ?? fallback.image;
  return {
    // metaTitle already carries the brand suffix, so bypass the layout template.
    title: seo.metaTitle ? { absolute: seo.metaTitle } : fallback.title,
    description,
    alternates: { canonical: fallback.path },
    robots: seo.noIndex ? { index: false, follow: true } : undefined,
    openGraph: { title, description, url: fallback.path, images: image ? [image] : undefined },
  };
}
