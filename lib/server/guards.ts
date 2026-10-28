import "server-only";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import type { NextRequest } from "next/server";

export const clientIp = (req: NextRequest) =>
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";

/**
 * Sliding-window limiter. In-memory, per server instance: good enough for
 * low-traffic forms; swap for Upstash/Vercel KV if traffic grows.
 */
export function createRateLimiter(limit: number, windowMs: number) {
  const hits = new Map<string, number[]>();
  return (key: string) => {
    const now = Date.now();
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    recent.push(now);
    hits.set(key, recent);
    return recent.length > limit;
  };
}

export async function verifyTurnstile(token: unknown, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return process.env.NODE_ENV !== "production"; // skip locally, never in production
  if (typeof token !== "string" || !token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  });
  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}

/**
 * Redundant local log under /data. Vercel's filesystem is read-only, so this only
 * persists on a long-running server or in local dev; failures never block the request.
 */
export async function appendJsonl(file: string, record: object) {
  try {
    const dir = path.join(process.cwd(), "data");
    await mkdir(dir, { recursive: true });
    await appendFile(path.join(dir, file), JSON.stringify(record) + "\n");
  } catch (err) {
    console.warn(`[${file}] backup log not written`, (err as Error).message);
  }
}

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
