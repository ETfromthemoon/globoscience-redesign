"use client";

import { useRef, useEffect } from "react";
import Ripple from "./ripple";
import CtaMolecularField from "./cta-molecular-field";

export default function CTABanner() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.querySelector(".reveal-target")?.classList.add("is-visible");
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="section-pad relative overflow-hidden bg-[#160a0d] text-white"
    >
      {/* Base gradient — vino profundo derivado del #2B161B de marca */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_-10%,#26121a_0%,#160a0d_55%,#0f0b0c_100%)]" />

      {/* Red molecular animada */}
      <CtaMolecularField />

      {/* Glows de acento */}
      <div className="pointer-events-none absolute -top-1/3 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(233,31,39,0.16)_0%,transparent_65%)]" />
      <div className="pointer-events-none absolute -bottom-1/4 right-[10%] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(233,31,39,0.08)_0%,transparent_70%)]" />

      {/* Hairlines de marca arriba y abajo */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand/20 to-transparent" />

      <div className="relative z-10 mx-auto max-w-[760px] px-6 text-center">
        <div className="scroll-reveal reveal-target">
          <span className="eyebrow mb-5 !text-brand/80">
            Our Mission
          </span>
          <h2 className="mb-6 font-heading text-[clamp(2.4rem,4.4vw,3.9rem)] font-bold leading-[1.08] tracking-[-0.025em] text-white text-wrap-balance">
            Get <span className="text-brand">One Step Ahead</span> of&nbsp;Disease
          </h2>
          <p className="mx-auto mb-11 max-w-[540px] text-[1rem] leading-relaxed text-white/60">
            We believe in regulatory science as a weapon to fight disease and
            improve health outcomes worldwide.
          </p>
          <Ripple className="inline-block rounded-sm">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2.5 rounded-sm bg-brand px-9 py-4 text-sm font-bold uppercase tracking-[0.08em] text-white shadow-[0_12px_40px_-8px_rgba(233,31,39,0.55)] transition-all duration-400 hover:-translate-y-0.5 hover:shadow-[0_16px_50px_-8px_rgba(233,31,39,0.7)]"
            >
              Schedule a Consultation
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform duration-400 group-hover:translate-x-1">
                <path d="M1 7h11M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </Ripple>
        </div>
      </div>
    </section>
  );
}
