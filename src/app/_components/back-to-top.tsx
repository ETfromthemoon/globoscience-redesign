"use client";

import { motion, useAnimation } from "motion/react";

export default function BackToTop() {
  const controls = useAnimation();

  if (typeof window === "undefined") return null;

  const checkScroll = () => {
    if (window.scrollY > 500) controls.start({ opacity: 1, y: 0 });
    else controls.start({ opacity: 0, y: 16 });
  };

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", checkScroll, { passive: true });
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={controls}
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-border-light bg-white/80 shadow-lg backdrop-blur-md transition-colors hover:border-brand hover:text-brand"
      aria-label="Back to top"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M3 9L7 5l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.button>
  );
}
