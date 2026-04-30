interface IconProps {
  className?: string;
}

export function BrandMark({ className }: IconProps) {
  return (
    <img
      className={className}
      src="https://www.qhms.com/uploads/QHC_logo_401be2b48f.png?w=640&q=100"
      alt="Quality HealthCare"
      loading="eager"
      decoding="async"
    />
  );
}

export function ECGIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 120 90" className={className} aria-hidden="true">
      <rect x="14" y="12" width="92" height="60" rx="6" fill="none" stroke="currentColor" strokeWidth="4" />
      <path
        d="M24 44h18l8-10 8 24 10-20 8 10h18"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M25 30c0-5 4-9 9-9 4 0 8 4 8 9 0 7-9 12-9 12s-8-5-8-12Z"
        fill="currentColor"
        opacity="0.9"
      />
      <line x1="25" y1="62" x2="55" y2="62" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <line x1="75" y1="28" x2="95" y2="28" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <line x1="75" y1="38" x2="95" y2="38" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <line x1="75" y1="48" x2="95" y2="48" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function BloodIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 120 96" className={className} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="14" y="64" width="92" height="12" />
        <path d="M24 22h18" />
        <path d="M51 22h18" />
        <path d="M78 22h18" />
        <path d="M28 22v12M34 22v12M40 22v12" />
        <path d="M55 22v12M61 22v12M67 22v12" />
        <path d="M82 22v12M88 22v12M94 22v12" />
        <path d="M28 34v30c0 8 6 14 14 14s14-6 14-14V34" />
        <path d="M55 34v30c0 8 6 14 14 14s14-6 14-14V34" />
        <path d="M1 1" stroke="none" />
        <path d="M1 1" stroke="none" />
        <path d="M82 34v30c0 8 6 14 14 14s14-6 14-14V34" />
        <path d="M20 42h24" />
        <path d="M47 42h24" />
        <path d="M74 42h24" />
      </g>
      <rect x="32" y="48" width="8" height="18" rx="2" fill="currentColor" opacity="0.9" />
      <rect x="59" y="40" width="8" height="26" rx="2" fill="currentColor" opacity="0.9" />
      <rect x="86" y="48" width="8" height="18" rx="2" fill="currentColor" opacity="0.9" />
    </svg>
  );
}

export function ComboIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 120 96" className={className} aria-hidden="true">
      <path
        d="M38 22c9 0 16 7 22 16 6-9 13-16 22-16 12 0 21 10 21 22 0 20-19 34-43 48-24-14-43-28-43-48 0-12 9-22 21-22Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M25 48h18l7-9 7 22 8-18 7 7h15"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M70 42c8 2 14 10 14 18 0 11-11 20-24 22"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M73 39c6 5 10 12 10 19"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d="M21 22c-4 4-6 9-6 15" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M13 18c-3 4-5 9-5 14" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function FileDoctorIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
      <path
        d="M46 10H22c-4 0-7 3-7 7v44c0 4 3 7 7 7h34c4 0 7-3 7-7V27L46 10Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M46 10v17h17" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="M35 34h16M35 42h16M35 50h12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="24" cy="40" r="7" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M16 60c1-7 7-11 8-11s7 4 8 11" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M22 34h4v12h-4Z" fill="currentColor" opacity="0.85" />
      <path d="M18 38h12v4H18Z" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

export function CalendarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect x="6" y="10" width="36" height="30" rx="4" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M6 18h36" stroke="currentColor" strokeWidth="3" />
      <path d="M16 6v8M32 6v8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M14 24h6M24 24h6M14 31h6M24 31h6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="18" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M24 14v11l8 4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 5h12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function UserIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="24" cy="15" r="8" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M10 40c2-9 8-14 14-14s12 5 14 14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function PhoneIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect x="14" y="4" width="20" height="40" rx="4" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M20 10h8M22 36h4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
