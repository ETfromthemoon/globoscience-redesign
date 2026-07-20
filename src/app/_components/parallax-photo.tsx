"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

interface ParallaxPhotoProps {
  src: string;
  alt: string;
  className?: string;
}

/** Parallax de profundidad: la imagen se desplaza más lento que la página
 *  dentro de su marco (overflow hidden), con headroom dado por la escala. */
export default function ParallaxPhoto({ src, alt, className }: ParallaxPhotoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-9%", "9%"]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className || ""}`}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full"
        style={prefersReduced ? undefined : { y, scale: 1.18 }}
      />
    </div>
  );
}
