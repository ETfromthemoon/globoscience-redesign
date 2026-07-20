"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";

const NODE_COUNT = 55;
const RADIUS = 190;
const EDGE_MAX_DIST = 130;
const SIZE = 560;
const CX = 280;
const CY = 280;
const DEPTH_SQUASH = 0.35;   // proyección oblicua: la profundidad empuja hacia abajo
const ROTATION_SPEED = 0.11; // rad/s — vuelta completa ≈ 57s
const BUILD_TIME = 3.8;      // s — dibujo línea a línea

interface Node3D {
  x: number;
  y: number;
  z: number;
}

interface Projected {
  px: number;
  py: number;
  depth: number; // 0 = atrás, 1 = delante
}

function generateSphereNodes(count: number, radius: number): Node3D[] {
  const nodes: Node3D[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = phi * i;
    nodes.push({
      x: Math.cos(theta) * radiusAtY * radius,
      y: y * radius,
      z: Math.sin(theta) * radiusAtY * radius,
    });
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

/** Rotación alrededor del eje Y + proyección oblicua a 2D */
function project(n: Node3D, angle: number): Projected {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const x = n.x * cos + n.z * sin;
  const z = -n.x * sin + n.z * cos;
  return {
    px: CX + x,
    py: CY + n.y + z * DEPTH_SQUASH,
    depth: (z + RADIUS) / (2 * RADIUS),
  };
}

const nodeOpacity = (depth: number) => 0.2 + depth * 0.65;
const edgeOpacity = (dA: number, dB: number) => 0.08 + Math.min(dA, dB) * 0.3;

export default function MolecularOrb() {
  const prefersReduced = useReducedMotion();
  const [phase, setPhase] = useState<"building" | "rotating">("building");

  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(SVGCircleElement | null)[]>([]);
  const haloRefs = useRef<(SVGCircleElement | null)[]>([]);
  const edgeRefs = useRef<(SVGLineElement | null)[]>([]);
  const isVisibleRef = useRef(true);

  const { nodes, edges } = useMemo(() => {
    const n = generateSphereNodes(NODE_COUNT, RADIUS);
    return { nodes: n, edges: findEdges(n, EDGE_MAX_DIST) };
  }, []);

  const initial = useMemo(() => nodes.map((n) => project(n, 0)), [nodes]);

  const edgeDelayStep = BUILD_TIME / edges.length;
  const nodeAppearStart = BUILD_TIME * 0.25;

  useEffect(() => {
    if (prefersReduced) return;
    const timer = setTimeout(() => setPhase("rotating"), BUILD_TIME * 1000 + 800);
    return () => clearTimeout(timer);
  }, [prefersReduced]);

  /* Pausa total cuando el orbe sale del viewport */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { isVisibleRef.current = e.isIntersecting; },
      { threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* Rotación 3D imperativa: un solo rAF actualiza atributos directamente,
     sin re-renders de React ni animaciones por-elemento */
  useEffect(() => {
    if (phase !== "rotating" || prefersReduced) return;

    let raf = 0;
    let last = performance.now();
    let angle = 0;
    const projected: Projected[] = new Array(nodes.length);

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!isVisibleRef.current) return;

      angle += ROTATION_SPEED * dt;
      const t = now / 1000;

      for (let i = 0; i < nodes.length; i++) {
        const p = project(nodes[i], angle);
        projected[i] = p;
        const el = nodeRefs.current[i];
        if (!el) continue;
        el.setAttribute("cx", p.px.toFixed(1));
        el.setAttribute("cy", p.py.toFixed(1));
        const shimmer = 0.85 + 0.15 * Math.sin(t * 0.9 + i * 1.7);
        el.setAttribute("opacity", (nodeOpacity(p.depth) * shimmer).toFixed(3));

        const halo = haloRefs.current[i];
        if (halo) {
          halo.setAttribute("cx", p.px.toFixed(1));
          halo.setAttribute("cy", p.py.toFixed(1));
          const pulse = 0.5 + 0.5 * Math.sin(t * 0.7 + i * 2.3);
          halo.setAttribute("opacity", ((0.08 + p.depth * 0.22) * pulse).toFixed(3));
          halo.setAttribute("r", (12.5 + 2.5 * pulse).toFixed(1));
        }
      }

      for (let j = 0; j < edges.length; j++) {
        const el = edgeRefs.current[j];
        if (!el) continue;
        const pa = projected[edges[j][0]];
        const pb = projected[edges[j][1]];
        el.setAttribute("x1", pa.px.toFixed(1));
        el.setAttribute("y1", pa.py.toFixed(1));
        el.setAttribute("x2", pb.px.toFixed(1));
        el.setAttribute("y2", pb.py.toFixed(1));
        el.setAttribute("opacity", edgeOpacity(pa.depth, pb.depth).toFixed(3));
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, prefersReduced, nodes, edges]);

  const animate = !prefersReduced;

  return (
    <div ref={containerRef} className="pointer-events-none flex items-center justify-center" aria-hidden="true">
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
          initial={animate ? { opacity: 0 } : false}
          animate={animate ? { opacity: [0, 1, 0.7, 1] } : undefined}
          transition={{ duration: 2, delay: 0.6, ease: "easeOut", times: [0, 0.5, 0.75, 1] }}
        />

        {/* EDGES — se dibujan una a una durante el build; luego el rAF las gobierna */}
        {edges.map(([a, b], i) => {
          const pa = initial[a];
          const pb = initial[b];
          const finalOp = edgeOpacity(pa.depth, pb.depth);
          return (
            <motion.line
              key={`edge-${i}`}
              ref={(el: SVGLineElement | null) => { edgeRefs.current[i] = el; }}
              x1={pa.px} y1={pa.py}
              x2={pb.px} y2={pb.py}
              stroke="#E91F27"
              strokeWidth={0.9}
              strokeLinecap="round"
              initial={animate ? { pathLength: 0, opacity: 0 } : false}
              animate={animate ? { pathLength: 1, opacity: finalOp } : undefined}
              transition={{
                pathLength: { duration: 0.5, delay: i * edgeDelayStep, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.6, delay: i * edgeDelayStep },
              }}
              opacity={animate ? undefined : finalOp}
            />
          );
        })}

        {/* NODES — aparecen conforme sus líneas conectan */}
        {nodes.map((node, i) => {
          const p = initial[i];
          const isMajor = i % 4 === 0;
          const r = isMajor ? 3.5 : 2;
          const appearDelay = nodeAppearStart + i * ((BUILD_TIME * 0.6) / nodes.length);
          return (
            <g key={`node-${i}`}>
              {isMajor && (
                <circle
                  ref={(el) => { haloRefs.current[i] = el; }}
                  cx={p.px} cy={p.py} r={13}
                  fill="none" stroke="#E91F27" strokeWidth={0.5}
                  opacity={animate && phase === "building" ? 0 : 0.15}
                />
              )}
              <motion.circle
                ref={(el: SVGCircleElement | null) => { nodeRefs.current[i] = el; }}
                cx={p.px} cy={p.py} r={r}
                fill="#E91F27"
                filter={isMajor ? "url(#nodeGlow)" : undefined}
                initial={animate ? { opacity: 0, scale: 0 } : false}
                animate={animate ? { opacity: nodeOpacity(p.depth), scale: 1 } : undefined}
                transition={{
                  opacity: { duration: 0.4, delay: appearDelay },
                  scale: { duration: 0.3, delay: appearDelay, ease: [0.22, 1, 0.36, 1] },
                }}
                opacity={animate ? undefined : nodeOpacity(p.depth)}
              />
            </g>
          );
        })}

        {/* CENTRAL NUCLEUS */}
        <motion.circle cx={CX} cy={CY} r={10} fill="#E91F27"
          filter="url(#nodeGlow)"
          initial={animate ? { opacity: 0, scale: 0 } : false}
          animate={animate ? { opacity: [0, 0.7, 0.4, 0.7, 0.4], scale: 1 } : undefined}
          transition={{
            opacity: { duration: 3.5, delay: 2.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
            scale: { duration: 0.5, delay: 2.2, ease: [0.22, 1, 0.36, 1] },
          }}
          opacity={animate ? undefined : 0.55}
        />

        {/* Inner pulse ring */}
        <motion.circle cx={CX} cy={CY} r={25} fill="none" stroke="#E91F27" strokeWidth={0.8}
          initial={animate ? { opacity: 0, scale: 0.3 } : false}
          animate={animate ? {
            opacity: [0, 0.5, 0.15, 0.5, 0.15],
            scale: [0.3, 1.15, 0.9, 1.15, 0.9],
          } : undefined}
          transition={{
            opacity: { duration: 3.5, delay: 2.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
            scale: { duration: 3.5, delay: 2.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
          }}
          opacity={animate ? undefined : 0.3}
        />

        {/* Outer pulse rings — ondas expansivas */}
        {animate && (
          <>
            <motion.circle cx={CX} cy={CY} r={70} fill="none" stroke="#E91F27" strokeWidth={0.4}
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: [0, 0.25, 0], scale: [0.3, 1.8, 2.2] }}
              transition={{ duration: 6, delay: 3, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.circle cx={CX} cy={CY} r={45} fill="none" stroke="#E91F27" strokeWidth={0.35}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 0.18, 0], scale: [0.5, 1.5, 2] }}
              transition={{ duration: 5, delay: 3.5, repeat: Infinity, ease: "easeOut" }}
            />
          </>
        )}

        {/* ORBITING PARTICLES */}
        {animate && [
          { orbit: 200, y: 0, r: 2.8, dur: 14, dir: 1, delay: 3, fade: 2.5 },
          { orbit: 155, y: 0, r: 2.2, dur: 20, dir: -1, delay: 3.5, fade: 3 },
          { orbit: 0, y: -120, r: 2, dur: 9, dir: 1, delay: 3.2, fade: 1.8 },
          { orbit: 180, y: -40, r: 2.4, dur: 16, dir: 1, delay: 3.8, fade: 2.2 },
        ].map((pt, i) => (
          <motion.g
            key={`particle-${i}`}
            animate={phase === "rotating" ? { rotate: 360 * pt.dir } : { rotate: 0 }}
            transition={phase === "rotating" ? { duration: pt.dur, repeat: Infinity, ease: "linear" } : { duration: 0 }}
            style={{ transformOrigin: `${CX}px ${CY}px` }}
          >
            <motion.circle cx={CX + pt.orbit} cy={CY + pt.y} r={pt.r} fill="#E91F27" filter="url(#nodeGlow)"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.1, 0.6, 0.1] }}
              transition={{ duration: pt.fade, delay: pt.delay, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            />
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
