"use client";

import { useMemo, useRef } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";

interface Node3D {
  x: number; y: number; z: number;
  px: number; py: number;
  opacity: number;
}

function generateSphereNodes(count: number, radius: number): Node3D[] {
  const nodes: Node3D[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = phi * i;
    const x3d = Math.cos(theta) * radiusAtY * radius;
    const y3d = y * radius;
    const z3d = Math.sin(theta) * radiusAtY * radius;
    const depth = (z3d + radius) / (2 * radius);
    const px = x3d;
    const py = y3d + z3d * 0.35;
    nodes.push({ x: x3d, y: y3d, z: z3d, px, py, opacity: 0.2 + depth * 0.65 });
  }
  return nodes;
}

function findEdges(nodes: Node3D[], maxDist: number): [number, number][] {
  const edges: [number, number][] = [];
  for (let i = 0; i < nodes.length; i++)
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y, dz = nodes[i].z - nodes[j].z;
      if (Math.sqrt(dx * dx + dy * dy + dz * dz) < maxDist) edges.push([i, j]);
    }
  return edges;
}

export default function MolecularOrb() {
  const { nodes, edges } = useMemo(() => {
    const n = generateSphereNodes(40, 135);
    const e = findEdges(n, 100);
    return { nodes: n, edges: e };
  }, []);

  const CX = 220, CY = 220, SIZE = 440;

  return (
    <div className="pointer-events-none flex items-center justify-center" aria-hidden="true">
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="pulseGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E91F27" stopOpacity="0.15" />
            <stop offset="60%" stopColor="#E91F27" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#E91F27" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Rotating group */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: `${CX}px ${CY}px` }}
        >
          {edges.map(([a, b], i) => (
            <motion.line
              key={`edge-${i}`}
              x1={CX + nodes[a].px} y1={CY + nodes[a].py}
              x2={CX + nodes[b].px} y2={CY + nodes[b].py}
              stroke="#E91F27"
              strokeWidth={0.5}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity: [0, Math.min(nodes[a].opacity, nodes[b].opacity) * 0.3, 0.15, 0.3, 0.15],
              }}
              transition={{
                pathLength: { duration: 1.5, delay: i * 0.025, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 6 + (i % 4), delay: i * 0.02 + 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
              }}
            />
          ))}

          {nodes.map((node, i) => {
            const isGlow = i % 5 === 0;
            const r = isGlow ? 3 : 1.8;
            return (
              <g key={`node-${i}`}>
                {isGlow && (
                  <motion.circle
                    cx={CX + node.px} cy={CY + node.py} r={r + 7}
                    fill="none" stroke="#E91F27" strokeWidth={0.35}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: [0, 0.35, 0.08, 0.35, 0.08], scale: [0.5, 1.3, 0.7, 1.3, 0.7] }}
                    transition={{ duration: 4.5 + (i % 3), delay: i * 0.07 + 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                  />
                )}
                <motion.circle
                  cx={CX + node.px} cy={CY + node.py} r={r}
                  fill="#E91F27"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: isGlow ? [0, node.opacity * 0.7, node.opacity * 0.35, node.opacity * 0.7, node.opacity * 0.35] : node.opacity * 0.4,
                    scale: 1,
                  }}
                  transition={{
                    opacity: { duration: isGlow ? 3.5 + (i % 4) : 0.5, delay: i * 0.04 + 1.3, repeat: isGlow ? Infinity : 0, repeatType: isGlow ? "reverse" : undefined, ease: "easeInOut" },
                    scale: { duration: 0.35, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] },
                  }}
                />
              </g>
            );
          })}
        </motion.g>

        {/* Central pulse waves — outside rotation group, stays centered */}
        <motion.circle cx={CX} cy={CY} r={8} fill="#E91F27"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.5, 0.3, 0.5, 0.3], scale: 1 }}
          transition={{ duration: 0.7, delay: 1.8, ease: [0.22, 1, 0.36, 1], times: undefined }}
        />

        {/* Pulse ring 1 */}
        <motion.circle cx={CX} cy={CY} r={16} fill="none" stroke="#E91F27" strokeWidth={0.7}
          initial={{ opacity: 0, scale: 0.5, pathLength: 0 }}
          animate={{
            opacity: [0, 0.4, 0.1, 0.4, 0.1],
            scale: [0.5, 1.1, 0.9, 1.1, 0.9],
            pathLength: 1,
          }}
          transition={{
            pathLength: { duration: 1, delay: 1.6, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 4, delay: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
            scale: { duration: 4, delay: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
          }}
        />

        {/* Pulse ring 2 */}
        <motion.circle cx={CX} cy={CY} r={50} fill="none" stroke="#E91F27" strokeWidth={0.35}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: [0, 0.2, 0], scale: [0.3, 1.6, 2] }}
          transition={{ duration: 5, delay: 2.5, repeat: Infinity, ease: "easeOut" }}
        />

        {/* Particle 1 — orbiting */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: `${CX}px ${CY}px` }}
        >
          <motion.circle cx={CX + 155} cy={CY} r={2.5} fill="#E91F27"
            animate={{ opacity: [0.15, 0.6, 0.15] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          />
        </motion.g>

        {/* Particle 2 — orbiting opposite direction */}
        <motion.g
          animate={{ rotate: -360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: `${CX}px ${CY}px` }}
        >
          <motion.circle cx={CX + 120} cy={CY} r={2} fill="#E91F27"
            animate={{ opacity: [0.1, 0.5, 0.1] }}
            transition={{ duration: 3, delay: 0.7, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          />
        </motion.g>

        {/* Particle 3 — close orbit */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: `${CX}px ${CY}px` }}
        >
          <motion.circle cx={CX} cy={CY - 90} r={1.8} fill="#E91F27"
            animate={{ opacity: [0.2, 0.7, 0.2] }}
            transition={{ duration: 1.8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          />
        </motion.g>
      </svg>
    </div>
  );
}
