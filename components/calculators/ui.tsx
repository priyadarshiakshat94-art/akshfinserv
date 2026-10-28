"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

/** Slider plus a typed number box, kept in sync. */
export function SliderField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix,
  suffix,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  hint?: string;
}) {
  const id = useId();
  const pct = ((Math.min(Math.max(value, min), max) - min) / (max - min)) * 100;
  return (
    <div className="border-b border-line py-5 first:pt-0">
      <div className="flex items-center justify-between gap-4">
        <label htmlFor={id} className="text-sm text-ink-secondary">
          {label}
        </label>
        <div className="flex h-10 items-center gap-1 rounded-pill border border-line bg-elevated-2 px-4 focus-within:border-gold/60">
          {prefix ? <span className="text-ink-muted">{prefix}</span> : null}
          <input
            id={id}
            type="number"
            inputMode="decimal"
            value={Number.isFinite(value) ? value : ""}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
            className="w-24 bg-transparent text-right text-ink tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          />
          {suffix ? <span className="text-ink-muted">{suffix}</span> : null}
        </div>
      </div>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={Math.min(Math.max(value, min), max)}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ ["--pct" as string]: `${pct}%` }}
        className="range-gold mt-4 w-full"
      />
      {hint ? <p className="mt-2 text-xs text-ink-muted">{hint}</p> : null}
    </div>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}) {
  return (
    <div className="border-b border-line py-5">
      <label className="flex cursor-pointer items-center justify-between gap-4">
        <span className="text-sm text-ink-secondary">{label}</span>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className="relative h-7 w-12 rounded-pill bg-elevated-2 transition-colors duration-200 after:absolute after:left-1 after:top-1 after:size-5 after:rounded-full after:bg-ink-secondary after:transition-transform after:duration-200 peer-checked:bg-gold peer-checked:after:translate-x-5 peer-checked:after:bg-ink-dark peer-focus-visible:outline-2 peer-focus-visible:outline-gold"
        />
      </label>
      {hint ? <p className="mt-2 text-xs text-ink-muted">{hint}</p> : null}
    </div>
  );
}

export function CalcLayout({ inputs, result }: { inputs: React.ReactNode; result: React.ReactNode }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="rounded-card border border-line bg-elevated p-7 sm:p-9">{inputs}</div>
      <div className="flex flex-col gap-4 lg:sticky lg:top-8 lg:h-fit">{result}</div>
    </div>
  );
}

export function BigResult({
  label,
  value,
  unit,
  sub,
  tone = "gold",
}: {
  label: string;
  value: string;
  unit?: string;
  sub?: React.ReactNode;
  tone?: "gold" | "light" | "dark";
}) {
  return (
    <div
      aria-live="polite"
      className={cn(
        "rounded-card p-8 sm:p-10",
        tone === "gold" && "bg-gold text-ink-dark",
        tone === "light" && "bg-surface-light text-ink-dark",
        tone === "dark" && "border border-line bg-elevated text-ink",
      )}
    >
      <p className={cn("text-sm", tone === "dark" ? "text-ink-secondary" : "text-[#3d2f1a]")}>{label}</p>
      <p className="mt-10 flex flex-wrap items-baseline gap-x-3">
        <span className="display-num text-[clamp(3.5rem,8vw,6rem)]">{value}</span>
        {unit ? <span className="font-display text-2xl font-light opacity-60">{unit}</span> : null}
      </p>
      {sub ? (
        <div className={cn("mt-4 text-sm", tone === "dark" ? "text-ink-secondary" : "text-[#3d2f1a]")}>{sub}</div>
      ) : null}
    </div>
  );
}

export function Breakdown({ rows }: { rows: { label: string; value: string; strong?: boolean }[] }) {
  return (
    <dl className="rounded-card border border-line bg-elevated p-7 sm:p-9">
      {rows.map((r) => (
        <div
          key={r.label}
          className="flex items-baseline justify-between gap-6 border-b border-line py-3 last:border-0"
        >
          <dt className={r.strong ? "text-ink" : "text-ink-secondary"}>{r.label}</dt>
          <dd className={cn("tabular-nums", r.strong ? "font-medium text-ink" : "text-ink")}>{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Splits "₹7.22 Cr" into the number and its unit for the big display. */
export function splitUnit(formatted: string) {
  const m = formatted.match(/^(-?₹[\d.,]+)\s*(.*)$/);
  return m ? { value: m[1], unit: m[2] || undefined } : { value: formatted, unit: undefined };
}
