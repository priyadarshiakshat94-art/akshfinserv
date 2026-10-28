import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroCardStack } from "./hero-card-stack";

export function HeroBackdrop() {
  return (
    <>
      {/* Concrete-shadow mood: a soft diagonal light falloff behind header and hero. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(118deg,rgba(245,242,236,0.075)_0%,rgba(245,242,236,0.03)_34%,transparent_34.2%,transparent_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[20%] top-[-30%] -z-10 h-[90%] w-[70%] rounded-full bg-[radial-gradient(closest-side,rgba(201,163,107,0.08),transparent)]"
      />
    </>
  );
}

export function Hero() {
  return (
    <section className="relative">
      <div className="mx-auto grid w-full max-w-[1320px] items-center gap-16 px-5 pb-24 pt-10 sm:px-8 lg:min-h-[calc(100svh-96px)] lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pb-16 lg:pt-0">
        <div className="animate-in fade-in duration-400 ease-out">
          <h1 className="sr-only">
            Aksh Finserv: mutual fund distribution and wealth advice in Powai, Mumbai, since 1998
          </h1>

          <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1" aria-label="250 crore rupees under advice">
            <span className="display-num text-[clamp(4.5rem,13vw,10.5rem)] text-ink">₹250 Cr</span>
            <span className="font-display text-[clamp(1.5rem,3.4vw,2.75rem)] font-light tracking-[-0.03em] text-ink-muted">
              under advice
            </span>
          </p>

          <p className="eyebrow mt-8 flex items-center gap-2.5">
            <span>Aksh Finserv</span>
            <span aria-hidden>·</span>
            <span>Mumbai</span>
            <span aria-hidden>·</span>
            <span>Since 1998</span>
            <span aria-hidden className="relative ml-1 grid size-3 place-items-center rounded-full border border-gold/50">
              <span className="size-1.5 rounded-full bg-gold" />
            </span>
          </p>

          <p className="mt-6 max-w-[30rem] text-[1.0625rem] leading-relaxed text-ink-secondary">
            1,500 families. One office in Powai. Every plan is reviewed by a founder before a rupee moves.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/#review-portfolio"
              className="group inline-flex h-13 items-center gap-2 rounded-pill bg-gold px-7 text-[0.95rem] font-medium text-ink-dark transition-colors duration-200 hover:bg-gold-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              Review my portfolio
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={1.75} />
            </Link>
            <Link
              href="/#book-call"
              className="inline-flex h-13 items-center rounded-pill border border-line px-7 text-[0.95rem] font-medium text-ink transition-colors duration-200 hover:border-line-hover hover:bg-elevated focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              Talk to Plabita
            </Link>
          </div>
        </div>

        <HeroCardStack />
      </div>
    </section>
  );
}
