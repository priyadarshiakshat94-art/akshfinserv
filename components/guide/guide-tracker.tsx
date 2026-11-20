"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/track";

// One listener for the guide's links. Any element with data-track="event_name" fires that GA4
// event when clicked, with its data-section and data-dest values. No personal details are sent.
export function GuideTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.("[data-track]") as HTMLElement | null;
      if (!el) return;
      const params: Record<string, string> = {};
      if (el.dataset.section) params.section = el.dataset.section;
      if (el.dataset.dest) params.destination = el.dataset.dest;
      trackEvent(el.dataset.track!, params);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
