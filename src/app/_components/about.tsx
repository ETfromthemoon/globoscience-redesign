"use client";

import { useRef, useEffect } from "react";
import ImageTilt from "./image-tilt";
import MetricStrip from "./metric-strip";

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); obs.unobserve(e.target); } },
      { threshold: 0.12 }
    );
    [ref.current, imgRef.current].forEach((el) => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <section id="about" className="section-pad relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-molecular opacity-30" />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6">
        <div className="grid items-center gap-24 lg:grid-cols-2">
          <div ref={ref} className="scroll-reveal">
            <span className="eyebrow mb-4">
              Who We Are
            </span>
            <h2 className="heading-2 mb-8">
              The strategic regulatory{" "}
              <span className="whitespace-nowrap text-brand">problem solver</span>{" "}
              and product development partner of&nbsp;choice
            </h2>
            <p className="mb-5 leading-relaxed text-[0.9375rem] text-text-body text-pretty">
              We are a collective of thought leaders — former regulators,
              prescribers, and sponsors — who have been there and done that. Our
              direct access to a network of key opinion leaders, regulators, and
              executives enables success outcomes for our clients.
            </p>
            <p className="mb-10 leading-relaxed text-[0.9375rem] text-text-body text-pretty">
              From the laboratory to the approved product label, our expertise and
              influence extends globally.
            </p>

            <blockquote className="glass-dark glass-sheen relative rounded-sm p-8 shadow-[0_8px_30px_-4px_rgba(43,22,27,0.16)]">
              <svg className="mb-4 opacity-30" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 11H6V7h4V3H3v12h7v-4zm8 0h-4V7h4V3h-7v12h7v-4z" />
              </svg>
              <p className="text-sm leading-relaxed">
                &ldquo;GloboScience is the regulatory problem solver and product
                development consulting partner of choice.&rdquo;
              </p>
              <footer className="mt-4 text-sm font-semibold text-white">
                Lorna L. Langdon{" "}
                <span className="font-normal text-white/40">— Chairwoman</span>
              </footer>
            </blockquote>
          </div>

          <div ref={imgRef} className="scroll-reveal relative">
            <ImageTilt>
              <div className="glass-dark glass-sheen relative overflow-hidden rounded-sm p-3 shadow-[0_8px_30px_-4px_rgba(43,22,27,0.16)]">
                <img src="/assets/Scientist-PNG.png" alt="Scientific visualization" className="relative z-10 w-full rounded-[2px]" loading="lazy" />
              </div>
            </ImageTilt>
            <div className="pointer-events-none absolute -top-4 -right-4 -bottom-4 -left-4 rounded-md border-2 border-brand/8" />
            <div className="pointer-events-none absolute -top-6 -right-6 -bottom-6 -left-6 rounded-lg border border-brand/5" />
          </div>
        </div>

        {/* Metrics — mini franja con derretido líquido */}
        <div className="mx-auto mt-20 max-w-[680px]">
          <MetricStrip />
        </div>
      </div>
    </section>
  );
}
