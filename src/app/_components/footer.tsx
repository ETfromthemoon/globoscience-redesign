export default function Footer() {
  return (
    <footer className="border-t border-border-light bg-bg-light py-16">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mb-10 grid gap-8 sm:grid-cols-3">
          <div>
            <h3 className="mb-3 font-heading text-xl font-bold text-brand">
              GloboScience <span className="text-text-primary">{ }</span>
            </h3>
            <p className="max-w-[320px] text-sm leading-relaxed text-text-body">
              Win your therapeutic area with GloboScience. Architects of
              innovative regulatory pathways from molecule to marketplace.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.1em] text-brand">
              Navigate
            </h4>
            <nav className="flex flex-col gap-2">
              {["About", "Expertise", "Why Us", "Locations", "Contact"].map(
                (label) => (
                  <a
                    key={label}
                    href={`#${label.toLowerCase().replace(/\s/g, "-")}`}
                    className="text-sm text-text-body transition-colors hover:text-brand"
                  >
                    {label}
                  </a>
                ),
              )}
            </nav>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.1em] text-brand">
              Connect
            </h4>
            <div className="flex gap-3">
              <a
                href="https://www.linkedin.com/company/40735184/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border-light text-sm text-text-body transition-all hover:border-brand hover:bg-brand/5 hover:text-brand"
                aria-label="LinkedIn"
              >
                in
              </a>
              <a
                href="mailto:innovate@globoscience.com"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border-light text-sm text-text-body transition-all hover:border-brand hover:bg-brand/5 hover:text-brand"
                aria-label="Email"
              >
                @
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border-light pt-6 text-xs text-text-body">
          <p>&copy; 2026 GloboScience Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
