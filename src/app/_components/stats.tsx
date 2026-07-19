"use client";

import { useRef, useEffect, useState } from "react";

const STATS = [
  { value: 4000, label: "Health Authority Meetings" },
  { value: 2000, label: "Therapeutic Programs" },
  { value: 100, label: "Countries Reached" },
  { value: 10, label: "Fastest FDA Approvals" },
];

function Counter({ target, inView }: { target: number; inView: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!inView || !ref.current) return;
    let raf = 0;
    const start = performance.now();
    const duration = 2000;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      ref.current!.textContent = Math.round(eased * target).toLocaleString();
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  return <span ref={ref}>0</span>;
}

export default function StatsStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative border-b border-border-light bg-bg-alt py-16"
    >
      <div className="absolute inset-0 bg-dots opacity-50 pointer-events-none" />
      <div className="relative z-10 mx-auto flex max-w-[1200px] flex-wrap items-center justify-around gap-8 px-6">
        {STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center text-center">
            <div className="font-heading text-[clamp(2.6rem,5vw,4.2rem)] font-bold leading-none text-brand">
              {stat.value === 10 ? (
                <>
                  10
                  <span className="ml-1 align-middle text-[0.3em] font-medium tracking-normal">Fastest</span>
                </>
              ) : (
                <>
                  <Counter target={stat.value} inView={inView} />
                  <span className="text-[0.45em] align-super font-bold">+</span>
                </>
              )}
            </div>
            <p className="mt-2 max-w-[180px] text-[0.8rem] font-medium text-text-body">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}


