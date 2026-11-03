// Conversion events for GA4 and Meta Pixel. Safe to call when either is not loaded.

type Gtag = (...args: unknown[]) => void;
type Fbq = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: Gtag;
    fbq?: Fbq;
  }
}

export function trackLead(intent: string) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", "generate_lead", { lead_intent: intent });
  window.fbq?.("track", "Lead", { content_category: intent });
}

/** A GA4 custom event. Never pass personal details or test answers. */
export function trackEvent(name: string, params: Record<string, string | number> = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
}

export function trackNewsletterSignup() {
  if (typeof window === "undefined") return;
  window.gtag?.("event", "sign_up", { method: "newsletter" });
  window.fbq?.("track", "CompleteRegistration", { content_name: "newsletter" });
}
