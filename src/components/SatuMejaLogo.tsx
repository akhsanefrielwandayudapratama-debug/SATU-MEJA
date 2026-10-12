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
  const logoSrc = `${import.meta.env.BASE_URL}logo-satu-meja.png`;

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Logo Satu Meja - gambar asli, crop lingkaran agar cocok di header terang */}
      <img
        src={logoSrc}
        alt="Logo Satu Meja"
        width={40}
        height={40}
        loading="eager"
        className="w-10 h-10 rounded-full object-cover bg-white ring-1 ring-[#2C1810]/10 shrink-0"
      />

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
