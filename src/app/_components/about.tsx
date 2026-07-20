"use client";

import { useRef, useEffect, useState } from "react";
import ImageTilt from "./image-tilt";

const METRICS = [
  { value: 4000, suffix: "+", label: "Health Authority Meetings" },
  { value: 2000, suffix: "+", label: "Therapeutic Programs" },
  { value: 100, suffix: "+", label: "Countries Reached" },
  { value: 10, suffix: "×", label: "Fastest FDA Approvals" },
];

function Counter({ target, inView }: { target: number; inView: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!inView || !ref.current) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / 2000, 1);
      ref.current!.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target).toLocaleString();
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);
  return <span ref={ref}>0</span>;
}

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const [metricsInView, setMetricsInView] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); obs.unobserve(e.target); } },
      { threshold: 0.12 }
    );
    [ref.current, imgRef.current].forEach((el) => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const el = document.getElementById("metrics-trigger");
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setMetricsInView(true); obs.disconnect(); } },
      { threshold: 0.5 }
    );
    obs.observe(el);
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

            <blockquote className="glass-dark glass-sheen relative rounded-sm p-8 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)]">
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
              <div className="glass-dark glass-sheen relative overflow-hidden rounded-sm p-3 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)]">
                <img src="/assets/Scientist-PNG.png" alt="Scientific visualization" className="relative z-10 w-full rounded-[2px]" loading="lazy" />
              </div>
            </ImageTilt>
            <div className="pointer-events-none absolute -top-4 -right-4 -bottom-4 -left-4 rounded-md border-2 border-brand/8" />
            <div className="pointer-events-none absolute -top-6 -right-6 -bottom-6 -left-6 rounded-lg border border-brand/5" />
          </div>
        </div>

        {/* Metrics — floating pills below the grid */}
        <div id="metrics-trigger" className="mt-24">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {METRICS.map((m) => (
              <div key={m.label} className="glass-light rounded-sm px-5 py-6 text-center transition-all duration-400 hover:-translate-y-1 hover:border-brand/10">
                <div className="font-heading text-[clamp(2rem,3vw,3rem)] font-bold leading-none text-brand">
                  <Counter target={m.value} inView={metricsInView} />
                  <span className="text-[0.45em] align-super font-bold">{m.suffix}</span>
                </div>
                <p className="mt-2 text-[0.75rem] font-medium leading-tight text-text-body">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
