"use client";

import { useRef, useEffect } from "react";

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          obs.unobserve(e.target);
        }
      },
      { threshold: 0.15 }
    );
    [ref.current, imgRef.current].forEach((el) => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <section id="about" className="relative overflow-hidden py-28">
      {/* Subtle molecular bg */}
      <div className="pointer-events-none absolute inset-0 bg-molecular opacity-30" />

      <div className="relative z-10 mx-auto grid max-w-[1200px] items-center gap-20 px-6 lg:grid-cols-2">
        {/* Content */}
        <div ref={ref} className="scroll-reveal">
          <span className="mb-4 block text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand">
            Who We Are
          </span>
          <h2 className="mb-8 font-heading text-[clamp(2rem,3.2vw,2.8rem)] font-bold leading-[1.14] tracking-[-0.015em] text-text-primary">
            The strategic regulatory{" "}
            <span className="whitespace-nowrap text-brand">
              problem solver
            </span>{" "}
            and product development partner of&nbsp;choice
          </h2>
          <p className="mb-5 leading-relaxed text-text-body">
            We are a collective of thought leaders — former regulators,
            prescribers, and sponsors — who have been there and done that. Our
            direct access to a network of key opinion leaders, regulators, and
            executives enables success outcomes for our clients.
          </p>
          <p className="mb-10 leading-relaxed text-text-body">
            From the laboratory to the approved product label, our expertise and
            influence extends globally. We find the &ldquo;it&rdquo; that
            supports an innovative regulatory pathway.
          </p>

          {/* Quote glass-dark panel */}
          <blockquote className="glass-dark glass-sheen relative rounded-sm p-6">
            <svg className="mb-3 opacity-40" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 11H6V7h4V3H3v12h7v-4zm8 0h-4V7h4V3h-7v12h7v-4z" />
            </svg>
            <p className="text-sm leading-relaxed">
              &ldquo;GloboScience is the regulatory problem solver and product
              development consulting partner of choice.&rdquo;
            </p>
            <footer className="mt-4 text-sm font-semibold text-white">
              Lorna L. Langdon{" "}
              <span className="font-normal text-white/50">— Chairwoman</span>
            </footer>
          </blockquote>
        </div>

        {/* Image panel */}
        <div ref={imgRef} className="scroll-reveal relative">
          <div className="glass-dark glass-sheen relative overflow-hidden rounded-sm p-3">
            <img
              src="/assets/Scientist-PNG.png"
              alt="Scientific visualization"
              className="relative z-10 w-full rounded-[2px]"
              loading="lazy"
            />
          </div>
          {/* Offset decorative frame */}
          <div className="pointer-events-none absolute -top-4 -right-4 -bottom-4 -left-4 rounded-md border-2 border-brand/10" />
          <div className="pointer-events-none absolute -top-6 -right-6 -bottom-6 -left-6 rounded-lg border border-brand/5" />
        </div>
      </div>
    </section>
  );
}
