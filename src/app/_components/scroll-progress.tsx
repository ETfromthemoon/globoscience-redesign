"use client";

import { motion, useScroll } from "motion/react";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[999] h-[2px] origin-left bg-brand"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
