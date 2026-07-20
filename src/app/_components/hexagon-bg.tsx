"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface Hexagon {
  id: number;
  cx: number;
  cy: number;
  r: number;
  delay: number;
  glow: boolean;
}

function generateHexagons(cols: number, rows: number, size: number, gap: number): Hexagon[] {
  const hexagons: Hexagon[] = [];
  const hStep = size * 1.8 + gap;
  const vStep = size * 1.6 + gap;
  let id = 0;

  for (let row = 0; row < rows; row++) {
    const offsetX = row % 2 === 0 ? 0 : hStep / 2;
    for (let col = 0; col < cols; col++) {
      const cx = offsetX + col * hStep + size;
      const cy = row * vStep + size;
      // Skip some hexagons for a sparse, organic feel
      if (Math.random() < 0.35) continue;
      hexagons.push({
        id: id++,
        cx,
        cy,
        r: size,
        delay: Math.random() * 2.5,
        glow: Math.random() < 0.18,
      });
    }
  }
  return hexagons;
}

function hexPath(cx: number, cy: number, r: number): string {
  const points: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return `M${points.join("L")}Z`;
}

export default function HexagonBackground() {
  const [hexagons, setHexagons] = useState<Hexagon[]>([]);
  const [viewport, setViewport] = useState({ w: 1200, h: 800 });

  useEffect(() => {
    setViewport({ w: window.innerWidth, h: window.innerHeight });
    const cols = Math.ceil(window.innerWidth / 100) + 2;
    const rows = Math.ceil(window.innerHeight / 85) + 2;
    setHexagons(generateHexagons(cols, rows, 42, 6));

    const onResize = () => {
      setViewport({ w: window.innerWidth, h: window.innerHeight });
      const c = Math.ceil(window.innerWidth / 100) + 2;
      const r = Math.ceil(window.innerHeight / 85) + 2;
      setHexagons(generateHexagons(c, r, 42, 6));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${viewport.w} ${viewport.h}`}
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-50"
      >
        {/* Connecting lines between nearby hexagons */}
        <g stroke="#E91F27" strokeWidth="0.4" opacity="0.25">
          {hexagons.map((h, i) => {
            // Find nearest hexagon to the right
            const nearby = hexagons.find(
              (h2) =>
                h2.id !== h.id &&
                Math.abs(h2.cx - h.cx) < 120 &&
                Math.abs(h2.cy - h.cy) < 40 &&
                h2.cx > h.cx,
            );
            if (!nearby) return null;
            return (
              <motion.line
                key={`line-${i}`}
                x1={h.cx}
                y1={h.cy}
                x2={nearby.cx}
                y2={nearby.cy}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.3 }}
                transition={{
                  duration: 1.2,
                  delay: h.delay * 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            );
          })}
        </g>

        {/* Hexagons */}
        {hexagons.map((h) => (
          <g key={h.id}>
            {/* Main hexagon path */}
            <motion.path
              d={hexPath(h.cx, h.cy, h.r)}
              fill="none"
              stroke="#E91F27"
              strokeWidth={h.glow ? 1 : 0.5}
              opacity={h.glow ? 0.35 : 0.15}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity: h.glow ? [0, 0.35, 0.15, 0.35, 0.15] : 0.15,
              }}
              transition={{
                pathLength: { duration: 1, delay: h.delay * 0.3, ease: [0.22, 1, 0.36, 1] },
                opacity: h.glow
                  ? { duration: 4, delay: h.delay * 0.3, repeat: Infinity, repeatType: "reverse" }
                  : { duration: 0.8, delay: h.delay * 0.3 },
              }}
            />

            {/* Glow hexagons get an inner filled circle */}
            {h.glow && (
              <motion.circle
                cx={h.cx}
                cy={h.cy}
                r={h.r * 0.3}
                fill="#E91F27"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 0.25, 0.08, 0.25, 0.08], scale: [0, 1.1, 1, 1.1, 1] }}
                transition={{
                  duration: 6,
                  delay: h.delay * 0.4,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              />
            )}

            {/* Center dot for all hexagons */}
            <motion.circle
              cx={h.cx}
              cy={h.cy}
              r={1.2}
              fill="#E91F27"
              initial={{ opacity: 0 }}
              animate={{ opacity: h.glow ? 0.6 : 0.2 }}
              transition={{ duration: 0.6, delay: h.delay * 0.5 + 1 }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
