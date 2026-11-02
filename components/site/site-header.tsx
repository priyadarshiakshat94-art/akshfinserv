import Link from "next/link";
import { BrandLogo } from "@/components/site/brand-logo";

const NAV = [
  { href: "/how-we-work", label: "How we work" },
  { href: "/offerings", label: "Offerings" },
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="relative z-20 mx-auto flex w-full max-w-[1320px] items-center justify-between px-5 py-6 sm:px-8">
      <Link href="/" aria-label="Aksh Finserv, home" className="shrink-0 text-ink">
        <BrandLogo className="h-8 w-auto sm:h-9" />
      </Link>
      <nav aria-label="Primary" className="hidden items-center gap-8 text-sm text-ink-secondary md:flex">
        {NAV.map((item) => (
          <Link key={item.href} href={item.href} className="transition-colors duration-200 hover:text-ink">
            {item.label}
          </Link>
        ))}
      </nav>
      <Link
        href="/client-login"
        className="rounded-pill border border-line px-4 py-2 text-sm text-ink transition-colors duration-200 hover:border-line-hover hover:bg-elevated"
      >
        Client login
      </Link>
    </header>
  );
}
