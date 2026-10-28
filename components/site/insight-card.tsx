import Link from "next/link";
import type { Insight } from "@/lib/content/schemas";
import { CATEGORY_LABEL, fmtDate } from "@/lib/format";

export type InsightCardData = Pick<
  Insight,
  "slug" | "title" | "excerpt" | "category" | "readTime" | "publishedAt"
> & { authorName?: string };

export function InsightCard({ post }: { post: InsightCardData }) {
  return (
    <Link
      href={`/insights/${post.slug}`}
      className="card-lift flex h-full min-h-[20rem] flex-col justify-between rounded-card bg-elevated p-8"
    >
      <div>
        <div className="flex items-center justify-between text-xs">
          <span className="rounded-pill bg-elevated-2 px-3 py-1 text-ink-secondary">{CATEGORY_LABEL[post.category]}</span>
          <span className="text-ink-muted">{post.readTime} min read</span>
        </div>
        <h3 className="mt-8 text-[1.5rem] leading-[1.15] text-ink">{post.title}</h3>
        <p className="mt-4 line-clamp-3 text-[0.95rem] text-ink-secondary">{post.excerpt}</p>
      </div>
      <p className="mt-8 text-sm text-ink-muted">
        {post.authorName ? `${post.authorName} · ` : ""}
        {fmtDate(post.publishedAt)}
      </p>
    </Link>
  );
}
