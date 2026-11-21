"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, Phone, X } from "lucide-react";
import { BUSINESS } from "@/lib/site";

type NavItem = { href: string; label: string };

// Phone-only menu: a button in the header that opens a full-screen list of the main pages.
// Closes on link tap, the close button, Escape, or a change of page.
export function MobileMenu({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const firstLink = useRef<HTMLAnchorElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  // Close whenever the page changes.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLink.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="grid size-10 place-items-center rounded-full border border-line text-ink transition-colors duration-200 hover:border-line-hover md:hidden"
      >
        <Menu className="size-5" strokeWidth={1.5} />
      </button>

      {open && typeof document !== "undefined"
        ? createPortal(
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-base px-5 pb-10 pt-6 sm:px-8 md:hidden"
        >
          <div className="flex items-center justify-between">
            <p className="eyebrow">Menu</p>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => {
                setOpen(false);
                button.current?.focus();
              }}
              className="grid size-10 place-items-center rounded-full border border-line text-ink hover:border-line-hover"
            >
              <X className="size-5" strokeWidth={1.5} />
            </button>
          </div>

          <nav aria-label="Primary" className="mt-10">
            <ul className="divide-y divide-line border-y border-line">
              {[{ href: "/", label: "Home" }, ...items, { href: "/contact", label: "Contact" }].map((item, i) => (
                <li key={item.href}>
                  <Link
                    ref={i === 0 ? firstLink : undefined}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className="flex items-center justify-between py-4 font-display text-2xl text-ink"
                  >
                    {item.label}
                    <ArrowRight className="size-5 text-ink-secondary" strokeWidth={1.5} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-10 grid gap-3">
            <Link
              href="/one-page"
              onClick={() => setOpen(false)}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-pill bg-gold px-7 font-medium text-ink-dark"
            >
              Take the One-Page Test
            </Link>
            <Link
              href="/client-login"
              onClick={() => setOpen(false)}
              className="inline-flex h-14 items-center justify-center rounded-pill border border-line px-7 text-ink"
            >
              Client login
            </Link>
            <a
              href={`tel:${BUSINESS.phoneE164}`}
              className="mt-2 inline-flex items-center justify-center gap-2 text-sm text-ink-secondary"
            >
              <Phone className="size-4" strokeWidth={1.75} /> {BUSINESS.phoneDisplay}
            </a>
          </div>
        </div>,
        // Rendered on <body> so it sits above everything, including the guide's pinned contents bar.
        document.body,
      )
        : null}
    </>
  );
}
