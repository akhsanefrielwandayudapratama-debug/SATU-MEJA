import React from 'react';

interface SatuMejaLogoProps {
  className?: string;
  variant?: 'light' | 'dark'; // dark text for light header, light text for dark footer
  showSubtitle?: boolean;
}

export const SatuMejaLogo: React.FC<SatuMejaLogoProps> = ({
  className = '',
  variant = 'dark',
  showSubtitle = false,
}) => {
  const isDarkText = variant === 'dark';
  const textColor = isDarkText ? 'text-[#2C1810]' : 'text-[#FAF6F0]';
  const subtextColor = isDarkText ? 'text-[#6D4C41]' : 'text-[#D7CCC8]';
  const strokeColor = isDarkText ? '#2C1810' : '#FAF6F0';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Handcrafted Coffee Cup & Saucer Icon from design header */}
      <svg
        viewBox="0 0 64 56"
        className="w-10 h-9 shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Steam wisps */}
        <path
          d="M20 14C19 9 24 6 22 2"
          stroke={strokeColor}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M28 14C27 8 32 5 30 1"
          stroke={strokeColor}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M36 14C35 9 40 6 38 2"
          stroke={strokeColor}
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Coffee Cup Body */}
        <path
          d="M12 20C12 20 14 40 28 40C42 40 44 20 44 20H12Z"
          fill={isDarkText ? 'none' : 'rgba(255,255,255,0.08)'}
          stroke={strokeColor}
          strokeWidth="2.6"
          strokeLinejoin="round"
        />

        {/* Coffee Liquid line */}
        <ellipse cx="28" cy="22" rx="14" ry="3.5" stroke={strokeColor} strokeWidth="1.6" />

        {/* Cup Handle */}
        <path
          d="M43 23C49 23 51 28 49 33C47 37 42 36 40 35"
          stroke={strokeColor}
          strokeWidth="2.4"
          strokeLinecap="round"
        />

        {/* Saucer */}
        <path
          d="M8 43C16 47 40 47 48 43"
          stroke={strokeColor}
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <path
          d="M12 45.5C18 48.5 38 48.5 44 45.5"
          stroke={strokeColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.8"
        />
      </svg>

      <div className="flex flex-col">
        <span
          className={`font-serif text-2xl font-bold tracking-tight leading-none ${textColor}`}
          style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
        >
          Satu Meja
        </span>
        {showSubtitle && (
          <span className={`text-xs font-medium tracking-wider mt-1 ${subtextColor}`}>
            Coffee, Smoke, Talk
          </span>
        )}
      </div>
    </div>
  );
};
