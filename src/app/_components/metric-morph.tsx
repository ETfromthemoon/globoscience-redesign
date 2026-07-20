"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

const METRICS = [
  { display: "4,000", suffix: "+", label: "Health Authority Meetings" },
  { display: "2,000", suffix: "+", label: "Therapeutic Programs" },
  { display: "100", suffix: "+", label: "Countries Reached" },
  { display: "10", suffix: "×", label: "Fastest FDA Approvals" },
];

const CYCLE_MS = 4000;

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const EASE_IN = [0.55, 0, 0.68, 0.19] as const;

/** Un carril de carácter: si el char no cambia entre métricas, no se anima;
 *  si cambia, el viejo rueda hacia abajo y el nuevo entra desde arriba (odómetro). */
function CharSlot({ char, slow }: { char: string; slow: boolean }) {
  return (
    <motion.span
      layout
      className="relative inline-flex h-[1em] items-baseline overflow-hidden"
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: "auto", opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: slow ? 0 : 0.45, ease: EASE_OUT }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={char}
          className="inline-block leading-none"
          initial={{ y: "-105%", opacity: 0, filter: "blur(5px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "105%", opacity: 0, filter: "blur(5px)" }}
          transition={{ duration: slow ? 0 : 0.62, ease: EASE_OUT }}
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}

/** Número con morph por carácter, alineado desde la derecha:
 *  4,000 → 2,000 solo transforma el 4; los «,000» permanecen inmóviles. */
function MorphNumber({ text, suffix, slow }: { text: string; suffix: string; slow: boolean }) {
  const chars = text.split("");
  return (
    <span
      className="inline-flex items-baseline font-heading text-[2rem] font-bold leading-none text-brand sm:text-[2.4rem]"
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {chars.map((ch, i) => {
          const slotFromRight = chars.length - i;
          return <CharSlot key={`slot-${slotFromRight}`} char={ch} slow={slow} />;
        })}
      </AnimatePresence>
      <span className="relative ml-0.5 inline-flex h-[0.62em] w-[0.62em] items-baseline self-start overflow-hidden text-[0.58em]">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={suffix}
            className="inline-block leading-none"
            initial={{ y: "-105%", opacity: 0, filter: "blur(4px)" }}
            animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
            exit={{ y: "105%", opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: slow ? 0 : 0.62, ease: EASE_OUT }}
          >
            {suffix}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}

/** Label que muta palabra a palabra en cascada */
function MorphLabel({ label, slow }: { label: string; slow: boolean }) {
  return (
    <span className="relative block h-[2.6em] overflow-hidden sm:h-[1.4em]">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={label}
          className="absolute inset-0 flex flex-wrap content-center items-center gap-x-[0.35em]"
          initial="hidden"
          animate="show"
          exit="exit"
          variants={{
            show: { transition: { staggerChildren: slow ? 0 : 0.07, delayChildren: slow ? 0 : 0.18 } },
            exit: { transition: { staggerChildren: slow ? 0 : 0.05 } },
          }}
        >
          {label.split(" ").map((word, i) => (
            <motion.span
              key={`${word}-${i}`}
              className="inline-block"
              variants={{
                hidden: { y: 15, opacity: 0, filter: "blur(6px)" },
                show: { y: 0, opacity: 1, filter: "blur(0px)", transition: { duration: slow ? 0 : 0.55, ease: EASE_OUT } },
                exit: { y: -13, opacity: 0, filter: "blur(6px)", transition: { duration: slow ? 0 : 0.34, ease: EASE_IN } },
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function MetricMorph() {
  const prefersReduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const [inView, setInView] = useState(false);
  const [active, setActive] = useState(0);

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

  useEffect(() => {
    if (!inView) return;
    const interval = setInterval(() => {
      if (!pausedRef.current) setActive((cur) => (cur + 1) % METRICS.length);
    }, CYCLE_MS);
    return () => clearInterval(interval);
  }, [inView]);

  const m = METRICS[active];
  const slow = !!prefersReduced;

  return (
    <div
      ref={rootRef}
      className="glass-light glass-sheen relative flex items-center gap-5 rounded-sm px-6 py-5 sm:px-8"
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
        <MorphNumber text={m.display} suffix={m.suffix} slow={slow} />
        <span className="flex-1 text-[0.8rem] font-medium text-text-body sm:text-sm">
          <MorphLabel label={m.label} slow={slow} />
        </span>
      </div>

      {/* Indicador de progreso */}
      <div className="flex items-center gap-1.5" role="tablist" aria-label="Metrics">
        {METRICS.map((metric, i) => (
          <button
            key={metric.label}
            onClick={() => setActive(i)}
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
