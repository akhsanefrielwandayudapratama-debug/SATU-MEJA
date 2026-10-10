import React from 'react';
import { TabType } from '../types';
import { SatuMejaEmblem } from './SatuMejaEmblem';
import { Phone, Instagram } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: TabType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  const navLinks: { id: TabType; label: string }[] = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'menu', label: 'Menu' },
    { id: 'tentang', label: 'Tentang Kami' },
    { id: 'galeri', label: 'Galeri' },
    { id: 'kontak', label: 'Kontak' },
  ];

  return (
    <footer className="bg-[#2D1A12] text-[#FAF6F0] border-t border-[#22130C] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
          {/* Left Brand Lockup (Exact match to Footer Screenshot) */}
          <div className="flex items-center gap-3.5 select-none">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-[#1E251E] flex items-center justify-center shrink-0 border border-[#E6DEC9]/40 shadow-xs">
              <SatuMejaEmblem size={44} />
            </div>
            <div>
              <h3
                className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white leading-none"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                Satu Meja
              </h3>
              <p className="text-xs sm:text-sm text-[#D7CCC8]/90 font-medium mt-1 tracking-wide">
                Coffee, Smoke, Talk
              </p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs sm:text-sm font-medium text-[#D7CCC8]">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onSelectTab(link.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-white transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Social & Contact Links (Exact match to Footer Screenshot) */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium text-[#FAF6F0]">
            {/* WhatsApp */}
            <a
              href="https://wa.me/6281112131415"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-[#25D366] transition-colors italic tracking-wide"
            >
              <Phone className="w-4 h-4 text-[#D7CCC8]" />
              <span>081112131415</span>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/SATU_MEJA"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-[#F06292] transition-colors italic tracking-wide"
            >
              <Instagram className="w-4 h-4 text-[#D7CCC8]" />
              <span>@SATU_MEJA</span>
            </a>
          </div>
        </div>

        {/* Quiet Bottom Line */}
        <div className="mt-8 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#A1887F] gap-2">
          <span>&copy; 2026 Satu Meja. Pesantren Ekonomi Darul Uchwah.</span>
          <span className="font-script text-base text-[#D7CCC8]" style={{ fontFamily: '"Caveat", cursive' }}>
            Kopi yang baik, selalu punya cerita.
          </span>
        </div>
      </div>
    </footer>
  );
};
