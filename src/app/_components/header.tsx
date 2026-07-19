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
          scrolled ? "glass-nav py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6">
          <a href="#" className="group flex items-center gap-1.5">
            <svg width="28" height="28" viewBox="0 0 28 28" className="transition-transform duration-500 group-hover:rotate-90">
              <circle cx="14" cy="14" r="12" stroke="#E91F27" strokeWidth="1.5" fill="none" />
              <circle cx="14" cy="14" r="4" fill="#E91F27" />
              <line x1="14" y1="2" x2="14" y2="10" stroke="#E91F27" strokeWidth="1.5" />
              <line x1="14" y1="18" x2="14" y2="26" stroke="#E91F27" strokeWidth="1.5" />
              <line x1="2" y1="14" x2="10" y2="14" stroke="#E91F27" strokeWidth="1.5" />
              <line x1="18" y1="14" x2="26" y2="14" stroke="#E91F27" strokeWidth="1.5" />
            </svg>
            <span className="font-heading text-lg font-bold tracking-tight text-text-primary">
              GloboScience
            </span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_ITEMS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="relative text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-text-body transition-colors hover:text-brand after:absolute after:-bottom-1 after:left-0 after:h-[1.5px] after:w-0 after:bg-brand after:transition-all after:duration-400 hover:after:w-full"
              >
                {label}
              </a>
            ))}
            <a href="#contact"
              className="btn-ghost ml-2 rounded-sm px-5 py-2.5 text-[0.72rem]">
              Get In Touch
            </a>
          </nav>

          <button
            onClick={() => setMenuOpen(true)}
            className="flex flex-col gap-[5px] p-1 md:hidden"
            aria-label="Open menu"
          >
            <span className="block h-[1.5px] w-6 bg-text-primary transition-all" />
            <span className="block h-[1.5px] w-6 bg-text-primary" />
            <span className="block h-[1.5px] w-6 bg-text-primary" />
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[60] flex flex-col items-center justify-center gap-8 bg-white/95 backdrop-blur-2xl transition-all duration-500 md:hidden ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <button onClick={closeMenu} className="absolute top-6 right-6 text-3xl text-text-primary" aria-label="Close">&times;</button>
        {NAV_ITEMS.map(({ label, href }, i) => (
          <a key={label} href={href} onClick={closeMenu}
            className={`text-2xl font-semibold uppercase tracking-[0.1em] text-text-primary transition-all duration-500 ${
              menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: menuOpen ? `${i * 60}ms` : "0ms" }}
          >{label}</a>
        ))}
        <a href="#contact" onClick={closeMenu}
          className="mt-4 magnetic-btn rounded-sm bg-brand px-8 py-3 text-sm font-bold uppercase tracking-[0.08em] text-white"
        >Get In Touch</a>
      </div>
    </>
  );
}
