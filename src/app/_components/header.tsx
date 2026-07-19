"use client";

import { useState, useEffect, useCallback } from "react";

const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Expertise", href: "#expertise" },
  { label: "Why Us", href: "#why" },
  { label: "Locations", href: "#locations" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl border-b border-border-light shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4">
          <a href="#" className="flex items-center gap-1">
            <span className="font-heading text-xl font-bold tracking-tight text-brand">
              GloboScience
            </span>
            <span className="text-sm font-medium text-text-primary">{ }</span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_ITEMS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="relative text-xs font-semibold uppercase tracking-[0.1em] text-text-body transition-colors hover:text-brand after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-brand after:transition-all after:duration-300 hover:after:w-full"
              >
                {label}
              </a>
            ))}
            <a
              href="#contact"
              className="ml-2 rounded-sm bg-brand px-5 py-2.5 text-xs font-bold uppercase tracking-[0.06em] text-white transition-all hover:bg-brand-dark hover:shadow-lg hover:shadow-brand/25 active:scale-[0.98]"
            >
              Get In Touch
            </a>
          </nav>

          <button
            onClick={() => setMenuOpen(true)}
            className="flex flex-col gap-1.5 p-1 md:hidden"
            aria-label="Open menu"
          >
            <span className="block h-[2px] w-6 bg-text-primary transition-transform" />
            <span className="block h-[2px] w-6 bg-text-primary" />
            <span className="block h-[2px] w-6 bg-text-primary" />
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-[60] flex flex-col items-center justify-center gap-8 bg-white/95 backdrop-blur-2xl transition-all duration-400 md:hidden ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <button
          onClick={closeMenu}
          className="absolute top-6 right-6 text-3xl text-text-primary"
          aria-label="Close menu"
        >
          &times;
        </button>
        {NAV_ITEMS.map(({ label, href }, i) => (
          <a
            key={label}
            href={href}
            onClick={closeMenu}
            className={`text-2xl font-semibold uppercase tracking-[0.08em] text-text-primary transition-all duration-500 ${
              menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: menuOpen ? `${i * 60}ms` : "0ms" }}
          >
            {label}
          </a>
        ))}
        <a
          href="#contact"
          onClick={closeMenu}
          className="mt-4 rounded-sm bg-brand px-8 py-3 text-sm font-bold uppercase tracking-[0.06em] text-white"
        >
          Get In Touch
        </a>
      </div>
    </>
  );
}
