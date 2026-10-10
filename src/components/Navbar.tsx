import React, { useState } from 'react';
import { TabType } from '../types';
import { SatuMejaLogo } from './SatuMejaLogo';
import { ShoppingBag, Menu, X, User } from 'lucide-react';

interface NavbarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenAdmin: () => void;
  onOpenCart: () => void;
  cartCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenAdmin,
  onOpenCart,
  cartCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: TabType; label: string }[] = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'menu', label: 'Menu' },
    { id: 'tentang', label: 'Tentang Kami' },
    { id: 'galeri', label: 'Galeri' },
    { id: 'kontak', label: 'Kontak' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF6F0]/95 backdrop-blur-md border-b border-[#E8DFC8]/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <button
          onClick={() => {
            onSelectTab('beranda');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="focus:outline-none text-left cursor-pointer"
        >
          <SatuMejaLogo variant="dark" />
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  onSelectTab(link.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`text-sm lg:text-[15px] font-medium transition-all relative py-1 cursor-pointer ${
                  isActive
                    ? 'text-[#2C1810] font-semibold'
                    : 'text-[#6D5A4E] hover:text-[#2C1810]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-[-6px] left-0 right-0 h-[2.5px] bg-[#2C1810] rounded-full transition-all" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons Zone */}
        <div className="flex items-center gap-3">
          {/* Cart Floating Action */}
          <button
            onClick={onOpenCart}
            aria-label="Keranjang Pesanan"
            className="relative p-2.5 rounded-xl text-[#2C1810] hover:bg-[#EBE2D3] transition-colors focus:outline-none cursor-pointer"
            title="Lihat Keranjang Pesanan"
          >
            <ShoppingBag className="w-5 h-5 text-[#2C1810]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#8D3B2B] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* Login Admin Pill Button (Matches UI Mockup) */}
          <button
            onClick={onOpenAdmin}
            className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#2C1810] hover:bg-[#402317] text-white text-xs lg:text-sm font-semibold rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <User className="w-4 h-4 opacity-80" />
            <span>Login Admin</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#2C1810] hover:bg-[#EBE2D3] focus:outline-none cursor-pointer"
            aria-label="Buka Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF6F0] border-b border-[#E8DFC8] px-4 pt-2 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onSelectTab(link.id);
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors cursor-pointer ${
                activeTab === link.id
                  ? 'bg-[#EAE1D1] text-[#2C1810] font-bold'
                  : 'text-[#5C4A3E] hover:bg-[#F2ECE0]'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-[#E8DFC8]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#2C1810] text-white font-semibold rounded-xl cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>Login Admin (Barista)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
