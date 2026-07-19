"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const stagger = (delay: number) => ({
  initial: { opacity: 0, y: 48, filter: "blur(8px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true, margin: "-10% 0px" },
  transition: { duration: 0.8, ease: easeOutExpo, delay },
});

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center overflow-hidden bg-bg-primary pt-20"
    >
      {/* Subtle radial accent */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_70%_50%_at_30%_30%,rgba(233,31,39,0.03)_0%,transparent_60%)]" />

      {/* Large IDEAS watermark */}
      <div className="pointer-events-none absolute right-[-5%] top-1/2 z-0 -translate-y-1/2 select-none font-heading text-[clamp(6rem,16vw,14rem)] font-extrabold leading-none tracking-[0.3em] text-brand/5">
        IDEAS
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6 py-20">
        <motion.p {...stagger(0)} className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-brand">
          Insight · Direction · Experience · Advice · Strategies
        </motion.p>

        <motion.h1
          {...stagger(0.1)}
          className="mb-6 max-w-[820px] font-heading text-[clamp(2.5rem,6vw,5.5rem)] font-bold leading-[1.06] tracking-[-0.015em] text-text-primary"
        >
          Architects of <span className="text-brand">innovative</span>{" "}
          regulatory pathways from molecule to&nbsp;marketplace
        </motion.h1>

        <motion.p
          {...stagger(0.2)}
          className="mb-10 max-w-[560px] text-lg leading-relaxed text-text-body"
        >
          We transform scientific discoveries into differentiated therapeutics
          — creating regulatory strategies where no precedent or guidance
          exists.
        </motion.p>

        <motion.div {...stagger(0.3)} className="flex flex-wrap gap-4">
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 rounded-sm bg-brand px-7 py-3.5 text-sm font-bold uppercase tracking-[0.06em] text-white shadow-lg shadow-brand/20 transition-all hover:bg-brand-dark hover:shadow-xl hover:shadow-brand/25 active:scale-[0.98]"
          >
            Start Your Approval Journey
            <span className="transition-transform group-hover:translate-x-0.5">&rarr;</span>
          </a>
          <a
            href="#expertise"
            className="inline-flex items-center gap-2 rounded-sm border border-border-light px-7 py-3.5 text-sm font-medium uppercase tracking-[0.06em] text-text-body transition-all hover:border-brand hover:text-brand"
          >
            Explore Expertise
          </a>
        </motion.div>
      </div>
    </section>
  );
}
