"use client";

import { useRef, useEffect } from "react";
import MolecularOrb from "./molecular-orb";

export default function Hero() {
  const line1Ref = useRef<HTMLParagraphElement>(null);
  const line2Ref = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const seq = [
      { el: line1Ref.current, delay: 400 },
      { el: line2Ref.current, delay: 600 },
      { el: subRef.current, delay: 800 },
      { el: ctaRef.current, delay: 1000 },
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
    <section className="relative flex min-h-[100dvh] items-center overflow-hidden bg-bg-primary">
      {/* Radial red accent */}
      <div className="pointer-events-none absolute -top-[20%] -right-[10%] z-[1] h-[80%] w-[60%] rounded-full bg-[radial-gradient(ellipse,rgba(233,31,39,0.03)_0%,transparent_70%)]" />

      <div className="relative z-10 mx-auto grid w-full max-w-[1200px] items-center gap-8 px-6 py-24 lg:grid-cols-[1fr_440px]">
        {/* Left: Text content */}
        <div>
          <p
            ref={line1Ref}
            className="mb-5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand/70 opacity-0 translate-y-6 blur-sm transition-all duration-800"
            style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
          >
            Insight · Direction · Experience · Advice · Strategies
          </p>

          <h1
            ref={line2Ref}
            className="mb-8 max-w-[680px] font-heading text-[clamp(2.6rem,5.5vw,5rem)] font-bold leading-[1.06] tracking-[-0.02em] text-text-primary opacity-0 translate-y-8 blur-sm transition-all duration-900"
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

          <p
            ref={subRef}
            className="mb-10 max-w-[520px] text-[1.05rem] leading-relaxed text-text-body opacity-0 translate-y-6 blur-sm transition-all duration-800"
            style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
          >
            We transform scientific discoveries into differentiated therapeutics — creating regulatory strategies where no precedent or guidance exists.
          </p>

          <div
            ref={ctaRef}
            className="flex flex-wrap gap-4 opacity-0 translate-y-6 blur-sm transition-all duration-800"
            style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
          >
            <a href="#contact" className="btn-ghost magnetic-btn rounded-sm px-8 py-4 text-sm">
              Start Your Approval Journey
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 7h11M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a href="#expertise"
              className="magnetic-btn inline-flex items-center gap-2 rounded-sm border border-border-light bg-white/40 px-8 py-4 text-sm font-medium uppercase tracking-[0.08em] text-text-primary backdrop-blur-sm transition-all hover:border-brand/40 hover:text-brand/80">
              Explore Expertise
            </a>
          </div>
        </div>

        {/* Right: Molecular orb */}
        <div className="hidden lg:flex items-center justify-center">
          <MolecularOrb />
        </div>
      </div>
    </section>
  );
}
