/* SVG geometric icons — minimal, corporate, science-themed */

export function CellIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="16" cy="16" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function GeneIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 16 Q16 4 26 16 Q16 28 6 16Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 16 Q16 28 26 16 Q16 4 6 16Z" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
      <circle cx="16" cy="16" r="1.8" fill="currentColor" />
    </svg>
  );
}

export function RareIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="24" height="24" rx="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="6" stroke="currentColor" strokeWidth="1.2" />
      <path d="M16 10v12M10 16h12" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function ImmunoIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 4L20 12L28 14L20 20L22 28L16 24L10 28L12 20L4 14L12 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="16" cy="16" r="3" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function TissueIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="6" width="20" height="20" rx="6" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="13" cy="13" r="3" stroke="currentColor" strokeWidth="1" />
      <circle cx="19" cy="19" r="3" stroke="currentColor" strokeWidth="1" />
      <circle cx="19" cy="13" r="3" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function DrugIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 24L24 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="20" cy="20" r="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <circle cx="20" cy="20" r="2" fill="currentColor" />
    </svg>
  );
}

export function BiologicsIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 4C9.4 4 4 9.4 4 16s5.4 12 12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 4c6.6 0 12 5.4 12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 2" />
      <path d="M16 4v24" stroke="currentColor" strokeWidth="1" />
      <circle cx="16" cy="16" r="2" fill="currentColor" />
    </svg>
  );
}

export function DeviceIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="8" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="4" stroke="currentColor" strokeWidth="1.2" />
      <path d="M16 12v8M12 16h8" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function ComboIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="21" cy="21" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 14l4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="11" cy="11" r="1.5" fill="currentColor" />
      <circle cx="21" cy="21" r="1.5" fill="currentColor" />
    </svg>
  );
}

export const EXPERTISE_ICONS = [
  { Icon: CellIcon },
  { Icon: GeneIcon },
  { Icon: RareIcon },
  { Icon: ImmunoIcon },
  { Icon: TissueIcon },
  { Icon: DrugIcon },
  { Icon: BiologicsIcon },
  { Icon: DeviceIcon },
  { Icon: ComboIcon },
];
