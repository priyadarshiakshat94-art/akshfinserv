"use client";

import { useEffect, useState } from "react";
import { insightCategories } from "@/lib/content/schemas";
import { CATEGORY_LABEL } from "@/lib/format";
import { cn } from "@/lib/utils";
import { InsightCard, type InsightCardData } from "./insight-card";

type Category = (typeof insightCategories)[number];
const isCategory = (v: string | null): v is Category =>
  !!v && (insightCategories as readonly string[]).includes(v);

// Filters client-side so /insights stays a static page; ?category= is kept in the URL for sharing.
export function InsightsFilter({ posts }: { posts: InsightCardData[] }) {
  const [active, setActive] = useState<Category | null>(null);

  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("category");
    if (isCategory(c)) setActive(c);
  }, []);

  function select(c: Category | null) {
    setActive(c);
    const url = new URL(window.location.href);
    if (c) url.searchParams.set("category", c);
    else url.searchParams.delete("category");
    window.history.replaceState(null, "", url);
  }

  const counts = Object.fromEntries(
    insightCategories.map((c) => [c, posts.filter((p) => p.category === c).length]),
  ) as Record<Category, number>;
  const visible = active ? posts.filter((p) => p.category === active) : posts;

  const pill = (on: boolean) =>
    cn(
      "h-10 rounded-pill border px-5 text-sm transition-colors duration-200",
      on ? "border-gold bg-gold text-ink-dark" : "border-line text-ink-secondary hover:border-line-hover hover:text-ink",
    );

  return (
    <>
      <div role="group" aria-label="Filter by category" className="mb-10 flex flex-wrap gap-2">
        <button type="button" aria-pressed={!active} onClick={() => select(null)} className={pill(!active)}>
          All <span className="opacity-60">{posts.length}</span>
        </button>
        {insightCategories.map((c) =>
          counts[c] ? (
            <button key={c} type="button" aria-pressed={active === c} onClick={() => select(c)} className={pill(active === c)}>
              {CATEGORY_LABEL[c]} <span className="opacity-60">{counts[c]}</span>
            </button>
          ) : null,
        )}
      </div>
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <li key={p.slug}>
            <InsightCard post={p} />
          </li>
        ))}
      </ul>
    </>
  );
}
