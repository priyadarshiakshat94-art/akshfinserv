import { cn } from "@/lib/utils";

export function PageIntro({
  eyebrow,
  title,
  lede,
  children,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "page-fade mx-auto w-full max-w-[1320px] px-5 pb-14 pt-14 sm:px-8 lg:pb-20 lg:pt-24",
        className,
      )}
    >
      <p className="eyebrow mb-6">{eyebrow}</p>
      <h1 className="max-w-[56rem] text-[clamp(2.6rem,6vw,5rem)] text-ink">{title}</h1>
      {lede ? <p className="mt-6 max-w-[40rem] text-lg text-ink-secondary">{lede}</p> : null}
      {children}
    </header>
  );
}
