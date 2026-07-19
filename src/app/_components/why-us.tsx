"use client";

import { useRef, useEffect } from "react";

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

export default function WhyUs() {
  const headerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); obs.unobserve(e.target); } },
      { threshold: 0.1 }
    );
    [headerRef.current, timelineRef.current].forEach((el) => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <section id="why" className="relative overflow-hidden py-28">
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-30" />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6">
        <div ref={headerRef} className="scroll-reveal mb-20 text-center">
          <span className="mb-3 block text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand">
            Why Choose Us
          </span>
          <h2 className="mb-5 font-heading text-[clamp(2rem,3.2vw,2.8rem)] font-bold tracking-[-0.015em] text-text-primary">
            Experience with the{" "}
            <span className="text-brand">10 fastest</span> FDA approvals is our
            point of&nbsp;difference
          </h2>
          <p className="mx-auto max-w-[560px] text-base text-text-body">
            We solve problems that others can&apos;t — creating regulatory pathways where none existed.
          </p>
        </div>

        {/* Timeline layout */}
        <div ref={timelineRef} className="stagger relative">
          {/* Vertical timeline line */}
          <div className="pointer-events-none absolute top-0 bottom-0 left-[2px] w-[1px] bg-brand/10 hidden lg:block" />

          <div className="space-y-6 lg:space-y-12">
            {REASONS.map((reason, i) => (
              <div
                key={reason.num}
                className={`relative flex flex-col gap-6 lg:flex-row lg:items-start ${
                  i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Timeline dot — desktop */}
                <div className="absolute top-0 left-0 z-20 hidden h-[5px] w-[5px] rounded-full bg-brand lg:block" />

                {/* Empty spacer for alternating layout */}
                <div className="hidden lg:block lg:w-1/2" />

                {/* Card */}
                <div className="glass-dark glass-sheen group rounded-sm p-6 lg:w-1/2 hover:border-brand/25 transition-all duration-500">
                  <div className="mb-3 font-heading text-2xl font-bold text-brand/50">
                    {reason.num}
                  </div>
                  <h3 className="mb-2 font-heading text-base font-semibold text-white">
                    {reason.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/55">
                    {reason.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
