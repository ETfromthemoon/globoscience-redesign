"use client";

import { useRef, useEffect } from "react";
import {
  CellIcon, GeneIcon, RareIcon, ImmunoIcon, TissueIcon,
  DrugIcon, BiologicsIcon, DeviceIcon, ComboIcon,
} from "./icons";

const EXPERTISE = [
  { title: "Cell Therapy", desc: "CAR-T, TCR, and NK cell product regulatory strategy", Icon: CellIcon },
  { title: "Gene Therapy", desc: "AAV, lentiviral, and CRISPR-based therapeutics", Icon: GeneIcon },
  { title: "Rare Diseases", desc: "Orphan drug designation and accelerated approval", Icon: RareIcon },
  { title: "Immunotherapy", desc: "Checkpoint inhibitors, bispecifics, cancer vaccines", Icon: ImmunoIcon },
  { title: "Advanced Tissue", desc: "Regenerative medicine and tissue-engineered products", Icon: TissueIcon },
  { title: "Drugs", desc: "Small molecules across all therapeutic areas", Icon: DrugIcon },
  { title: "Biologics", desc: "Monoclonal antibodies, fusion proteins, biosimilars", Icon: BiologicsIcon },
  { title: "Devices", desc: "510(k), De Novo, PMA pathways for medical devices", Icon: DeviceIcon },
  { title: "Combination Products", desc: "Drug-device and biologic-device strategy", Icon: ComboIcon },
];

export default function Expertise() {
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); obs.unobserve(e.target); } },
      { threshold: 0.1 }
    );
    [headerRef.current, gridRef.current].forEach((el) => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <section id="expertise" className="relative overflow-hidden bg-bg-alt py-28">
      <div className="pointer-events-none absolute inset-0 bg-hexgrid opacity-50" />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6">
        <div ref={headerRef} className="scroll-reveal mb-20 text-center">
          <span className="mb-3 block text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand">
            Our Expertise
          </span>
          <h2 className="mb-5 font-heading text-[clamp(2rem,3.2vw,2.8rem)] font-bold tracking-[-0.015em] text-text-primary">
            From laboratory to <span className="text-brand">approved label</span>
          </h2>
          <p className="mx-auto max-w-[560px] text-base text-text-body">
            We&apos;ve worked in all therapeutic areas, with all technologies,
            in all routes of administration.
          </p>
        </div>

        <div ref={gridRef} className="stagger grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {EXPERTISE.map(({ title, desc, Icon }) => (
            <div
              key={title}
              className="glass-light glass-sheen group cursor-pointer rounded-sm px-6 py-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-brand/15 hover:shadow-lg hover:shadow-brand/5"
            >
              <div className="mb-5 text-brand transition-transform duration-500 group-hover:scale-110">
                <Icon />
              </div>
              <h3 className="mb-2 font-heading text-base font-semibold text-text-primary">
                {title}
              </h3>
              <p className="text-[0.85rem] leading-relaxed text-text-body">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
