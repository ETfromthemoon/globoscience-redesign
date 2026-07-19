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

export default function WhyUs() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const prevIndex = useRef(0);

  useEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const st = ScrollTrigger.create({
      trigger,
      start: "top top",
      end: `+=${TOTAL * 100}%`, // virtual scroll: 10 cards × 100% of viewport
      pin: true,
      scrub: 0.5,
      onUpdate: (self) => {
        const progress = self.progress;
        const newIndex = Math.min(TOTAL - 1, Math.floor(progress * TOTAL));
        if (newIndex !== prevIndex.current) {
          setDirection(newIndex > prevIndex.current ? 1 : -1);
          prevIndex.current = newIndex;
          setActiveIndex(newIndex);
        }
      },
    });

    return () => st.kill();
  }, []);

  const cardVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      y: dir > 0 ? 80 : -80,
      scale: 0.94,
      filter: "blur(6px)",
    }),
    center: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
    },
    exit: (dir: number) => ({
      opacity: 0,
      y: dir > 0 ? -50 : 50,
      scale: 1.02,
      filter: "blur(3px)",
    }),
  };

  return (
    <>
      {/* Spacer to create scroll room for GSAP pin */}
      <div ref={triggerRef} className="relative bg-bg-alt">
        <section className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-dots opacity-20" />

          <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col items-center gap-10 px-6 lg:flex-row lg:gap-20">
            {/* Left: header + dots */}
            <div className="flex-shrink-0 text-center lg:w-[340px] lg:text-left">
              <span className="mb-3 block text-[0.65rem] font-bold uppercase tracking-[0.2em] text-brand/70">
                Why Choose Us
              </span>
              <h2 className="mb-4 font-heading text-[clamp(1.6rem,2.5vw,2.2rem)] font-bold leading-[1.15] tracking-[-0.02em] text-text-primary text-wrap-balance">
                The <span className="text-brand">10 fastest</span> FDA approvals
              </h2>
              <p className="text-[0.9375rem] leading-relaxed text-text-body">
                Scroll to reveal each reason.
              </p>

              {/* Clickable dots */}
              <div className="mt-8 flex flex-wrap gap-2 lg:gap-2.5">
                {REASONS.map((r, i) => (
                  <button
                    key={r.num}
                    onClick={() => {
                      const trigger = triggerRef.current;
                      if (trigger) {
                        const target = trigger.offsetTop + (window.innerHeight * i);
                        window.scrollTo({ top: target, behavior: "smooth" });
                      }
                    }}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-[0.6rem] font-bold transition-all duration-300 ${
                      i === activeIndex
                        ? "bg-brand text-white shadow-md shadow-brand/20 scale-110"
                        : i < activeIndex
                          ? "bg-brand/10 text-brand/40"
                          : "bg-border-light text-text-muted hover:bg-brand/8"
                    }`}
                    aria-label={`Reason ${r.num}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: card */}
            <div ref={cardContainerRef} className="relative flex min-h-[260px] flex-1 items-center justify-center sm:min-h-[300px]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activeIndex}
                  custom={direction}
                  variants={cardVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="glass-light glass-sheen w-full max-w-[540px] rounded-sm p-10 shadow-[0_4px_24px_rgba(0,0,0,0.04)]"
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

          {/* Bottom scroll indicator */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="animate-bounce text-brand/25">
              <path d="M4.5 7L9 11.5 13.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </section>
      </div>
    </>
  );
}
