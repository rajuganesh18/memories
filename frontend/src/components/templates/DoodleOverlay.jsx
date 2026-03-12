/**
 * Minimal hand-drawn doodle overlays for each album theme.
 * These render as SVG decorations on white pages, giving a
 * delicate, artisanal feel around photo slots.
 */

const DOODLE_COLOR = '#D4C4B0'; // warm taupe, very subtle

function BabyDoodles({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Stars scattered */}
      <path d="M50 30l3 9h9l-7 5 3 9-7-5-7 5 3-9-7-5h9z" stroke={DOODLE_COLOR} strokeWidth="1" fill="none" />
      <path d="M350 50l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z" stroke={DOODLE_COLOR} strokeWidth="1" fill="none" />
      <path d="M30 350l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z" stroke={DOODLE_COLOR} strokeWidth="1" fill="none" />
      {/* Cloud */}
      <path d="M320 340c-3-8-10-12-18-12-6 0-12 3-15 8-2-3-6-5-10-5-8 0-14 6-14 14h64c0-6-3-10-7-10z" stroke={DOODLE_COLOR} strokeWidth="1" fill="none" />
      {/* Moon */}
      <path d="M360 370c8-5 12-14 10-23-6 6-14 8-22 5s-14-10-15-18c-8 5-12 14-10 23s10 15 18 17 14-1 19-4z" stroke={DOODLE_COLOR} strokeWidth="1" fill="none" />
      {/* Heart */}
      <path d="M40 370c0 0 15-20 15-30 0-6-3-10-8-10s-7 4-7 10c0-6-2-10-7-10s-8 4-8 10c0 10 15 30 15 30z" stroke={DOODLE_COLOR} strokeWidth="1" fill="none" />
      {/* Dots */}
      <circle cx="100" cy="20" r="2" fill={DOODLE_COLOR} opacity="0.4" />
      <circle cx="200" cy="15" r="1.5" fill={DOODLE_COLOR} opacity="0.3" />
      <circle cx="300" cy="25" r="2" fill={DOODLE_COLOR} opacity="0.4" />
      <circle cx="380" cy="200" r="1.5" fill={DOODLE_COLOR} opacity="0.3" />
      <circle cx="20" cy="200" r="1.5" fill={DOODLE_COLOR} opacity="0.3" />
    </svg>
  );
}

function WeddingDoodles({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Floral corner top-left */}
      <path d="M20 40c10-5 15-15 12-25M20 40c-5-10-15-15-15-15" stroke={DOODLE_COLOR} strokeWidth="1" />
      <path d="M15 30c5-2 8 0 10 3s2 7-1 9" stroke={DOODLE_COLOR} strokeWidth="0.8" />
      <path d="M25 25c3 3 3 7 1 10s-6 4-9 2" stroke={DOODLE_COLOR} strokeWidth="0.8" />
      <circle cx="20" cy="32" r="2" fill={DOODLE_COLOR} opacity="0.3" />
      {/* Floral corner bottom-right */}
      <path d="M380 360c-10 5-15 15-12 25M380 360c5 10 15 15 15 15" stroke={DOODLE_COLOR} strokeWidth="1" />
      <path d="M385 370c-5 2-8 0-10-3s-2-7 1-9" stroke={DOODLE_COLOR} strokeWidth="0.8" />
      <circle cx="380" cy="368" r="2" fill={DOODLE_COLOR} opacity="0.3" />
      {/* Rings */}
      <circle cx="355" cy="30" r="8" stroke={DOODLE_COLOR} strokeWidth="1" fill="none" />
      <circle cx="365" cy="30" r="8" stroke={DOODLE_COLOR} strokeWidth="1" fill="none" />
      {/* Leaf sprigs */}
      <path d="M30 370l8-15M34 362c-4-1-7 1-7 4" stroke={DOODLE_COLOR} strokeWidth="0.8" />
      <path d="M30 370l-5-16M28 360c4-1 7 1 7 4" stroke={DOODLE_COLOR} strokeWidth="0.8" />
      {/* Dots */}
      <circle cx="200" cy="12" r="1.5" fill={DOODLE_COLOR} opacity="0.3" />
      <circle cx="200" cy="388" r="1.5" fill={DOODLE_COLOR} opacity="0.3" />
    </svg>
  );
}

