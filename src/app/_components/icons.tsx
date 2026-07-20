"use client";

import { motion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;
const EASE_INOUT = "easeInOut" as const; 

const drawVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (delay: number) => ({
    pathLength: 1, opacity: 1,
    transition: { duration: 0.55, delay, ease: EASE },
  }),
};

const glowVariants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: {
    opacity: [0, 0.6, 0.15, 0.5, 0.1],
    scale: [0.6, 1.15, 0.95, 1.1, 1],
    transition: { duration: 2.8, delay: 0.7, ease: EASE_INOUT },
  },
};

const dotVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (delay: number) => ({
    scale: 1, opacity: 1,
    transition: { duration: 0.35, delay: delay + 0.3, ease: EASE },
  }),
};

interface IconWrapperProps { children: React.ReactNode; delay?: number }

export function IconWrapper({ children, delay = 0 }: IconWrapperProps) {
  return (
    <motion.div
      className="relative text-brand"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-6% 0px" }}
      custom={delay}
    >
      {/* Glow ring behind */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-full"
        variants={glowVariants}
        style={{
          background: "radial-gradient(circle, rgba(233,31,39,0.15) 0%, transparent 70%)",
          filter: "blur(4px)",
          transform: "scale(2)",
        }}
      />
      {children}
    </motion.div>
  );
}

export function CellIcon({ delay = 0 }: { delay?: number }) {
  return (
    <IconWrapper delay={delay}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <motion.circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.5" variants={drawVariants} custom={delay} />
        <motion.circle cx="16" cy="16" r="5" stroke="currentColor" strokeWidth="1.2" variants={drawVariants} custom={delay + 0.1} />
        <motion.circle cx="16" cy="16" r="1.5" fill="currentColor" variants={dotVariants} custom={delay + 0.2} />
      </svg>
    </IconWrapper>
  );
}

export function GeneIcon({ delay = 0 }: { delay?: number }) {
  return (
    <IconWrapper delay={delay}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <motion.path d="M6 16 Q16 4 26 16 Q16 28 6 16Z" stroke="currentColor" strokeWidth="1.5" variants={drawVariants} custom={delay} />
        <motion.circle cx="16" cy="16" r="1.8" fill="currentColor" variants={dotVariants} custom={delay + 0.15} />
      </svg>
    </IconWrapper>
  );
}

export function RareIcon({ delay = 0 }: { delay?: number }) {
  return (
    <IconWrapper delay={delay}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <motion.rect x="4" y="4" width="24" height="24" rx="4" stroke="currentColor" strokeWidth="1.5" variants={drawVariants} custom={delay} />
        <motion.circle cx="16" cy="16" r="6" stroke="currentColor" strokeWidth="1.2" variants={drawVariants} custom={delay + 0.1} />
        <motion.line x1="16" y1="10" x2="16" y2="22" stroke="currentColor" strokeWidth="1" variants={drawVariants} custom={delay + 0.15} />
        <motion.line x1="10" y1="16" x2="22" y2="16" stroke="currentColor" strokeWidth="1" variants={drawVariants} custom={delay + 0.2} />
      </svg>
    </IconWrapper>
  );
}

export function ImmunoIcon({ delay = 0 }: { delay?: number }) {
  return (
    <IconWrapper delay={delay}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <motion.path d="M16 4L20 12L28 14L20 20L22 28L16 24L10 28L12 20L4 14L12 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" variants={drawVariants} custom={delay} />
        <motion.circle cx="16" cy="16" r="3" stroke="currentColor" strokeWidth="1" variants={drawVariants} custom={delay + 0.15} />
      </svg>
    </IconWrapper>
  );
}

export function TissueIcon({ delay = 0 }: { delay?: number }) {
  return (
    <IconWrapper delay={delay}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <motion.rect x="6" y="6" width="20" height="20" rx="6" stroke="currentColor" strokeWidth="1.5" variants={drawVariants} custom={delay} />
        <motion.circle cx="13" cy="13" r="3" stroke="currentColor" strokeWidth="1" variants={drawVariants} custom={delay + 0.1} />
        <motion.circle cx="19" cy="19" r="3" stroke="currentColor" strokeWidth="1" variants={drawVariants} custom={delay + 0.15} />
        <motion.circle cx="19" cy="13" r="3" stroke="currentColor" strokeWidth="1" variants={drawVariants} custom={delay + 0.2} />
      </svg>
    </IconWrapper>
  );
}

export function DrugIcon({ delay = 0 }: { delay?: number }) {
  return (
    <IconWrapper delay={delay}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <motion.path d="M8 24L24 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" variants={drawVariants} custom={delay} />
        <motion.circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" variants={drawVariants} custom={delay + 0.08} />
        <motion.circle cx="20" cy="20" r="5" stroke="currentColor" strokeWidth="1.5" variants={drawVariants} custom={delay + 0.12} />
        <motion.circle cx="12" cy="12" r="2" fill="currentColor" variants={dotVariants} custom={delay + 0.2} />
        <motion.circle cx="20" cy="20" r="2" fill="currentColor" variants={dotVariants} custom={delay + 0.25} />
      </svg>
    </IconWrapper>
  );
}

export function BiologicsIcon({ delay = 0 }: { delay?: number }) {
  return (
    <IconWrapper delay={delay}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <motion.path d="M16 4C9.4 4 4 9.4 4 16s5.4 12 12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" variants={drawVariants} custom={delay} />
        <motion.path d="M16 4c6.6 0 12 5.4 12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 2" variants={drawVariants} custom={delay + 0.1} />
        <motion.line x1="16" y1="4" x2="16" y2="28" stroke="currentColor" strokeWidth="1" variants={drawVariants} custom={delay + 0.15} />
        <motion.circle cx="16" cy="16" r="2" fill="currentColor" variants={dotVariants} custom={delay + 0.2} />
      </svg>
    </IconWrapper>
  );
}

export function DeviceIcon({ delay = 0 }: { delay?: number }) {
  return (
    <IconWrapper delay={delay}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <motion.rect x="6" y="8" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" variants={drawVariants} custom={delay} />
        <motion.circle cx="16" cy="16" r="4" stroke="currentColor" strokeWidth="1.2" variants={drawVariants} custom={delay + 0.1} />
        <motion.line x1="16" y1="12" x2="16" y2="20" stroke="currentColor" strokeWidth="1" variants={drawVariants} custom={delay + 0.15} />
        <motion.line x1="12" y1="16" x2="20" y2="16" stroke="currentColor" strokeWidth="1" variants={drawVariants} custom={delay + 0.18} />
      </svg>
    </IconWrapper>
  );
}

export function ComboIcon({ delay = 0 }: { delay?: number }) {
  return (
    <IconWrapper delay={delay}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <motion.circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" variants={drawVariants} custom={delay} />
        <motion.circle cx="21" cy="21" r="7" stroke="currentColor" strokeWidth="1.5" variants={drawVariants} custom={delay + 0.08} />
        <motion.line x1="14" y1="14" x2="18" y2="18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" variants={drawVariants} custom={delay + 0.14} />
        <motion.circle cx="11" cy="11" r="1.5" fill="currentColor" variants={dotVariants} custom={delay + 0.18} />
        <motion.circle cx="21" cy="21" r="1.5" fill="currentColor" variants={dotVariants} custom={delay + 0.22} />
      </svg>
    </IconWrapper>
  );
}
