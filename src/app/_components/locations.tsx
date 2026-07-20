"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "motion/react";

interface Location {
  region: string;
  city: string;
  addr: string;
  phone: string;
  photo: string;
  lat: number;
  lng: number;
}

const LOCATIONS: Location[] = [
  {
    region: "North America", city: "Boston",
    addr: "One Washington Mall, Suite #1066, Government Center, Boston, MA 02108",
    phone: "+1 617 583 5727",
    photo: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80",
    lat: 42.36, lng: -71.06,
  },
  {
    region: "Europe", city: "London",
    addr: "11 Westferry Circus, London E14 8RH, United Kingdom",
    phone: "+44 74 5128 6444",
    photo: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80",
    lat: 51.51, lng: -0.13,
  },
  {
    region: "EU Headquarters", city: "Amsterdam",
    addr: "World Trade Center, Strawinskylaan 1, 1077 XW Amsterdam",
    phone: "+31 9 700 503 3004",
    photo: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1200&q=80",
    lat: 52.37, lng: 4.90,
  },
  {
    region: "France", city: "Lyon",
    addr: "Tour Part-Dieu, 129 Rue Servient, 69326 Lyon Cedex 3",
    phone: "+33 7 5793 5000",
    photo: "https://images.unsplash.com/photo-1524396309943-e03f5249f002?w=1200&q=80",
    lat: 45.76, lng: 4.84,
  },
  {
    region: "Canada", city: "Toronto",
    addr: "181 University Ave, Toronto, ON M5H 3M7",
    phone: "+1 416 907 9455",
    photo: "https://images.unsplash.com/photo-1517090504586-fde19ea6066f?w=1200&q=80",
    lat: 43.65, lng: -79.38,
  },
  {
    region: "Latin America", city: "Santiago",
    addr: "Entrevalle #62 G-864-F, Alhue, Curacavi, Region Metropolitana, Chile",
    phone: "+56 2 2582 9330",
    photo: "https://picsum.photos/seed/santiago/1200/800",
    lat: -33.45, lng: -70.67,
  },
  {
    region: "South Asia", city: "Rawalpindi",
    addr: "Office # M-91, First Floor, Midway Centrum, 6th Rd, Rawalpindi 46000",
    phone: "+92 301 9333400",
    photo: "https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=1200&q=80",
    lat: 33.60, lng: 73.04,
  },
];

/* ───── Wireframe Scientific Globe ───── */

const GLOBE_R = 140;
const GLOBE_CX = 160;
const GLOBE_CY = 160;
const GLOBE_SIZE = 320;
const MERIDIANS = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
const PARALLELS = [-60, -30, 0, 30, 60];

function degToRad(d: number) { return (d * Math.PI) / 180; }

