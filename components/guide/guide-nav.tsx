"use client";

import { useEffect, useState } from "react";
import { GUIDE_SECTIONS } from "@/lib/family-guide";
import { trackEvent } from "@/lib/track";
import { cn } from "@/lib/utils";

// Contents for the Family Money Guide. "desktop" is the sticky list in the side column; "mobile" is the slim
// bar that opens a list. The mobile bar must sit outside the two-column grid (as a direct child of the
// article), or it stops sticking once its grid cell scrolls away.
export function GuideNav({ variant }: { variant: "desktop" | "mobile" }) {
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const els = GUIDE_SECTIONS.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        const top = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (top) setActive(top.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  const onClick = (id: string) => {
    trackEvent("hub_toc_click", { section: id });
    setOpen(false);
  };

  const list = (
    <ol className="grid gap-1 text-sm">
      {GUIDE_SECTIONS.map((s) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            onClick={() => onClick(s.id)}
            aria-current={active === s.id ? "location" : undefined}
            className={cn(
              "flex gap-3 rounded-[10px] px-3 py-2 transition-colors duration-200",
              active === s.id ? "bg-elevated-2 text-ink" : "text-ink-secondary hover:text-ink",
            )}
          >
            <span className="w-5 shrink-0 tabular-nums text-gold">{s.n}</span>
            {s.label}
          </a>
        </li>
      ))}
    </ol>
  );

  if (variant === "desktop") {
    return (
      <nav aria-label="In this guide" className="hidden lg:sticky lg:top-8 lg:block">
        <p className="eyebrow mb-4 px-3">In this guide</p>
        {list}
      </nav>
    );
  }

  return (
    <nav aria-label="In this guide" className="sticky top-0 z-30 border-y border-line bg-base/95 px-5 backdrop-blur sm:px-8 lg:hidden">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-12 w-full items-center justify-between text-sm text-ink"
        >
          <span>
            <span className="text-ink-secondary">In this guide: </span>
            {GUIDE_SECTIONS.find((s) => s.id === active)?.label ?? "Contents"}
          </span>
          <span aria-hidden className={cn("text-ink-secondary transition-transform", open && "rotate-45")}>
            +
          </span>
        </button>
        {open ? <div className="max-h-[70vh] overflow-y-auto pb-4">{list}</div> : null}
    </nav>
  );
}
