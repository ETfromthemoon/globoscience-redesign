"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

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
  const ref = useRef<HTMLElement>(null);

  return (
    <section id="locations" ref={ref} className="py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
          className="mb-16 text-center"
        >
          <span className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-brand">
            Global Presence
          </span>
          <h2 className="mb-4 font-heading text-[clamp(2rem,3.2vw,2.8rem)] font-bold tracking-[-0.01em] text-text-primary">
            Serving clients across{" "}
            <span className="text-brand">100+</span> countries
          </h2>
          <p className="mx-auto max-w-[560px] text-base text-text-body">
            Our expertise and influence extends globally with offices on four
            continents.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LOCATIONS.map((loc, i) => (
            <motion.div
              key={loc.city}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1] as const,
                delay: i * 0.06,
              }}
              className="glass-card rounded-sm p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand/20"
            >
              <p className="mb-1 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-brand">
                {loc.region}
              </p>
              <h3 className="mb-2 font-heading text-lg font-semibold text-text-primary">
                {loc.city}
              </h3>
              <p className="mb-2 text-xs leading-relaxed text-text-body">
                {loc.addr}
              </p>
              <p className="text-xs text-text-body">{loc.phone}</p>
            </motion.div>
          ))}

          {/* 100+ highlight card */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const, delay: 0.42 }}
            className="glass-card flex flex-col items-center justify-center gap-1 rounded-sm p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-brand/20"
          >
            <span className="font-heading text-4xl font-bold text-brand">
              100+
            </span>
            <p className="text-xs text-text-body">
              Countries
              <br />
              Served Globally
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
