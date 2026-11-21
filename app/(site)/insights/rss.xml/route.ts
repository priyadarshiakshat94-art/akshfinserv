import { getAllInsights, getTeamBySlug } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

// RSS feed of every published Insights article, so readers and AI tools can see new pieces.
export const dynamic = "force-static";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const posts = getAllInsights();
  const items = posts
    .map((p) => {
      const url = `${SITE_URL}/insights/${p.slug}`;
      const author = getTeamBySlug(p.author)?.name ?? "Aksh Finserv";
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${esc(p.excerpt)}</description>
      <dc:creator>${esc(author)}</dc:creator>
      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
    </item>`;
    })
    .join("\n");
  const lastBuild = posts[0] ? new Date(posts[0].updatedAt ?? posts[0].publishedAt).toUTCString() : new Date().toUTCString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Aksh Finserv Insights</title>
    <link>${SITE_URL}/insights</link>
    <atom:link href="${SITE_URL}/insights/rss.xml" rel="self" type="application/rss+xml" />
    <description>Notes from Aksh Finserv, an AMFI-registered mutual fund distributor in Powai, Mumbai, on organising and looking after a family's money.</description>
    <language>en-in</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
