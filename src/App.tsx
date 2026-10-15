/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { TabType, MenuItem, CartItem, GalleryPhoto, SiteStatus } from './types';
import { INITIAL_MENU_ITEMS, INITIAL_GALLERY_PHOTOS } from './data/initialData';
import { fetchSiteStatus, DEFAULT_SITE_STATUS } from './lib/siteStatus';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { TentangKamiSection } from './components/TentangKamiSection';
import { MenuSection } from './components/MenuSection';
import { GaleriSection } from './components/GaleriSection';
import { BerandaSection } from './components/BerandaSection';
import { KontakSection } from './components/KontakSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { AdminModal } from './components/AdminModal';
import { ClosedScreen } from './components/ClosedScreen';

export default function App() {
  // State for Navigation: default to 'tentang' as in the primary user mockup
  const [activeTab, setActiveTab] = useState<TabType>('tentang');

  // State for Menu Items (persisted in localStorage)
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem('satu_meja_menu');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_MENU_ITEMS;
  });

  // State for Gallery Photos (persisted in localStorage)
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>(() => {
    try {
      const saved = localStorage.getItem('satu_meja_gallery');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_GALLERY_PHOTOS;
  });

  // State for Shopping Cart (persisted in localStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('satu_meja_cart');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Site open/closed status (read from repo, so all visitors see the same)
  const [siteStatus, setSiteStatus] = useState<SiteStatus>(DEFAULT_SITE_STATUS);
  const [isStatusLoaded, setIsStatusLoaded] = useState(false);
  const [adminSession, setAdminSession] = useState(false);

  useEffect(() => {
    let active = true;
    fetchSiteStatus().then((status) => {
      if (!active) return;
      setSiteStatus(status);
      setIsStatusLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('satu_meja_menu', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('satu_meja_gallery', JSON.stringify(galleryPhotos));
  }, [galleryPhotos]);

  useEffect(() => {
    localStorage.setItem('satu_meja_cart', JSON.stringify(cart));
  }, [cart]);

  // Cart operations
  const handleAddToCart = (item: MenuItem) => {
    if (!item.isAvailable) return; // safety: out-of-stock items can't be ordered
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItem.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.menuItem.id === item.id
            ? { ...c, quantity: c.quantity + 1 }
            : c
        );
      }
      return [...prev, { menuItem: item, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.menuItem.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.menuItem.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const cartTotalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Loading splash while reading site status
  if (!isStatusLoaded) {
    return (
      <div className="min-h-screen bg-[#1D231E] flex items-center justify-center">
        <div className="w-14 h-14 rounded-full border-2 border-[#E6DEC9]/30 border-t-[#E6DEC9] animate-spin" />
      </div>
    );
  }

  const isClosed = !siteStatus.open && !adminSession;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#2C1810]">
      {isClosed ? (
        /* Closed mode: full takeover. Admin can still log in to reopen. */
        <ClosedScreen
          message={siteStatus.message}
          reopenInfo={siteStatus.reopenInfo}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />
      ) : (
        <>
          {/* 1. Header Navigation */}
          <Navbar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            onOpenAdmin={() => setIsAdminOpen(true)}
            onOpenCart={() => setIsCartOpen(true)}
            cartCount={cartTotalItemsCount}
          />

          {/* 2. Hero Dark Banner with Dynamic Section Text */}
          <HeroBanner
            activeTab={activeTab}
            onNavigateToMenu={() => setActiveTab('menu')}
          />

          {/* 3. Main SPA View Router */}
          <main className="flex-1">
            {activeTab === 'tentang' && (
              <TentangKamiSection
                onNavigateToMenu={() => setActiveTab('menu')}
              />
            )}

            {activeTab === 'menu' && (
              <MenuSection
                menuItems={menuItems}
                onAddToCart={handleAddToCart}
              />
            )}

            {activeTab === 'galeri' && (
              <GaleriSection photos={galleryPhotos} />
            )}

            {activeTab === 'beranda' && (
              <BerandaSection
                onNavigateTab={setActiveTab}
                featuredMenuItems={menuItems}
                previewPhotos={galleryPhotos}
                onAddToCart={handleAddToCart}
              />
            )}

            {activeTab === 'kontak' && <KontakSection />}
          </main>

          {/* 4. Footer Matching Design */}
          <Footer onSelectTab={setActiveTab} />

          {/* 5. Cart Drawer Slide-out */}
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveCartItem}
            onClearCart={handleClearCart}
          />
        </>
      )}

      {/* 6. Admin Barista Management Modal (always mounted to keep auth state) */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        menuItems={menuItems}
        galleryPhotos={galleryPhotos}
        onSaveMenuItems={setMenuItems}
        onSaveGalleryPhotos={setGalleryPhotos}
        siteStatus={siteStatus}
        onChangeStatus={setSiteStatus}
        onAuthChange={setAdminSession}
      />
    </div>
  );
}
