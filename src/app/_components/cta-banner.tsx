"use client";

import { useRef, useEffect } from "react";
import Ripple from "./ripple";

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
    <section ref={ref} className="section-pad relative overflow-hidden border-t border-border-light bg-bg-alt">
      <div className="pointer-events-none absolute inset-0 bg-molecular opacity-20" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(233,31,39,0.04)_0%,transparent_70%)]" />

      <div className="relative z-10 mx-auto max-w-[720px] px-6 text-center">
        <div className="scroll-reveal reveal-target">
          <h2 className="mb-6 font-heading text-[clamp(2.2rem,4vw,3.5rem)] font-bold leading-[1.12] tracking-[-0.02em] text-text-primary text-wrap-balance">
            Get <span className="text-brand">One Step Ahead</span> of&nbsp;Disease
          </h2>
          <p className="mx-auto mb-10 max-w-[520px] text-[0.9375rem] leading-relaxed text-text-body">
            We believe in regulatory science as a weapon to fight disease and improve health outcomes worldwide.
          </p>
          <Ripple className="inline-block rounded-sm">
            <a href="#contact"
              className="btn-ghost rounded-sm px-9 py-3.5 text-sm"
            >
              Schedule a Consultation
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 7h11M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </Ripple>
        </div>
      </div>
    </section>
  );
}
