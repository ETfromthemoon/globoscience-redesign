"use client";

import { useMemo } from "react";
import { motion } from "motion/react";

interface Node3D {
  x: number;
  y: number;
  z: number;
  px: number;
  py: number;
  opacity: number;
}

function generateSphereNodes(count: number, radius: number): Node3D[] {
  const nodes: Node3D[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2; // -1 to 1
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = phi * i;

    const x3d = Math.cos(theta) * radiusAtY * radius;
    const y3d = y * radius;
    const z3d = Math.sin(theta) * radiusAtY * radius;

    // Simple perspective: closer z = larger + brighter
    const depth = (z3d + radius) / (2 * radius); // 0 (back) to 1 (front)
    const px = x3d;
    const py = y3d + z3d * 0.35; // isometric tilt

    nodes.push({
      x: x3d,
      y: y3d,
      z: z3d,
      px,
      py,
      opacity: 0.2 + depth * 0.65,
    });
  }
  return nodes;
}

function findEdges(nodes: Node3D[], maxDist: number): [number, number][] {
  const edges: [number, number][] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dz = nodes[i].z - nodes[j].z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < maxDist) {
        edges.push([i, j]);
      }
    }
  }
  return edges;
}

export default function MolecularOrb() {
  const { nodes, edges } = useMemo(() => {
    const n = generateSphereNodes(45, 140);
    const e = findEdges(n, 105);
    return { nodes: n, edges: e };
  }, []);

  const centerX = 220;
  const centerY = 220;
  const viewSize = 440;

  return (
    <div className="pointer-events-none flex items-center justify-center" aria-hidden="true">
      <svg
        width={viewSize}
        height={viewSize}
        viewBox={`0 0 ${viewSize} ${viewSize}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Connecting lines — path drawing */}
        {edges.map(([a, b], i) => (
          <motion.line
            key={`edge-${i}`}
            x1={centerX + nodes[a].px}
            y1={centerY + nodes[a].py}
            x2={centerX + nodes[b].px}
            y2={centerY + nodes[b].py}
            stroke="#E91F27"
            strokeWidth={0.6}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: Math.min(nodes[a].opacity, nodes[b].opacity) * 0.35,
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.03,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))}

        {/* Nodes — circles with pulse for some */}
        {nodes.map((node, i) => {
          const isGlow = i % 5 === 0;
          const r = isGlow ? 3.5 : 2;
          return (
            <g key={`node-${i}`}>
              {/* Outer glow ring for glow nodes */}
              {isGlow && (
                <motion.circle
                  cx={centerX + node.px}
                  cy={centerY + node.py}
                  r={r + 6}
                  fill="none"
                  stroke="#E91F27"
                  strokeWidth={0.4}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{
                    opacity: [0, 0.4, 0.1, 0.4, 0.1],
                    scale: [0.6, 1.2, 0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 5 + (i % 3),
                    delay: i * 0.08 + 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                />
              )}

              {/* Main dot */}
              <motion.circle
                cx={centerX + node.px}
                cy={centerY + node.py}
                r={r}
                fill="#E91F27"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: isGlow
                    ? [0, node.opacity * 0.8, node.opacity * 0.4, node.opacity * 0.8, node.opacity * 0.4]
                    : node.opacity * 0.45,
                  scale: 1,
                }}
                transition={{
                  opacity: {
                    duration: isGlow ? 4 + (i % 4) : 0.6,
                    delay: i * 0.05 + 1.5,
                    repeat: isGlow ? Infinity : 0,
                    repeatType: isGlow ? "reverse" : undefined,
                    ease: "easeInOut",
                  },
                  scale: { duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] },
                }}
              />
            </g>
          );
        })}

        {/* Center core */}
        <motion.circle
          cx={centerX}
          cy={centerY}
          r={8}
          fill="#E91F27"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.55, scale: 1 }}
          transition={{ duration: 0.8, delay: 2, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.circle
          cx={centerX}
          cy={centerY}
          r={18}
          fill="none"
          stroke="#E91F27"
          strokeWidth={0.8}
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: [0.15, 0.35, 0.15], pathLength: 1 }}
          transition={{
            pathLength: { duration: 1.2, delay: 1.8, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 4, delay: 2.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
          }}
        />
      </svg>
    </div>
  );
}
