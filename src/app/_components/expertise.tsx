"use client";

import { useRef, useEffect } from "react";
import ModuleSlider from "./module-slider";
import AnimatedIcon from "./animated-icon";
import {
  CellIcon, GeneIcon, RareIcon, ImmunoIcon, TissueIcon,
  DrugIcon, BiologicsIcon, DeviceIcon, ComboIcon,
} from "./icons";

const EXPERTISE = [
  { title: "Cell Therapy", desc: "CAR-T, TCR, and NK cell product regulatory strategy", icon: CellIcon },
  { title: "Gene Therapy", desc: "AAV, lentiviral, and CRISPR-based therapeutics", icon: GeneIcon },
  { title: "Rare Diseases", desc: "Orphan drug designation and accelerated approval strategies", icon: RareIcon },
  { title: "Immunotherapy", desc: "Checkpoint inhibitors, bispecifics, and cancer vaccines", icon: ImmunoIcon },
  { title: "Advanced Tissue", desc: "Regenerative medicine and tissue-engineered products", icon: TissueIcon },
  { title: "Drugs", desc: "Small molecules and new chemical entities across all therapeutic areas", icon: DrugIcon },
  { title: "Biologics", desc: "Monoclonal antibodies, fusion proteins, and biosimilars", icon: BiologicsIcon },
  { title: "Devices", desc: "510(k), De Novo, PMA pathways for medical devices", icon: DeviceIcon },
  { title: "Combination Products", desc: "Drug-device and biologic-device combination regulatory strategy", icon: ComboIcon },
];

export default function Expertise() {
  const headerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); obs.unobserve(e.target); } },
      { threshold: 0.1 }
    );
    [headerRef.current, sliderRef.current].forEach((el) => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <section id="expertise" className="relative overflow-hidden bg-bg-alt py-32">
      <div className="pointer-events-none absolute inset-0 bg-hexgrid opacity-50" />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6">
        <div ref={headerRef} className="scroll-reveal mb-20 text-center">
          <span className="mb-3 block text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand">
            Our Expertise
          </span>
          <h2 className="mb-5 font-heading text-[clamp(2rem,3.2vw,2.8rem)] font-bold tracking-[-0.02em] text-text-primary">
            From laboratory to <span className="text-brand">approved label</span>
          </h2>
          <p className="mx-auto max-w-[560px] text-[0.9375rem] leading-relaxed text-text-body">
            We&apos;ve worked in all therapeutic areas, with all technologies,
            in all routes of administration.
          </p>
        </div>

        {/* Slider: Card hero + navegación */}
        <div ref={sliderRef} className="scroll-reveal mx-auto max-w-2xl">
          <ModuleSlider
            items={EXPERTISE}
            renderItem={(item) => (
              <div className="flex flex-col items-center text-center py-4">
                <AnimatedIcon className="mb-6 text-brand">
                  {<item.icon />}
                </AnimatedIcon>
                <h3 className="mb-3 font-heading text-xl font-semibold text-white">
                  {item.title}
                </h3>
                <p className="max-w-md text-[0.9375rem] leading-relaxed text-white/55">
                  {item.desc}
                </p>
                <span className="mt-6 inline-block text-[0.65rem] font-bold uppercase tracking-[0.12em] text-brand">
                  {String(EXPERTISE.indexOf(item) + 1).padStart(2, "0")} / {String(EXPERTISE.length).padStart(2, "0")}
                </span>
              </div>
            )}
          />
        </div>
      </div>
    </section>
  );
}
