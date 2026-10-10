/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { TabType, MenuItem, CartItem, GalleryPhoto } from './types';
import { INITIAL_MENU_ITEMS, INITIAL_GALLERY_PHOTOS } from './data/initialData';
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

  const handleResetToDefault = () => {
    if (window.confirm('Kembalikan menu dan galeri ke data awal bawaan?')) {
      setMenuItems(INITIAL_MENU_ITEMS);
      setGalleryPhotos(INITIAL_GALLERY_PHOTOS);
      localStorage.removeItem('satu_meja_menu');
      localStorage.removeItem('satu_meja_gallery');
    }
  };

  const cartTotalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#2C1810]">
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

      {/* 6. Admin Barista Management Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        menuItems={menuItems}
        galleryPhotos={galleryPhotos}
        onSaveMenuItems={setMenuItems}
        onSaveGalleryPhotos={setGalleryPhotos}
        onResetToDefault={handleResetToDefault}
      />
    </div>
  );
}
