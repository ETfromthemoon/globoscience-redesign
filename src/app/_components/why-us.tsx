"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const REASONS = [
  { title: "We Solve Problems", desc: "We create regulatory strategies and pathways that result in first-cycle approvals — no re-submissions, no delays." },
  { title: "We Help You Avoid Pitfalls", desc: "We shepherd discoveries from the research bench through the myriad of challenges, avoiding common regulatory traps." },
  { title: "We Are Transformative", desc: "Transforming nonclinical and clinical results into optimized pathways means faster reviews and patients receiving treatment sooner." },
  { title: "You Gain Critical Insights", desc: "We deliver sage insights into regulators' thinking at every step of the product development cycle." },
  { title: "Unmatched Strategic Expertise", desc: "Our team brings global experience across geographic regions, development types, pathways, and routes of administration." },
  { title: "We Deliver Wins for Clients", desc: "From rescuing programs with devastating clinical trial results to optimizing development — we save time, money, and patient quality of life." },
  { title: "Breakthrough Regulatory Strategies", desc: "Our expertise in forging new regulatory pathways is unparalleled and our major differentiator in the industry." },
  { title: "Accomplishments Drive Us", desc: "Collaborating with clients at the forefront of clinical science — transforming available data into regulatory success stories." },
  { title: "A Unique Perspective", desc: "A mix of prescribers, former sponsors, and former reviewers from all regions — uniquely positioned to accelerate your path." },
  { title: "We Help Fuel Your Growth", desc: "We've helped startups launch their first products and globally recognized brands advance their pipelines." },
];

const TOTAL = REASONS.length;

/** Stack offset per card: active=0, distance 1=24px, distance 2=44px, etc. */
function stackY(distanceFromActive: number): number {
  if (distanceFromActive <= 0) return 0;
  return 16 + distanceFromActive * 18;
}

function stackScale(distanceFromActive: number): number {
  const d = Math.abs(distanceFromActive);
  if (d === 0) return 1;
  if (d <= 1) return 0.95;
  if (d <= 3) return 0.92 - d * 0.015;
  return 0.87 - d * 0.01;
}

function stackBlur(distanceFromActive: number): string {
  const d = Math.abs(distanceFromActive);
  if (d === 0) return "blur(0px)";
  if (d <= 2) return `blur(${d * 2.5}px)`;
  return `blur(${5 + (d - 2) * 3}px)`;
}

function stackOpacity(distanceFromActive: number): number {
  const d = Math.abs(distanceFromActive);
  if (d === 0) return 1;
  if (d <= 2) return 0.55 - d * 0.12;
  return 0.2 - d * 0.02;
}

