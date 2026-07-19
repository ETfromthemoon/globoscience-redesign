"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

export default function CTABanner() {
  const ref = useRef<HTMLElement>(null);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-b border-t border-border-light bg-bg-alt py-24"
    >
      {/* Subtle radial bg */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(233,31,39,0.04)_0%,transparent_70%)]" />

      <div className="relative z-10 mx-auto max-w-[700px] px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
          className="mb-4 font-heading text-[clamp(2rem,3.5vw,3rem)] font-bold leading-[1.16] tracking-[-0.01em] text-text-primary"
        >
          Get <span className="text-brand">One Step Ahead</span> of Disease
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const, delay: 0.1 }}
          className="mb-8 text-base text-text-body"
        >
          We believe in regulatory science as a weapon to fight disease and
          improve health outcomes worldwide.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const, delay: 0.2 }}
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-sm bg-brand px-8 py-3.5 text-sm font-bold uppercase tracking-[0.06em] text-white shadow-lg shadow-brand/20 transition-all hover:bg-brand-dark hover:shadow-xl hover:shadow-brand/25 active:scale-[0.98]"
          >
            Schedule a Consultation
            <span>&rarr;</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
