"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

const STATS = [
  { value: 4000, suffix: "+", label: "Health Authority Meetings" },
  { value: 2000, suffix: "+", label: "Therapeutic Programs" },
  { value: 100, suffix: "+", label: "Countries Reached" },
  { value: 10, suffix: "", prefix: "", label: "Fastest FDA Approvals", special: true },
];

function StatItem({
  value,
  suffix,
  label,
  special,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  special?: boolean;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const, delay }}
      className="flex flex-col items-center text-center"
    >
      <div className="font-heading text-[clamp(2.4rem,4.5vw,4rem)] font-bold leading-none text-brand">
        {special ? (
          <>
            {value}
            <span className="align-middle text-[0.35em] font-medium">
              {" "}
              Fastest
            </span>
          </>
        ) : (
          <>
            <AnimatedCounter target={value} inView={inView} />
            <span className="text-[0.5em] align-super">{suffix}</span>
          </>
        )}
      </div>
      <p className="mt-2 max-w-[180px] text-sm font-medium text-text-body">
        {label}
      </p>
    </motion.div>
  );
}

function AnimatedCounter({ target, inView }: { target: number; inView: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);

  if (!inView) return <span ref={ref}>0</span>;

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <CountUp target={target} />
    </motion.span>
  );
}

function CountUp({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  if (typeof window === "undefined") return <span ref={ref}>{target}</span>;

  let raf = 0;
  const start = performance.now();
  const duration = 1800;

  function tick(now: number) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    if (ref.current) ref.current.textContent = current.toLocaleString();
    if (progress < 1) raf = requestAnimationFrame(tick);
  }

  raf = requestAnimationFrame(tick);

  const cleanup = () => cancelAnimationFrame(raf);
  setTimeout(cleanup, duration + 100);

  return <span ref={ref}>0</span>;
}

export default function StatsStrip() {
  return (
    <section className="border-b border-border-light bg-bg-alt py-14">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-around gap-8 px-6">
        {STATS.map((stat, i) => (
          <StatItem key={stat.label} {...stat} delay={i * 0.08} />
        ))}
      </div>
    </section>
  );
}
