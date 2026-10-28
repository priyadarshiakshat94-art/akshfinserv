import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { PageIntro } from "@/components/site/page-intro";
import { Section } from "@/components/site/section";

export const metadata: Metadata = {
  title: "Client login",
  description: "Log in to your NJ E-Wealth Account or NJ Client Desk to see holdings, statements and transactions.",
  alternates: { canonical: "/client-login" },
};

const NJ_EWA = process.env.NEXT_PUBLIC_NJ_EWA_LOGIN ?? "https://ewa.njindiaonline.com/ewa/login";
const NJ_CDESK = process.env.NEXT_PUBLIC_NJ_CDESK_LOGIN ?? "https://cdesk.njwealth.in/cdesk/login";

const PORTALS = [
  {
    href: NJ_EWA,
    name: "NJ E-Wealth Account",
    body: "Holdings, SIPs, transactions and capital gains statements. Most clients use this one.",
    tone: "gold" as const,
  },
  {
    href: NJ_CDESK,
    name: "NJ Client Desk",
    body: "Portfolio reports, consolidated statements and service requests.",
    tone: "dark" as const,
  },
];

export default function ClientLoginPage() {
  return (
    <>
      <PageIntro
        eyebrow="Client login"
        title="Your portfolio lives with NJ Wealth. Log in there."
        lede="Our clients' accounts and transactions run on NJ's platform. Choose the portal you were set up with. If you are not sure, it is usually the E-Wealth Account."
      />
      <Section className="pt-0 lg:pt-0">
        <div className="grid gap-4 md:grid-cols-2">
          {PORTALS.map((p) => (
            <a
              key={p.href}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className={
                p.tone === "gold"
                  ? "card-lift group flex min-h-[18rem] flex-col justify-between rounded-card bg-gold p-8 text-ink-dark lg:p-10"
                  : "card-lift group flex min-h-[18rem] flex-col justify-between rounded-card bg-elevated p-8 text-ink lg:p-10"
              }
            >
              <div className="flex items-start justify-between">
                <span className="text-sm opacity-70">Opens NJ in a new tab</span>
                <ArrowUpRight className="size-5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-[clamp(1.8rem,3vw,2.5rem)]">{p.name}</h2>
                <p className="mt-3 max-w-[28rem] opacity-75">{p.body}</p>
              </div>
            </a>
          ))}
        </div>
        <p className="mt-10 max-w-[40rem] text-sm text-ink-muted">
          Forgot your password or never received login details? Email{" "}
          <a href="mailto:plabita@akshfinserv.com" className="text-ink underline decoration-gold underline-offset-4">
            plabita@akshfinserv.com
          </a>{" "}
          and we will reset it with NJ for you. We will never ask for your password.
        </p>
      </Section>
    </>
  );
}
