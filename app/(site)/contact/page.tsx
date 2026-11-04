import type { Metadata } from "next";
import { CalendarDays, MapPin, Mail, Phone } from "lucide-react";
import { PageIntro } from "@/components/site/page-intro";
import { Section } from "@/components/site/section";
import { LeadForm } from "@/components/site/lead-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Aksh Finserv, 363 Powai Plaza, Central Avenue, Hiranandani Gardens, Powai, Mumbai 400076. Call +91 98209 32489 or leave your number and we call back within one working day.",
  alternates: { canonical: "/contact" },
};

import { BUSINESS, DIRECTIONS_URL, MAPS_URL } from "@/lib/site";
const CAL_URL = process.env.NEXT_PUBLIC_CALCOM_URL;

export default function ContactPage() {
  return (
    <>
      <PageIntro
        eyebrow="Contact"
        title="Leave a number. We call back within one working day."
        lede="Or call, or visit us at Powai Plaza, Hiranandani Gardens. We are in Monday to Friday, 9 am to 5 pm."
      />
      <Section className="pt-0 lg:pt-0">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div className="rounded-card border border-line bg-elevated p-8 sm:p-10 lg:p-12">
            <h2 className="mb-8 text-[clamp(1.8rem,3vw,2.5rem)] text-ink">Send us a note</h2>
            <LeadForm variant="dark" full />
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-card bg-surface-light p-8 text-ink-dark">
              <MapPin className="size-5" strokeWidth={1.5} />
              <p className="mt-8 text-sm text-[#5c574f]">Office</p>
              <address className="mt-2 font-display text-xl not-italic leading-snug">
                363, Powai Plaza, Central Avenue
                <br />
                Hiranandani Gardens, Powai
                <br />
                Mumbai 400076
              </address>
              <p className="mt-4 text-sm leading-relaxed text-[#5c574f]">
                Office 363 in Powai Plaza, at the Central Avenue end of Hiranandani Gardens. Open Monday to Friday,
                9 am to 5 pm. Walk in, or call ahead to book a time.
              </p>
              <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <a
                  href={DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-ink-dark/30 underline-offset-4 hover:decoration-ink-dark"
                >
                  Get directions
                </a>
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-ink-dark/30 underline-offset-4 hover:decoration-ink-dark"
                >
                  Open in Google Maps
                </a>
              </p>
            </div>
            <a href={`tel:${BUSINESS.phoneE164}`} className="card-lift rounded-card bg-elevated p-8">
              <Phone className="size-5 text-ink-secondary" strokeWidth={1.5} />
              <p className="mt-8 text-sm text-ink-secondary">Call</p>
              <p className="mt-2 font-display text-xl text-ink">{BUSINESS.phoneDisplay}</p>
            </a>
            <a href={`tel:${BUSINESS.phone2E164}`} className="-mt-2 card-lift rounded-card bg-elevated px-8 py-5">
              <p className="text-sm text-ink-secondary">Or</p>
              <p className="mt-1 font-display text-xl text-ink">{BUSINESS.phone2Display}</p>
            </a>
            <a href="mailto:plabita@akshfinserv.com" className="card-lift rounded-card bg-elevated p-8">
              <Mail className="size-5 text-ink-secondary" strokeWidth={1.5} />
              <p className="mt-8 text-sm text-ink-secondary">Email</p>
              <p className="mt-2 font-display text-xl text-ink">plabita@akshfinserv.com</p>
            </a>
            <a
              href={CAL_URL ?? "/#book-call"}
              {...(CAL_URL ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="card-lift rounded-card bg-gold p-8 text-ink-dark"
            >
              <CalendarDays className="size-5" strokeWidth={1.5} />
              <p className="mt-8 font-display text-xl">Book a 30-min call with Plabita</p>
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
