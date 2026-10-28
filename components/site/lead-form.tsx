"use client";

import { useEffect, useRef, useState } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { ArrowRight } from "lucide-react";
import { leadIntents, leadSchema, type Lead } from "@/lib/lead";
import { cn } from "@/lib/utils";
import { trackLead } from "@/lib/track";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const INTENT_LABEL: Record<Lead["intent"], string> = {
  "portfolio-review": "Review my portfolio",
  "call-plabita": "Talk to Plabita",
  general: "Something else",
};

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

const THEME = {
  // Sits on the gold card.
  gold: {
    field:
      "border-ink-dark/15 bg-[#f5f2ec]/35 text-ink-dark placeholder:text-[#3d2f1a]/60 focus:border-ink-dark/50 focus:bg-[#f5f2ec]/55",
    button: "bg-ink-dark text-surface-light hover:bg-black",
    muted: "text-[#3d2f1a]/80",
    error: "text-[#7a2a14]",
    sent: "bg-ink-dark/10",
    turnstile: "light" as const,
  },
  // Sits on charcoal.
  dark: {
    field:
      "border-line bg-elevated-2 text-ink placeholder:text-ink-muted focus:border-gold/60",
    button: "bg-gold text-ink-dark hover:bg-gold-hover",
    muted: "text-ink-muted",
    error: "text-[#f0937c]",
    sent: "bg-elevated-2",
    turnstile: "dark" as const,
  },
};

/**
 * Lead capture form posting to /api/lead.
 * `full` adds email, city and a topic picker (contact page); the default is name + mobile.
 * With `full`, ?intent= in the URL preselects the topic.
 */
export function LeadForm({
  variant = "gold",
  full = false,
  defaultIntent = "portfolio-review",
}: {
  variant?: keyof typeof THEME;
  full?: boolean;
  defaultIntent?: Lead["intent"];
}) {
  const t = THEME[variant];
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [token, setToken] = useState<string | null>(null);
  const [intent, setIntent] = useState<Lead["intent"]>(defaultIntent);
  const turnstile = useRef<TurnstileInstance>(null);

  useEffect(() => {
    if (!full) return;
    const fromUrl = new URLSearchParams(window.location.search).get("intent");
    if (fromUrl && (leadIntents as readonly string[]).includes(fromUrl)) setIntent(fromUrl as Lead["intent"]);
  }, [full]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      mobile: String(form.get("mobile") ?? ""),
      email: String(form.get("email") ?? ""),
      city: String(form.get("city") ?? ""),
      intent,
    };

    const parsed = leadSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0]), i.message])));
      return;
    }
    setErrors({});
    if (SITE_KEY && !token) {
      setStatus({ kind: "error", message: "Please wait for the security check to finish." });
      return;
    }

    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, website: form.get("website"), turnstileToken: token }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Something went wrong. Please email plabita@akshfinserv.com.");
      trackLead(intent);
      setStatus({ kind: "sent" });
    } catch (err) {
      setStatus({ kind: "error", message: (err as Error).message });
      turnstile.current?.reset();
      setToken(null);
    }
  }

  if (status.kind === "sent") {
    return (
      <div role="status" className={cn("rounded-[20px] p-6", t.sent)}>
        <p className="font-display text-2xl">Thank you. We have your details.</p>
        <p className={cn("mt-2", t.muted)}>Plabita or Shailee will call you within one working day.</p>
      </div>
    );
  }

  const field = cn(
    "h-14 w-full rounded-pill border px-6 outline-none transition-colors duration-200",
    t.field,
  );

  const input = (
    name: "name" | "mobile" | "email" | "city",
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement> = {},
  ) => (
    <div>
      <label className="sr-only" htmlFor={`lead-${name}`}>
        {label}
      </label>
      <input
        id={`lead-${name}`}
        name={name}
        placeholder={label}
        className={field}
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? `lead-${name}-err` : undefined}
        {...props}
      />
      {errors[name] ? (
        <p id={`lead-${name}-err`} className={cn("mt-2 px-6 text-sm", t.error)}>
          {errors[name]}
        </p>
      ) : null}
    </div>
  );

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3">
      {/* Honeypot: real visitors never see or fill this. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      {full ? (
        <fieldset className="mb-3">
          <legend className={cn("mb-3 text-sm", t.muted)}>What would you like to do?</legend>
          <div className="flex flex-wrap gap-2">
            {leadIntents.map((i) => (
              <label
                key={i}
                className={cn(
                  "cursor-pointer rounded-pill border px-4 py-2 text-sm transition-colors duration-200",
                  intent === i ? "border-gold bg-gold text-ink-dark" : "border-line text-ink-secondary hover:border-line-hover",
                )}
              >
                <input
                  type="radio"
                  name="intent"
                  value={i}
                  checked={intent === i}
                  onChange={() => setIntent(i)}
                  className="sr-only"
                />
                {INTENT_LABEL[i]}
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      {input("name", "Your name", { autoComplete: "name" })}
      {input("mobile", "Mobile number", { type: "tel", inputMode: "tel", autoComplete: "tel" })}
      {full ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {input("email", "Email (optional)", { type: "email", autoComplete: "email" })}
          {input("city", "City (optional)", { autoComplete: "address-level2" })}
        </div>
      ) : null}

      {SITE_KEY ? (
        <Turnstile
          ref={turnstile}
          siteKey={SITE_KEY}
          onSuccess={setToken}
          onExpire={() => setToken(null)}
          options={{ theme: t.turnstile, size: "flexible", appearance: "interaction-only" }}
        />
      ) : null}

      <button
        type="submit"
        disabled={status.kind === "sending"}
        className={cn(
          "group mt-2 inline-flex h-14 items-center justify-center gap-2 rounded-pill px-7 font-medium transition-colors duration-200 disabled:opacity-60",
          t.button,
        )}
      >
        {status.kind === "sending" ? "Sending" : full ? "Send" : "Review my portfolio"}
        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={1.75} />
      </button>

      {status.kind === "error" ? (
        <p role="alert" className={cn("px-2 text-sm", t.error)}>
          {status.message}
        </p>
      ) : null}
      <p className={cn("px-2 text-xs", t.muted)}>
        We use your details only to contact you about this request. No spam, no lists.
      </p>
    </form>
  );
}
