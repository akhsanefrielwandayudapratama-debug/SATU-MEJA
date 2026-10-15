import React from 'react';
import { Coffee, Clock, MapPin, MessageCircle, Instagram, User } from 'lucide-react';

interface ClosedScreenProps {
  message?: string;
  reopenInfo?: string;
  onOpenAdmin: () => void;
}

export const ClosedScreen: React.FC<ClosedScreenProps> = ({
  message,
  reopenInfo,
  onOpenAdmin,
}) => {
  const logoSrc = `${import.meta.env.BASE_URL}logo-satu-meja-bg.png`;

  return (
    <div className="min-h-screen flex flex-col bg-[#1D231E] text-[#FAF6F0]">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg text-center space-y-6">
          {/* Logo */}
          <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-full overflow-hidden border-4 border-[#E6DEC9]/30 shadow-2xl">
            <img
              src={logoSrc}
              alt="Logo Satu Meja"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-[#8D3B2B] text-white text-xs font-bold tracking-widest uppercase">
              Sedang Tutup
            </span>
            <h1
              className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white"
              style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
            >
              Satu Meja Beristirahat
            </h1>
            <p className="text-sm sm:text-base text-[#D7CCC8]/90 leading-relaxed max-w-md mx-auto">
              {message || 'Kami sedang istirahat sejenak. Silakan cek lagi nanti ya.'}
            </p>
          </div>

          {/* Reopen info */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3 text-left">
            {reopenInfo && (
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#E8DFC8] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-white">Perkiraan Buka Lagi</p>
                  <p className="text-xs text-[#D7CCC8]/80 mt-0.5">{reopenInfo}</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#E8DFC8] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-white">Alamat Kedai</p>
                <p className="text-xs text-[#D7CCC8]/80 mt-0.5">
                  Pesantren Ekonomi Darul Uchwah
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Coffee className="w-5 h-5 text-[#E8DFC8] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-white">Jam Buka</p>
                <p className="text-xs text-[#D7CCC8]/80 mt-0.5">Tergantung Mood Barista</p>
              </div>
            </div>
          </div>

          {/* Contact actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://wa.me/6282216828280"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#1ebe5b] text-[#0B2E17] font-bold text-sm rounded-xl transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Hubungi via WhatsApp</span>
            </a>
            <a
              href="https://instagram.com/SATU_MEJA"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl transition-colors"
            >
              <Instagram className="w-4 h-4" />
              <span>@SATU_MEJA</span>
            </a>
          </div>

          <p
            className="font-script text-xl text-[#D7CCC8] pt-2"
            style={{ fontFamily: '"Caveat", cursive' }}
          >
            Kopi yang baik, selalu punya cerita.
          </p>
        </div>
      </div>

      {/* Footer + discreet admin entry */}
      <div className="border-t border-white/10 px-4 py-4">
        <div className="max-w-lg mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#A1887F]">
          <span>&copy; 2026 Satu Meja. Pesantren Ekonomi Darul Uchwah.</span>
          <button
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          >
            <User className="w-3.5 h-3.5" />
            <span>Barista? Login di sini</span>
          </button>
        </div>
      </div>
    </div>
  );
};
