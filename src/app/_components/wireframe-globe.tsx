"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { Location } from "./locations-data";
import { LAND_RINGS } from "./land-rings";

const R = 140;
const CX = 160;
const CY = 160;
const SIZE = 320;
const MERIDIANS = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
const PARALLELS = [-60, -30, 0, 30, 60];
const FRAME_MS = 33;        // ~30fps — suficiente para la rotación lenta
const BREATH_DEG = 2.2;     // micro-oscilación de vida
const ARC_LIFT = 0.16;      // elevación radial del arco HQ→ciudad
const EASE = 0.07;          // easing de rotación/inclinación por frame

function degToRad(d: number) { return (d * Math.PI) / 180; }

interface P3 { x: number; y: number; z: number; }
interface Cam { rot: number; cosT: number; sinT: number; }

/** Vector unitario en el marco de la Tierra (y = eje polar norte) */
function earthVec(latDeg: number, lngDeg: number): P3 {
  const phi = degToRad(90 - latDeg);
  const lam = degToRad(lngDeg);
  return { x: Math.sin(phi) * Math.cos(lam), y: Math.cos(phi), z: Math.sin(phi) * Math.sin(lam) };
}

/* Costas precomputadas como vectores 3D (una sola vez al cargar el módulo) */
const LAND_VECS: P3[][] = LAND_RINGS.map((ring) =>
  ring.map(([lng, lat]) => earthVec(lat, lng)),
);

/** Rotación por longitud + inclinación de cámara + proyección ortográfica.
 *  La ciudad activa queda en L = 90° (frente) y la inclinación −lat la centra. */
function projectVec(v: P3, cam: Cam, scale = 1) {
  const cosR = Math.cos(cam.rot);
  const sinR = Math.sin(cam.rot);
  const x = v.x * cosR + v.z * sinR;
  const z0 = v.z * cosR - v.x * sinR;
  const y = v.y * cam.cosT + z0 * cam.sinT;
  const z = z0 * cam.cosT - v.y * cam.sinT;
  return { px: CX + x * R * scale, py: CY - y * R * scale, z };
}

