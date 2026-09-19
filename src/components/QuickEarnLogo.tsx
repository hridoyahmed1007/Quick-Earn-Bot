import React from 'react';

interface QuickEarnLogoProps {
  className?: string;
  size?: number | string;
  glow?: boolean;
}

export const QuickEarnLogo: React.FC<QuickEarnLogoProps> = ({
  className = '',
  size = '100%',
  glow = true,
}) => {
  return (
    <svg
      viewBox="0 0 500 500"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
      style={{ imageRendering: 'crisp-edges' }}
    >
      <defs>
        {/* Outer Ring Gradients */}
        <linearGradient id="qe_outer_ring" x1="50" y1="50" x2="450" y2="450" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="45%" stopColor="#22C55E" />
          <stop offset="75%" stopColor="#16A34A" />
          <stop offset="100%" stopColor="#15803D" />
        </linearGradient>

        <linearGradient id="qe_outer_ring_glow" x1="0" y1="0" x2="500" y2="500" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#86EFAC" />
          <stop offset="50%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#14532D" />
        </linearGradient>

        {/* Dark Circular Background */}
        <radialGradient id="qe_dark_bg" cx="250" cy="250" r="240" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0D1A10" />
          <stop offset="65%" stopColor="#070D08" />
          <stop offset="100%" stopColor="#040604" />
        </radialGradient>

        {/* Cash Notes Gradient */}
        <linearGradient id="qe_cash_grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#86EFAC" />
          <stop offset="50%" stopColor="#4ADE80" />
          <stop offset="100%" stopColor="#16A34A" />
        </linearGradient>

        {/* Cash Accent Stroke */}
        <linearGradient id="qe_cash_stroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#BBF7D0" />
          <stop offset="100%" stopColor="#15803D" />
        </linearGradient>

        {/* Wallet Main Body Gradient */}
        <linearGradient id="qe_wallet_grad" x1="130" y1="90" x2="350" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="30%" stopColor="#22C55E" />
          <stop offset="85%" stopColor="#16A34A" />
          <stop offset="100%" stopColor="#15803D" />
        </linearGradient>

        {/* Wallet Highlight Line */}
        <linearGradient id="qe_wallet_highlight" x1="160" y1="95" x2="330" y2="95" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#86EFAC" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#22C55E" stopOpacity="0.1" />
        </linearGradient>

        {/* Clasp Metallic Button */}
        <radialGradient id="qe_rivet_grad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="45%" stopColor="#E2E8F0" />
          <stop offset="80%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#475569" />
        </radialGradient>

        {/* 3D Chrome Text Gradient for "Quick" */}
        <linearGradient id="qe_chrome_text" x1="250" y1="200" x2="250" y2="280" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="48%" stopColor="#F1F5F9" />
          <stop offset="52%" stopColor="#CBD5E1" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>

        {/* 3D Lime Neon Text Gradient for "Earn" */}
        <linearGradient id="qe_earn_text" x1="250" y1="285" x2="250" y2="385" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#BBF7D0" />
          <stop offset="25%" stopColor="#4ADE80" />
          <stop offset="70%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#15803D" />
        </linearGradient>

        {/* Drop Shadows and Filters */}
        <filter id="qe_glow_filter" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <filter id="qe_text_shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#000000" floodOpacity="0.85" />
        </filter>

        <filter id="qe_deep_shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.9" />
        </filter>
      </defs>

      {/* Outer Glow Ring (if enabled) */}
      {glow && (
        <circle
          cx="250"
          cy="250"
          r="234"
          stroke="url(#qe_outer_ring_glow)"
          strokeWidth="10"
          opacity="0.45"
          filter="url(#qe_glow_filter)"
        />
      )}

      {/* Main Circular Dark Badge Plate */}
      <circle
        cx="250"
        cy="250"
        r="232"
        fill="url(#qe_dark_bg)"
      />

      {/* Subtle Inner Carbon/Tech Background Lines */}
      <g opacity="0.08">
        <circle cx="250" cy="250" r="220" stroke="#4ADE80" strokeWidth="1" strokeDasharray="4 6" />
        <circle cx="250" cy="250" r="195" stroke="#4ADE80" strokeWidth="0.75" />
        <circle cx="250" cy="250" r="160" stroke="#4ADE80" strokeWidth="0.5" strokeDasharray="3 5" />
      </g>

      {/* Outer Metallic Green Rim */}
      <circle
        cx="250"
        cy="250"
        r="232"
        stroke="url(#qe_outer_ring)"
        strokeWidth="6.5"
      />
      <circle
        cx="250"
        cy="250"
        r="228"
        stroke="#040604"
        strokeWidth="1.5"
      />

      {/* ======================================================== */}
      {/* 1. TOP CASH BANKNOTES (Bursting from wallet) */}
      {/* ======================================================== */}
      <g filter="url(#qe_text_shadow)">
        {/* Left Note (Angled Left -18deg) */}
        <g transform="rotate(-18 210 95)">
          <rect
            x="175"
            y="48"
            width="72"
            height="48"
            rx="5"
            fill="url(#qe_cash_grad)"
            stroke="url(#qe_cash_stroke)"
            strokeWidth="2.5"
          />
          <rect x="180" y="53" width="62" height="38" rx="3" stroke="#15803D" strokeWidth="1" fill="none" opacity="0.6" />
          <circle cx="211" cy="72" r="10" fill="#16A34A" opacity="0.7" />
          <text x="211" y="76" fill="#DCFCE7" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">$</text>
        </g>

        {/* Right Note (Angled Right +18deg) */}
        <g transform="rotate(18 290 95)">
          <rect
            x="253"
            y="48"
            width="72"
            height="48"
            rx="5"
            fill="url(#qe_cash_grad)"
            stroke="url(#qe_cash_stroke)"
            strokeWidth="2.5"
          />
          <rect x="258" y="53" width="62" height="38" rx="3" stroke="#15803D" strokeWidth="1" fill="none" opacity="0.6" />
          <circle cx="289" cy="72" r="10" fill="#16A34A" opacity="0.7" />
          <text x="289" y="76" fill="#DCFCE7" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">$</text>
        </g>

        {/* Center Note (Straight Up) */}
        <g>
          <rect
            x="212"
            y="40"
            width="76"
            height="52"
            rx="5"
            fill="url(#qe_cash_grad)"
            stroke="url(#qe_cash_stroke)"
            strokeWidth="2.5"
          />
          <rect x="218" y="46" width="64" height="40" rx="3" stroke="#15803D" strokeWidth="1" fill="none" opacity="0.7" />
          <circle cx="250" cy="66" r="11" fill="#16A34A" opacity="0.8" />
          <text x="250" y="70" fill="#FFFFFF" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">$</text>
        </g>
      </g>

      {/* ======================================================== */}
      {/* 2. SPEED WALLET BODY & MOTION PARTICLES */}
      {/* ======================================================== */}
      <g filter="url(#qe_deep_shadow)">
        {/* Speed Trails / Motion Dashes on Left */}
        {/* Top dash */}
        <rect x="145" y="108" width="40" height="7" rx="3.5" fill="#4ADE80" />
        <rect x="132" y="108" width="8" height="7" rx="3.5" fill="#4ADE80" opacity="0.75" />
        
        {/* Upper middle dash */}
        <rect x="135" y="122" width="48" height="8" rx="4" fill="#22C55E" />
        <rect x="120" y="122" width="10" height="8" rx="4" fill="#22C55E" opacity="0.6" />

        {/* Center long dash */}
        <rect x="125" y="137" width="58" height="8.5" rx="4.25" fill="#22C55E" />
        <rect x="108" y="137" width="12" height="8.5" rx="4.25" fill="#4ADE80" opacity="0.7" />

        {/* Lower middle dash */}
        <rect x="138" y="152" width="46" height="8" rx="4" fill="#16A34A" />
        <rect x="122" y="152" width="11" height="8" rx="4" fill="#16A34A" opacity="0.6" />

        {/* Bottom dash */}
        <rect x="152" y="167" width="34" height="7" rx="3.5" fill="#15803D" />
        <rect x="140" y="167" width="7" height="7" rx="3.5" fill="#15803D" opacity="0.5" />

        {/* Main Green Wallet Box */}
        <rect
          x="180"
          y="95"
          width="155"
          height="102"
          rx="18"
          fill="url(#qe_wallet_grad)"
          stroke="#86EFAC"
          strokeWidth="2.5"
        />

        {/* Top Rim Specular Highlight */}
        <path
          d="M 195 98 L 320 98"
          stroke="url(#qe_wallet_highlight)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Front Flap Pocket Seam / Detail */}
        <path
          d="M 183 148 C 220 152, 280 152, 332 148"
          stroke="#14532D"
          strokeWidth="2.5"
          fill="none"
          opacity="0.8"
        />

        {/* Wallet Right Clasp Tab */}
        <path
          d="M 285 125 L 338 125 C 347 125, 355 133, 355 142 C 355 151, 347 159, 338 159 L 285 159 Z"
          fill="#22C55E"
          stroke="#86EFAC"
          strokeWidth="2"
        />
        <path
          d="M 285 128 L 336 128 C 344 128, 351 134, 351 142 C 351 150, 344 156, 336 156 L 285 156 Z"
          fill="#16A34A"
        />

        {/* Metallic Silver Clasp Rivet */}
        <circle cx="334" cy="142" r="9" fill="url(#qe_rivet_grad)" stroke="#1E293B" strokeWidth="1.5" />
        <circle cx="332" cy="140" r="3.5" fill="#FFFFFF" opacity="0.8" />
      </g>

      {/* ======================================================== */}
      {/* 3. 3D "Quick" METALLIC CHROME TYPOGRAPHY */}
      {/* ======================================================== */}
      <g filter="url(#qe_deep_shadow)">
        {/* Dark 3D Extrusion Shadow Layer */}
        <text
          x="250"
          y="278"
          textAnchor="middle"
          fill="#050A06"
          fontFamily="'Arial Black', 'Montserrat', 'Impact', sans-serif"
          fontWeight="900"
          fontStyle="italic"
          fontSize="92"
          letterSpacing="-1"
        >
          Quick
        </text>
        <text
          x="250"
          y="275"
          textAnchor="middle"
          fill="#0F172A"
          fontFamily="'Arial Black', 'Montserrat', 'Impact', sans-serif"
          fontWeight="900"
          fontStyle="italic"
          fontSize="92"
          letterSpacing="-1"
        >
          Quick
        </text>

        {/* Main Polished Chrome Silver Body */}
        <text
          x="250"
          y="270"
          textAnchor="middle"
          fill="url(#qe_chrome_text)"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          fontFamily="'Arial Black', 'Montserrat', 'Impact', sans-serif"
          fontWeight="900"
          fontStyle="italic"
          fontSize="92"
          letterSpacing="-1"
        >
          Quick
        </text>
      </g>

      {/* ======================================================== */}
      {/* 4. 3D "Earn" VIBRANT LIME GREEN TYPOGRAPHY */}
      {/* ======================================================== */}
      <g filter="url(#qe_deep_shadow)">
        {/* Dark Emerald 3D Extrusion Shadow */}
        <text
          x="250"
          y="374"
          textAnchor="middle"
          fill="#052E16"
          fontFamily="'Arial Black', 'Montserrat', 'Impact', sans-serif"
          fontWeight="900"
          fontStyle="italic"
          fontSize="106"
          letterSpacing="-0.5"
        >
          Earn
        </text>
        <text
          x="250"
          y="370"
          textAnchor="middle"
          fill="#14532D"
          fontFamily="'Arial Black', 'Montserrat', 'Impact', sans-serif"
          fontWeight="900"
          fontStyle="italic"
          fontSize="106"
          letterSpacing="-0.5"
        >
          Earn
        </text>

        {/* Main Vibrant Lime-Green Body */}
        <text
          x="250"
          y="364"
          textAnchor="middle"
          fill="url(#qe_earn_text)"
          stroke="#86EFAC"
          strokeWidth="1.5"
          fontFamily="'Arial Black', 'Montserrat', 'Impact', sans-serif"
          fontWeight="900"
          fontStyle="italic"
          fontSize="106"
          letterSpacing="-0.5"
        >
          Earn
        </text>
      </g>

      {/* ======================================================== */}
      {/* 5. SUBTITLE "— SMART WAY TO EARN —" & 3 STARS */}
      {/* ======================================================== */}
      {/* Left accent dash */}
      <line x1="95" y1="411" x2="118" y2="411" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" />

      {/* Subtitle Text */}
      <text
        x="250"
        y="415"
        textAnchor="middle"
        fill="#F8FAFC"
        fontFamily="'Montserrat', 'Arial', sans-serif"
        fontWeight="800"
        fontSize="16"
        letterSpacing="3.5"
      >
        SMART WAY TO EARN
      </text>

      {/* Right accent dash */}
      <line x1="382" y1="411" x2="405" y2="411" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" />

      {/* 3 Green Stars ⭐⭐⭐ */}
      <g fill="#22C55E" filter="url(#qe_text_shadow)">
        {/* Left Star */}
        <path
          d="M 215 435 L 217.5 442.5 L 225 442.5 L 219 447 L 221.5 454.5 L 215 450 L 208.5 454.5 L 211 447 L 205 442.5 L 212.5 442.5 Z"
          transform="scale(0.85) translate(40 68)"
        />

        {/* Center Star (slightly larger) */}
        <path
          d="M 250 432 L 253.5 441.5 L 263 441.5 L 255.5 447 L 258.5 456.5 L 250 451 L 241.5 456.5 L 244.5 447 L 237 441.5 L 246.5 441.5 Z"
          transform="scale(1.05) translate(-12 -22)"
        />

        {/* Right Star */}
        <path
          d="M 285 435 L 287.5 442.5 L 295 442.5 L 289 447 L 291.5 454.5 L 285 450 L 278.5 454.5 L 281 447 L 275 442.5 L 282.5 442.5 Z"
          transform="scale(0.85) translate(46 68)"
        />
      </g>
    </svg>
  );
};
