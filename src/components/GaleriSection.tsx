import React, { useState } from 'react';
import { GalleryPhoto } from '../types';
import { X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

interface GaleriSectionProps {
  photos: GalleryPhoto[];
}

export const GaleriSection: React.FC<GaleriSectionProps> = ({ photos }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'coffee' | 'atmosphere' | 'barista'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredPhotos = activeCategory === 'all'
    ? photos
    : photos.filter((p) => p.category === activeCategory);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextPhoto = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length);
  };

  const prevPhoto = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Category Tabs */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap">
        {[
          { id: 'all', label: 'Semua Momen (15)' },
          { id: 'coffee', label: 'Cita Rasa Kopi' },
          { id: 'atmosphere', label: 'Suasana & Diskusi' },
          { id: 'barista', label: 'Seni Barista' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-[#2C1810] text-[#FAF6F0] shadow-sm'
                : 'bg-[#EDE4D5]/70 text-[#6D5A4E] hover:bg-[#E2D5C0] hover:text-[#2C1810]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 3 Rows x 5 Columns Grid (Matches GALERI SATU MEJA.png) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-5">
        {filteredPhotos.map((photo, index) => (
          <div
            key={photo.id}
            onClick={() => openLightbox(index)}
            className="group relative aspect-4/3 rounded-2xl overflow-hidden cursor-pointer bg-[#E2D7C5] shadow-xs hover:shadow-lg transition-all duration-300"
          >
            <img
              src={photo.imageUrl}
              alt={photo.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80';
              }}
            />
            {/* Subtle Gradient Scrim on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C100B]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
              <span className="text-[11px] font-semibold text-white/95 line-clamp-1">
                {photo.title}
              </span>
              <span className="text-[10px] text-[#D7CCC8]/80 line-clamp-1">
                {photo.subtitle}
              </span>
              <div className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 text-white backdrop-blur-xs">
                <Eye className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && filteredPhotos[lightboxIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            aria-label="Tutup Galeri"
            className="absolute top-5 right-5 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Prev */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevPhoto();
            }}
            aria-label="Foto Sebelumnya"
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Image & Caption Container */}
          <div
            className="max-w-4xl max-h-[85vh] flex flex-col items-center justify-center p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filteredPhotos[lightboxIndex].imageUrl}
              alt={filteredPhotos[lightboxIndex].title}
              referrerPolicy="no-referrer"
              className="max-h-[70vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
            />
            <div className="mt-4 text-center">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                {filteredPhotos[lightboxIndex].title}
              </h3>
              <p className="text-xs sm:text-sm text-[#D7CCC8] mt-1 max-w-lg mx-auto">
                {filteredPhotos[lightboxIndex].subtitle}
              </p>
              <span className="text-[11px] text-[#A1887F] font-mono mt-2 inline-block">
                {lightboxIndex + 1} dari {filteredPhotos.length}
              </span>
            </div>
          </div>

          {/* Navigation Next */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextPhoto();
            }}
            aria-label="Foto Berikutnya"
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};
