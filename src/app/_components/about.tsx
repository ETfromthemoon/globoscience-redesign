"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section id="about" ref={ref} className="py-24">
      <div className="mx-auto grid max-w-[1200px] items-center gap-16 px-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <span className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-brand">
            Who We Are
          </span>
          <h2 className="mb-6 font-heading text-[clamp(2rem,3.2vw,2.8rem)] font-bold leading-[1.16] tracking-[-0.01em] text-text-primary">
            The strategic regulatory{" "}
            <span className="text-brand">problem solver</span> and product
            development partner of&nbsp;choice
          </h2>
          <p className="mb-4 text-base leading-relaxed text-text-body">
            We are a collective of thought leaders — former regulators,
            prescribers, and sponsors — who have been there and done that. Our
            direct access to a network of key opinion leaders, regulators, and
            executives enables success outcomes for our clients.
          </p>
          <p className="mb-8 text-base leading-relaxed text-text-body">
            From the laboratory to the approved product label, our expertise and
            influence extends globally. We find the &ldquo;it&rdquo; that
            supports an innovative regulatory pathway — because no two products
            or programs are alike.
          </p>

          <blockquote className="border-l-[3px] border-brand/20 py-2 pl-5 italic text-text-body">
            &ldquo;GloboScience is the regulatory problem solver and product
            development consulting partner of choice.&rdquo;
            <footer className="mt-2 text-sm font-semibold not-italic text-text-primary">
              — Lorna L. Langdon, <span className="font-normal text-text-body">Chairwoman</span>
            </footer>
          </blockquote>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const, delay: 0.15 }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-sm border border-border-light bg-bg-light p-1">
            <div className="relative aspect-square overflow-hidden rounded-[2px]">
              <img
                src="/assets/Scientist-PNG.png"
                alt="Scientific visualization"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
          {/* Decorative offset border */}
          <div className="pointer-events-none absolute -top-3 -right-3 -bottom-3 -left-3 rounded-md border border-brand/15" />
        </motion.div>
      </div>
    </section>
  );
}