/** Path de una polilínea de vectores — solo tramos del hemisferio indicado */
function vecsPath(vecs: P3[], cam: Cam, front: boolean): string {
  let d = "";
  let pen = false;
  for (let i = 0; i < vecs.length; i++) {
    const p = projectVec(vecs[i], cam);
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

/** Path de un meridiano muestreado */
function meridianVecs(lngDeg: number): P3[] {
  const vecs: P3[] = [];
  for (let lat = -88; lat <= 88; lat += 4) vecs.push(earthVec(lat, lngDeg));
  return vecs;
}
const MERIDIAN_VECS: P3[][] = MERIDIANS.map(meridianVecs);

/** Path de un paralelo muestreado */
function parallelVecs(latDeg: number): P3[] {
  const vecs: P3[] = [];
  for (let lng = 0; lng <= 360; lng += 6) vecs.push(earthVec(latDeg, lng));
  return vecs;
}
const PARALLEL_VECS: P3[][] = PARALLELS.map(parallelVecs);

/** Arco elevado entre dos puntos de la esfera (slerp + lift radial) */
function arcPath(a: Location, b: Location, cam: Cam): string {
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
    const p = projectVec(v, cam, lift);
    d += `${s === 0 ? "M" : "L"}${p.px.toFixed(1)},${p.py.toFixed(1)}`;
  }
  return d;
}

/** Rotación que deja la ciudad de frente (L = λ − rot = 90°) */
const rotForLng = (lngDeg: number) => degToRad(lngDeg - 90);
/** Inclinación que centra la latitud de la ciudad en la vista */
const tiltForLat = (latDeg: number) => degToRad(-latDeg);

interface WireframeGlobeProps {
  locations: Location[];
  activeIndex: number;
}

export default function WireframeGlobe({ locations, activeIndex }: WireframeGlobeProps) {
  const prefersReduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(true);

  const initialRot = rotForLng(locations[0].lng);
  const initialTilt = tiltForLat(locations[0].lat);
  const rotRef = useRef(initialRot);
  const tiltRef = useRef(initialTilt);
  const targetRotRef = useRef(initialRot);
  const targetTiltRef = useRef(initialTilt);
  const [cam, setCam] = useState<Cam>({
    rot: initialRot,
    cosT: Math.cos(initialTilt),
    sinT: Math.sin(initialTilt),
  });

  /* El objetivo sigue a la ciudad activa: rotación por el camino más corto + tilt a su latitud */
  useEffect(() => {
    const loc = locations[activeIndex];
    const targetRot = rotForLng(loc.lng);
    const current = targetRotRef.current;
    let delta = (targetRot - current) % (2 * Math.PI);
    if (delta > Math.PI) delta -= 2 * Math.PI;
    if (delta < -Math.PI) delta += 2 * Math.PI;
    targetRotRef.current = current + delta;
    targetTiltRef.current = tiltForLat(loc.lat);
    if (prefersReduced) {
      rotRef.current = targetRotRef.current;
      tiltRef.current = targetTiltRef.current;
      setCam({
        rot: rotRef.current,
        cosT: Math.cos(tiltRef.current),
        sinT: Math.sin(tiltRef.current),
      });
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
      rotRef.current += (targetRotRef.current - rotRef.current) * EASE;
      tiltRef.current += (targetTiltRef.current - tiltRef.current) * EASE;
      const breath = degToRad(BREATH_DEG) * Math.sin(now / 3200);
      const tilt = tiltRef.current;
      setCam({
        rot: rotRef.current + breath,
        cosT: Math.cos(tilt),
        sinT: Math.sin(tilt),
      });
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
          {/* La retícula y costas se recortan a la silueta de la esfera */}
          <clipPath id="wgSphere">
            <circle cx={CX} cy={CY} r={R} />
          </clipPath>
        </defs>

        {/* Ambient glow behind sphere */}
        <circle cx={CX} cy={CY} r={R + 30} fill="url(#wgCore)" />

        {/* Sphere outline */}
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(233,31,39,0.18)" strokeWidth={0.8} />
        <circle cx={CX} cy={CY} r={R - 1} fill="none" stroke="rgba(233,31,39,0.06)" strokeWidth={0.4} />

        <g clipPath="url(#wgSphere)">
          {/* Retícula — hemisferio trasero muy tenue */}
          {MERIDIAN_VECS.map((vecs, i) => (
            <path key={`mer-b-${i}`} d={vecsPath(vecs, cam, false)} fill="none"
              stroke="rgba(233,31,39,0.035)" strokeWidth={0.4} />
          ))}
          {PARALLEL_VECS.map((vecs, i) => (
            <path key={`par-b-${i}`} d={vecsPath(vecs, cam, false)} fill="none"
              stroke="rgba(233,31,39,0.035)" strokeWidth={0.35} />
          ))}
          {/* Retícula frontal */}
          {MERIDIAN_VECS.map((vecs, i) => (
            <path key={`mer-f-${i}`} d={vecsPath(vecs, cam, true)} fill="none"
              stroke="rgba(233,31,39,0.09)" strokeWidth={0.4} strokeDasharray="2 5" />
          ))}
          {PARALLEL_VECS.map((vecs, i) => (
            <path key={`par-f-${i}`} d={vecsPath(vecs, cam, true)} fill="none"
              stroke={PARALLELS[i] === 0 ? "rgba(233,31,39,0.2)" : "rgba(233,31,39,0.08)"}
              strokeWidth={PARALLELS[i] === 0 ? 0.6 : 0.35}
              strokeDasharray={PARALLELS[i] === 0 ? undefined : "3 6"} />
          ))}

          {/* Costas — la Tierra reconocible: dorso fantasma, frente definido */}
          {LAND_VECS.map((vecs, i) => (
            <path key={`land-b-${i}`} d={vecsPath(vecs, cam, false)} fill="none"
              stroke="rgba(233,31,39,0.06)" strokeWidth={0.5} />
          ))}
          {LAND_VECS.map((vecs, i) => (
            <path key={`land-f-${i}`} d={vecsPath(vecs, cam, true)} fill="none"
              stroke="rgba(233,31,39,0.34)" strokeWidth={0.7} strokeLinejoin="round" />
          ))}
        </g>

        {/* Arco de conexión HQ → ciudad activa */}
        {showArc && (
          <motion.path
            key={`arc-${activeIndex}`}
            d={arcPath(hq, active, cam)}
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

        {/* City markers — misma proyección que retícula y costas */}
        {locations.map((loc, i) => {
          const p = projectVec(earthVec(loc.lat, loc.lng), cam);
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
        {(() => {
          const north = projectVec({ x: 0, y: 1, z: 0 }, cam);
          const south = projectVec({ x: 0, y: -1, z: 0 }, cam);
          return (
            <>
              {north.z > 0 && <circle cx={north.px} cy={north.py} r={2} fill="rgba(233,31,39,0.3)" />}
              {south.z > 0 && <circle cx={south.px} cy={south.py} r={2} fill="rgba(233,31,39,0.25)" />}
            </>
          );
        })()}
      </svg>
    </div>
  );
}
