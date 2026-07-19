"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useCallback, useRef } from "react";

export default function ModuleSlider<T extends Record<string, unknown>>({ items, renderItem }: {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
}) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pausedRef = useRef(false);

  const goTo = useCallback((idx: number) => {
    setDirection(idx > active ? 1 : -1);
    setActive(idx);
  }, [active]);

  const next = useCallback(() => {
    setDirection(1);
    setActive((prev) => (prev + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (pausedRef.current) return;
    intervalRef.current = setInterval(next, 4000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [next]);

  return (
    <div
      className="relative"
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      {/* Slide area */}
      <div className="relative overflow-hidden rounded-sm">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={active}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -direction * 30, scale: 1.02 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="glass-dark glass-sheen rounded-sm p-8"
          >
            {renderItem(items[active], active)}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation dots */}
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          onClick={() => goTo(active === 0 ? items.length - 1 : active - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-brand/15 text-brand transition-colors hover:bg-brand/5"
          aria-label="Previous"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M7 3L4 6l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`relative h-2.5 rounded-full transition-all duration-400 ${
              i === active ? "w-8 bg-brand" : "w-2.5 bg-brand/20 hover:bg-brand/40"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          >
            {i === active && (
              <motion.div
                className="absolute inset-0 rounded-full bg-brand"
                layoutId="slider-dot"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}

        <button
          onClick={() => goTo((active + 1) % items.length)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-brand/15 text-brand transition-colors hover:bg-brand/5"
          aria-label="Next"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M5 9L8 6 5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
