"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { Location } from "./locations-data";

const R = 140;
const CX = 160;
const CY = 160;
const SIZE = 320;
const TILT = (16 * Math.PI) / 180; // inclinación de cámara — coherente en retícula y marcadores
const COS_T = Math.cos(TILT);
const SIN_T = Math.sin(TILT);
const MERIDIANS = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
const PARALLELS = [-60, -30, 0, 30, 60];
const FRAME_MS = 33;        // ~30fps — suficiente para la rotación lenta
const BREATH_DEG = 2.2;     // micro-oscilación de vida
const ARC_LIFT = 0.16;      // elevación radial del arco HQ→ciudad

function degToRad(d: number) { return (d * Math.PI) / 180; }

interface P3 { x: number; y: number; z: number; }

/** Vector unitario en el marco de la Tierra (y = eje polar norte) */
function earthVec(latDeg: number, lngDeg: number): P3 {
  const phi = degToRad(90 - latDeg);
  const lam = degToRad(lngDeg);
  return { x: Math.sin(phi) * Math.cos(lam), y: Math.cos(phi), z: Math.sin(phi) * Math.sin(lam) };
}

/** Rotación por longitud + tilt de cámara + proyección ortográfica */
function projectVec(v: P3, rotRad: number, scale = 1) {
  const cosR = Math.cos(rotRad);
  const sinR = Math.sin(rotRad);
  const x = v.x * cosR + v.z * sinR;
  const z0 = v.z * cosR - v.x * sinR;
  const y = v.y * COS_T + z0 * SIN_T;
  const z = z0 * COS_T - v.y * SIN_T;
  return { px: CX + x * R * scale, py: CY - y * R * scale, z };
}

/** Path de un meridiano muestreado — solo tramos del hemisferio indicado */
function meridianPath(lngDeg: number, rotRad: number, front: boolean): string {
  let d = "";
  let pen = false;
  for (let lat = -88; lat <= 88; lat += 4) {
    const p = projectVec(earthVec(lat, lngDeg), rotRad);
    const onSide = front ? p.z > 0.01 : p.z <= 0.01;
    if (onSide) {
      d += `${pen ? "L" : "M"}${p.px.toFixed(1)},${p.py.toFixed(1)}`;
      pen = true;
    } else {
      pen = false;
    }
  }
  return d;
}

/** Arco elevado entre dos puntos de la esfera (slerp + lift radial) */
function arcPath(a: Location, b: Location, rotRad: number): string {
  const va = earthVec(a.lat, a.lng);
  const vb = earthVec(b.lat, b.lng);
  const dot = Math.max(-1, Math.min(1, va.x * vb.x + va.y * vb.y + va.z * vb.z));
  const omega = Math.acos(dot);
  if (omega < 1e-4) return "";
  const sinOmega = Math.sin(omega);
  let d = "";
  const STEPS = 28;
  for (let s = 0; s <= STEPS; s++) {
    const t = s / STEPS;
    const wa = Math.sin((1 - t) * omega) / sinOmega;
    const wb = Math.sin(t * omega) / sinOmega;
    const v: P3 = { x: wa * va.x + wb * vb.x, y: wa * va.y + wb * vb.y, z: wa * va.z + wb * vb.z };
    const lift = 1 + ARC_LIFT * Math.sin(Math.PI * t);
    const p = projectVec(v, rotRad, lift);
    d += `${s === 0 ? "M" : "L"}${p.px.toFixed(1)},${p.py.toFixed(1)}`;
  }
  return d;
}

interface WireframeGlobeProps {
  locations: Location[];
  activeIndex: number;
}

