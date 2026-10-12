import React from 'react';
import { TabType } from '../types';

interface HeroBannerProps {
  activeTab: TabType;
  onNavigateToMenu?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  activeTab,
}) => {
  const base = import.meta.env.BASE_URL;

  const getBanner = (): { src: string; alt: string } => {
    switch (activeTab) {
      case 'menu':
        return {
          src: `${base}banner-menu.png`,
          alt: 'Daftar Menu Satu Meja - kopi, non kopi, makanan ringan',
        };
      case 'galeri':
        return {
          src: `${base}banner-galeri.png`,
          alt: 'Galeri - Momen Spesial di Satu Meja',
        };
      case 'kontak':
        return {
          src: `${base}banner-kontak.png`,
          alt: 'Hubungi Kami di Satu Meja',
        };
      case 'tentang':
      case 'beranda':
      default:
        return {
          src: `${base}banner-beranda.png`,
          alt: 'Beranda Satu Meja - selamat datang dan selamat menikmati kopi',
        };
    }
  };

  const { src, alt } = getBanner();

  return (
    <section className="border-b border-[#24140D] bg-[#1D231E]">
      <img
        src={src}
        alt={alt}
        loading="eager"
        className="w-full h-auto object-cover"
      />
    </section>
  );
};
