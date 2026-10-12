import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, Trash2, Plus, Minus, Send, ShoppingBag } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [tableOrAddress, setTableOrAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  if (!isOpen) return null;

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(price).replace('Rp', 'Rp ');
  };

  const handleCheckoutWA = () => {
    if (cart.length === 0) return;

    let text = `*PESANAN SATU MEJA*\n`;
    text += `Nama: ${customerName.trim() || 'Pelanggan'}\n`;
    if (tableOrAddress.trim()) {
      text += `No Meja / Lokasi: ${tableOrAddress.trim()}\n`;
    }
    text += `\n*Daftar Pesanan:*\n`;

    cart.forEach((item, index) => {
      const itemTotal = item.menuItem.price * item.quantity;
      text += `${index + 1}. ${item.quantity}x ${item.menuItem.name} (${formatPrice(itemTotal)})\n`;
      if (item.notes) {
        text += `   ↳ Catatan: ${item.notes}\n`;
      }
    });

    text += `\n*Total Bayar: ${formatPrice(totalAmount)}*\n`;
    if (orderNotes.trim()) {
      text += `\nCatatan Tambahan: ${orderNotes.trim()}\n`;
    }
    text += `\nMohon konfirmasi pesanan saya ya mas barista, terima kasih! ☕`;

    const encoded = encodeURIComponent(text);
    const waUrl = `https://wa.me/6282216828280?text=${encoded}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#FAF6F0] h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E2D6C0] bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2C1810] text-[#FAF6F0] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2C1810]">
                Keranjang Pesanan
              </h3>
              <p className="text-xs text-[#7A685A]">
                {cart.length} jenis minuman / makanan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-xs text-[#8D3B2B] hover:underline font-semibold cursor-pointer"
                title="Kosongkan Keranjang"
              >
                Hapus Semua
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[#5C4535] hover:bg-[#EFE7D8] transition-colors cursor-pointer"
              aria-label="Tutup Keranjang"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#EAE0D0] flex items-center justify-center mx-auto text-[#8D705F]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-[#2C1810] text-base">
                Keranjang Anda masih kosong
              </h4>
              <p className="text-xs text-[#6E594B] max-w-xs mx-auto">
                Silakan pilih racikan kopi atau minuman segar dari menu Satu Meja.
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.menuItem.id}
                className="bg-white rounded-2xl p-3.5 border border-[#E8DFC8] shadow-xs flex gap-3 items-center justify-between"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-[#EFE9DD]">
                  <img
                    src={item.menuItem.image}
                    alt={item.menuItem.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-xs sm:text-sm text-[#2C1810] truncate">
                    {item.menuItem.name}
                  </h5>
                  <span className="text-xs font-semibold text-[#A2442F] tabular-nums">
                    {formatPrice(item.menuItem.price)}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center bg-[#F2ECE1] rounded-lg p-0.5 border border-[#DDD3C2]">
                    <button
                      onClick={() => onUpdateQuantity(item.menuItem.id, -1)}
                      className="p-1 hover:bg-white rounded text-[#2C1810] transition-colors cursor-pointer"
                      aria-label="Kurangi jumlah"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-[#2C1810] tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.menuItem.id, 1)}
                      className="p-1 hover:bg-white rounded text-[#2C1810] transition-colors cursor-pointer"
                      aria-label="Tambah jumlah"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.menuItem.id)}
                    className="p-1.5 text-[#A89082] hover:text-[#8D3B2B] transition-colors cursor-pointer"
                    aria-label="Hapus item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Customer Input Section */}
          {cart.length > 0 && (
            <div className="pt-4 border-t border-[#E2D6C0] space-y-3 bg-[#F4EDE2] p-4 rounded-2xl">
              <h5 className="font-bold text-xs text-[#2C1810] uppercase tracking-wider">
                Informasi Pemesan
              </h5>
              <div>
                <input
                  type="text"
                  placeholder="Nama Pemesan (contoh: Dimas)"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl text-xs text-[#2C1810] placeholder-[#8F7D70] border border-[#D9CDB8] focus:outline-none focus:ring-2 focus:ring-[#2C1810]/20"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="No Meja / Tempat Duduk (contoh: Meja 2 Luar)"
                  value={tableOrAddress}
                  onChange={(e) => setTableOrAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl text-xs text-[#2C1810] placeholder-[#8F7D70] border border-[#D9CDB8] focus:outline-none focus:ring-2 focus:ring-[#2C1810]/20"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Catatan (contoh: Kopi susu less sugar)"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl text-xs text-[#2C1810] placeholder-[#8F7D70] border border-[#D9CDB8] focus:outline-none focus:ring-2 focus:ring-[#2C1810]/20"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer / Total & Checkout */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-[#E2D6C0] bg-white space-y-3 shadow-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6D5A4E] font-medium">Total Pesanan:</span>
              <span className="font-serif text-xl font-bold text-[#2C1810] tabular-nums">
                {formatPrice(totalAmount)}
              </span>
            </div>

            <button
              onClick={handleCheckoutWA}
              className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Send className="w-4 h-4" />
              <span>Checkout ke WhatsApp (082216828280)</span>
            </button>
            <p className="text-[11px] text-center text-[#7E6C5F]">
              Pesanan akan otomatis terkirim langsung ke barista Satu Meja.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
