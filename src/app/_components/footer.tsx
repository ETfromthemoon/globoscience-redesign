export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-black/[0.06] bg-white py-16">
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-30" />
      <div className="relative z-10 mx-auto max-w-[1200px] px-6">
        <div className="mb-12 grid gap-10 sm:grid-cols-3">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <svg width="22" height="22" viewBox="0 0 28 28">
                <circle cx="14" cy="14" r="12" stroke="#E91F27" strokeWidth="1.2" fill="none" />
                <circle cx="14" cy="14" r="3.5" fill="#E91F27" />
                <line x1="14" y1="2" x2="14" y2="10.5" stroke="#E91F27" strokeWidth="1.2" />
                <line x1="14" y1="17.5" x2="14" y2="26" stroke="#E91F27" strokeWidth="1.2" />
                <line x1="2" y1="14" x2="10.5" y2="14" stroke="#E91F27" strokeWidth="1.2" />
                <line x1="17.5" y1="14" x2="26" y2="14" stroke="#E91F27" strokeWidth="1.2" />
              </svg>
              <h3 className="font-heading text-lg font-bold text-text-primary">
                GloboScience
              </h3>
            </div>
            <p className="max-w-[300px] text-sm leading-relaxed text-text-body">
              Win your therapeutic area with GloboScience. Architects of
              innovative regulatory pathways from molecule to marketplace.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-brand">
              Navigate
            </h4>
            <nav className="flex flex-col gap-2.5">
              {["About", "Expertise", "Why Us", "Locations", "Contact"].map((label) => (
                <a
                  key={label}
                  href={`#${label.toLowerCase().replace(/\s/g, "-")}`}
                  className="text-sm text-text-body transition-colors hover:text-brand"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="mb-4 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-brand">
              Connect
            </h4>
            <div className="flex gap-3">
              <a
                href="https://www.linkedin.com/company/40735184/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-black/[0.08] text-sm text-text-body transition-all hover:border-brand hover:text-brand"
                aria-label="LinkedIn"
              >
                in
              </a>
              <a
                href="mailto:innovate@globoscience.com"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-black/[0.08] text-sm text-text-body transition-all hover:border-brand hover:text-brand"
                aria-label="Email"
              >
                @
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-black/[0.06] pt-6">
          <p className="text-xs text-text-muted">
            &copy; 2026 GloboScience Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
