"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

interface AnimatedIconProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function AnimatedIcon({ children, className, delay = 0 }: AnimatedIconProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });

  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
          delay,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/** Path-drawing animation wrapper for SVG stroke elements */
export function PathDraw({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.g
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ staggerChildren: 0.15, delayChildren: delay }}
    >
      {children}
    </motion.g>
  );
}

/** Individual path that draws itself */
export function AnimatedPath({
  d,
  className,
}: {
  d: string;
  className?: string;
}) {
  return (
    <motion.path
      d={d}
      className={className}
      variants={{
        hidden: { pathLength: 0, opacity: 0 },
        visible: { pathLength: 1, opacity: 1 },
      }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

/** Animated circle with path drawing */
export function AnimatedCircle({
  cx,
  cy,
  r,
  className,
}: {
  cx: number;
  cy: number;
  r: number;
  className?: string;
}) {
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={r}
      className={className}
      variants={{
        hidden: { pathLength: 0, opacity: 0 },
        visible: { pathLength: 1, opacity: 1 },
      }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

/** Animated line with path drawing */
export function AnimatedLine({
  x1,
  y1,
  x2,
  y2,
  className,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  className?: string;
}) {
  return (
    <motion.line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      className={className}
      variants={{
        hidden: { pathLength: 0, opacity: 0 },
        visible: { pathLength: 1, opacity: 1 },
      }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}
