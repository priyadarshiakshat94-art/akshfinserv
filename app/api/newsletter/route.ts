import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { appendJsonl, clientIp, createRateLimiter } from "@/lib/server/guards";

export const runtime = "nodejs";

const rateLimited = createRateLimiter(5, 60 * 60 * 1000);
const schema = z.object({ email: z.string().trim().toLowerCase().email("Enter a valid email").max(120) });

/**
 * With RESEND_SEGMENT_ID set, the address is added to that Resend segment (the list
 * newsletters go out to). Without it, Plabita gets an email to add it by hand.
 */
async function subscribe(email: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[newsletter] RESEND_API_KEY not set, signup not sent", email);
    return process.env.NODE_ENV !== "production";
  }
  const resend = new Resend(key);
  const segmentId = process.env.RESEND_SEGMENT_ID;

  if (segmentId) {
    const { error } = await resend.contacts.create({ email, segments: [{ id: segmentId }] });
    // Re-subscribing an existing contact is not an error for the visitor.
    if (error && !/already exists/i.test(error.message)) {
      console.error("[newsletter] Resend contacts error", error);
      return false;
    }
    return true;
  }

  const { error } = await resend.emails.send({
    from: `Aksh Finserv Website <${process.env.LEAD_FROM_EMAIL ?? "website@akshfinserv.com"}>`,
    to: process.env.LEAD_TO_EMAIL ?? "plabita@akshfinserv.com",
    subject: `Newsletter signup: ${email}`,
    text: `New newsletter signup from the website: ${email}`,
  });
  if (error) {
    console.error("[newsletter] Resend error", error);
    return false;
  }
  return true;
}

export async function POST(req: NextRequest) {
  if (rateLimited(clientIp(req))) {
    return NextResponse.json({ ok: false, error: "Too many attempts. Try again later." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  // Honeypot filled: pretend success so bots learn nothing.
  if (body.website) return NextResponse.json({ ok: true });

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message ?? "Invalid email." }, { status: 422 });
  }

  const subscribedAt = new Date().toISOString();
  await appendJsonl("newsletter.jsonl", { email: parsed.data.email, subscribedAt });
  if (!(await subscribe(parsed.data.email))) {
    return NextResponse.json({ ok: false, error: "Could not sign you up. Please try again later." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
