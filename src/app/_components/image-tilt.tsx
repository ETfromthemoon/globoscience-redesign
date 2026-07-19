"use client";

import { useRef, useState } from "react";

interface ImageTiltProps {
  children: React.ReactNode;
  className?: string;
}

export default function ImageTilt({ children, className }: ImageTiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const onMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientY - rect.top) / rect.height - 0.5;
    const y = (e.clientX - rect.left) / rect.width - 0.5;
    setRotate({ x: -x * 8, y: y * 8 });
  };

  const onMouseLeave = () => setRotate({ x: 0, y: 0 });

  return (
    <div
      ref={ref}
      className={`transition-transform duration-100 ease-out ${className || ""}`}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
}
