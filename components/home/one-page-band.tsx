import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/site/section";
import { FadeIn } from "@/components/motion/fade-in";

const LINES = ["Investments", "Insurance", "Loans", "Goals", "Dates", "Nominees", "Who knows where this is"];

// Homepage entry to the One-Page Test, placed after How we work because it is step 01 made public.
export function OnePageBand() {
  return (
    <Section className="pt-0 lg:pt-0">
      <FadeIn className="grid items-center gap-10 rounded-card border border-line bg-elevated p-8 sm:p-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16 lg:p-14">
        <div>
          <p className="eyebrow mb-5">The One-Page Test</p>
          <h2 className="max-w-[36rem] text-[clamp(2rem,3.6vw,3rem)] text-ink">
            Could you show your whole financial life on one page?
          </h2>
          <p className="mt-4 max-w-[32rem] text-ink-secondary">
            Seven questions about where things are, not how much you have. Two minutes, no sign-up. You leave with your
            page and a checklist.
          </p>
          <Link
            href="/one-page"
            className="group mt-8 inline-flex h-14 items-center gap-2 rounded-pill bg-gold px-7 font-medium text-ink-dark transition-colors duration-200 hover:bg-gold-hover"
          >
            Take the test
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={1.75} />
          </Link>
        </div>
        <div aria-hidden className="rounded-[6px] bg-surface-light px-6 pb-3 pt-5 text-[#24211c]">
          <p className="border-b-2 border-gold pb-3 text-[10px] font-medium tracking-[0.3em] text-[#6d675d]">ONE PAGE</p>
          {LINES.map((l, i) => (
            <p key={l} className="flex gap-3 border-b border-[#e3ddd2] py-2 text-sm last:border-b-0">
              <span className="text-gold tabular-nums">0{i + 1}</span>
              {l}
            </p>
          ))}
        </div>
      </FadeIn>
    </Section>
  );
}
