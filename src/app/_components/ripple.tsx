"use client";

import { useRef, useEffect, useState } from "react";

interface RippleProps {
  children: React.ReactNode;
  className?: string;
}

export default function Ripple({ children, className }: RippleProps) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  const onClick = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const id = Date.now();
    setRipples((prev) => [...prev.slice(-3), { x: e.clientX - rect.left, y: e.clientY - rect.top, id }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 800);
  };

  return (
    <div ref={ref} className={`relative overflow-hidden ${className || ""}`} onClick={onClick}>
      {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="pointer-events-none absolute rounded-full bg-brand/20"
          style={{
            left: r.x - 20,
            top: r.y - 20,
            width: 40,
            height: 40,
            animation: "ripple-out 0.7s ease-out forwards",
          }}
        />
      ))}
      <style jsx>{`
        @keyframes ripple-out {
          0% { transform: scale(0); opacity: 0.5; }
          100% { transform: scale(4); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