function WireframeGlobe({
  rotationDeg,
  activeCity,
  activeIndex,
}: {
  rotationDeg: number;
  activeCity: Location;
  activeIndex: number;
}) {
  const rotRad = degToRad(rotationDeg);
  const R = GLOBE_R;
  const CX = GLOBE_CX;
  const CY = GLOBE_CY;

  return (
    <svg
      width={GLOBE_SIZE}
      height={GLOBE_SIZE}
      viewBox={`0 0 ${GLOBE_SIZE} ${GLOBE_SIZE}`}
      xmlns="http://www.w3.org/2000/svg"
      className="overflow-visible"
    >
      <defs>
        <radialGradient id="wgCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E91F27" stopOpacity="0.12" />
          <stop offset="60%" stopColor="#E91F27" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#E91F27" stopOpacity="0" />
        </radialGradient>
        <filter id="wgGlow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="wgGlowStrong">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Ambient glow behind sphere */}
      <circle cx={CX} cy={CY} r={R + 30} fill="url(#wgCore)" />

      {/* Sphere outline */}
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(233,31,39,0.18)" strokeWidth={0.8} />
      <circle cx={CX} cy={CY} r={R - 1} fill="none" stroke="rgba(233,31,39,0.06)" strokeWidth={0.4} />

      {/* Latitude parallels */}
      {PARALLELS.map((latDeg) => {
        const phi = degToRad(90 - latDeg);
        const cy = CY - R * Math.cos(phi);
        const rx = R * Math.abs(Math.sin(phi));
        const ry = rx * 0.28;
        const isEquator = latDeg === 0;
        return (
          <ellipse
            key={`lat-${latDeg}`}
            cx={CX} cy={cy}
            rx={rx} ry={ry}
            fill="none"
            stroke={isEquator ? "rgba(233,31,39,0.25)" : "rgba(233,31,39,0.09)"}
            strokeWidth={isEquator ? 0.7 : 0.35}
            strokeDasharray={isEquator ? undefined : "3 6"}
          />
        );
      })}

      {/* Longitude meridians */}
      {MERIDIANS.map((lngDeg) => {
        const L = degToRad(lngDeg) - rotRad;
        const sinL = Math.sin(L);
        if (sinL < -0.02) return null;
        const cosL = Math.cos(L);
        const rx = R * Math.abs(cosL);
        const ry = R;
        if (rx < 1.5) {
          return (
            <line
              key={`mer-${lngDeg}`}
              x1={CX} y1={CY - R} x2={CX} y2={CY + R}
              stroke="rgba(233,31,39,0.14)" strokeWidth={0.4}
            />
          );
        }
        return (
          <ellipse
            key={`mer-${lngDeg}`}
            cx={CX} cy={CY}
            rx={rx} ry={ry}
            fill="none"
            stroke="rgba(233,31,39,0.1)"
            strokeWidth={0.4}
            strokeDasharray="2 5"
          />
        );
      })}

      {/* Equator glow ring */}
      <ellipse cx={CX} cy={CY} rx={R * 0.98} ry={R * 0.27} fill="none"
        stroke="rgba(233,31,39,0.12)" strokeWidth={1.5} />

      {/* City markers */}
      {LOCATIONS.map((loc, i) => {
        const phi = degToRad(90 - loc.lat);
        const L = degToRad(loc.lng) - rotRad;
        const z3d = Math.sin(phi) * Math.sin(L);
        if (z3d < -0.05) return null;

        const x3d = Math.sin(phi) * Math.cos(L);
        const y3d = Math.cos(phi);
        const px = CX + x3d * R;
        const py = CY - y3d * R;
        const opacity = Math.max(0.15, z3d * 0.6 + 0.3);
        const isActive = i === activeIndex;

        return (
          <g key={`city-${i}`}>
            {/* Pulse ring for active */}
            {isActive && (
              <motion.circle
                cx={px} cy={py} r={8}
                fill="none" stroke="#E91F27" strokeWidth={0.7}
                filter="url(#wgGlowStrong)"
                initial={{ opacity: 0.7, scale: 0.6 }}
                animate={{ opacity: [0.7, 0.15, 0.7], scale: [0.6, 1.8, 0.6] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
            {/* Dot */}
            <motion.circle
              cx={px} cy={py}
              r={isActive ? 4 : 2.5}
              fill="#E91F27"
              filter={isActive ? "url(#wgGlowStrong)" : "url(#wgGlow)"}
              initial={{ opacity: 0 }}
              animate={{
                opacity: isActive ? [opacity, 1, opacity] : opacity,
              }}
              transition={{
                opacity: { duration: isActive ? 1.5 : 0.3, repeat: isActive ? Infinity : 0, repeatType: "reverse", ease: "easeInOut" },
              }}
            />
            {/* Label for active */}
            {isActive && (
              <motion.text
                x={px + 10} y={py - 6}
                fill="#E91F27"
                fontSize="9"
                fontWeight="700"
                fontFamily="var(--font-heading)"
                letterSpacing="0.08em"
                initial={{ opacity: 0, x: px + 4 }}
                animate={{ opacity: 1, x: px + 10 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                {loc.city}
              </motion.text>
            )}
          </g>
        );
      })}

      {/* Axis poles */}
      <circle cx={CX} cy={CY - R} r={2} fill="rgba(233,31,39,0.3)" />
      <circle cx={CX} cy={CY + R} r={2} fill="rgba(233,31,39,0.2)" />
    </svg>
  );
}

/* ───── Main Component ───── */

export default function Locations() {
  const headerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [slideKey, setSlideKey] = useState(0);
  const [rotationDeg, setRotationDeg] = useState(LOCATIONS[0].lng);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const targetRot = useRef(LOCATIONS[0].lng);
  const animFrame = useRef<number>(0);

  const goTo = useCallback((index: number) => {
    setSlideKey((k) => k + 1);
    setActive(index);
    targetRot.current = LOCATIONS[index].lng;
  }, []);

  const next = useCallback(() => {
    const nxt = (active + 1) % LOCATIONS.length;
    setSlideKey((k) => k + 1);
    setActive(nxt);
    targetRot.current = LOCATIONS[nxt].lng;
  }, [active]);

  const prev = useCallback(() => {
    const prv = (active - 1 + LOCATIONS.length) % LOCATIONS.length;
    setSlideKey((k) => k + 1);
    setActive(prv);
    targetRot.current = LOCATIONS[prv].lng;
  }, [active]);

  /* Smooth globe rotation via rAF */
  useEffect(() => {
    const animate = () => {
      setRotationDeg((cur) => {
        const diff = targetRot.current - cur;
        if (Math.abs(diff) < 0.3) return targetRot.current;
        return cur + diff * 0.06;
      });
      animFrame.current = requestAnimationFrame(animate);
    };
    animFrame.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame.current);
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
    if (isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(next, 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPaused, next]);

  const loc = LOCATIONS[active];

  return (
    <section
      id="locations"
      className="relative overflow-hidden bg-bg-alt py-24 lg:py-28"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="pointer-events-none absolute inset-0 bg-molecular opacity-[0.04]" />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6">
        {/* ── Full-width title ── */}
        <div ref={headerRef} className="scroll-reveal mb-16 text-center">
          <span className="mb-3 block text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand/70">
            Global Presence
          </span>
          <h2 className="mb-4 font-heading text-[clamp(2rem,3.2vw,2.8rem)] font-bold leading-[1.15] tracking-[-0.015em] text-text-primary">
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
              <div className="mt-6 flex items-center justify-center gap-4">
                <button
                  onClick={prev}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border-strong text-text-body transition-all hover:border-brand hover:text-brand"
                  aria-label="Previous"
                >
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className="flex items-center gap-2">
                  {LOCATIONS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      className={`rounded-full transition-all duration-400 ${
                        i === active
                          ? "h-[5px] w-7 bg-brand shadow-[0_0_8px_rgba(233,31,39,0.4)]"
                          : "h-[3px] w-[3px] bg-text-muted hover:bg-brand/35"
                      }`}
                      aria-label={`Location ${i + 1}`}
                    />
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
              <WireframeGlobe rotationDeg={rotationDeg} activeCity={loc} activeIndex={active} />
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
