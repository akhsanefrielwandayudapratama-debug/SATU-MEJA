import React from 'react';
import { TabType } from '../types';

interface HeroBannerProps {
  activeTab: TabType;
  onNavigateToMenu?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  activeTab,
}) => {
  const getBannerContent = () => {
    switch (activeTab) {
      case 'tentang':
        return {
          kicker: 'Selamat datang dan selamat menikmati kopi di SATU MEJA',
          title: 'Nikmati Kopi Pilihan',
          desc: 'Rasakan cita rasa kopi terbaik dengan suasana keheningan malam dan atau diskusi terbaik bersama kerabat, hanya di Satu Meja.',
        };
      case 'menu':
        return {
          kicker: 'Pilihan Rasa, Untuk Setiap Cerita',
          title: 'Menu Kami',
          desc: 'Nikmati berbagai pilihan kopi dan minuman lezat dengan rasa terbaik, hanya di SATU MEJA.',
        };
      case 'galeri':
        return {
          kicker: '',
          title: 'Galeri',
          desc: 'Momen, rasa, dan suasana di satu meja',
        };
      case 'kontak':
        return {
          kicker: 'Terhubung Bersama Kami',
          title: 'Kunjungi & Hubungi Kami',
          desc: 'Temukan kedai kami di Pesantren Ekonomi Darul Uchwah. Duduk bersama dan mulailah ceritamu di Satu Meja.',
        };
      case 'beranda':
      default:
        return {
          kicker: 'Selamat datang dan selamat menikmati kopi di SATU MEJA',
          title: 'Nikmati Kopi Pilihan',
          desc: 'Rasakan cita rasa kopi terbaik dengan suasana keheningan malam dan atau diskusi terbaik bersama kerabat, hanya di Satu Meja.',
        };
    }
  };

  const { kicker, title, desc } = getBannerContent();

  return (
    <section className="bg-[#331E15] text-[#FAF6F0] py-10 lg:py-14 border-b border-[#24140D] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {kicker && (
            <p className="text-xs sm:text-sm font-medium tracking-wide text-[#D7CCC8]/90 mb-1 sm:mb-2">
              {kicker}
            </p>
          )}
          <h1
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-3"
            style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
          >
            {title}
          </h1>
          <p className="text-sm sm:text-base text-[#D7CCC8]/85 font-normal leading-relaxed max-w-2xl">
            {desc}
          </p>
        </div>
      </div>
    </section>
  );
};
