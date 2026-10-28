import Link from "next/link";
import { NewsletterForm } from "./newsletter-form";

const NJ_EWA = process.env.NEXT_PUBLIC_NJ_EWA_LOGIN ?? "https://ewa.njindiaonline.com/ewa/login";
const NJ_CDESK = process.env.NEXT_PUBLIC_NJ_CDESK_LOGIN ?? "https://cdesk.njwealth.in/cdesk/login";

type NavLink = { href: string; label: string; external?: boolean };

const COLUMNS: { title: string; links: NavLink[] }[] = [
  {
    title: "Offerings",
    links: [
      { href: "/offerings/mutual-funds", label: "Mutual Funds" },
      { href: "/offerings/equity-and-etfs", label: "Equity & ETFs" },
      { href: "/offerings/nps", label: "NPS" },
      { href: "/offerings/loan-against-mutual-funds", label: "Loan Against Mutual Funds" },
      { href: "/offerings/insurance", label: "Insurance" },
    ],
  },
  {
    title: "Firm",
    links: [
      { href: "/how-we-work", label: "How we work" },
      { href: "/about", label: "About" },
      { href: "/insights", label: "Insights" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Calculators",
    links: [
      { href: "/calculators/sip", label: "SIP" },
      { href: "/calculators/retirement", label: "Retirement" },
      { href: "/calculators/loan-vs-liquidate", label: "Loan vs Liquidate" },
    ],
  },
  {
    title: "Clients",
    links: [
      { href: "/client-login", label: "Client login" },
      { href: NJ_EWA, label: "NJ E-Wealth Account", external: true },
      { href: NJ_CDESK, label: "NJ Client Desk", external: true },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto w-full max-w-[1320px] px-5 pb-10 pt-20 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_2fr]">
          <div>
            <Link href="/" className="font-display text-[2rem] font-medium tracking-[-0.03em] text-ink">
              Aksh<span className="text-ink-secondary"> Finserv</span>
            </Link>
            {/* TODO before launch: add the real ARN number. */}
            <p className="mt-4 text-sm text-ink-secondary">
              AMFI-registered Mutual Fund Distributor. ARN-XXXXXX.
            </p>
            <address className="mt-8 text-sm not-italic leading-relaxed text-ink-secondary">
              363, Powai Plaza, Central Avenue
              <br />
              Hiranandani Gardens, Powai
              <br />
              Mumbai 400076
            </address>
            <a
              href="mailto:plabita@akshfinserv.com"
              className="mt-4 inline-block text-sm text-ink underline decoration-line-hover underline-offset-4 hover:decoration-gold"
            >
              plabita@akshfinserv.com
            </a>
            <div className="mt-10">
              <NewsletterForm />
            </div>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="eyebrow mb-5">{col.title}</p>
                <ul className="space-y-3 text-sm">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      {l.external ? (
                        <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-ink-secondary transition-colors duration-200 hover:text-ink">
                          {l.label}
                        </a>
                      ) : (
                        <Link href={l.href} className="text-ink-secondary transition-colors duration-200 hover:text-ink">
                          {l.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-20 space-y-3 border-t border-line pt-8 text-xs leading-relaxed text-ink-muted">
          <p>
            Mutual fund investments are subject to market risks. Read all scheme related documents carefully before
            investing. Past performance does not guarantee future returns.
          </p>
          <p>
            Aksh Finserv is an AMFI-registered mutual fund distributor and receives commission from fund houses on
            regular plans. We are not a SEBI-registered investment adviser. Insurance is the subject matter of
            solicitation.
          </p>
          <div className="flex flex-col gap-2 pt-4 sm:flex-row sm:justify-between">
            <p>© {new Date().getFullYear()} Aksh Finserv. Powai, Mumbai. Since 1998.</p>
            <p className="flex gap-5">
              <Link href="/disclosures" className="hover:text-ink">Disclosures</Link>
              <Link href="/privacy" className="hover:text-ink">Privacy</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
