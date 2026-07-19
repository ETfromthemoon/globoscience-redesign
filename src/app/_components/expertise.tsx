"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

const EXPERTISE = [
  { title: "Cell Therapy", desc: "CAR-T, TCR, and NK cell product regulatory strategy", icon: "🧬" },
  { title: "Gene Therapy", desc: "AAV, lentiviral, and CRISPR-based therapeutics", icon: "🧬" },
  { title: "Rare Diseases", desc: "Orphan drug designation and accelerated approval", icon: "🔬" },
  { title: "Immunotherapy", desc: "Checkpoint inhibitors, bispecifics, cancer vaccines", icon: "🛡️" },
  { title: "Advanced Tissue", desc: "Regenerative medicine and tissue-engineered products", icon: "🧪" },
  { title: "Drugs", desc: "Small molecules across all therapeutic areas", icon: "💊" },
  { title: "Biologics", desc: "Monoclonal antibodies, fusion proteins, biosimilars", icon: "🧫" },
  { title: "Devices", desc: "510(k), De Novo, PMA pathways for medical devices", icon: "⚙️" },
  { title: "Combination Products", desc: "Drug-device and biologic-device strategy", icon: "🔗" },
];

export default function Expertise() {
  const ref = useRef<HTMLElement>(null);

  return (
    <section id="expertise" ref={ref} className="bg-bg-alt py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
          className="mb-16 text-center"
        >
          <span className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-brand">
            Our Expertise
          </span>
          <h2 className="mb-4 font-heading text-[clamp(2rem,3.2vw,2.8rem)] font-bold tracking-[-0.01em] text-text-primary">
            From laboratory to <span className="text-brand">approved label</span>
          </h2>
          <p className="mx-auto max-w-[560px] text-base text-text-body">
            We&apos;ve worked in all therapeutic areas, with all technologies,
            in all routes of administration, and with all company types and
            sizes.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EXPERTISE.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1] as const,
                delay: i * 0.05,
              }}
              className="glass-card group cursor-pointer rounded-sm p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand/20 hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand/8 text-2xl transition-transform duration-300 group-hover:scale-110">
                {item.icon}
              </div>
              <h3 className="mb-2 font-heading text-lg font-semibold text-text-primary">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-text-body">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
