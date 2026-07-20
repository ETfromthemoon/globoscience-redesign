"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const REASONS = [
  { num: "01", title: "We Solve Problems", desc: "We create regulatory strategies and pathways that result in first-cycle approvals — no re-submissions, no delays." },
  { num: "02", title: "We Help You Avoid Pitfalls", desc: "We shepherd discoveries from the research bench through the myriad of challenges, avoiding common regulatory traps." },
  { num: "03", title: "We Are Transformative", desc: "Transforming nonclinical and clinical results into optimized pathways means faster reviews and patients receiving treatment sooner." },
  { num: "04", title: "You Gain Critical Insights", desc: "We deliver sage insights into regulators' thinking at every step of the product development cycle." },
  { num: "05", title: "Unmatched Strategic Expertise", desc: "Our team brings global experience across geographic regions, development types, pathways, and routes of administration." },
  { num: "06", title: "We Deliver Wins for Clients", desc: "From rescuing programs with devastating clinical trial results to optimizing development — we save time, money, and patient quality of life." },
  { num: "07", title: "Breakthrough Regulatory Strategies", desc: "Our expertise in forging new regulatory pathways is unparalleled and our major differentiator in the industry." },
  { num: "08", title: "Accomplishments Drive Us", desc: "Collaborating with clients at the forefront of clinical science — transforming available data into regulatory success stories." },
  { num: "09", title: "A Unique Perspective", desc: "A mix of prescribers, former sponsors, and former reviewers from all regions — uniquely positioned to accelerate your path." },
  { num: "10", title: "We Help Fuel Your Growth", desc: "We've helped startups launch their first products and globally recognized brands advance their pipelines." },
];

const TOTAL = REASONS.length;
const VISIBLE_BEHIND = 3;

function getDepthStyle(distanceFromActive: number): {
  scale: number;
  opacity: number;
  blur: string;
  y: number;
  z: number;
} {
  const abs = Math.abs(distanceFromActive);
  if (abs === 0) return { scale: 1, opacity: 1, blur: "blur(0px)", y: 0, z: 30 };
  if (abs === 1) return { scale: 0.9, opacity: 0.5, blur: "blur(4px)", y: 20, z: 20 };
  if (abs === 2) return { scale: 0.82, opacity: 0.28, blur: "blur(8px)", y: 34, z: 10 };
  return { scale: 0.76, opacity: 0.14, blur: "blur(14px)", y: 44, z: 5 };
}

