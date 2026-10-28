import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

// Shell for every inner page. The home page builds its own header into the hero backdrop.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="grain relative min-h-svh">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[36rem] bg-[linear-gradient(118deg,rgba(245,242,236,0.06)_0%,rgba(245,242,236,0.02)_30%,transparent_30.2%)]"
        />
        <SiteHeader />
        <main>{children}</main>
      </div>
      <SiteFooter />
    </>
  );
}
