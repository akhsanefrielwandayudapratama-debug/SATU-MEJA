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
  const logoSrc = `${import.meta.env.BASE_URL}logo-satu-meja-bg.png`;

  const imgContent = (
    <img
      src={logoSrc}
      alt="Emblem Satu Meja - Kopi Rokok Diskusi"
      loading="lazy"
      className="w-full h-full object-cover rounded-full select-none"
    />
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
          {imgContent}
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size }}>
      {imgContent}
    </div>
  );
};
