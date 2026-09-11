"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { nav, doctor } from "@/lib/data";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "border-b border-border bg-background/95 py-3 backdrop-blur-sm" : "py-5",
      )}
    >
      <Container className="flex items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-3" aria-label={doctor.name}>
          <Logo height={40} priority className="transition-opacity group-hover:opacity-90" />
          <span className="hidden leading-tight sm:block">
            <span className="block text-sm font-bold text-navy-900 dark:text-white">{doctor.name}</span>
            <span className="block text-[11px] font-medium uppercase tracking-wider text-muted">
              Neuro &amp; Spine Surgeon
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((it) =>
            it.children ? (
              <div key={it.label} className="group relative">
                <button className="flex items-center gap-1 px-3.5 py-2 text-sm font-medium text-navy-700 transition-colors hover:text-teal-700 dark:text-white/80 dark:hover:text-teal-300">
                  {it.label}
                  <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                </button>
                <div className="invisible absolute left-0 top-full w-60 translate-y-2 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="overflow-hidden rounded-lg border border-border bg-background p-2 shadow-soft">
                    {it.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className="block rounded-xl px-4 py-2.5 text-sm font-medium text-navy-700 transition-colors hover:bg-teal-500/10 hover:text-teal-700 dark:text-white/80 dark:hover:text-teal-300"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={it.href}
                href={it.href}
                className={cn(
                  "px-3.5 py-2 text-sm font-medium transition-colors",
                  pathname === it.href
                    ? "text-teal-700 dark:text-teal-300"
                    : "text-navy-700 hover:text-teal-700 dark:text-white/80 dark:hover:text-teal-300",
                )}
              >
                {it.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Button href="/appointment/" size="sm" className="hidden md:inline-flex">
            <Phone className="h-4 w-4" /> Book Appointment
          </Button>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-navy-200 text-navy-800 lg:hidden dark:ring-white/15 dark:text-white"
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-border bg-background lg:hidden"
          >
            {/* The panel lives inside a `fixed` header, so anything taller than the
                viewport is simply unreachable — the page behind it scrolls, this does not.
                Its natural height is ~700px (7 top-level links, 7 sub-links, the CTA), which
                overflows a 320x568 or 360x640 screen by 140-220px and swallows the
                "Book Appointment" button. Capping it against the dynamic viewport height
                and letting it scroll fixes that; `overscroll-contain` stops the scroll
                chaining to the page behind once the list bottoms out. Mobile-only: the whole
                panel is `lg:hidden`, so no desktop breakpoint is touched. */}
            <Container className="flex max-h-[calc(100dvh-5rem)] flex-col gap-1 overflow-y-auto overscroll-contain py-4">
              {nav.map((it) => (
                <div key={it.label}>
                  <Link
                    href={it.href}
                    className="block rounded-xl px-4 py-3 text-base font-semibold text-navy-800 hover:bg-navy-50 dark:text-white dark:hover:bg-white/5"
                  >
                    {it.label}
                  </Link>
                  {it.children && (
                    <div className="ml-3 border-l border-border pl-3">
                      {it.children.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          className="block rounded-lg px-4 py-2 text-sm text-muted hover:text-teal-600"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="mt-3 flex items-center gap-3 px-1">
                <Button href="/appointment/" className="flex-1">
                  Book Appointment
                </Button>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
