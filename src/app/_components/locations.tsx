"use client";

import { useRef, useEffect } from "react";

const LOCATIONS = [
  { region: "North America", city: "Boston", addr: "One Washington Mall, Suite #1066, Government Center, Boston, MA 02108", phone: "+1 617 583 5727" },
  { region: "Europe", city: "London", addr: "11 Westferry Circus, London E14 8RH, United Kingdom", phone: "+44 74 5128 6444" },
  { region: "EU Headquarters", city: "Amsterdam", addr: "World Trade Center, Strawinskylaan 1, 1077 XW Amsterdam", phone: "+31 9 700 503 3004" },
  { region: "France", city: "Lyon", addr: "Tour Part-Dieu, 129 Rue Servient, 69326 Lyon Cedex 3", phone: "+33 7 5793 5000" },
  { region: "Canada", city: "Toronto", addr: "181 University Ave, Toronto, ON M5H 3M7", phone: "+1 416 907 9455" },
  { region: "Latin America", city: "Santiago", addr: "Entrevalle #62 G-864-F, Alhue, Curacavi, Region Metropolitana, Chile", phone: "+56 2 2582 9330" },
  { region: "South Asia", city: "Rawalpindi", addr: "Office # M-91, First Floor, Midway Centrum, 6th Rd, Rawalpindi 46000", phone: "+92 301 9333400" },
];

export default function Locations() {
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); obs.unobserve(e.target); } },
      { threshold: 0.1 }
    );
    [headerRef.current, gridRef.current].forEach((el) => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <section id="locations" className="relative overflow-hidden bg-bg-alt py-28">
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-40" />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6">
        <div ref={headerRef} className="scroll-reveal mb-20 text-center">
          <span className="mb-3 block text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand/70">
            Global Presence
          </span>
          <h2 className="mb-5 font-heading text-[clamp(2rem,3.2vw,2.8rem)] font-bold tracking-[-0.015em] text-text-primary">
            Serving clients across <span className="text-brand">100+</span> countries
          </h2>
          <p className="mx-auto max-w-[560px] text-base text-text-body">
            Our expertise extends globally with offices on four continents.
          </p>
        </div>

        <div ref={gridRef} className="stagger grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {LOCATIONS.map((loc) => (
            <div key={loc.city} className="glass-light rounded-sm p-5 transition-all duration-400 hover:-translate-y-1.5 hover:border-brand/15 hover:shadow-md">
              <p className="mb-1 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-brand/60">
                {loc.region}
              </p>
              <h3 className="mb-2 font-heading text-base font-semibold text-text-primary">
                {loc.city}
              </h3>
              <p className="mb-2 text-[0.82rem] leading-relaxed text-text-body">{loc.addr}</p>
              <p className="text-[0.82rem] text-text-body">{loc.phone}</p>
            </div>
          ))}

          {/* 100+ highlight */}
          <div className="glass-dark glass-sheen flex flex-col items-center justify-center gap-2 rounded-sm p-5 text-center transition-all duration-400 hover:-translate-y-1.5">
            <span className="font-heading text-4xl font-bold text-brand">100+</span>
            <p className="text-xs text-white/55">Countries<br />Served Globally</p>
          </div>
        </div>
      </div>
    </section>
  );
}
