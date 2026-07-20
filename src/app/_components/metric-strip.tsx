"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

const METRICS = [
  { value: 4000, suffix: "+", label: "Health Authority Meetings" },
  { value: 2000, suffix: "+", label: "Therapeutic Programs" },
  { value: 100, suffix: "+", label: "Countries Reached" },
  { value: 10, suffix: "×", label: "Fastest FDA Approvals" },
];

const CYCLE_MS = 4000;   // permanencia de cada métrica
const MELT_MS = 950;     // duración del derretido
const COUNT_MS = 2000;   // count-up inicial de la primera métrica

/** Posiciones (en %) de las gotas que caen durante el derretido */
const DRIPS = [18, 46, 71];

function formatValue(v: number) {
  return v.toLocaleString("en-US");
}

/** Count-up de la primera aparición */
function CountUp({ target, play }: { target: number; play: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!play || !ref.current) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / COUNT_MS, 1);
      ref.current!.textContent = formatValue(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play, target]);
  return <span ref={ref}>0</span>;
}

export default function MetricStrip() {
  const prefersReduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const [inView, setInView] = useState(false);
  const [active, setActive] = useState(0);
  const [melting, setMelting] = useState(false);
  const [hasCycled, setHasCycled] = useState(false);

  /* Arranca el count-up al entrar en viewport */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* Ciclo: espera el count-up inicial, luego derrite cada CYCLE_MS */
  useEffect(() => {
    if (!inView) return;
    let meltTimer: ReturnType<typeof setTimeout>;
    const interval = setInterval(() => {
      if (pausedRef.current) return;
      setHasCycled(true);
      if (!prefersReduced) {
        setMelting(true);
        meltTimer = setTimeout(() => setMelting(false), MELT_MS);
      }
      setActive((cur) => (cur + 1) % METRICS.length);
    }, CYCLE_MS + (hasCycled ? 0 : COUNT_MS * 0.4));
    return () => { clearInterval(interval); clearTimeout(meltTimer); };
  }, [inView, prefersReduced, hasCycled]);

  const goTo = (i: number) => {
    if (i === active) return;
    setHasCycled(true);
    if (!prefersReduced) {
      setMelting(true);
      setTimeout(() => setMelting(false), MELT_MS);
    }
    setActive(i);
  };

  const m = METRICS[active];
  const showCountUp = active === 0 && !hasCycled;

  return (
    <div
      ref={rootRef}
      className="glass-light glass-sheen relative flex items-center gap-5 rounded-sm px-6 py-5 sm:px-8"
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      {/* Filtro gooey — funde los trazos en líquido durante la transición */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <filter id="kpi-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
            <feColorMatrix
              in="blur" mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Ventana de la métrica */}
      <div className="relative h-[60px] flex-1 overflow-hidden sm:h-[56px]">
        <div
          className="absolute inset-0"
          style={{ filter: melting && !prefersReduced ? "url(#kpi-goo)" : undefined }}
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={active}
              className="absolute inset-0 flex flex-col justify-center gap-x-4 gap-y-0.5 sm:flex-row sm:items-baseline sm:justify-start"
              style={{ transformOrigin: "50% 100%" }}
              initial={prefersReduced ? { opacity: 0 } : { y: -34, scaleY: 0.4, opacity: 0 }}
              animate={
                prefersReduced
                  ? { opacity: 1, transition: { duration: 0.4 } }
                  : { y: 0, scaleY: 1, opacity: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.22 } }
              }
              exit={
                prefersReduced
                  ? { opacity: 0, transition: { duration: 0.3 } }
                  : { y: 38, scaleY: 0.18, opacity: 0, transition: { duration: 0.8, ease: [0.55, 0, 0.68, 0.19] } }
              }
            >
              <span className="font-heading text-[1.7rem] font-bold leading-none text-brand sm:text-[2rem]">
                {showCountUp ? <CountUp target={m.value} play={inView} /> : formatValue(m.value)}
                <span className="align-super text-[0.55em] font-bold">{m.suffix}</span>
              </span>
              <span className="text-[0.8rem] font-medium leading-tight text-text-body sm:text-sm">
                {m.label}
              </span>

              {/* Gotas que caen al derretirse — el goo las funde con el texto */}
              {!prefersReduced &&
                DRIPS.map((left, i) => (
                  <motion.span
                    key={`drip-${i}`}
                    className="pointer-events-none absolute top-1/2 h-2.5 w-2.5 rounded-full bg-brand"
                    style={{ left: `${left}%` }}
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 0 }}
                    exit={{
                      opacity: [1, 1, 0],
                      y: [0, 26, 52],
                      scale: [1, 0.85, 0.5],
                      transition: { duration: 0.85, delay: i * 0.09, ease: [0.55, 0, 0.68, 0.19] },
                    }}
                  />
                ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Indicador de progreso */}
      <div className="flex items-center gap-1.5" role="tablist" aria-label="Metrics">
        {METRICS.map((metric, i) => (
          <button
            key={metric.label}
            onClick={() => goTo(i)}
            className="group/kpi flex h-7 w-4 items-center justify-center"
            role="tab"
            aria-selected={i === active}
            aria-label={metric.label}
          >
            <span
              className={`rounded-full transition-all duration-400 ${
                i === active
                  ? "h-[18px] w-[4px] bg-brand shadow-[0_0_8px_rgba(233,31,39,0.35)]"
                  : "h-[6px] w-[4px] bg-brand/15 group-hover/kpi:bg-brand/35"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
