"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

const REASONS = [
  {
    num: "01",
    title: "We Solve Problems",
    desc: "We create regulatory strategies and pathways that result in first-cycle approvals — no re-submissions, no delays.",
  },
  {
    num: "02",
    title: "We Help You Avoid Pitfalls",
    desc: "We shepherd discoveries from the research bench through the myriad of challenges, avoiding common regulatory traps.",
  },
  {
    num: "03",
    title: "We Are Transformative",
    desc: "Transforming nonclinical and clinical results into optimized pathways means faster reviews and patients receiving treatment sooner.",
  },
  {
    num: "04",
    title: "You Gain Critical Insights",
    desc: "We deliver sage insights into regulators' thinking at every step of the product development cycle.",
  },
  {
    num: "05",
    title: "Unmatched Strategic Expertise",
    desc: "Our team brings global experience across geographic regions, development types, pathways, and routes of administration.",
  },
  {
    num: "06",
    title: "We Deliver Wins for Clients",
    desc: "From rescuing programs with devastating clinical trial results to optimizing development — we save time, money, and patient quality of life.",
  },
  {
    num: "07",
    title: "Breakthrough Regulatory Strategies",
    desc: "Our expertise in forging new regulatory pathways is unparalleled and our major differentiator in the industry.",
  },
  {
    num: "08",
    title: "Accomplishments Drive Us",
    desc: "Collaborating with clients at the forefront of clinical science — transforming available data into regulatory success stories.",
  },
  {
    num: "09",
    title: "A Unique Perspective",
    desc: "A mix of prescribers, former sponsors, and former reviewers from all regions — uniquely positioned to accelerate your path.",
  },
  {
    num: "10",
    title: "We Help Fuel Your Growth",
    desc: "We've helped startups launch their first products and globally recognized brands advance their pipelines.",
  },
];

export default function WhyUs() {
  const ref = useRef<HTMLElement>(null);

  return (
    <section id="why" ref={ref} className="py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
          className="mb-16 text-center"
        >
          <span className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-brand">
            Why Choose Us
          </span>
          <h2 className="mb-4 font-heading text-[clamp(2rem,3.2vw,2.8rem)] font-bold tracking-[-0.01em] text-text-primary">
            Experience with the{" "}
            <span className="text-brand">10 fastest</span> FDA approvals is our
            point of&nbsp;difference
          </h2>
          <p className="mx-auto max-w-[560px] text-base text-text-body">
            We solve problems that others can&apos;t — creating regulatory
            pathways where none existed.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2">
          {REASONS.map((reason, i) => (
            <motion.div
              key={reason.num}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1] as const,
                delay: i * 0.05,
              }}
              className="glass-card rounded-sm p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/20"
            >
              <div className="mb-3 font-heading text-3xl font-bold text-brand/40">
                {reason.num}
              </div>
              <h3 className="mb-2 font-heading text-base font-semibold text-text-primary">
                {reason.title}
              </h3>
              <p className="text-sm leading-relaxed text-text-body">
                {reason.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
