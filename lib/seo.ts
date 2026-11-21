import type { Metadata } from "next";

// The site-wide share image. Setting openGraph on a page replaces the default, so pages name it explicitly.
export const DEFAULT_SHARE_IMAGE = "/opengraph-image.png";

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
    // Pages without their own image use the site's default share image (app/opengraph-image.png).
    openGraph: { title, description, url: fallback.path, images: [image ?? DEFAULT_SHARE_IMAGE] },
  };
}
