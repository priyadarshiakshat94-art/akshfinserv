"use client";

import { useState } from "react";
import { ArrowRight, Download } from "lucide-react";
import Link from "next/link";
import { WORKBOOK_PDF } from "@/lib/family-guide";
import { trackEvent } from "@/lib/track";

type Status = "idle" | "sending" | "sent" | "error";

// Emails the Family Money Workbook. The monthly email is a separate, unticked choice:
// the workbook is sent either way.
export function WorkbookForm({ placement }: { placement: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const consent = form.get("monthly") === "on";
    setStatus("sending");
    try {
      const res = await fetch("/api/workbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          name: form.get("name"),
          monthly: consent,
          website: form.get("website"),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error ?? "That didn't go through. Please try again.");
      trackEvent("workbook_request", { placement, newsletter_consent: consent ? "yes" : "no" });
      setEmail(String(form.get("email") ?? ""));
      setStatus("sent");
    } catch (err) {
      setError((err as Error).message);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="grid gap-4">
        <p className="text-lg text-ink">Sent to {email}.</p>
        <p className="text-ink-secondary">
          It should arrive within a minute. If it doesn&apos;t, check Promotions or Spam. You can also download it now.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href={WORKBOOK_PDF}
            data-track="workbook_download"
            data-section={placement}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-pill border border-line px-6 text-sm text-ink hover:border-line-hover"
          >
            <Download className="size-4" strokeWidth={1.75} /> Download the PDF
          </a>
          <Link
            href="/one-page"
            data-track="hub_card_click"
            data-section="workbook"
            data-dest="/one-page"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-pill px-2 text-sm text-ink-secondary hover:text-ink"
          >
            Not sure which pages to fill first? Take the One-Page Test
            <ArrowRight className="size-4" strokeWidth={1.75} />
          </Link>
        </div>
      </div>
    );
  }

  const field =
    "h-12 w-full rounded-pill border border-line bg-base px-5 text-sm text-ink outline-none placeholder:text-ink-muted focus:border-gold/60";

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      <div className="grid gap-3 sm:grid-cols-[1fr_1.4fr]">
        <label className="sr-only" htmlFor={`wb-name-${placement}`}>
          First name (optional)
        </label>
        <input id={`wb-name-${placement}`} name="name" autoComplete="given-name" placeholder="First name (optional)" maxLength={60} className={field} />
        <label className="sr-only" htmlFor={`wb-email-${placement}`}>
          Email address
        </label>
        <input
          id={`wb-email-${placement}`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Your email"
          maxLength={120}
          className={field}
        />
      </div>
      <label className="flex items-start gap-3 px-1 text-sm text-ink-secondary">
        <input type="checkbox" name="monthly" className="mt-1 size-4 shrink-0 accent-[#c9a36b]" />
        <span>Also send me one email a month on keeping our family&apos;s money in order. I can unsubscribe any time.</span>
      </label>
      <button
        type="submit"
        disabled={status === "sending"}
        className="group inline-flex h-12 items-center justify-center gap-2 rounded-pill bg-gold px-7 font-medium text-ink-dark transition-colors duration-200 hover:bg-gold-hover disabled:opacity-60 sm:justify-self-start"
      >
        {status === "sending" ? "Sending…" : "Email me the workbook"}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
      </button>
      {status === "error" ? (
        <p role="alert" className="px-1 text-sm text-[#f0937c]">
          {error}{" "}
          <a
            href={WORKBOOK_PDF}
            data-track="workbook_download"
            data-section={`${placement}-fallback`}
            className="text-ink underline underline-offset-4"
          >
            Download the workbook directly
          </a>
          .
        </p>
      ) : null}
      <p className="px-1 text-xs leading-relaxed text-ink-muted">
        We use your email to send the workbook and, only if you ticked the box, the monthly note. We don&apos;t share it
        with anyone. <Link href="/privacy" className="underline underline-offset-4 hover:text-ink-secondary">Privacy policy</Link>.
      </p>
    </form>
  );
}
