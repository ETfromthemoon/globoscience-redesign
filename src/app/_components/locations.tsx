"use client";

import { useRef, useEffect, useState, useCallback } from "react";

interface Location {
  region: string;
  city: string;
  addr: string;
  phone: string;
  gradient: string;
  accent: string;
}

const LOCATIONS: Location[] = [
  {
    region: "North America",
    city: "Boston",
    addr: "One Washington Mall, Suite #1066, Government Center, Boston, MA 02108",
    phone: "+1 617 583 5727",
    gradient: "from-[#1a2332] via-[#1e3a5f] to-[#0f1922]",
    accent: "#4a90d9",
  },
  {
    region: "Europe",
    city: "London",
    addr: "11 Westferry Circus, London E14 8RH, United Kingdom",
    phone: "+44 74 5128 6444",
    gradient: "from-[#1a1a2e] via-[#16213e] to-[#0f111a]",
    accent: "#6c63ff",
  },
  {
    region: "EU Headquarters",
    city: "Amsterdam",
    addr: "World Trade Center, Strawinskylaan 1, 1077 XW Amsterdam",
    phone: "+31 9 700 503 3004",
    gradient: "from-[#0d1b2a] via-[#1b4332] to-[#081c15]",
    accent: "#52b788",
  },
  {
    region: "France",
    city: "Lyon",
    addr: "Tour Part-Dieu, 129 Rue Servient, 69326 Lyon Cedex 3",
    phone: "+33 7 5793 5000",
    gradient: "from-[#1a0a0a] via-[#3d1212] to-[#0f0505]",
    accent: "#d44c4c",
  },
  {
    region: "Canada",
    city: "Toronto",
    addr: "181 University Ave, Toronto, ON M5H 3M7",
    phone: "+1 416 907 9455",
    gradient: "from-[#0a1628] via-[#1a3a5c] to-[#0d1b2a]",
    accent: "#00b4d8",
  },
  {
    region: "Latin America",
    city: "Santiago",
    addr: "Entrevalle #62 G-864-F, Alhue, Curacavi, Region Metropolitana, Chile",
    phone: "+56 2 2582 9330",
    gradient: "from-[#1a0f0a] via-[#4a2c17] to-[#0f0805]",
    accent: "#e07b39",
  },
  {
    region: "South Asia",
    city: "Rawalpindi",
    addr: "Office # M-91, First Floor, Midway Centrum, 6th Rd, Rawalpindi 46000",
    phone: "+92 301 9333400",
    gradient: "from-[#0a1a0a] via-[#2d4a1e] to-[#0a0f05]",
    accent: "#c9a93e",
  },
];

function Globe() {
  return (
    <div className="globe-stage relative mx-auto h-[280px] w-[280px] lg:h-[320px] lg:w-[320px]">
      {/* Atmosphere glow */}
      <div className="absolute top-1/2 left-1/2 h-[310px] w-[310px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(233,31,39,0.06)_0%,transparent_70%)] lg:h-[360px] lg:w-[360px]" />
      {/* Rotating rings */}
      <div className="globe-ring" />
      <div className="globe-ring" />
      <div className="globe-ring" />
      {/* Sphere */}
      <div className="globe-sphere relative z-10 lg:h-[300px] lg:w-[300px]">
        {/* Location dots */}
        <div className="globe-dot" />
        <div className="globe-dot" />
        <div className="globe-dot" />
        <div className="globe-dot" />
        <div className="globe-dot" />
        <div className="globe-dot" />
        <div className="globe-dot" />
        {/* Equator line */}
        <div className="absolute top-1/2 left-1/2 h-[100%] w-[100%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]" />
        {/* Prime meridian */}
        <div className="absolute top-0 bottom-0 left-1/2 w-[1px] -translate-x-1/2 bg-gradient-to-b from-transparent via-white/[0.06] to-transparent" />
      </div>
    </div>
  );
}

