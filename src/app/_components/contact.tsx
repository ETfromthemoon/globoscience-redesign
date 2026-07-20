"use client";

import { useRef, useEffect } from "react";

export default function Contact() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.querySelectorAll(".scroll-reveal").forEach((c) => c.classList.add("is-visible"));
          obs.unobserve(e.target);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="contact" ref={ref} className="section-pad relative overflow-hidden bg-bg-primary">
      <div className="pointer-events-none absolute inset-0 bg-molecular opacity-20" />

      <div className="relative z-10 mx-auto grid max-w-[1200px] gap-16 px-6 lg:grid-cols-2">
        {/* Info */}
        <div>
          <div className="scroll-reveal mb-14">
            <span className="eyebrow mb-4">
              Let&apos;s Talk
            </span>
            <h2 className="heading-2 mb-5">
              Start the <span className="text-brand">conversation</span>
            </h2>
            <p className="max-w-[440px] leading-relaxed text-text-body">
              If exceptional experience, transformative solutions, and verifiable
              success are your criteria for a regulatory strategy partner, your
              search ends here.
            </p>
          </div>

          <div className="scroll-reveal space-y-6">
            {[
              { icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", label: "Email", value: "innovate@globoscience.com" },
              { icon: "M3 5h18v14H3zM3 5a2 2 0 012-2h14a2 2 0 012 2M16 3.5V7m-8-3.5V7", label: "Phone", value: "+1 617 583 5727" },
              { icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z", label: "Headquarters", value: "One Washington Mall, Suite #1066, Boston, MA 02108", circle: "M12 7a3 3 0 100 6 3 3 0 000-6z" },
            ].map(({ icon, label, value, circle }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand/6 text-brand">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={icon} />
                    {circle && <circle cx="12" cy="10" r="3" />}
                  </svg>
                </div>
                <div>
                  <p className="mb-0.5 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-brand/60">{label}</p>
                  <p className="text-sm text-text-body">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="scroll-reveal">
          <form
            className="glass-dark glass-sheen rounded-sm p-8"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="mb-4">
              <select
                className="w-full cursor-pointer rounded-sm border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-brand"
                required
                defaultValue=""
              >
                <option value="" disabled className="text-gray-500">
                  I&apos;m interested in...
                </option>
                <option className="text-gray-800">Regulatory Strategy</option>
                <option className="text-gray-800">Product Development Consulting</option>
                <option className="text-gray-800">Clinical Development Optimization</option>
                <option className="text-gray-800">FDA / EMA Meeting Preparation</option>
                <option className="text-gray-800">General Inquiry</option>
              </select>
            </div>

            <div className="mb-4 grid gap-4 sm:grid-cols-2">
              <input type="text" placeholder="Full Name" required className="rounded-sm border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 transition-colors focus:border-brand" />
              <input type="email" placeholder="Email Address" required className="rounded-sm border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 transition-colors focus:border-brand" />
            </div>

            <div className="mb-4 grid gap-4 sm:grid-cols-2">
              <input type="text" placeholder="Company" className="rounded-sm border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 transition-colors focus:border-brand" />
              <input type="tel" placeholder="Phone" className="rounded-sm border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 transition-colors focus:border-brand" />
            </div>

            <textarea
              placeholder="Tell us about your regulatory challenge..."
              rows={4}
              className="mb-6 w-full resize-y rounded-sm border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 transition-colors focus:border-brand"
            />

            <button type="submit"
              className="btn-ghost rounded-sm px-10 py-3.5 text-sm">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
