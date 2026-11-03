"use client";

import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { z } from "zod";
import { leadSchema } from "@/lib/lead";
import { cn } from "@/lib/utils";
import { trackLead } from "@/lib/track";

export const CALL_SLOTS = ["10 am to 12 noon", "12 noon to 2 pm", "2 pm to 4 pm", "4 pm to 6 pm"] as const;

const bookingSchema = z.object({
  name: leadSchema.shape.name,
  mobile: leadSchema.shape.mobile,
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a day")
    .refine((d) => new Date(`${d}T00:00:00`).getDay() !== 0, "We are closed on Sundays. Pick Monday to Saturday"),
  slot: z.enum(CALL_SLOTS, { message: "Pick a time" }),
  topic: z.string().trim().max(300).optional().or(z.literal("")),
});

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent"; when: string } | { kind: "error" };

// Local date as YYYY-MM-DD, offset by `days`.
function isoDay(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-");
}

/**
 * Call request form, submitted to Netlify Forms. The matching static form in
 * public/__forms.html is what Netlify detects at deploy; field names must stay in sync.
 * `source` tags where the request came from; `requireConsent` adds an explicit contact consent box.
 */
export function BookCallForm({
  defaultTopic = "",
  source = "home",
  requireConsent = false,
}: {
  defaultTopic?: string;
  source?: string;
  requireConsent?: boolean;
} = {}) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [minDay, maxDay] = useMemo(() => [isoDay(1), isoDay(30)], []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = bookingSchema.safeParse({
      name: String(form.get("name") ?? ""),
      mobile: String(form.get("mobile") ?? ""),
      date: String(form.get("date") ?? ""),
      slot: String(form.get("slot") ?? ""),
      topic: String(form.get("topic") ?? ""),
    });
    const consented = !requireConsent || form.get("consent") === "yes";
    if (!parsed.success || !consented) {
      const next: Record<string, string> = parsed.success ? {} : Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0]), i.message]));
      if (!consented) next.consent = "Please tick the box so we can contact you about this call";
      setErrors(next);
      return;
    }
    setErrors({});
    setStatus({ kind: "sending" });

    const body = new URLSearchParams({
      "form-name": "book-call",
      "bot-field": String(form.get("bot-field") ?? ""),
      ...parsed.data,
      topic: parsed.data.topic ?? "",
      source,
      consent: requireConsent ? "yes" : "",
    });
    try {
      const res = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      if (!res.ok) throw new Error(String(res.status));
      trackLead(source === "home" ? "call-plabita" : `call-plabita-${source}`);
      const day = new Date(`${parsed.data.date}T00:00:00`).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
      setStatus({ kind: "sent", when: `${day}, ${parsed.data.slot}` });
    } catch {
      setStatus({ kind: "error" });
    }
  }

  if (status.kind === "sent") {
    return (
      <div role="status" className="rounded-[20px] bg-elevated-2 p-6">
        <p className="font-display text-2xl text-ink">Request received.</p>
        <p className="mt-2 text-ink-muted">
          You asked for {status.when}. We will call or message you within one working day to confirm the time.
        </p>
      </div>
    );
  }

  const field =
    "h-14 w-full rounded-pill border border-line bg-elevated-2 px-6 text-ink outline-none transition-colors duration-200 placeholder:text-ink-muted focus:border-gold/60";
  const err = (name: string) =>
    errors[name] ? (
      <p id={`call-${name}-err`} className="mt-2 px-6 text-sm text-[#f0937c]">
        {errors[name]}
      </p>
    ) : null;
  const a11y = (name: string) => ({
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `call-${name}-err` : undefined,
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3">
      {/* Honeypot: real visitors never see or fill this. */}
      <input type="text" name="bot-field" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      <div>
        <label className="sr-only" htmlFor="call-name">Your name</label>
        <input id="call-name" name="name" placeholder="Your name" autoComplete="name" className={field} {...a11y("name")} />
        {err("name")}
      </div>
      <div>
        <label className="sr-only" htmlFor="call-mobile">Mobile number</label>
        <input
          id="call-mobile"
          name="mobile"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="Mobile number"
          className={field}
          {...a11y("mobile")}
        />
        {err("mobile")}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-2 block px-6 text-sm text-ink-muted" htmlFor="call-date">Day</label>
          <input id="call-date" name="date" type="date" min={minDay} max={maxDay} className={cn(field, "[color-scheme:dark]")} {...a11y("date")} />
          {err("date")}
        </div>
        <div>
          <label className="mb-2 block px-6 text-sm text-ink-muted" htmlFor="call-slot">Time (IST)</label>
          <select id="call-slot" name="slot" defaultValue="" className={cn(field, "appearance-none")} {...a11y("slot")}>
            <option value="" disabled>
              Pick a time
            </option>
            {CALL_SLOTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {err("slot")}
        </div>
      </div>
      <div>
        <label className="sr-only" htmlFor="call-topic">What would you like to talk about? (optional)</label>
        <input
          id="call-topic"
          name="topic"
          defaultValue={defaultTopic}
          maxLength={300}
          placeholder="What would you like to talk about? (optional)"
          className={field}
        />
      </div>

      {requireConsent ? (
        <div>
          <label className="flex items-start gap-3 px-2 text-sm text-ink-secondary" htmlFor="call-consent">
            <input
              id="call-consent"
              name="consent"
              type="checkbox"
              value="yes"
              className="mt-0.5 size-5 shrink-0 accent-[var(--accent)]"
              {...a11y("consent")}
            />
            Aksh Finserv may call or message me on this number about this request. Nothing else, and no lists.
          </label>
          {err("consent")}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={status.kind === "sending"}
        className="group mt-2 inline-flex h-14 items-center justify-center gap-2 rounded-pill bg-gold px-7 font-medium text-ink-dark transition-colors duration-200 hover:bg-gold-hover disabled:opacity-60"
      >
        {status.kind === "sending" ? "Sending" : "Request this slot"}
        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={1.75} />
      </button>

      {status.kind === "error" ? (
        <p role="alert" className="px-2 text-sm text-[#f0937c]">
          We could not send your request. Please email plabita@akshfinserv.com.
        </p>
      ) : null}
      <p className="px-2 text-xs text-ink-muted">
        Monday to Saturday. We confirm every request by phone. We use your details only for this call.
      </p>
    </form>
  );
}