function TravelDoodles({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Compass top-right */}
      <circle cx="365" cy="35" r="15" stroke={DOODLE_COLOR} strokeWidth="1" />
      <path d="M365 20v30M350 35h30" stroke={DOODLE_COLOR} strokeWidth="0.8" />
      <path d="M365 22l2 8-2-2-2 2z" fill={DOODLE_COLOR} opacity="0.4" />
      {/* Mountains bottom-left */}
      <path d="M15 380l25-35 15 15 20-25 25 45" stroke={DOODLE_COLOR} strokeWidth="1" fill="none" />
      {/* Paper plane */}
      <path d="M340 360l25-15-20 20-3-12z" stroke={DOODLE_COLOR} strokeWidth="0.8" fill="none" />
      <path d="M342 353l10 2" stroke={DOODLE_COLOR} strokeWidth="0.6" strokeDasharray="2 2" />
      {/* Dotted trail */}
      <path d="M30 30c20 5 40 2 55 10" stroke={DOODLE_COLOR} strokeWidth="0.8" strokeDasharray="3 4" />
      {/* Dots */}
      <circle cx="200" cy="15" r="1.5" fill={DOODLE_COLOR} opacity="0.3" />
      <circle cx="385" cy="200" r="1.5" fill={DOODLE_COLOR} opacity="0.3" />
      <circle cx="15" cy="200" r="1.5" fill={DOODLE_COLOR} opacity="0.3" />
    </svg>
  );
}

function BirthdayDoodles({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Balloon top-left */}
      <ellipse cx="40" cy="30" rx="10" ry="13" stroke={DOODLE_COLOR} strokeWidth="1" />
      <path d="M40 43l-1 3 2 0-1 3 2 0-1 15" stroke={DOODLE_COLOR} strokeWidth="0.8" />
      {/* Balloon top-right */}
      <ellipse cx="360" cy="35" rx="8" ry="11" stroke={DOODLE_COLOR} strokeWidth="1" />
      <path d="M360 46l1 3-2 0 1 3-2 0 1 12" stroke={DOODLE_COLOR} strokeWidth="0.8" />
      {/* Confetti dots */}
      <rect x="70" y="15" width="4" height="4" rx="0.5" transform="rotate(30 72 17)" stroke={DOODLE_COLOR} strokeWidth="0.8" fill="none" />
      <rect x="320" y="20" width="3" height="3" rx="0.5" transform="rotate(-20 321 21)" stroke={DOODLE_COLOR} strokeWidth="0.8" fill="none" />
      <circle cx="150" cy="10" r="2" fill={DOODLE_COLOR} opacity="0.3" />
      <circle cx="250" cy="12" r="1.5" fill={DOODLE_COLOR} opacity="0.3" />
      {/* Star bottom-left */}
      <path d="M35 365l3 9h9l-7 5 3 9-7-5-7 5 3-9-7-5h9z" stroke={DOODLE_COLOR} strokeWidth="0.8" fill="none" />
      {/* Gift bottom-right */}
      <rect x="350" y="360" width="20" height="16" rx="1" stroke={DOODLE_COLOR} strokeWidth="1" fill="none" />
      <path d="M360 360v16M350 368h20" stroke={DOODLE_COLOR} strokeWidth="0.8" />
      <path d="M355 360c3-5 5-7 5-7s2 2 5 7" stroke={DOODLE_COLOR} strokeWidth="0.8" fill="none" />
    </svg>
  );
}

