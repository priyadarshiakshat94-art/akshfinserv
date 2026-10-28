import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { leadSchema, type Lead } from "@/lib/lead";
import { appendJsonl, clientIp, createRateLimiter, escapeHtml, verifyTurnstile } from "@/lib/server/guards";

export const runtime = "nodejs";

const rateLimited = createRateLimiter(10, 60 * 60 * 1000);

async function sendEmail(lead: Lead, receivedAt: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[lead] RESEND_API_KEY not set, email skipped", lead);
    return process.env.NODE_ENV !== "production";
  }
  const rows: [string, string][] = [
    ["Name", lead.name],
    ["Mobile", lead.mobile],
    ["Email", lead.email || "-"],
    ["City", lead.city || "-"],
    ["Intent", lead.intent],
    ["Received", receivedAt],
  ];
  const { error } = await new Resend(key).emails.send({
    from: `Aksh Finserv Website <${process.env.LEAD_FROM_EMAIL ?? "website@akshfinserv.com"}>`,
    to: process.env.LEAD_TO_EMAIL ?? "plabita@akshfinserv.com",
    subject: `New lead: ${lead.name} (${lead.intent})`,
    text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
    html: `<table cellpadding="6">${rows.map(([k, v]) => `<tr><td><b>${k}</b></td><td>${escapeHtml(v)}</td></tr>`).join("")}</table>`,
  });
  if (error) {
    console.error("[lead] Resend error", error);
    return false;
  }
  return true;
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);

  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "Too many requests. Please email plabita@akshfinserv.com." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot filled: pretend success so bots learn nothing.
  if (body.website) return NextResponse.json({ ok: true });

  if (!(await verifyTurnstile(body.turnstileToken, ip))) {
    return NextResponse.json({ ok: false, error: "Security check failed. Please try again." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid details." },
      { status: 422 },
    );
  }

  const receivedAt = new Date().toISOString();
  await appendJsonl("leads.jsonl", { ...parsed.data, receivedAt });
  const sent = await sendEmail(parsed.data, receivedAt);
  if (!sent) {
    return NextResponse.json(
      { ok: false, error: "We could not send your request. Please email plabita@akshfinserv.com." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