export default function Locations() {
  const headerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [slideKey, setSlideKey] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((index: number) => {
    setSlideKey((k) => k + 1);
    setActive(index);
  }, []);

  const next = useCallback(() => {
    setSlideKey((k) => k + 1);
    setActive((prev) => (prev + 1) % LOCATIONS.length);
  }, []);

  const prev = useCallback(() => {
    setSlideKey((k) => k + 1);
    setActive((p) => (p - 1 + LOCATIONS.length) % LOCATIONS.length);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          obs.unobserve(e.target);
        }
      },
      { threshold: 0.15 },
    );
    if (headerRef.current) obs.observe(headerRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(next, 4500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, next]);

  const loc = LOCATIONS[active];

  return (
    <section
      id="locations"
      className="relative overflow-hidden bg-bg-alt py-24 lg:py-28"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="pointer-events-none absolute inset-0 bg-molecular opacity-[0.06]" />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6">
        {/* Header + Globe row */}
        <div className="mb-14 flex flex-col items-center gap-10 lg:mb-16 lg:flex-row lg:items-start lg:justify-between">
          <div ref={headerRef} className="scroll-reveal flex-shrink-0 text-center lg:text-left">
            <span className="mb-3 block text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand/70">
              Global Presence
            </span>
            <h2 className="mb-4 font-heading text-[clamp(2rem,3.2vw,2.8rem)] font-bold leading-[1.15] tracking-[-0.015em] text-text-primary">
              Serving clients across{" "}
              <span className="text-brand">100+</span> countries
            </h2>
            <p className="max-w-[480px] text-base text-text-body">
              Our expertise extends globally with offices on four continents.
            </p>
          </div>

          {/* Globe */}
          <div className="hidden lg:block">
            <Globe />
          </div>
        </div>

        {/* Carousel */}
        <div className="relative mx-auto max-w-[900px]">
          {/* Slide */}
          <div
            key={slideKey}
            className="location-slide-enter group relative overflow-hidden rounded-lg"
            style={{
              minHeight: 340,
              background: `linear-gradient(135deg, ${loc.accent}18 0%, ${loc.accent}05 40%, transparent 70%)`,
            }}
          >
            {/* Gradient background layer */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${loc.gradient} opacity-90`}
            />
            {/* Pattern overlay */}
            <div className="pointer-events-none absolute inset-0 bg-hexgrid opacity-[0.07]" />
            {/* Accent glow */}
            <div
              className="pointer-events-none absolute -top-20 -right-20 h-[280px] w-[280px] rounded-full blur-3xl"
              style={{ background: `${loc.accent}15` }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-center px-10 py-12 md:px-14 md:py-14">
              <div key={slideKey} className="location-info-reveal">
                {/* Accent line */}
                <div
                  className="mb-5 h-[2px] w-12"
                  style={{ background: loc.accent }}
                />

                {/* Region */}
                <p
                  className="mb-3 text-[0.65rem] font-bold uppercase tracking-[0.2em]"
                  style={{ color: `${loc.accent}cc` }}
                >
                  {loc.region}
                </p>

                {/* City */}
                <h3 className="mb-5 font-heading text-[clamp(2.2rem,4vw,3.2rem)] font-bold leading-[1.1] tracking-[-0.02em] text-white">
                  {loc.city}
                </h3>

                {/* Address */}
                <p className="mb-3 max-w-[540px] text-[0.9rem] leading-relaxed text-white/70">
                  {loc.addr}
                </p>

                {/* Phone */}
                <p
                  className="text-[0.95rem] font-semibold tracking-wide"
                  style={{ color: loc.accent }}
                >
                  {loc.phone}
                </p>
              </div>
            </div>

            {/* 100+ badge */}
            <div className="absolute top-4 right-6 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 backdrop-blur-sm">
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white/40">
                Office
              </span>
              <span className="font-heading text-lg font-bold text-brand">
                {active + 1}/{LOCATIONS.length}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-center gap-5">
            {/* Prev arrow */}
            <button
              onClick={prev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border-strong text-text-body transition-all hover:border-brand hover:text-brand"
              aria-label="Previous location"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M10 4L6 8l4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2.5">
              {LOCATIONS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`rounded-full transition-all duration-400 ${
                    i === active
                      ? "h-[5px] w-7 bg-brand shadow-[0_0_8px_rgba(233,31,39,0.4)]"
                      : "h-[3.5px] w-[3.5px] bg-text-muted hover:bg-brand/40"
                  }`}
                  aria-label={`Location ${i + 1}`}
                />
              ))}
            </div>

            {/* Next arrow */}
            <button
              onClick={next}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border-strong text-text-body transition-all hover:border-brand hover:text-brand"
              aria-label="Next location"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile globe */}
        <div className="mt-12 flex justify-center lg:hidden">
          <Globe />
        </div>
      </div>
    </section>
  );
}