export default function WhyUs() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const prevIndex = useRef(0);

  useEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const st = ScrollTrigger.create({
      trigger,
      start: "top top",
      end: `+=300%`, // faster — less scroll distance
      pin: true,
      scrub: 0.3,
      onUpdate: (self) => {
        const newIndex = Math.min(TOTAL - 1, Math.floor(self.progress * TOTAL));
        if (newIndex !== prevIndex.current) {
          prevIndex.current = newIndex;
          setActiveIndex(newIndex);
        }
      },
    });

    return () => st.kill();
  }, []);

  const behindCards = [];
  for (let i = 1; i <= VISIBLE_BEHIND; i++) {
    const idx = activeIndex - i;
    if (idx >= 0) behindCards.push({ idx, distance: i });
  }

  return (
    <div ref={triggerRef} className="relative bg-bg-alt">
      <section className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-dots opacity-20" />

        <div className="relative z-10 mx-auto flex w-full max-w-[1200px] items-center gap-16 px-6 lg:gap-24">
          {/* Left: header + timeline indicator */}
          <div className="flex-shrink-0 text-center lg:w-[300px] lg:text-left">
            <span className="mb-3 block text-[0.65rem] font-bold uppercase tracking-[0.2em] text-brand/70">
              Why Choose Us
            </span>
            <h2 className="mb-3 font-heading text-[clamp(1.6rem,2.5vw,2.2rem)] font-bold leading-[1.15] tracking-[-0.02em] text-text-primary text-wrap-balance">
              The <span className="text-brand">10 fastest</span> FDA&nbsp;approvals
            </h2>
            <p className="text-[0.875rem] leading-relaxed text-text-body">
              Scroll to discover each reason.
            </p>

            {/* Timeline indicator — vertical line + dots */}
            <div className="mt-10 hidden lg:block">
              <div className="relative ml-1 flex flex-col items-start gap-[18px]">
                {/* Vertical line */}
                <div className="absolute top-0 bottom-0 left-[3px] w-[1px] bg-brand/15" />

                {REASONS.map((_, i) => {
                  const isActive = i === activeIndex;
                  const isPast = i < activeIndex;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        const trigger = triggerRef.current;
                        if (trigger) {
                          const targetY = trigger.offsetTop + (window.innerHeight * (i / TOTAL) * 3);
                          window.scrollTo({ top: targetY, behavior: "smooth" });
                        }
                      }}
                      className="relative z-10 flex items-center gap-3 group"
                      aria-label={`Reason ${i + 1}`}
                    >
                      {/* Dot */}
                      <span
                        className={`block h-[7px] w-[7px] rounded-full transition-all duration-400 ${
                          isActive
                            ? "bg-brand shadow-[0_0_10px_rgba(233,31,39,0.5)] scale-125"
                            : isPast
                              ? "bg-brand/40"
                              : "bg-brand/12 group-hover:bg-brand/30"
                        }`}
                      />
                      {/* Label — only visible on active */}
                      <span
                        className={`text-[0.65rem] font-semibold uppercase tracking-[0.1em] transition-all duration-300 ${
                          isActive ? "text-brand opacity-100" : "opacity-0 w-0 overflow-hidden"
                        }`}
                      >
                        {REASONS[i].title.length > 25
                          ? REASONS[i].title.slice(0, 25) + "..."
                          : REASONS[i].title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: stacked cards */}
          <div className="relative flex flex-1 items-center justify-center" style={{ minHeight: 320 }}>
            <div className="relative w-full max-w-[540px]" style={{ height: 340 }}>
              {/* Behind cards (depth effect) */}
              {behindCards.map(({ idx, distance }) => {
                const style = getDepthStyle(distance);
                return (
                  <motion.div
                    key={`behind-${idx}`}
                    initial={false}
                    animate={{
                      scale: style.scale,
                      y: style.y,
                      filter: style.blur,
                      opacity: style.opacity,
                      zIndex: style.z,
                    }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="glass-light absolute inset-x-0 top-0 rounded-sm p-8 text-center"
                    style={{ transformOrigin: "center top" }}
                  >
                    <div className="font-heading text-4xl font-bold text-brand/15 mb-2">
                      {REASONS[idx].num}
                    </div>
                    <h3 className="font-heading text-base font-semibold text-text-primary/60 mb-1">
                      {REASONS[idx].title}
                    </h3>
                  </motion.div>
                );
              })}

              {/* Active card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 60, scale: 0.92, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)", zIndex: 30 }}
                  exit={{ opacity: 0, y: -30, scale: 0.98, filter: "blur(2px)" }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="glass-light glass-sheen absolute inset-x-0 top-0 rounded-sm p-10 shadow-[0_4px_28px_rgba(0,0,0,0.05)]"
                >
                  <div className="mb-5 font-heading text-7xl font-bold leading-none text-brand/12">
                    {REASONS[activeIndex].num}
                  </div>
                  <h3 className="mb-4 font-heading text-xl font-semibold text-text-primary">
                    {REASONS[activeIndex].title}
                  </h3>
                  <p className="text-[0.9375rem] leading-relaxed text-text-body">
                    {REASONS[activeIndex].desc}
                  </p>
                  <div className="mt-8 flex items-center gap-2 text-[0.6rem] font-bold uppercase tracking-[0.12em] text-brand/40">
                    <span className="text-brand">{String(activeIndex + 1).padStart(2, "0")}</span>
                    <span>/</span>
                    <span>{String(TOTAL).padStart(2, "0")}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile timeline dots */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 lg:hidden">
          {REASONS.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                const trigger = triggerRef.current;
                if (trigger) {
                  const targetY = trigger.offsetTop + (window.innerHeight * (i / TOTAL) * 3);
                  window.scrollTo({ top: targetY, behavior: "smooth" });
                }
              }}
              className={`h-[5px] rounded-full transition-all duration-400 ${
                i === activeIndex
                  ? "w-6 bg-brand shadow-[0_0_6px_rgba(233,31,39,0.4)]"
                  : i < activeIndex
                    ? "w-[5px] bg-brand/30"
                    : "w-[5px] bg-border-light"
              }`}
              aria-label={`Reason ${i + 1}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
