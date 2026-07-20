"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "motion/react";
import { LOCATIONS } from "./locations-data";
import WireframeGlobe from "./wireframe-globe";

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
    setActive((cur) => (cur + 1) % LOCATIONS.length);
  }, []);

  const prev = useCallback(() => {
    setSlideKey((k) => k + 1);
    setActive((cur) => (cur - 1 + LOCATIONS.length) % LOCATIONS.length);
  }, []);

  /* Preload de todas las fotos — evita el flash al cambiar de slide */
  useEffect(() => {
    LOCATIONS.forEach((l) => {
      const img = new Image();
      img.src = l.photo;
    });
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); obs.unobserve(e.target); }
      },
      { threshold: 0.15 },
    );
    if (headerRef.current) obs.observe(headerRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = setInterval(next, 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPaused, next]);

  const loc = LOCATIONS[active];

  return (
    <section
      id="locations"
      className="section-pad relative overflow-hidden bg-bg-alt"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="pointer-events-none absolute inset-0 bg-molecular opacity-[0.04]" />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6">
        {/* ── Full-width title ── */}
        <div ref={headerRef} className="scroll-reveal mb-16 text-center">
          <span className="eyebrow mb-3">
            Global Presence
          </span>
          <h2 className="heading-2 mb-4">
            Serving clients across{" "}
            <span className="text-brand">100+</span> countries
          </h2>
          <p className="mx-auto max-w-[520px] text-base text-text-body">
            Our expertise extends globally with offices on four continents.
          </p>
        </div>

        {/* ── 50/50 Carousel + Globe ── */}
        <div className="flex flex-col-reverse items-center gap-10 lg:flex-row lg:items-stretch lg:gap-8">
          {/* Left: Carousel slider (50%) */}
          <div className="w-full lg:w-1/2">
            <div className="relative mx-auto w-full max-w-[560px]">
              <div
                key={slideKey}
                className="location-slide-enter group relative overflow-hidden rounded-lg"
                style={{ minHeight: 380 }}
              >
                {/* Photo background */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] group-hover:scale-105"
                  style={{ backgroundImage: `url(${loc.photo})` }}
                />
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
                {/* Red accent gradient */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand/10 via-transparent to-transparent" />
                {/* Hexgrid pattern */}
                <div className="pointer-events-none absolute inset-0 bg-hexgrid opacity-[0.06]" />

                {/* Content */}
                <div className="relative z-10 flex h-full min-h-[380px] flex-col justify-end px-8 pb-10 pt-24 md:px-10 md:pb-12">
                  <div key={slideKey + "-info"} className="location-info-reveal">
                    {/* Region */}
                    <p className="mb-2 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-brand/80">
                      {loc.region}
                    </p>
                    {/* City */}
                    <h3 className="mb-4 font-heading text-[clamp(2rem,3.5vw,2.8rem)] font-bold leading-[1.1] tracking-[-0.02em] text-white">
                      {loc.city}
                    </h3>
                    {/* Address */}
                    <p className="mb-3 max-w-[440px] text-[0.85rem] leading-relaxed text-white/65">
                      {loc.addr}
                    </p>
                    {/* Phone */}
                    <p className="text-[0.9rem] font-semibold tracking-wide text-brand/90">
                      {loc.phone}
                    </p>
                  </div>
                </div>

                {/* Counter badge */}
                <div className="absolute top-4 right-5 z-10 flex items-center gap-2 rounded-full border border-white/[0.08] bg-black/30 px-4 py-1.5 backdrop-blur-md">
                  <span className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-white/35">
                    Office
                  </span>
                  <span className="font-heading text-base font-bold text-brand">
                    {active + 1}/{LOCATIONS.length}
                  </span>
                </div>
              </div>

              {/* Navigation */}
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  onClick={prev}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border-strong text-text-body transition-all hover:border-brand hover:text-brand"
                  aria-label="Previous"
                >
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className="flex items-center">
                  {LOCATIONS.map((l, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      className="group/dot flex h-8 w-6 items-center justify-center"
                      aria-label={`${l.city} office`}
                    >
                      <span
                        className={`rounded-full transition-all duration-400 ${
                          i === active
                            ? "h-[5px] w-5 bg-brand shadow-[0_0_8px_rgba(233,31,39,0.4)]"
                            : "h-[4px] w-[4px] bg-text-muted group-hover/dot:bg-brand/40"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <button
                  onClick={next}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border-strong text-text-body transition-all hover:border-brand hover:text-brand"
                  aria-label="Next"
                >
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Wireframe Globe (50%) */}
          <div className="flex w-full items-center justify-center lg:w-1/2">
            <div className="relative">
              {/* Outer glow ring */}
              <div className="pointer-events-none absolute top-1/2 left-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(233,31,39,0.04)_0%,transparent_65%)]" />
              {/* Orbital ring 1 */}
              <motion.div
                className="pointer-events-none absolute top-1/2 left-1/2 h-[370px] w-[370px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand/[0.06]"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />
              {/* Orbital ring 2 */}
              <motion.div
                className="pointer-events-none absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand/[0.04]"
                animate={{ rotate: -360 }}
                transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
                style={{ transform: "translate(-50%, -50%) rotateX(60deg)" }}
              />
              <WireframeGlobe locations={LOCATIONS} activeIndex={active} />
              {/* Label: rotate hint */}
              <p className="mt-3 text-center text-[0.6rem] font-medium uppercase tracking-[0.14em] text-text-muted">
                Rotating to active location
              </p>
            </div>
          </div>
        </div>

        {/* Mobile-only: 100+ stat */}
        <div className="mx-auto mt-14 flex max-w-[320px] items-center justify-center gap-4 rounded-lg border border-border-light bg-white/40 px-8 py-5 backdrop-blur-sm lg:hidden">
          <span className="font-heading text-4xl font-bold text-brand">100+</span>
          <div className="text-left">
            <p className="text-sm font-semibold text-text-primary">Countries</p>
            <p className="text-xs text-text-body">Served Globally</p>
          </div>
        </div>
      </div>
    </section>
  );
}
