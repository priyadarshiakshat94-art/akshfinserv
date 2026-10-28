import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/site/section";

export function CtaBand({
  title = "Bring us your statements. Leave with one page that makes sense of them.",
  intent = "portfolio-review",
  label = "Review my portfolio",
}: {
  title?: string;
  intent?: string;
  label?: string;
}) {
  return (
    <Section>
      <div className="flex flex-col gap-8 rounded-card bg-gold p-8 text-ink-dark sm:p-12 lg:flex-row lg:items-end lg:justify-between">
        <h2 className="max-w-[36rem] text-[clamp(1.8rem,3.2vw,2.75rem)]">{title}</h2>
        <Link
          href={`/contact?intent=${intent}`}
          className="group inline-flex h-14 shrink-0 items-center justify-center gap-2 self-start rounded-pill bg-ink-dark px-7 font-medium text-surface-light transition-colors duration-200 hover:bg-black lg:self-auto"
        >
          {label}
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={1.75} />
        </Link>
      </div>
    </Section>
  );
}
