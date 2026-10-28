import { CalendarDays } from "lucide-react";
import { Section } from "@/components/site/section";
import { FadeIn } from "@/components/motion/fade-in";
import { LeadForm } from "@/components/site/lead-form";

const CAL_URL = process.env.NEXT_PUBLIC_CALCOM_URL;

export function LeadBlock() {
  return (
    <Section>
      <FadeIn className="grid gap-4 lg:grid-cols-2">
        <div id="review-portfolio" className="scroll-mt-24 rounded-card bg-gold p-8 text-ink-dark sm:p-10 lg:p-12">
          <p className="text-sm text-[#3d2f1a]">Free, no obligation</p>
          <h2 className="mt-4 text-[clamp(2rem,3.6vw,3rem)]">Review my portfolio</h2>
          <p className="mb-10 mt-4 max-w-[28rem] text-[#3d2f1a]">
            Leave a name and number. We call within one working day and ask for your statements. You get a
            one-page review in writing, even if you never invest with us.
          </p>
          <LeadForm />
        </div>

        <div
          id="book-call"
          className="flex scroll-mt-24 flex-col justify-between gap-10 rounded-card border border-line bg-elevated p-8 sm:p-10 lg:p-12"
        >
          <div>
            <p className="text-sm text-ink-secondary">With Plabita</p>
            <h2 className="mt-4 text-[clamp(2rem,3.6vw,3rem)] text-ink">Book a 30-min call</h2>
            <p className="mt-4 max-w-[28rem] text-ink-secondary">
              Pick a slot. Bring one question. Most first calls end with a clear next step, or a clear reason to
              wait.
            </p>
          </div>

          {CAL_URL ? (
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center justify-center gap-2 self-start rounded-pill bg-surface-light px-7 font-medium text-ink-dark transition-colors duration-200 hover:bg-white"
            >
              <CalendarDays className="size-4" strokeWidth={1.75} />
              See open slots
            </a>
          ) : (
            // Placeholder until NEXT_PUBLIC_CALCOM_URL is set; swap for the Cal.com embed then.
            <div className="grid min-h-[12rem] place-items-center rounded-[20px] border border-dashed border-line-hover bg-elevated-2/60 p-6 text-center">
              <div>
                <CalendarDays className="mx-auto size-6 text-ink-muted" strokeWidth={1.5} />
                <p className="mt-3 text-sm text-ink-muted">Cal.com booking embed goes here</p>
              </div>
            </div>
          )}
        </div>
      </FadeIn>
    </Section>
  );
}
