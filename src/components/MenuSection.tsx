import React, { useState, useMemo } from 'react';
import { MenuItem } from '../types';
import { Coffee, CupSoda, Search, Plus, Check } from 'lucide-react';

interface MenuSectionProps {
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  menuItems,
  onAddToCart,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'coffee' | 'non-coffee' | 'snack'>('all');
  const [addedItemIds, setAddedItemIds] = useState<{ [id: string]: boolean }>({});
  const [showAllCoffee, setShowAllCoffee] = useState(false);
  const [showAllNonCoffee, setShowAllNonCoffee] = useState(false);

  // Grouped items (available first, out-of-stock at the end)
  const sortAvailableFirst = (items: MenuItem[]) =>
    [...items].sort((a, b) => Number(b.isAvailable) - Number(a.isAvailable));

  const coffeeItems = useMemo(
    () => sortAvailableFirst(menuItems.filter((i) => i.category === 'coffee')),
    [menuItems]
  );
  const nonCoffeeItems = useMemo(
    () => sortAvailableFirst(menuItems.filter((i) => i.category === 'non-coffee')),
    [menuItems]
  );
  const snackItems = useMemo(
    () => sortAvailableFirst(menuItems.filter((i) => i.category === 'snack')),
    [menuItems]
  );

  // Search filtered items
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim() && selectedCategory === 'all') return null;
    return menuItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [menuItems, searchQuery, selectedCategory]);

  const handleAdd = (item: MenuItem) => {
    onAddToCart(item);
    setAddedItemIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [item.id]: false }));
    }, 1200);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(price).replace('Rp', 'Rp ');
  };

  const renderCard = (item: MenuItem) => {
    const isAdded = !!addedItemIds[item.id];
    const isOut = !item.isAvailable;

    return (
      <div
        key={item.id}
        className="group bg-white rounded-2xl p-3.5 sm:p-4 border border-[#E8DFC8] shadow-[0_2px_8px_rgba(44,24,16,0.04)] hover:shadow-[0_8px_20px_rgba(44,24,16,0.08)] transition-all flex flex-col justify-between"
      >
        <div className="flex gap-3.5 sm:gap-4 items-start">
          {/* Product Thumbnail */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-[#EFE9DD]">
            <img
              src={item.image}
              alt={item.name}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                isOut ? 'grayscale opacity-70' : ''
              }`}
              onError={(e) => {
                // Fallback to warm placeholder pattern
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80';
              }}
            />
            {isOut && (
              <span className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-[#D32F2F] text-white text-[10px] font-bold rounded-lg shadow">
                Stok Habis
              </span>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <h4 className="font-serif text-base sm:text-lg font-bold text-[#2C1810] tracking-tight leading-snug">
                {item.name}
              </h4>
              <p className="text-xs sm:text-[13px] text-[#6E594B] mt-1 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2">
              <span className="font-bold text-sm sm:text-[15px] text-[#A2442F] tabular-nums">
                {formatPrice(item.price)}
              </span>

              <button
                onClick={() => handleAdd(item)}
                disabled={isOut}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 ${
                  isOut
                    ? 'bg-[#E0D5C5] text-[#8A786B] cursor-not-allowed'
                    : isAdded
                      ? 'bg-[#2E7D32] text-white cursor-pointer'
                      : 'bg-[#2C1810] hover:bg-[#4A2D1F] text-white shadow-sm cursor-pointer'
                }`}
                title={isOut ? 'Stok habis' : 'Tambah ke Keranjang'}
                aria-label={isOut ? `${item.name} stok habis` : `Tambah ${item.name} ke pesanan`}
              >
                {isOut ? (
                  <span className="px-1">Habis</span>
                ) : isAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Ditambahkan</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Pesan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Search & Quick Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#F2EAE0] p-3 sm:p-4 rounded-2xl border border-[#E2D6C0]">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7C685A]" />
          <input
            type="text"
            placeholder="Cari kopi atau minuman..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white/90 rounded-xl text-xs sm:text-sm text-[#2C1810] placeholder-[#8A786B] border border-[#D9CDB8] focus:outline-none focus:ring-2 focus:ring-[#2C1810]/20"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto p-1 bg-white/80 rounded-xl border border-[#D9CDB8]/80">
          {[
            { id: 'all', label: 'Semua Menu' },
            { id: 'coffee', label: 'Coffee' },
            { id: 'non-coffee', label: 'Non Coffee' },
            { id: 'snack', label: 'Camilan' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === tab.id
                  ? 'bg-[#2C1810] text-white shadow-xs'
                  : 'text-[#5C4535] hover:text-[#2C1810]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* If Search/Filter Active */}
      {filteredItems !== null ? (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl font-bold text-[#2C1810]">
              Hasil Pencarian ({filteredItems.length})
            </h3>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-xs font-semibold text-[#8D3B2B] hover:underline cursor-pointer"
            >
              Reset Filter
            </button>
          </div>

          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-[#E8DFC8]">
              <Coffee className="w-12 h-12 text-[#B09A8B] mx-auto mb-3" />
              <p className="text-[#4E382A] font-semibold text-base">
                Menu tidak ditemukan
              </p>
              <p className="text-xs text-[#7C685A] mt-1">
                Silakan coba kata kunci lain atau pilih kategori Semua Menu.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredItems.map(renderCard)}
            </div>
          )}
        </section>
      ) : (
        <>
          {/* SECTION 1: COFFEE (Mockup 3 Match) */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2D5C0] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#EBE0CF] flex items-center justify-center text-[#2C1810] shrink-0">
                  <Coffee className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#2C1810] tracking-tight">
                    Coffee
                  </h3>
                  <p className="text-xs text-[#6E594B] mt-0.5">
                    Racikan kopi pilihan untuk menemani hari-harimu.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAllCoffee(!showAllCoffee)}
                className="self-start sm:self-center px-4 py-1.5 bg-[#2E1A11] hover:bg-[#4A2C1D] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                {showAllCoffee ? 'Sembunyikan' : 'Lihat semua'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {(showAllCoffee ? coffeeItems : coffeeItems.slice(0, 4)).map(renderCard)}
            </div>
          </section>

          {/* SECTION 2: NON COFFEE (Mockup 3 Match) */}
          <section className="space-y-6 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2D5C0] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#EBE0CF] flex items-center justify-center text-[#2C1810] shrink-0">
                  <CupSoda className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#2C1810] tracking-tight">
                    Non Coffee
                  </h3>
                  <p className="text-xs text-[#6E594B] mt-0.5">
                    Pilihan minuman segar untuk suasana yang lebih santai.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAllNonCoffee(!showAllNonCoffee)}
                className="self-start sm:self-center px-4 py-1.5 bg-[#2E1A11] hover:bg-[#4A2C1D] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                {showAllNonCoffee ? 'Sembunyikan' : 'Lihat semua'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {(showAllNonCoffee ? nonCoffeeItems : nonCoffeeItems.slice(0, 3)).map(renderCard)}
            </div>
          </section>

          {/* SECTION 3: SNACKS / CAMILAN TEMAN KOPI */}
          {snackItems.length > 0 && (
            <section className="space-y-6 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2D5C0] pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#EBE0CF] flex items-center justify-center text-[#2C1810] shrink-0">
                    <span className="text-lg">🥐</span>
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#2C1810] tracking-tight">
                      Camilan & Teman Ngobrol
                    </h3>
                    <p className="text-xs text-[#6E594B] mt-0.5">
                      Roti bakar, kentang renyah, dan camilan khas tongkrongan.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {snackItems.map(renderCard)}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};
