"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

export default function Contact() {
  const ref = useRef<HTMLElement>(null);

  return (
    <section id="contact" ref={ref} className="bg-bg-alt py-24">
      <div className="mx-auto grid max-w-[1200px] gap-16 px-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <span className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-brand">
            Let&apos;s Talk
          </span>
          <h2 className="mb-4 font-heading text-[clamp(2rem,3vw,2.6rem)] font-bold tracking-[-0.01em] text-text-primary">
            Start the <span className="text-brand">conversation</span>
          </h2>
          <p className="mb-10 max-w-[440px] text-base leading-relaxed text-text-body">
            If exceptional experience, transformative solutions, and verifiable
            success are your criteria for a regulatory strategy partner, your
            search ends here.
          </p>

          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand/8 text-brand">
                &#9993;
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-brand">
                  Email
                </p>
                <p className="text-sm text-text-body">
                  innovate@globoscience.com
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand/8 text-brand">
                &#9742;
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-brand">
                  Phone
                </p>
                <p className="text-sm text-text-body">+1 617 583 5727</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand/8 text-brand">
                &#9872;
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-brand">
                  Headquarters
                </p>
                <p className="text-sm text-text-body">
                  One Washington Mall, Suite #1066
                  <br />
                  Boston, MA 02108
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const, delay: 0.1 }}
        >
          <form
            className="glass-card rounded-sm p-8"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="mb-4">
              <select
                className="w-full cursor-pointer rounded-sm border border-border-light bg-white px-4 py-3 text-sm text-text-primary outline-none transition-colors focus:border-brand"
                required
                defaultValue=""
              >
                <option value="" disabled>
                  I&apos;m interested in...
                </option>
                <option>Regulatory Strategy</option>
                <option>Product Development Consulting</option>
                <option>Clinical Development Optimization</option>
                <option>FDA / EMA Meeting Preparation</option>
                <option>General Inquiry</option>
              </select>
            </div>

            <div className="mb-4 grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Full Name"
                required
                className="rounded-sm border border-border-light bg-white px-4 py-3 text-sm text-text-primary outline-none transition-colors focus:border-brand"
              />
              <input
                type="email"
                placeholder="Email Address"
                required
                className="rounded-sm border border-border-light bg-white px-4 py-3 text-sm text-text-primary outline-none transition-colors focus:border-brand"
              />
            </div>

            <div className="mb-4 grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Company"
                className="rounded-sm border border-border-light bg-white px-4 py-3 text-sm text-text-primary outline-none transition-colors focus:border-brand"
              />
              <input
                type="tel"
                placeholder="Phone"
                className="rounded-sm border border-border-light bg-white px-4 py-3 text-sm text-text-primary outline-none transition-colors focus:border-brand"
              />
            </div>

            <textarea
              placeholder="Tell us about your regulatory challenge..."
              rows={4}
              className="mb-6 w-full resize-y rounded-sm border border-border-light bg-white px-4 py-3 text-sm text-text-primary outline-none transition-colors focus:border-brand"
            />

            <button
              type="submit"
              className="rounded-sm bg-brand px-8 py-3.5 text-sm font-bold uppercase tracking-[0.06em] text-white shadow-lg shadow-brand/20 transition-all hover:bg-brand-dark hover:shadow-xl hover:shadow-brand/25 active:scale-[0.98]"
            >
              Send Message
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
