"use client";

import { useEffect } from "react";

export function CinematicSection({ children, className }: { children: React.ReactNode; className?: string }) {
  useEffect(() => {
    const els = document.querySelectorAll(".cinematic-section");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("cinematic-visible");
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className={`cinematic-section opacity-0 transition-all duration-900 ease-out ${className || ""}`}
      style={{
        filter: "blur(8px)",
        transitionProperty: "opacity, filter, transform",
        transform: "translateY(32px)",
      }}
    >
      {children}
      <style jsx>{`
        .cinematic-visible {
          opacity: 1 !important;
          filter: blur(0) !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </div>
  );
}
