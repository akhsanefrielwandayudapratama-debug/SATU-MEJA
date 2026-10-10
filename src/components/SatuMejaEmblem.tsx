import React from 'react';

interface SatuMejaEmblemProps {
  className?: string;
  size?: number | string;
  variant?: 'badge-card' | 'icon' | 'stamp-only';
}

export const SatuMejaEmblem: React.FC<SatuMejaEmblemProps> = ({
  className = '',
  size = 320,
  variant = 'stamp-only',
}) => {
  const svgContent = (
    <svg
      viewBox="0 0 400 400"
      className="w-full h-full select-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Curved Path for SATU MEJA on Top */}
        <path
          id="topTextPath"
          d="M 60,200 A 140,140 0 0,1 340,200"
        />
        {/* Curved Path for KOPI • ROKOK • DISKUSI on Bottom */}
        <path
          id="bottomTextPath"
          d="M 330,200 A 135,135 0 0,1 70,200"
        />

        {/* Vintage Grunge Noise Filter */}
        <filter id="vintageGrain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.15 0" />
          <feComposite in2="SourceGraphic" in="gl" operator="in" />
        </filter>
      </defs>

      {/* Dark background circle */}
      <circle cx="200" cy="200" r="185" fill="#202621" stroke="#E6DEC9" strokeWidth="4" />
      <circle cx="200" cy="200" r="176" fill="none" stroke="#E6DEC9" strokeWidth="1.5" strokeDasharray="4 4" />
      <circle cx="200" cy="200" r="162" fill="none" stroke="#E6DEC9" strokeWidth="2.5" />

      {/* Top Arched Text: SATU MEJA */}
      <text fill="#E8DFCA" fontSize="38" fontWeight="900" fontFamily="Playfair Display, Georgia, serif" letterSpacing="4">
        <textPath href="#topTextPath" startOffset="50%" textAnchor="middle">
          SATU MEJA
        </textPath>
      </text>

      {/* Fratellanza Banner (Left) */}
      <g transform="translate(42, 192)">
        <text fill="#D5CBB5" fontSize="12" fontWeight="700" letterSpacing="1.5" fontFamily="Plus Jakarta Sans, sans-serif">
          fratellanza
        </text>
        <line x1="-5" y1="5" x2="68" y2="5" stroke="#D5CBB5" strokeWidth="1" strokeDasharray="2 2" />
      </g>

      {/* 2026 Banner (Right) */}
      <g transform="translate(315, 192)">
        <text fill="#D5CBB5" fontSize="13" fontWeight="700" letterSpacing="2" fontFamily="Plus Jakarta Sans, sans-serif">
          2026
        </text>
        <line x1="-5" y1="5" x2="42" y2="5" stroke="#D5CBB5" strokeWidth="1" strokeDasharray="2 2" />
      </g>

      {/* Middle Inner Seal Circle */}
      <circle cx="200" cy="200" r="105" fill="none" stroke="#E6DEC9" strokeWidth="1.5" strokeDasharray="3 3" />

      {/* Center Table, Coffee Cup, Ashtray, and Stools */}
      <g id="tableCenter" transform="translate(200, 220)">
        {/* Stools Left & Right & Bottom */}
        {/* Left Stool */}
        <g transform="translate(-75, 25)">
          <ellipse cx="0" cy="0" rx="16" ry="6" fill="#D5CBB5" stroke="#202621" strokeWidth="1.5" />
          <line x1="-10" y1="4" x2="-14" y2="30" stroke="#E6DEC9" strokeWidth="2.5" />
          <line x1="10" y1="4" x2="14" y2="30" stroke="#E6DEC9" strokeWidth="2.5" />
          <line x1="-12" y1="20" x2="12" y2="20" stroke="#E6DEC9" strokeWidth="1.5" />
        </g>
        {/* Right Stool */}
        <g transform="translate(75, 25)">
          <ellipse cx="0" cy="0" rx="16" ry="6" fill="#D5CBB5" stroke="#202621" strokeWidth="1.5" />
          <line x1="-10" y1="4" x2="-14" y2="30" stroke="#E6DEC9" strokeWidth="2.5" />
          <line x1="10" y1="4" x2="14" y2="30" stroke="#E6DEC9" strokeWidth="2.5" />
          <line x1="-12" y1="20" x2="12" y2="20" stroke="#E6DEC9" strokeWidth="1.5" />
        </g>
        {/* Center Stool (Foreground) */}
        <g transform="translate(0, 48)">
          <ellipse cx="0" cy="0" rx="18" ry="7" fill="#D5CBB5" stroke="#202621" strokeWidth="1.5" />
          <line x1="-12" y1="5" x2="-16" y2="34" stroke="#E6DEC9" strokeWidth="2.5" />
          <line x1="12" y1="5" x2="16" y2="34" stroke="#E6DEC9" strokeWidth="2.5" />
          <line x1="-14" y1="22" x2="14" y2="22" stroke="#E6DEC9" strokeWidth="1.5" />
        </g>

        {/* Main Round Wooden Table */}
        {/* Table Top (Ellipse in 3D perspective) */}
        <g transform="translate(0, 0)">
          {/* Table Legs */}
          <line x1="-40" y1="12" x2="-55" y2="65" stroke="#E6DEC9" strokeWidth="3" />
          <line x1="40" y1="12" x2="55" y2="65" stroke="#E6DEC9" strokeWidth="3" />
          <line x1="-15" y1="14" x2="-18" y2="68" stroke="#E6DEC9" strokeWidth="2.5" />
          <line x1="15" y1="14" x2="18" y2="68" stroke="#E6DEC9" strokeWidth="2.5" />

          {/* Cross stretcher between legs */}
          <line x1="-48" y1="42" x2="48" y2="42" stroke="#E6DEC9" strokeWidth="1.5" />

          {/* Table Rim thickness */}
          <ellipse cx="0" cy="6" rx="64" ry="24" fill="#1C211D" stroke="#E6DEC9" strokeWidth="2" />
          {/* Table Top Surface */}
          <ellipse cx="0" cy="0" rx="64" ry="24" fill="#202621" stroke="#E6DEC9" strokeWidth="2.5" />

          {/* Wood Planks Lines on Table */}
          <line x1="-40" y1="-10" x2="-40" y2="10" stroke="#E6DEC9" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          <line x1="-15" y1="-20" x2="-15" y2="20" stroke="#E6DEC9" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          <line x1="15" y1="-20" x2="15" y2="20" stroke="#E6DEC9" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          <line x1="40" y1="-10" x2="40" y2="10" stroke="#E6DEC9" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

          {/* Steaming Coffee Cup on Saucer */}
          <g transform="translate(-10, -10)">
            {/* Saucer */}
            <ellipse cx="0" cy="7" rx="16" ry="6" fill="#202621" stroke="#E6DEC9" strokeWidth="1.5" />
            {/* Cup */}
            <path
              d="M -11,0 C -11,9 11,9 11,0 Z"
              fill="#E6DEC9"
              stroke="#202621"
              strokeWidth="1.2"
            />
            {/* Cup Handle */}
            <path
              d="M 10,2 C 16,2 16,7 10,7"
              fill="none"
              stroke="#E6DEC9"
              strokeWidth="1.5"
            />
            {/* Steam Wisps */}
            <path
              d="M -4,-4 C -2,-10 -6,-16 -4,-22"
              fill="none"
              stroke="#E6DEC9"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.85"
            />
            <path
              d="M 2,-3 C 5,-9 1,-15 3,-24"
              fill="none"
              stroke="#E6DEC9"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.85"
            />
          </g>

          {/* Ashtray with Cigarette (Coffee, Smoke, Talk theme) */}
          <g transform="translate(24, -3)">
            <ellipse cx="0" cy="0" rx="9" ry="4" fill="#202621" stroke="#E6DEC9" strokeWidth="1.2" />
            {/* Cigarette */}
            <line x1="-2" y1="-2" x2="11" y2="4" stroke="#E6DEC9" strokeWidth="1.8" />
            {/* Little smoke wisp */}
            <path
              d="M 11,3 C 14,0 13,-4 16,-6"
              fill="none"
              stroke="#E6DEC9"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.75"
            />
          </g>
        </g>
      </g>

      {/* Bottom Arched Text: KOPI • ROKOK • DISKUSI */}
      <text fill="#E8DFCA" fontSize="21" fontWeight="800" fontFamily="Plus Jakarta Sans, sans-serif" letterSpacing="4">
        <textPath href="#bottomTextPath" startOffset="50%" textAnchor="middle">
          KOPI • ROKOK • DISKUSI
        </textPath>
      </text>

      {/* Star accents on bottom */}
      <circle cx="115" cy="318" r="2.5" fill="#E6DEC9" />
      <circle cx="285" cy="318" r="2.5" fill="#E6DEC9" />
    </svg>
  );

  if (variant === 'badge-card') {
    return (
      <div
        className={`relative overflow-hidden rounded-2xl bg-[#1A201B] p-4 shadow-xl border border-[#2D382F] flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        {/* Subtle vintage texture overlay */}
        <div className="absolute inset-0 bg-radial from-transparent to-[#101511]/70 pointer-events-none" />
        <div className="w-full h-full relative z-10 p-2">
          {svgContent}
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size }}>
      {svgContent}
    </div>
  );
};
