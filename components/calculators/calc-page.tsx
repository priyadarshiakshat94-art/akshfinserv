import Link from "next/link";
import { PageIntro } from "@/components/site/page-intro";
import { Section } from "@/components/site/section";
import { CtaBand } from "@/components/site/cta-band";

const ALL = [
  { href: "/calculators/sip", label: "SIP" },
  { href: "/calculators/retirement", label: "Retirement" },
  { href: "/calculators/loan-vs-liquidate", label: "Loan vs Liquidate" },
];

export function CalcPage({
  current,
  title,
  lede,
  notes,
  children,
}: {
  current: string;
  title: string;
  lede: string;
  notes: string[];
  children: React.ReactNode;
}) {
  return (
    <>
      <PageIntro eyebrow="Calculators" title={title} lede={lede}>
        <nav aria-label="Calculators" className="mt-10 flex flex-wrap gap-2">
          {ALL.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              aria-current={c.href === current ? "page" : undefined}
              className={
                c.href === current
                  ? "rounded-pill border border-gold bg-gold px-5 py-2 text-sm text-ink-dark"
                  : "rounded-pill border border-line px-5 py-2 text-sm text-ink-secondary hover:border-line-hover hover:text-ink"
              }
            >
              {c.label}
            </Link>
          ))}
        </nav>
      </PageIntro>
      <Section className="pt-0 lg:pt-0">
        {children}
        <div className="mt-12 grid gap-8 border-t border-line pt-10 lg:grid-cols-[14rem_minmax(0,1fr)]">
          <p className="eyebrow">How we calculate</p>
          <ul className="max-w-[46rem] space-y-3 text-sm text-ink-secondary">
            {notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
            <li className="text-ink-muted">
              Illustrations only, based on the assumptions you enter. Returns are not guaranteed. Mutual fund
              investments are subject to market risks; read all scheme related documents carefully.
            </li>
          </ul>
        </div>
      </Section>
      <CtaBand title="Numbers look tight? That is what the review is for." />
    </>
  );
}
