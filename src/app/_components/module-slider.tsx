"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useCallback, useRef } from "react";

export default function ModuleSlider<T extends Record<string, unknown>>({
  items,
  renderItem,
}: {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
}) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pausedRef = useRef(false);

  const goTo = useCallback(
    (idx: number) => {
      setDirection(idx > active ? 1 : -1);
      setActive(idx);
    },
    [active],
  );

  const next = useCallback(() => {
    setDirection(1);
    setActive((prev) => (prev + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (!pausedRef.current) next();
    }, 4000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [next]);

  const prevIdx = active === 0 ? items.length - 1 : active - 1;
  const nextIdx = (active + 1) % items.length;

  return (
    <div
      className="relative mx-auto max-w-4xl"
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      {/* 4F — Focus + Preview */}
      <div className="relative flex items-center gap-4">
        {/* Left preview (30% peek) */}
        <div className="hidden lg:block w-[22%] -mr-6 z-0">
          <div
            className="glass-light cursor-pointer rounded-sm p-5 opacity-40 scale-90 blur-[1px] transition-all duration-500 hover:opacity-60"
            onClick={() => goTo(prevIdx)}
          >
            {renderItem(items[prevIdx], prevIdx)}
          </div>
        </div>

        {/* Center — active card */}
        <div className="relative z-10 flex-1 overflow-hidden rounded-sm">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={active}
              custom={direction}
              initial={{ opacity: 0, x: direction * 30, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -direction * 20, scale: 1.01 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="glass-light glass-sheen flex min-h-[280px] items-center justify-center rounded-sm px-8 py-10 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)]"
            >
              {renderItem(items[active], active)}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right preview (30% peek) */}
        <div className="hidden lg:block w-[22%] -ml-6 z-0">
          <div
            className="glass-light cursor-pointer rounded-sm p-5 opacity-40 scale-90 blur-[1px] transition-all duration-500 hover:opacity-60"
            onClick={() => goTo(nextIdx)}
          >
            {renderItem(items[nextIdx], nextIdx)}
          </div>
        </div>
      </div>

      {/* Navigation dots */}
      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          onClick={() => goTo(prevIdx)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border-light text-text-body transition-all hover:border-brand hover:text-brand"
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
            className={`relative h-2 rounded-full transition-all duration-400 ${
              i === active ? "w-7 bg-brand" : "w-2 bg-border-light hover:bg-brand/30"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          >
            {i === active && (
              <motion.div
                className="absolute inset-0 rounded-full bg-brand"
                layoutId="active-dot"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}

        <button
          onClick={() => goTo(nextIdx)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border-light text-text-body transition-all hover:border-brand hover:text-brand"
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
