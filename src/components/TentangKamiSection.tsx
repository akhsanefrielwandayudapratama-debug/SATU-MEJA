import React from 'react';
import { SatuMejaEmblem } from './SatuMejaEmblem';
import { MapPin, Clock, ArrowRight } from 'lucide-react';

interface TentangKamiSectionProps {
  onNavigateToMenu: () => void;
}

export const TentangKamiSection: React.FC<TentangKamiSectionProps> = ({
  onNavigateToMenu,
}) => {
  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Action Button: "Lihat Menu ->" as in screenshot */}
      <div className="mb-8">
        <button
          onClick={onNavigateToMenu}
          className="inline-flex items-center gap-3 px-6 py-3 bg-[#2E1A11] hover:bg-[#4A2C1D] text-[#FAF6F0] font-semibold text-sm rounded-xl shadow-md transition-all group active:scale-95 cursor-pointer"
        >
          <span>Lihat Menu</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Main 3-Column Layout from UI Design */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: Vintage Circular Emblem (4 cols on lg) */}
        <div className="lg:col-span-4 flex justify-center lg:justify-start">
          <div className="w-full max-w-[340px] aspect-square rounded-2xl bg-[#1D231E] p-4 shadow-xl border border-[#2D382F] flex items-center justify-center transition-transform hover:scale-[1.01]">
            <SatuMejaEmblem size="100%" />
          </div>
        </div>

        {/* Center Column: Narrative Story (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4 lg:pr-6 lg:border-r border-[#D9CEBA]/60">
          <h2
            className="font-serif text-3xl sm:text-4xl font-bold text-[#2C1810] tracking-tight mb-4"
            style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
          >
            Tentang Satu Meja
          </h2>

          <p className="text-[#4E382A] text-sm sm:text-[15px] leading-relaxed text-justify">
            SATU MEJA lahir dari sebuah kebiasaan sederhana: duduk bersama, menikmati kopi, dan berbagi cerita.
            Bagi kami, sebuah meja bukan hanya tempat untuk meletakkan secangkir kopi. Meja adalah tempat
            di mana banyak cerita dimulai. <strong className="text-[#2C1810] font-semibold">Di satu meja</strong>, seseorang bisa datang dengan latar belakang
            yang berbeda, suku yang berbeda, pemikiran yang berbeda, bahkan kehidupan yang berbeda—namun tetap bisa duduk bersama dan menikmati suasana yang sama.
          </p>

          <p className="text-[#4E382A] text-sm sm:text-[15px] leading-relaxed text-justify">
            SATU MEJA terinspirasi dari kehidupan tongkrongan yang sederhana, hangat, dan penuh percakapan.
            Dari obrolan ringan hingga diskusi panjang, dari tawa hingga cerita tentang kehidupan,
            semuanya memiliki ruang di sini. Kopi menjadi teman dalam setiap percakapan, sementara malam memberikan
            suasana yang lebih tenang untuk menikmati waktu tanpa terburu-buru.
          </p>
        </div>

        {/* Right Column: Location, Hours, and Script Quote (3 cols on lg) */}
        <div className="lg:col-span-3 flex flex-col justify-between space-y-8 pt-2">
          {/* Address */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#EBE1CF] flex items-center justify-center shrink-0 text-[#2C1810]">
              <MapPin className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-bold text-[#2C1810] text-sm sm:text-base">
                Alamat
              </h3>
              <p className="text-xs sm:text-sm text-[#5C4535] mt-0.5 leading-snug">
                Pesantren Ekonomi Darul Uchwah
              </p>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#EBE1CF] flex items-center justify-center shrink-0 text-[#2C1810]">
              <Clock className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-bold text-[#2C1810] text-sm sm:text-base">
                Jam Buka
              </h3>
              <p className="text-xs sm:text-sm text-[#5C4535] mt-0.5 leading-snug">
                Tergantung Mood Barista
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full border-t border-[#D9CEBA]/80 pt-6">
            {/* Script Quote Matching Design */}
            <div className="text-right sm:text-left">
              <p
                className="font-script text-2xl sm:text-3xl text-[#3A2216] leading-tight select-none rotate-[-2deg]"
                style={{ fontFamily: '"Caveat", cursive' }}
              >
                Kopi yang baik,
                <br />
                selalu punya cerita.
              </p>
              {/* Hand-drawn underline stroke */}
              <svg
                viewBox="0 0 160 20"
                className="w-36 h-4 text-[#8D6E63] mt-1 inline-block"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12C35 4 100 3 155 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