function FamilyDoodles({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Tree branch top-left */}
      <path d="M10 50c15-10 25-20 40-25" stroke={DOODLE_COLOR} strokeWidth="1" />
      <path d="M30 35c-3-6-1-10 3-11" stroke={DOODLE_COLOR} strokeWidth="0.8" />
      <path d="M38 30c-5-4-3-9 1-10" stroke={DOODLE_COLOR} strokeWidth="0.8" />
      <path d="M22 42c-2-5 0-9 4-10" stroke={DOODLE_COLOR} strokeWidth="0.8" />
      {/* Leaf */}
      <path d="M45 25c3-3 8-2 10 1s1 8-2 10c-3-3-8-2-10-1s-1-8 2-10z" stroke={DOODLE_COLOR} strokeWidth="0.8" fill="none" />
      {/* Heart bottom-right */}
      <path d="M370 370c0 0 10-13 10-20 0-4-2-7-5-7s-5 3-5 7c0-4-2-7-5-7s-5 3-5 7c0 7 10 20 10 20z" stroke={DOODLE_COLOR} strokeWidth="1" fill="none" />
      {/* House bottom-left */}
      <rect x="25" y="365" width="18" height="14" rx="1" stroke={DOODLE_COLOR} strokeWidth="0.8" fill="none" />
      <path d="M22 365l12-10 12 10" stroke={DOODLE_COLOR} strokeWidth="0.8" fill="none" />
      <rect x="31" y="372" width="5" height="7" rx="0.5" stroke={DOODLE_COLOR} strokeWidth="0.6" fill="none" />
      {/* Birds top-right */}
      <path d="M340 30c3-3 6-3 8 0" stroke={DOODLE_COLOR} strokeWidth="0.8" fill="none" />
      <path d="M355 25c3-3 6-3 8 0" stroke={DOODLE_COLOR} strokeWidth="0.8" fill="none" />
      {/* Dots */}
      <circle cx="200" cy="12" r="1.5" fill={DOODLE_COLOR} opacity="0.3" />
      <circle cx="385" cy="200" r="1.5" fill={DOODLE_COLOR} opacity="0.3" />
    </svg>
  );
}

function GraduationDoodles({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Grad cap top-right */}
      <path d="M350 30l20 8-20 8-20-8z" stroke={DOODLE_COLOR} strokeWidth="1" fill="none" />
      <path d="M350 38v10" stroke={DOODLE_COLOR} strokeWidth="0.8" />
      <path d="M340 35v8c0 3 5 5 10 5s10-2 10-5v-8" stroke={DOODLE_COLOR} strokeWidth="0.8" fill="none" />
      <path d="M370 38v6" stroke={DOODLE_COLOR} strokeWidth="0.8" />
      <circle cx="370" cy="46" r="1.5" fill={DOODLE_COLOR} opacity="0.4" />
      {/* Open book bottom-left */}
      <path d="M20 375c10-5 18-3 25 0" stroke={DOODLE_COLOR} strokeWidth="0.8" />
      <path d="M20 375c-10-5-14-3-15 0" stroke={DOODLE_COLOR} strokeWidth="0.8" />
      <path d="M20 370v5M8 370v5M45 370v5" stroke={DOODLE_COLOR} strokeWidth="0.6" />
      {/* Stars */}
      <path d="M40 25l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z" stroke={DOODLE_COLOR} strokeWidth="0.8" fill="none" />
      <path d="M360 365l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z" stroke={DOODLE_COLOR} strokeWidth="0.8" fill="none" />
      {/* Laurel */}
      <path d="M15 200c3-5 8-6 12-4" stroke={DOODLE_COLOR} strokeWidth="0.7" />
      <path d="M15 210c3-5 8-6 12-4" stroke={DOODLE_COLOR} strokeWidth="0.7" />
      <path d="M15 220c3-5 8-6 12-4" stroke={DOODLE_COLOR} strokeWidth="0.7" />
      {/* Dots */}
      <circle cx="200" cy="12" r="1.5" fill={DOODLE_COLOR} opacity="0.3" />
      <circle cx="200" cy="388" r="1.5" fill={DOODLE_COLOR} opacity="0.3" />
    </svg>
  );
}

const THEME_DOODLES = {
  baby: BabyDoodles,
  wedding: WeddingDoodles,
  travel: TravelDoodles,
  birthday: BirthdayDoodles,
  family: FamilyDoodles,
  graduation: GraduationDoodles,
};

export default function DoodleOverlay({ theme, className = '' }) {
  const DoodleComponent = THEME_DOODLES[theme] || BabyDoodles;
  return <DoodleComponent className={className} />;
}

export { THEME_DOODLES };
