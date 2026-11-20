import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { appendJsonl, clientIp, createRateLimiter, escapeHtml } from "@/lib/server/guards";
import { SITE_URL } from "@/lib/site";
import { GUIDE_PATH, WORKBOOK_PDF } from "@/lib/family-guide";

export const runtime = "nodejs";

const rateLimited = createRateLimiter(5, 60 * 60 * 1000);
const schema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email").max(120),
  name: z.string().trim().max(60).optional().default(""),
  monthly: z.boolean().default(false),
});

// Wording shown next to the checkbox. Stored with each consent so we know what the person agreed to.
const CONSENT_TEXT_V1 =
  "Also send me one email a month on keeping our family's money in order. I can unsubscribe any time.";

function emailBody(name: string) {
  const hi = name ? `Hi ${escapeHtml(name)},` : "Hello,";
  const pdf = `${SITE_URL}${WORKBOOK_PDF}`;
  const guide = `${SITE_URL}${GUIDE_PATH}`;
  const test = `${SITE_URL}/one-page`;
  const text = [
    name ? `Hi ${name},` : "Hello,",
    "",
    "Here is the Family Money Workbook you asked for:",
    pdf,
    "",
    "It's 13 pages. Print it, or fill it in on a tablet. It never asks for balances, account numbers or passwords, and you shouldn't write any of those on it.",
    "",
    "A good way to start: fill in one page tonight, whichever looks easiest. If you're not sure where the gaps are, the One-Page Test takes two minutes:",
    test,
    "",
    "The guide the workbook follows is here, if you want the explanation for any page:",
    guide,
    "",
    "Aksh Finserv",
    "363, Powai Plaza, Hiranandani Gardens, Powai, Mumbai 400076",
    "AMFI-registered Mutual Fund Distributor, ARN-121998",
  ].join("\n");
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1c1c1c;max-width:560px">
<p>${hi}</p>
<p>Here is the Family Money Workbook you asked for.</p>
<p><a href="${pdf}" style="display:inline-block;background:#c9a36b;color:#14110c;padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:600">Download the workbook (PDF)</a></p>
<p>It's 13 pages. Print it, or fill it in on a tablet. It never asks for balances, account numbers or passwords, and you shouldn't write any of those on it.</p>
<p>A good way to start: fill in one page tonight, whichever looks easiest. If you're not sure where the gaps are, <a href="${test}">the One-Page Test</a> takes two minutes.</p>
<p>The explanation for every page is in <a href="${guide}">the Family Money Guide</a>.</p>
<p style="color:#6b6b6b;font-size:13px;margin-top:28px">Aksh Finserv · 363, Powai Plaza, Hiranandani Gardens, Powai, Mumbai 400076<br>AMFI-registered Mutual Fund Distributor, ARN-121998<br>You're receiving this because you asked for the workbook on akshfinserv.net.</p>
</div>`;
  return { text, html };
}

export async function POST(req: NextRequest) {
  if (rateLimited(clientIp(req))) {
    return NextResponse.json({ ok: false, error: "Too many attempts. Try again in a while." }, { status: 429 });
  }
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  // Honeypot filled: pretend success so bots learn nothing.
  if (body.website) return NextResponse.json({ ok: true });

  const parsed = schema.safeParse({ ...body, name: body.name ?? "" });
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message ?? "Invalid email." }, { status: 422 });
  }
  const { email, name, monthly } = parsed.data;
  const requestedAt = new Date().toISOString();
  await appendJsonl("workbook.jsonl", { email, monthly, consentText: monthly ? CONSENT_TEXT_V1 : null, requestedAt });

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[workbook] RESEND_API_KEY not set, email not sent", email);
    // Locally, succeed so the form can be tested. In production, say so honestly.
    if (process.env.NODE_ENV !== "production") return NextResponse.json({ ok: true });
    return NextResponse.json({ ok: false, error: "We couldn't send the email just now. Please try again later." }, { status: 502 });
  }
  const resend = new Resend(key);
  const from = `Aksh Finserv <${process.env.LEAD_FROM_EMAIL ?? "website@akshfinserv.com"}>`;
  const { text, html } = emailBody(name);

  const { error } = await resend.emails.send({ from, to: email, subject: "Your Family Money Workbook", text, html });
  if (error) {
    console.error("[workbook] Resend error", error);
    return NextResponse.json({ ok: false, error: "We couldn't send the email just now. Please try again later." }, { status: 502 });
  }

  // Monthly email only with the separate, ticked consent.
  if (monthly) {
    const segmentId = process.env.RESEND_SEGMENT_ID;
    if (segmentId) {
      const { error: cErr } = await resend.contacts.create({ email, firstName: name || undefined, segments: [{ id: segmentId }] });
      if (cErr && !/already exists/i.test(cErr.message)) console.error("[workbook] Resend contacts error", cErr);
    } else {
      // No list configured yet: tell the team so the address can be added by hand.
      await resend.emails.send({
        from,
        to: process.env.LEAD_TO_EMAIL ?? "plabita@akshfinserv.com",
        subject: `Monthly email consent (workbook): ${email}`,
        text: `${email} asked for the workbook and ticked: "${CONSENT_TEXT_V1}" at ${requestedAt}.`,
      });
    }
  }

  return NextResponse.json({ ok: true });
}
