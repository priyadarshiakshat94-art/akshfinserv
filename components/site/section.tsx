import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/motion/fade-in";

export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("mx-auto w-full max-w-[1320px] px-5 py-20 sm:px-8 lg:py-28", className)}>
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  aside,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
}) {
  return (
    <FadeIn className={cn("mb-12 flex flex-col gap-6 lg:mb-16 lg:flex-row lg:items-end lg:justify-between", className)}>
      <div className="max-w-[46rem]">
        <p className="eyebrow mb-5">{eyebrow}</p>
        <h2 className="text-[clamp(2rem,4.2vw,3.5rem)] text-ink">{title}</h2>
      </div>
      {aside ? <div className="text-ink-secondary lg:max-w-[22rem] lg:text-right">{aside}</div> : null}
    </FadeIn>
  );
}
