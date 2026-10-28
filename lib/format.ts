import type { Insight } from "./content/schemas";

export const CATEGORY_LABEL: Record<Insight["category"], string> = {
  markets: "Markets",
  planning: "Planning",
  interviews: "Interviews",
  "client-letters": "Client letters",
  guides: "Guides",
};

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

// ₹ amounts in Indian units: 4,56,000 -> "₹4.56 lakh", 7,20,00,000 -> "₹7.2 Cr".
export function fmtINR(n: number) {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1e7) return `${sign}₹${+(abs / 1e7).toFixed(2)} Cr`;
  if (abs >= 1e5) return `${sign}₹${+(abs / 1e5).toFixed(2)} lakh`;
  return `${sign}₹${inr.format(abs)}`;
}

export const fmtNum = (n: number) => inr.format(n);
