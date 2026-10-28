"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { trackNewsletterSignup } from "@/lib/track";

type Status = "idle" | "sending" | "sent" | "error";

export function NewsletterForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), website: form.get("website") }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Could not sign you up. Please try again later.");
      trackNewsletterSignup();
      setStatus("sent");
    } catch (err) {
      setError((err as Error).message);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return <p role="status" className="text-sm text-ink">Done. The next note from the Powai desk will reach your inbox.</p>;
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-[26rem]">
      <p className="eyebrow mb-4">One email a month</p>
      <div className="flex h-12 items-center rounded-pill border border-line bg-elevated pl-5 pr-1.5 focus-within:border-gold/60">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Your email"
          className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          aria-label="Subscribe"
          className="grid size-9 shrink-0 place-items-center rounded-full bg-gold text-ink-dark transition-colors duration-200 hover:bg-gold-hover disabled:opacity-60"
        >
          <ArrowRight className="size-4" strokeWidth={1.75} />
        </button>
      </div>
      {status === "error" ? (
        <p role="alert" className="mt-2 px-2 text-sm text-[#f0937c]">
          {error}
        </p>
      ) : (
        <p className="mt-2 px-2 text-xs text-ink-muted">Market notes and planning maths. Unsubscribe any time.</p>
      )}
    </form>
  );
}
