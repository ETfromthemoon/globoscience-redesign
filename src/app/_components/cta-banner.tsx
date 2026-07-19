"use client";

import { useRef, useEffect } from "react";

export default function CTABanner() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { e.target.querySelector(".reveal-target")?.classList.add("is-visible"); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden border-t border-border-light bg-bg-primary py-32 parallax-bg">
      {/* Molecular bg */}
      <div className="pointer-events-none absolute inset-0 bg-molecular opacity-30" />
      {/* Red radial */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(233,31,39,0.06)_0%,transparent_70%)]" />

      <div className="relative z-10 mx-auto max-w-[720px] px-6 text-center">
        <div className="scroll-reveal reveal-target">
          <h2 className="mb-6 font-heading text-[clamp(2.2rem,4vw,3.5rem)] font-bold leading-[1.12] tracking-[-0.015em] text-text-primary">
            Get <span className="text-brand">One Step Ahead</span> of&nbsp;Disease
          </h2>
          <p className="mx-auto mb-10 max-w-[520px] text-lg leading-relaxed text-text-body">
            We believe in regulatory science as a weapon to fight disease and
            improve health outcomes worldwide.
          </p>
          <a
            href="#contact"
            className="magnetic-btn inline-flex items-center gap-2 rounded-sm bg-brand px-9 py-4 text-sm font-bold uppercase tracking-[0.08em] text-white shadow-lg shadow-brand/20"
          >
            Schedule a Consultation
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 7h11M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
