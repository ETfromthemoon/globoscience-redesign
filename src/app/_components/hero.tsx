"use client";

import { useRef, useEffect } from "react";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const seq = [
      { el: line1Ref.current, delay: 200 },
      { el: line2Ref.current, delay: 350 },
      { el: subRef.current, delay: 550 },
      { el: ctaRef.current, delay: 750 },
    ];
    seq.forEach(({ el, delay }) => {
      if (el) {
        setTimeout(() => {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          el.style.filter = "blur(0)";
        }, delay);
      }
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100dvh] items-center overflow-hidden bg-bg-primary"
    >
      {/* Molecular pattern background */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-molecular opacity-60" />
      {/* Radial red accent — top right */}
      <div className="pointer-events-none absolute -top-[20%] -right-[10%] z-0 h-[80%] w-[60%] rounded-full bg-[radial-gradient(ellipse,rgba(233,31,39,0.05)_0%,transparent_70%)]" />

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6 py-24">
        {/* Eyebrow */}
        <p
          ref={line1Ref as React.RefObject<HTMLParagraphElement>}
          className="mb-5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand opacity-0 translate-y-6 blur-sm transition-all duration-800"
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          Insight · Direction · Experience · Advice · Strategies
        </p>

        {/* Headline */}
        <h1
          ref={line2Ref as React.RefObject<HTMLHeadingElement>}
          className="mb-8 max-w-[860px] font-heading text-[clamp(2.8rem,6.5vw,6rem)] font-bold leading-[1.04] tracking-[-0.02em] text-text-primary opacity-0 translate-y-8 blur-sm transition-all duration-900"
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          Architects of{" "}
          <span className="relative inline-block text-brand">
            innovative
            <svg className="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 200 6" preserveAspectRatio="none">
              <path d="M0 3 Q100 0 200 3" stroke="#E91F27" strokeWidth="1.5" fill="none" opacity="0.6" />
            </svg>
          </span>{" "}
          regulatory pathways from molecule to&nbsp;marketplace
        </h1>

        {/* Subtitle */}
        <p
          ref={subRef}
          className="mb-12 max-w-[560px] text-[1.1rem] leading-relaxed text-text-body opacity-0 translate-y-6 blur-sm transition-all duration-800"
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          We transform scientific discoveries into differentiated therapeutics
          — creating regulatory strategies where no precedent or guidance exists.
        </p>

        {/* CTAs */}
        <div
          ref={ctaRef}
          className="flex flex-wrap gap-4 opacity-0 translate-y-6 blur-sm transition-all duration-800"
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          <a href="#contact"
            className="btn-ghost magnetic-btn rounded-sm px-8 py-4 text-sm"
          >
            Start Your Approval Journey
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h11M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>
          <a href="#expertise"
            className="magnetic-btn inline-flex items-center gap-2 rounded-sm border border-border-light bg-white/60 px-8 py-4 text-sm font-medium uppercase tracking-[0.08em] text-text-primary backdrop-blur-sm transition-all hover:border-brand/40 hover:text-brand/80"
          >
            Explore Expertise
          </a>
        </div>
      </div>
    </section>
  );
}
