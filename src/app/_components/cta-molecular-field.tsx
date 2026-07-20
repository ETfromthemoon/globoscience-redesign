"use client";

import { useEffect, useRef } from "react";

const NODE_DENSITY = 0.00009;   // nodos por px²
const MAX_NODES = 90;
const MIN_NODES = 26;
const LINK_DIST = 150;          // distancia máx. para dibujar arista
const SPEED = 0.14;             // px/frame a 60fps
const BRAND = "233, 31, 39";

interface Node { x: number; y: number; vx: number; vy: number; r: number; }

/** Red molecular a la deriva sobre canvas — nodos + aristas de proximidad.
 *  Pausa fuera de viewport y respeta prefers-reduced-motion (frame estático). */
export default function CtaMolecularField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes: Node[] = [];
    let raf = 0;
    let visible = true;

    const seed = (i: number, n: number) => {
      // distribución pseudo-aleatoria determinista (sin Math.random en SSR)
      const a = Math.sin(i * 12.9898 + 1) * 43758.5453;
      const b = Math.sin(i * 78.233 + n) * 43758.5453;
      return [a - Math.floor(a), b - Math.floor(b)];
    };

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(MIN_NODES, Math.min(MAX_NODES, Math.round(width * height * NODE_DENSITY)));
      nodes = Array.from({ length: count }, (_, i) => {
        const [rx, ry] = seed(i, count);
        const [ra, rb] = seed(i + 0.5, count);
        return {
          x: rx * width,
          y: ry * height,
          vx: (ra - 0.5) * 2 * SPEED,
          vy: (rb - 0.5) * 2 * SPEED,
          r: 0.8 + rx * 1.8,
        };
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Aristas
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST * LINK_DIST) {
            const t = 1 - Math.sqrt(d2) / LINK_DIST;
            ctx.strokeStyle = `rgba(${BRAND}, ${(t * 0.22).toFixed(3)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Nodos
      for (const n of nodes) {
        ctx.fillStyle = `rgba(${BRAND}, 0.55)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = () => {
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
        n.x = Math.max(0, Math.min(width, n.x));
        n.y = Math.max(0, Math.min(height, n.y));
      }
      draw();
      raf = requestAnimationFrame(step);
    };

    build();
    draw();

    if (!reduced) {
      const io = new IntersectionObserver(
        ([e]) => {
          visible = e.isIntersecting;
          if (visible && !raf) raf = requestAnimationFrame(step);
          else if (!visible && raf) { cancelAnimationFrame(raf); raf = 0; }
        },
        { threshold: 0 },
      );
      io.observe(canvas);

      const onResize = () => { build(); draw(); };
      window.addEventListener("resize", onResize);

      return () => {
        io.disconnect();
        window.removeEventListener("resize", onResize);
        if (raf) cancelAnimationFrame(raf);
      };
    }

    const onResizeStatic = () => { build(); draw(); };
    window.addEventListener("resize", onResizeStatic);
    return () => window.removeEventListener("resize", onResizeStatic);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
