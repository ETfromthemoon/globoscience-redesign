"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "motion/react";

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
    nodes.push({ x: x3d, y: y3d, z: z3d, px, py, opacity: 0.18 + depth * 0.7 });
  }
  return nodes;
}

function findEdges(nodes: Node3D[], maxDist: number): [number, number][] {
  const edges: [number, number][] = [];
  for (let i = 0; i < nodes.length; i++)
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dz = nodes[i].z - nodes[j].z;
      if (Math.sqrt(dx * dx + dy * dy + dz * dz) < maxDist) edges.push([i, j]);
    }
  return edges;
}

export default function MolecularOrb() {
  const [phase, setPhase] = useState<"building" | "rotating">("building");

  const { nodes, edges } = useMemo(() => {
    const n = generateSphereNodes(55, 190);
    const e = findEdges(n, 130);
    return { nodes: n, edges: e };
  }, []);

  const CX = 280, CY = 280, SIZE = 560;

  const totalDrawTime = 3.8;
  const edgeDelayStep = totalDrawTime / edges.length;
  const nodeAppearStart = totalDrawTime * 0.25;

  useEffect(() => {
    const timer = setTimeout(() => setPhase("rotating"), totalDrawTime * 1000 + 800);
    return () => clearTimeout(timer);
  }, [totalDrawTime]);

  const edgeOpacityBase = (a: number, b: number) =>
    Math.min(nodes[a].opacity, nodes[b].opacity);

  return (
    <div className="pointer-events-none flex items-center justify-center" aria-hidden="true">
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E91F27" stopOpacity="0.25" />
            <stop offset="30%" stopColor="#E91F27" stopOpacity="0.08" />
            <stop offset="70%" stopColor="#E91F27" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#E91F27" stopOpacity="0" />
          </radialGradient>
          <filter id="lineGlow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="nodeGlow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient core glow */}
        <motion.circle
          cx={CX} cy={CY} r={140}
          fill="url(#coreGlow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.7, 1] }}
          transition={{ duration: 2, delay: 0.6, ease: "easeOut", times: [0, 0.5, 0.75, 1] }}
        />

        {/* Main rotating group */}
        <motion.g
          animate={phase === "rotating" ? { rotate: 360 } : { rotate: 0 }}
          transition={
            phase === "rotating"
              ? { duration: 50, repeat: Infinity, ease: "linear" }
              : { duration: 0 }
          }
          style={{ transformOrigin: `${CX}px ${CY}px` }}
        >
          {/* EDGES — draw one by one */}
          {edges.map(([a, b], i) => {
            const baseOp = edgeOpacityBase(a, b);
            return (
              <motion.line
                key={`edge-${i}`}
                x1={CX + nodes[a].px} y1={CY + nodes[a].py}
                x2={CX + nodes[b].px} y2={CY + nodes[b].py}
                stroke="#E91F27"
                strokeWidth={0.9}
                strokeLinecap="round"
                filter="url(#lineGlow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: 1,
                  opacity:
                    phase === "building"
                      ? [0, baseOp * 0.5, baseOp * 0.35]
                      : [baseOp * 0.35, baseOp * 0.55, baseOp * 0.25, baseOp * 0.5, baseOp * 0.3],
                }}
                transition={{
                  pathLength: {
                    duration: 0.5,
                    delay: i * edgeDelayStep,
                    ease: [0.22, 1, 0.36, 1],
                  },
                  opacity: {
                    duration: phase === "building" ? 0.6 : 4 + (i % 5),
                    delay: phase === "building" ? i * edgeDelayStep : i * 0.03,
                    repeat: phase === "building" ? 0 : Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  },
                }}
              />
            );
          })}

          {/* NODES — appear as their lines connect */}
          {nodes.map((node, i) => {
            const isMajor = i % 4 === 0;
            const r = isMajor ? 3.5 : 2;
            const appearDelay = nodeAppearStart + i * (totalDrawTime * 0.6 / nodes.length);
            return (
              <g key={`node-${i}`}>
                {/* Halo ring for major nodes */}
                {isMajor && (
                  <motion.circle
                    cx={CX + node.px} cy={CY + node.py} r={r + 9}
                    fill="none" stroke="#E91F27" strokeWidth={0.5}
                    filter="url(#nodeGlow)"
                    initial={{ opacity: 0, scale: 0.3 }}
                    animate={{
                      opacity: [0, 0.4, 0.1, 0.4, 0.1],
                      scale: [0.3, 1.4, 0.8, 1.4, 0.8],
                    }}
                    transition={{
                      opacity: { duration: 4 + (i % 3), delay: appearDelay + 0.4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
                      scale: { duration: 4 + (i % 3), delay: appearDelay + 0.4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
                    }}
                  />
                )}
                {/* Node dot */}
                <motion.circle
                  cx={CX + node.px} cy={CY + node.py} r={r}
                  fill="#E91F27"
                  filter={isMajor ? "url(#nodeGlow)" : undefined}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: isMajor
                      ? [node.opacity * 0.75, node.opacity * 0.4, node.opacity * 0.7]
                      : node.opacity * 0.45,
                    scale: 1,
                  }}
                  transition={{
                    opacity: {
                      duration: isMajor ? 3 + (i % 4) : 0.4,
                      delay: appearDelay,
                      repeat: isMajor ? Infinity : 0,
                      repeatType: isMajor ? "reverse" : undefined,
                      ease: "easeInOut",
                    },
                    scale: { duration: 0.3, delay: appearDelay, ease: [0.22, 1, 0.36, 1] },
                  }}
                />
              </g>
            );
          })}
        </motion.g>

        {/* CENTRAL NUCLEUS */}
        <motion.circle cx={CX} cy={CY} r={10} fill="#E91F27"
          filter="url(#nodeGlow)"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.7, 0.4, 0.7, 0.4], scale: 1 }}
          transition={{
            opacity: { duration: 3.5, delay: 2.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
            scale: { duration: 0.5, delay: 2.2, ease: [0.22, 1, 0.36, 1] },
          }}
        />

        {/* Inner pulse ring */}
        <motion.circle cx={CX} cy={CY} r={25} fill="none" stroke="#E91F27" strokeWidth={0.8}
          filter="url(#lineGlow)"
          initial={{ opacity: 0, scale: 0.3, pathLength: 0 }}
          animate={{
            opacity: [0, 0.5, 0.15, 0.5, 0.15],
            scale: [0.3, 1.15, 0.9, 1.15, 0.9],
            pathLength: 1,
          }}
          transition={{
            pathLength: { duration: 0.8, delay: 2, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 3.5, delay: 2.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
            scale: { duration: 3.5, delay: 2.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
          }}
        />

        {/* Outer pulse ring */}
        <motion.circle cx={CX} cy={CY} r={70} fill="none" stroke="#E91F27" strokeWidth={0.4}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: [0, 0.25, 0], scale: [0.3, 1.8, 2.2] }}
          transition={{ duration: 6, delay: 3, repeat: Infinity, ease: "easeOut" }}
        />

        {/* Medium pulse ring */}
        <motion.circle cx={CX} cy={CY} r={45} fill="none" stroke="#E91F27" strokeWidth={0.35}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 0.18, 0], scale: [0.5, 1.5, 2] }}
          transition={{ duration: 5, delay: 3.5, repeat: Infinity, ease: "easeOut" }}
        />

        {/* ORBITING PARTICLES */}
        {/* Particle 1 — far orbit */}
        <motion.g
          animate={phase === "rotating" ? { rotate: 360 } : { rotate: 0 }}
          transition={phase === "rotating" ? { duration: 14, repeat: Infinity, ease: "linear" } : { duration: 0 }}
          style={{ transformOrigin: `${CX}px ${CY}px` }}
        >
          <motion.circle cx={CX + 200} cy={CY} r={2.8} fill="#E91F27" filter="url(#nodeGlow)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.1, 0.6, 0.1] }}
            transition={{ duration: 2.5, delay: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          />
        </motion.g>

        {/* Particle 2 — opposite orbit */}
        <motion.g
          animate={phase === "rotating" ? { rotate: -360 } : { rotate: 0 }}
          transition={phase === "rotating" ? { duration: 20, repeat: Infinity, ease: "linear" } : { duration: 0 }}
          style={{ transformOrigin: `${CX}px ${CY}px` }}
        >
          <motion.circle cx={CX + 155} cy={CY} r={2.2} fill="#E91F27" filter="url(#nodeGlow)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.08, 0.5, 0.08] }}
            transition={{ duration: 3, delay: 3.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          />
        </motion.g>

        {/* Particle 3 — close fast orbit */}
        <motion.g
          animate={phase === "rotating" ? { rotate: 360 } : { rotate: 0 }}
          transition={phase === "rotating" ? { duration: 9, repeat: Infinity, ease: "linear" } : { duration: 0 }}
          style={{ transformOrigin: `${CX}px ${CY}px` }}
        >
          <motion.circle cx={CX} cy={CY - 120} r={2} fill="#E91F27" filter="url(#nodeGlow)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.15, 0.7, 0.15] }}
            transition={{ duration: 1.8, delay: 3.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          />
        </motion.g>

        {/* Particle 4 — tilted orbit */}
        <motion.g
          animate={phase === "rotating" ? { rotate: 360 } : { rotate: 0 }}
          transition={phase === "rotating" ? { duration: 16, repeat: Infinity, ease: "linear" } : { duration: 0 }}
          style={{ transformOrigin: `${CX}px ${CY}px` }}
        >
          <motion.circle cx={CX + 180} cy={CY - 40} r={2.4} fill="#E91F27" filter="url(#nodeGlow)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.12, 0.55, 0.12] }}
            transition={{ duration: 2.2, delay: 3.8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          />
        </motion.g>
      </svg>
    </div>
  );
}
