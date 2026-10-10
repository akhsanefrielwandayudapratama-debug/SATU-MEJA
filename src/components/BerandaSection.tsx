import React from 'react';
import { MenuItem, GalleryPhoto, TabType } from '../types';
import { SatuMejaEmblem } from './SatuMejaEmblem';
import { ArrowRight, Coffee, Clock, MapPin, Sparkles } from 'lucide-react';

interface BerandaSectionProps {
  onNavigateTab: (tab: TabType) => void;
  featuredMenuItems: MenuItem[];
  previewPhotos: GalleryPhoto[];
  onAddToCart: (item: MenuItem) => void;
}

export const BerandaSection: React.FC<BerandaSectionProps> = ({
  onNavigateTab,
  featuredMenuItems,
  previewPhotos,
  onAddToCart,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(price).replace('Rp', 'Rp ');
  };

  return (
    <div className="space-y-16 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* 1. Hero Feature: Philosophy & Warm Callout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#F3ECE0] rounded-3xl p-6 sm:p-10 border border-[#E3D7C1] shadow-xs">
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E4D7C3] text-[#422B1E] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Coffee, Smoke, Talk — Tempat Bertemu & Berbagi</span>
          </div>

          <h2
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2C1810] tracking-tight leading-tight"
            style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
          >
            Di Satu Meja, Semua Cerita Dimulai
          </h2>

          <p className="text-[#5C4535] text-sm sm:text-base leading-relaxed text-justify">
            Seseorang bisa datang dengan latar belakang yang berbeda, pemikiran yang berbeda, bahkan
            kehidupan yang berbeda—namun tetap bisa duduk bersama dan menikmati secangkir kopi yang sama.
            Nikmati keheningan malam dan diskusi hangat bersama kerabat terbaik.
          </p>

          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              onClick={() => onNavigateTab('menu')}
              className="inline-flex items-center gap-2.5 px-6 py-3 bg-[#2C1810] hover:bg-[#452719] text-[#FAF6F0] font-semibold text-sm rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <span>Jelajahi Menu Kami</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigateTab('tentang')}
              className="px-5 py-3 bg-white/80 hover:bg-white text-[#2C1810] font-semibold text-sm rounded-xl border border-[#D9CEBA] transition-colors cursor-pointer"
            >
              Baca Cerita Lengkap
            </button>
          </div>
        </div>

        {/* Vintage Seal Right */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-[280px] sm:max-w-[320px] aspect-square rounded-3xl bg-[#1D231E] p-4 shadow-xl border border-[#2D382F] flex items-center justify-center">
            <SatuMejaEmblem size="100%" />
          </div>
        </div>
      </div>

      {/* 2. Menu Pilihan Favorit */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2D5C0] pb-3">
          <div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810] tracking-tight">
              Pilihan Rasa Terbaik
            </h3>
            <p className="text-xs sm:text-sm text-[#6E594B] mt-0.5">
              Menu kopi dan minuman favorit pilihan kawan tongkrongan Satu Meja.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('menu')}
            className="self-start sm:self-center inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#2C1810] hover:text-[#7A3625] transition-colors cursor-pointer"
          >
            <span>Lihat Semua Menu</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredMenuItems.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 border border-[#E8DFC8] shadow-[0_2px_8px_rgba(44,24,16,0.04)] hover:shadow-[0_8px_20px_rgba(44,24,16,0.08)] transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-full aspect-4/3 rounded-xl overflow-hidden bg-[#ECE4D5]">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-[#2C1810]">
                    {item.name}
                  </h4>
                  <p className="text-xs text-[#6E594B] line-clamp-2 mt-1">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F0E8DA] flex items-center justify-between">
                <span className="font-bold text-sm text-[#A2442F] tabular-nums">
                  {formatPrice(item.price)}
                </span>
                <button
                  onClick={() => onAddToCart(item)}
                  className="px-3 py-1.5 bg-[#2C1810] hover:bg-[#452719] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  + Pesan
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Cuplikan Galeri Suasana */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2D5C0] pb-3">
          <div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810] tracking-tight">
              Momen di Satu Meja
            </h3>
            <p className="text-xs sm:text-sm text-[#6E594B] mt-0.5">
              Rasa, percakapan, dan kehangatan malam bersama kerabat.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('galeri')}
            className="self-start sm:self-center inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#2C1810] hover:text-[#7A3625] transition-colors cursor-pointer"
          >
            <span>Buka Galeri Penuh</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          {previewPhotos.slice(0, 5).map((photo) => (
            <div
              key={photo.id}
              onClick={() => onNavigateTab('galeri')}
              className="aspect-4/3 rounded-xl overflow-hidden cursor-pointer bg-[#E2D7C5] group relative shadow-xs hover:shadow-md transition-all"
            >
              <img
                src={photo.imageUrl}
                alt={photo.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                <span className="text-white text-xs font-semibold line-clamp-1">
                  {photo.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Lokasi & Jam Operasional Mini Banner */}
      <div className="bg-[#2C1810] text-[#FAF6F0] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#E8DFC8]">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-base sm:text-lg text-white">
              Pesantren Ekonomi Darul Uchwah
            </h4>
            <p className="text-xs sm:text-sm text-[#D7CCC8]/80 mt-0.5">
              Lokasi kedai kopi Satu Meja untuk diskusi dan tongkrongan santai.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#E8DFC8]">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-base sm:text-lg text-white">
              Tergantung Mood Barista
            </h4>
            <p className="text-xs sm:text-sm text-[#D7CCC8]/80 mt-0.5">
              Kopi yang baik, selalu punya cerita di waktu yang tepat.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('kontak')}
          className="w-full md:w-auto px-6 py-3 bg-[#FAF6F0] hover:bg-white text-[#2C1810] font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer shrink-0"
        >
          Lihat Peta & Kontak
        </button>
      </div>
    </div>
  );
};