export default function WireframeGlobe({ locations, activeIndex }: WireframeGlobeProps) {
  const prefersReduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(true);
  const initialRot = degToRad(locations[0].lng);
  const rotRef = useRef(initialRot);
  const targetRef = useRef(initialRot);
  const [rotRad, setRotRad] = useState(initialRot);

  /* El objetivo de rotación sigue a la ciudad activa (camino más corto) */
  useEffect(() => {
    const target = degToRad(locations[activeIndex].lng);
    const current = targetRef.current;
    let delta = (target - current) % (2 * Math.PI);
    if (delta > Math.PI) delta -= 2 * Math.PI;
    if (delta < -Math.PI) delta += 2 * Math.PI;
    targetRef.current = current + delta;
    if (prefersReduced) {
      rotRef.current = targetRef.current;
      setRotRad(targetRef.current);
    }
  }, [activeIndex, locations, prefersReduced]);

  /* Pausa cuando el globo no está en viewport */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { isVisibleRef.current = e.isIntersecting; },
      { threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* Animación autocontenida a ~30fps — solo re-renderiza este componente */
  useEffect(() => {
    if (prefersReduced) return;
    let raf = 0;
    let acc = 0;
    let last = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = now - last;
      last = now;
      if (!isVisibleRef.current) return;
      acc += dt;
      if (acc < FRAME_MS) return;
      acc = 0;
      rotRef.current += (targetRef.current - rotRef.current) * 0.07;
      const breath = degToRad(BREATH_DEG) * Math.sin(now / 3200);
      setRotRad(rotRef.current + breath);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [prefersReduced]);

  const hq = locations[0];
  const active = locations[activeIndex];
  const showArc = activeIndex !== 0;

  return (
    <div ref={wrapRef}>
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          <radialGradient id="wgCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E91F27" stopOpacity="0.12" />
            <stop offset="60%" stopColor="#E91F27" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#E91F27" stopOpacity="0" />
          </radialGradient>
          <filter id="wgGlow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="wgGlowStrong">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient glow behind sphere */}
        <circle cx={CX} cy={CY} r={R + 30} fill="url(#wgCore)" />

        {/* Sphere outline */}
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(233,31,39,0.18)" strokeWidth={0.8} />
        <circle cx={CX} cy={CY} r={R - 1} fill="none" stroke="rgba(233,31,39,0.06)" strokeWidth={0.4} />

        {/* Meridianos muestreados — hemisferio trasero tenue, frontal definido */}
        {MERIDIANS.map((lngDeg) => (
          <path
            key={`mer-b-${lngDeg}`}
            d={meridianPath(lngDeg, rotRad, false)}
            fill="none"
            stroke="rgba(233,31,39,0.045)"
            strokeWidth={0.4}
          />
        ))}
        {MERIDIANS.map((lngDeg) => (
          <path
            key={`mer-f-${lngDeg}`}
            d={meridianPath(lngDeg, rotRad, true)}
            fill="none"
            stroke="rgba(233,31,39,0.12)"
            strokeWidth={0.45}
            strokeDasharray="2 5"
          />
        ))}

        {/* Paralelos — proyección con el mismo tilt de cámara */}
        {PARALLELS.map((latDeg) => {
          const phi = degToRad(90 - latDeg);
          const rx = R * Math.sin(phi);
          const cy = CY - R * Math.cos(phi) * COS_T;
          const isEquator = latDeg === 0;
          return (
            <ellipse
              key={`lat-${latDeg}`}
              cx={CX} cy={cy}
              rx={rx} ry={rx * SIN_T}
              fill="none"
              stroke={isEquator ? "rgba(233,31,39,0.25)" : "rgba(233,31,39,0.09)"}
              strokeWidth={isEquator ? 0.7 : 0.35}
              strokeDasharray={isEquator ? undefined : "3 6"}
            />
          );
        })}

        {/* Equator glow ring */}
        <ellipse cx={CX} cy={CY} rx={R * 0.98} ry={R * 0.98 * SIN_T} fill="none"
          stroke="rgba(233,31,39,0.12)" strokeWidth={1.5} />

        {/* Arco de conexión HQ → ciudad activa */}
        {showArc && (
          <motion.path
            key={`arc-${activeIndex}`}
            d={arcPath(hq, active, rotRad)}
            fill="none"
            stroke="#E91F27"
            strokeWidth={0.9}
            strokeLinecap="round"
            strokeDasharray="4 4"
            filter="url(#wgGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.45 }}
            transition={{ pathLength: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.25 }, opacity: { duration: 0.3, delay: 0.25 } }}
          />
        )}

        {/* City markers — misma proyección que la retícula */}
        {locations.map((loc, i) => {
          const p = projectVec(earthVec(loc.lat, loc.lng), rotRad);
          if (p.z < -0.05) return null;
          const opacity = Math.max(0.15, p.z * 0.6 + 0.3);
          const isActive = i === activeIndex;
          const isHq = i === 0;

          return (
            <g key={`city-${i}`}>
              {isActive && (
                <motion.circle
                  cx={p.px} cy={p.py} r={8}
                  fill="none" stroke="#E91F27" strokeWidth={0.7}
                  filter="url(#wgGlowStrong)"
                  initial={{ opacity: 0.7, scale: 0.6 }}
                  animate={{ opacity: [0.7, 0.15, 0.7], scale: [0.6, 1.8, 0.6] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  style={{ transformOrigin: `${p.px}px ${p.py}px` }}
                />
              )}
              {/* Anillo fijo distintivo del HQ */}
              {isHq && !isActive && (
                <circle cx={p.px} cy={p.py} r={5} fill="none"
                  stroke="rgba(233,31,39,0.4)" strokeWidth={0.6} opacity={opacity} />
              )}
              <circle
                cx={p.px} cy={p.py}
                r={isActive ? 4 : 2.5}
                fill="#E91F27"
                filter={isActive ? "url(#wgGlowStrong)" : "url(#wgGlow)"}
                opacity={isActive ? 1 : opacity}
              />
              {isActive && (
                <motion.text
                  x={p.px + 10} y={p.py - 6}
                  fill="#E91F27"
                  fontSize="9"
                  fontWeight="700"
                  fontFamily="var(--font-heading)"
                  letterSpacing="0.08em"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  {loc.city}
                </motion.text>
              )}
            </g>
          );
        })}

        {/* Polos sobre el eje inclinado */}
        <circle cx={CX} cy={CY - R * COS_T} r={2} fill="rgba(233,31,39,0.3)" />
        <circle cx={CX} cy={CY + R * COS_T} r={2} fill="rgba(233,31,39,0.2)" />
      </svg>
    </div>
  );
}
