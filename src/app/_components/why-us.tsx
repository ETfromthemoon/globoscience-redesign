"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const REASONS = [
  { num: "01", title: "We Solve Problems", desc: "We create regulatory strategies and pathways that result in first-cycle approvals — no re-submissions, no delays." },
  { num: "02", title: "We Help You Avoid Pitfalls", desc: "We shepherd discoveries from the research bench through the myriad of challenges, avoiding common regulatory traps." },
  { num: "03", title: "We Are Transformative", desc: "Transforming nonclinical and clinical results into optimized pathways means faster reviews and patients receiving treatment sooner." },
  { num: "04", title: "You Gain Critical Insights", desc: "We deliver sage insights into regulators' thinking at every step of the product development cycle across all therapeutic areas." },
  { num: "05", title: "Unmatched Strategic Expertise", desc: "Our team brings global experience across geographic regions, development types, pathways, and routes of administration." },
  { num: "06", title: "We Deliver Wins for Clients", desc: "From rescuing programs with devastating clinical trial results to optimizing development — we save time, money, and patient quality of life." },
  { num: "07", title: "Breakthrough Regulatory Strategies", desc: "Our expertise in forging new regulatory pathways is unparalleled and our major differentiator in the industry." },
  { num: "08", title: "Accomplishments Drive Us", desc: "Collaborating with clients at the forefront of clinical science — transforming available data into regulatory success stories." },
  { num: "09", title: "A Unique Perspective", desc: "A mix of prescribers, former sponsors, and former reviewers from all regions — uniquely positioned to accelerate your path." },
  { num: "10", title: "We Help Fuel Your Growth", desc: "We've helped startups launch their first products and globally recognized brands advance their pipelines." },
];

const TOTAL_CARDS = REASONS.length;
const SECTION_MULTIPLIER = 10; // How many vh of scroll per card

export default function WhyUs() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const prevIndex = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const totalHeight = window.innerHeight * SECTION_MULTIPLIER;

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      // How far into the section are we? (0 = top of section just entered, 1 = bottom reached)
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const progress = Math.max(0, Math.min(1, -sectionTop / (sectionHeight - window.innerHeight)));

      const newIndex = Math.min(TOTAL_CARDS - 1, Math.floor(progress * TOTAL_CARDS));
      if (newIndex !== prevIndex.current) {
        setDirection(newIndex > prevIndex.current ? 1 : -1);
        prevIndex.current = newIndex;
        setActiveIndex(newIndex);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // init
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cardVariants = {
    enter: (dir: number) => ({ opacity: 0, y: dir > 0 ? 60 : -60, scale: 0.95, filter: "blur(4px)" }),
    center: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
    exit: (dir: number) => ({ opacity: 0, y: dir > 0 ? -40 : 40, scale: 1.02, filter: "blur(2px)" }),
  };

  return (
    <section
      id="why"
      ref={sectionRef}
      className="relative overflow-hidden bg-bg-alt"
      style={{ height: `${SECTION_MULTIPLIER * 100}vh` }}
    >
      {/* Sticky container — pins to viewport */}
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/* Subtle bg pattern */}
        <div className="pointer-events-none absolute inset-0 bg-dots opacity-20" />

        <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col items-center gap-12 px-6 lg:flex-row lg:gap-20">
          {/* Left: header + progress indicator */}
          <div className="flex-shrink-0 text-center lg:w-[380px] lg:text-left">
            <span className="mb-3 block text-[0.65rem] font-bold uppercase tracking-[0.2em] text-brand">
              Why Choose Us
            </span>
            <h2 className="mb-4 font-heading text-[clamp(1.6rem,2.5vw,2.4rem)] font-bold leading-[1.15] tracking-[-0.02em] text-text-primary text-wrap-balance">
              Experience with the{" "}
              <span className="text-brand">10 fastest</span> FDA approvals
            </h2>
            <p className="text-[0.9375rem] leading-relaxed text-text-body">
              We solve problems that others can&apos;t.
            </p>

            {/* Progress dots */}
            <div className="mt-10 flex flex-wrap gap-2 lg:gap-3">
              {REASONS.map((r, i) => (
                <button
                  key={r.num}
                  onClick={() => {
                    setDirection(i > activeIndex ? 1 : -1);
                    prevIndex.current = i;
                    setActiveIndex(i);
                    // Jump to scroll position
                    const section = sectionRef.current;
                    if (section) {
                      const targetY = section.offsetTop + (section.offsetHeight * i) / TOTAL_CARDS;
                      window.scrollTo({ top: targetY, behavior: "smooth" });
                    }
                  }}
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all duration-400 ${
                    i === activeIndex
                      ? "bg-brand text-white shadow-lg shadow-brand/20 scale-110"
                      : i < activeIndex
                        ? "bg-brand/15 text-brand/50"
                        : "bg-border-light text-text-muted hover:bg-brand/10"
                  }`}
                  aria-label={`Reason ${r.num}`}
                >
                  {r.num}
                </button>
              ))}
            </div>
          </div>

          {/* Right: active card */}
          <div className="relative flex min-h-[280px] flex-1 items-center justify-center sm:min-h-[320px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="glass-light glass-sheen w-full max-w-[560px] rounded-sm p-10 shadow-[0_4px_24px_rgba(0,0,0,0.04)]"
              >
                <div className="mb-5 font-heading text-7xl font-bold leading-none text-brand/15">
                  {REASONS[activeIndex].num}
                </div>
                <h3 className="mb-4 font-heading text-2xl font-semibold text-text-primary">
                  {REASONS[activeIndex].title}
                </h3>
                <p className="text-[0.9375rem] leading-relaxed text-text-body">
                  {REASONS[activeIndex].desc}
                </p>

                {/* Card counter */}
                <div className="mt-8 flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-brand/50">
                  <span className="text-brand">{String(activeIndex + 1).padStart(2, "0")}</span>
                  <span>/</span>
                  <span>{String(TOTAL_CARDS).padStart(2, "0")}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Scroll hint — bottom */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-brand/30">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 8L10 13l5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </section>
  );
}