function stackZ(distanceFromActive: number): number {
  return 30 - Math.abs(distanceFromActive);
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
      end: "+=300%",
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

  return (
    <div id="why" ref={triggerRef} className="relative bg-bg-alt">
      <section className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-dots opacity-20" />

        <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6">
          {/* Mobile header — visible solo bajo lg */}
          <div className="pt-14 pb-2 text-center lg:hidden">
            <span className="eyebrow mb-2">Why Choose Us</span>
            <h2 className="font-heading text-[clamp(1.4rem,5.5vw,1.8rem)] font-bold leading-[1.15] tracking-[-0.02em] text-text-primary">
              The <span className="text-brand">10 fastest</span> FDA&nbsp;approvals
            </h2>
          </div>

          <div className="flex w-full items-stretch gap-12 lg:gap-20">
          {/* Left sidebar: header + progreso — stays within viewport */}
          <div className="hidden w-[300px] flex-shrink-0 flex-col justify-between py-14 lg:flex">
            <div>
              <span className="eyebrow mb-3">
                Why Choose Us
              </span>
              <h2 className="mb-3 font-heading text-[clamp(1.5rem,2.2vw,2rem)] font-bold leading-[1.15] tracking-[-0.02em] text-text-primary text-wrap-balance">
                The <span className="text-brand">10 fastest</span> FDA&nbsp;approvals
              </h2>
              <p className="max-w-[240px] text-[0.8rem] leading-relaxed text-text-body">
                Scroll to discover each reason we deliver first-cycle wins.
              </p>
            </div>

            {/* Progreso: título de la razón activa + navegación por barras */}
            <div className="flex flex-col gap-4">
              <div className="relative h-[1.5rem] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={activeIndex}
                    initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 truncate font-heading text-[0.8rem] font-semibold uppercase tracking-[0.1em] text-brand"
                  >
                    {REASONS[activeIndex].title}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Barras de navegación — progreso + click */}
              <div className="flex items-center gap-[5px]">
                {REASONS.map((r, i) => {
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
                      className="group flex h-5 flex-1 items-center"
                      aria-label={`Reason ${i + 1}: ${r.title}`}
                    >
                      <span
                        className={`h-[3px] w-full rounded-full transition-all duration-500 ${
                          isActive
                            ? "bg-brand shadow-[0_0_8px_rgba(233,31,39,0.45)]"
                            : isPast
                              ? "bg-brand/40"
                              : "bg-brand/12 group-hover:bg-brand/30"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="flex items-baseline gap-1.5 font-heading">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={activeIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-lg font-bold text-brand"
                  >
                    {String(activeIndex + 1).padStart(2, "0")}
                  </motion.span>
                </AnimatePresence>
                <span className="text-sm font-semibold text-text-muted">/ {TOTAL}</span>
              </div>
            </div>
          </div>

          {/* Right: accordion stack + número marca de agua gigante */}
          <div className="relative flex flex-1 items-center py-8">
            {/* Watermark: número gigante que llena el vacío y muta con la razón */}
            <div className="pointer-events-none absolute inset-y-0 right-0 hidden select-none items-center overflow-hidden lg:flex">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={activeIndex}
                  initial={{ opacity: 0, x: 40, filter: "blur(12px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: -40, filter: "blur(12px)" }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="font-heading text-[20rem] font-bold leading-none text-brand/[0.055]"
                >
                  {String(activeIndex + 1).padStart(2, "0")}
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="relative z-10 w-full max-w-[500px]" style={{ height: 340 }}>
              {/* Render ALL cards as stack */}
              {REASONS.map((reason, i) => {
                const dist = i - activeIndex;
                if (dist < -8 || dist > 9) return null; // skip cards too far away
                const isTop = dist === 0;

                return (
                  <motion.div
                    key={i}
                    initial={false}
                    animate={{
                      y: stackY(dist < 0 ? 0 : dist),
                      scale: stackScale(dist),
                      filter: stackBlur(dist),
                      opacity: stackOpacity(dist),
                      zIndex: stackZ(dist),
                    }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className={`glass-light absolute inset-x-0 top-0 overflow-hidden rounded-sm p-8 ${
                      isTop ? "glass-sheen border-l-[3px] border-l-brand shadow-[0_10px_34px_-10px_rgba(43,22,27,0.14)]" : ""
                    }`}
                    style={{ transformOrigin: "center top" }}
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <span className="font-heading text-sm font-bold tracking-[0.05em] text-brand">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className={`h-px flex-1 transition-colors duration-500 ${isTop ? "bg-brand/25" : "bg-brand/10"}`} />
                    </div>
                    <h3 className="font-heading text-xl font-semibold leading-snug tracking-[-0.01em] text-text-primary">
                      {reason.title}
                    </h3>
                    {isTop && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35 }}
                        className="mt-3 text-[0.9rem] leading-relaxed text-text-body"
                      >
                        {reason.desc}
                      </motion.p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
          </div>
        </div>

        {/* Mobile indicator */}
        <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2 lg:hidden">
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
              className={`rounded-full transition-all duration-400 ${
                i === activeIndex
                  ? "h-[5px] w-6 bg-brand shadow-[0_0_6px_rgba(233,31,39,0.4)]"
                  : i < activeIndex
                    ? "h-[4px] w-[4px] bg-brand/30"
                    : "h-[4px] w-[4px] bg-border-light"
              }`}
              aria-label={`Reason ${i + 1}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
