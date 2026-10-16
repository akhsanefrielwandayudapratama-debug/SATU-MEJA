import React, { useEffect, useRef, useState } from 'react';
import { CartItem } from '../types';
import {
  X,
  Trash2,
  Plus,
  Minus,
  Send,
  ShoppingBag,
  CreditCard,
  Loader2,
  CheckCircle2,
  MessageCircle,
  AlertTriangle,
} from 'lucide-react';
import {
  isPaymentEnabled,
  createOrder,
  getOrderStatus,
  loadSnapScript,
} from '../lib/payment';
import type { OrderItemInput } from '../lib/payment';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

const OWNER_WA = '6282216828280';
type Stage = 'form' | 'creating' | 'waiting' | 'success' | 'error';

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [tableOrAddress, setTableOrAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  const [stage, setStage] = useState<Stage>('form');
  const [orderId, setOrderId] = useState('');
  const [message, setMessage] = useState('');
  const pollRef = useRef<number | null>(null);

  const stopPolling = () => {
    if (pollRef.current !== null) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopPolling();
  }, []);

  if (!isOpen) return null;

  const paymentEnabled = isPaymentEnabled();

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    })
      .format(price)
      .replace('Rp', 'Rp ');

  const buildWaText = (id?: string) => {
    let text = `*PESANAN SATU MEJA*\n`;
    text += `Nama: ${customerName.trim() || 'Pelanggan'}\n`;
    if (tableOrAddress.trim()) text += `No Meja / Lokasi: ${tableOrAddress.trim()}\n`;
    if (id) text += `Kode Pesanan: ${id}\nSudah dibayar ✅\n`;
    text += `\n*Daftar Pesanan:*\n`;
    cart.forEach((item, index) => {
      const itemTotal = item.menuItem.price * item.quantity;
      text += `${index + 1}. ${item.quantity}x ${item.menuItem.name} (${formatPrice(itemTotal)})\n`;
      if (item.notes) text += `   ↳ Catatan: ${item.notes}\n`;
    });
    text += `\n*Total Bayar: ${formatPrice(totalAmount)}*\n`;
    if (orderNotes.trim()) text += `\nCatatan Tambahan: ${orderNotes.trim()}\n`;
    text += `\nMohon konfirmasi pesanan saya ya mas barista, terima kasih! ☕`;
    return text;
  };

  const openWhatsApp = (id?: string) => {
    const waUrl = `https://wa.me/${OWNER_WA}?text=${encodeURIComponent(buildWaText(id))}`;
    window.open(waUrl, '_blank');
  };

  const handleCheckoutWA = () => {
    if (cart.length === 0) return;
    openWhatsApp();
  };

  const startPolling = (id: string) => {
    stopPolling();
    let tries = 0;
    pollRef.current = window.setInterval(async () => {
      tries += 1;
      try {
        const res = await getOrderStatus(id);
        if (res.status === 'paid') {
          stopPolling();
          setStage('success');
          onClearCart();
        } else if (res.status === 'expired' || res.status === 'failed') {
          stopPolling();
          setStage('error');
          setMessage('Pembayaran tidak selesai atau kedaluwarsa. Silakan coba lagi.');
        }
      } catch {
        // abaikan error sementara; coba lagi
      }
      if (tries >= 40) stopPolling();
    }, 3000);
  };

  const handlePay = async () => {
    if (cart.length === 0) return;
    const phoneDigits = customerPhone.replace(/\D/g, '');
    if (!customerName.trim()) {
      setStage('form');
      setMessage('Nama pemesan wajib diisi.');
      return;
    }
    if (phoneDigits.length < 9) {
      setStage('form');
      setMessage('Nomor WhatsApp wajib diisi dengan benar.');
      return;
    }

    setMessage('');
    setStage('creating');
    try {
      const items: OrderItemInput[] = cart.map((it) => ({
        id: it.menuItem.id,
        name: it.menuItem.name,
        price: it.menuItem.price,
        quantity: it.quantity,
        notes: it.notes,
      }));
      const res = await createOrder(
        items,
        {
          name: customerName.trim(),
          phone: phoneDigits,
          email: customerEmail.trim() || undefined,
          table: tableOrAddress.trim() || undefined,
          notes: orderNotes.trim() || undefined,
        },
        window.location.href
      );
      setOrderId(res.orderId);
      await loadSnapScript(res.snapScriptUrl, res.clientKey);
      setStage('waiting');
      window.snap?.pay(res.token, {
        onSuccess: () => startPolling(res.orderId),
        onPending: () => startPolling(res.orderId),
        onError: () => {
          setStage('error');
          setMessage('Pembayaran gagal. Silakan coba lagi.');
        },
        onClose: () => {
          setStage((prev) => (prev === 'creating' ? 'form' : prev));
          setMessage('Jendela pembayaran ditutup. Pesanan belum dibayar.');
        },
      });
    } catch (err) {
      setStage('error');
      setMessage(err instanceof Error ? err.message : 'Gagal memproses pembayaran.');
    }
  };

  const steps = ['Bayar', 'Verifikasi', 'Selesai'];
  const stepIndex = stage === 'success' ? 2 : stage === 'waiting' ? 1 : 0;

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
                {stage === 'success' ? 'Pembayaran berhasil' : `${cart.length} jenis minuman / makanan`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && stage !== 'success' && (
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

        {/* Progress langkah */}
        {paymentEnabled && stage !== 'form' && (
          <div className="flex items-center justify-center gap-2 px-5 py-3 bg-[#F4EDE2] border-b border-[#E2D6C0]">
            {steps.map((label, i) => (
              <React.Fragment key={label}>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                      i <= stepIndex ? 'bg-[#2C1810] text-white' : 'bg-[#DDD3C2] text-[#8F7D70]'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span
                    className={`text-[11px] font-semibold ${
                      i <= stepIndex ? 'text-[#2C1810]' : 'text-[#8F7D70]'
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < steps.length - 1 && <span className="w-4 h-px bg-[#C9BCA6]" />}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* SUCCESS */}
        {stage === 'success' ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 p-8">
            <div className="w-20 h-20 rounded-full bg-[#E4F3E7] flex items-center justify-center text-[#1E7A3D]">
              <CheckCircle2 className="w-11 h-11" />
            </div>
            <h4 className="font-serif text-xl font-bold text-[#2C1810]">
              Pembayaran Berhasil
            </h4>
            <p className="text-sm text-[#6E594B] max-w-xs">
              Terima kasih! Pembayaran Anda sudah diterima dan pesanan otomatis diteruskan ke barista Satu Meja.
            </p>
            {orderId && (
              <div className="bg-white border border-[#E8DFC8] rounded-xl px-4 py-2 text-xs text-[#5C4535]">
                Kode Pesanan: <span className="font-bold tabular-nums">{orderId}</span>
              </div>
            )}
            <button
              onClick={() => openWhatsApp(orderId)}
              className="mt-1 w-full py-3 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat Barista (opsional)</span>
            </button>
            <button
              onClick={onClose}
              className="text-xs text-[#7A685A] hover:underline font-semibold cursor-pointer"
            >
              Tutup
            </button>
          </div>
        ) : (
          <>
            {/* isi keranjang + form */}
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

              {/* Info pemesan */}
              {cart.length > 0 && (
                <div className="pt-4 border-t border-[#E2D6C0] space-y-3 bg-[#F4EDE2] p-4 rounded-2xl">
                  <h5 className="font-bold text-xs text-[#2C1810] uppercase tracking-wider">
                    Informasi Pemesan
                  </h5>
                  <input
                    type="text"
                    placeholder="Nama Pemesan (wajib)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl text-xs text-[#2C1810] placeholder-[#8F7D70] border border-[#D9CDB8] focus:outline-none focus:ring-2 focus:ring-[#2C1810]/20"
                  />
                  <input
                    type="tel"
                    placeholder="No. WhatsApp (wajib, contoh: 08123456789)"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl text-xs text-[#2C1810] placeholder-[#8F7D70] border border-[#D9CDB8] focus:outline-none focus:ring-2 focus:ring-[#2C1810]/20"
                  />
                  <input
                    type="email"
                    placeholder="Email (opsional, untuk struk)"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl text-xs text-[#2C1810] placeholder-[#8F7D70] border border-[#D9CDB8] focus:outline-none focus:ring-2 focus:ring-[#2C1810]/20"
                  />
                  <input
                    type="text"
                    placeholder="No Meja / Tempat Duduk (contoh: Meja 2 Luar)"
                    value={tableOrAddress}
                    onChange={(e) => setTableOrAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl text-xs text-[#2C1810] placeholder-[#8F7D70] border border-[#D9CDB8] focus:outline-none focus:ring-2 focus:ring-[#2C1810]/20"
                  />
                  <input
                    type="text"
                    placeholder="Catatan (contoh: Kopi susu less sugar)"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl text-xs text-[#2C1810] placeholder-[#8F7D70] border border-[#D9CDB8] focus:outline-none focus:ring-2 focus:ring-[#2C1810]/20"
                  />
                </div>
              )}

              {message && stage === 'form' && (
                <div className="flex items-start gap-2 text-xs text-[#8D3B2B] bg-[#FBE9E5] border border-[#F0C9BF] rounded-xl p-3">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{message}</span>
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-[#E2D6C0] bg-white space-y-3 shadow-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6D5A4E] font-medium">Total Pesanan:</span>
                  <span className="font-serif text-xl font-bold text-[#2C1810] tabular-nums">
                    {formatPrice(totalAmount)}
                  </span>
                </div>

                {/* ERROR */}
                {stage === 'error' && (
                  <div className="flex items-start gap-2 text-xs text-[#8D3B2B] bg-[#FBE9E5] border border-[#F0C9BF] rounded-xl p-3">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{message || 'Terjadi kesalahan.'}</span>
                  </div>
                )}

                {/* WAITING (menunggu konfirmasi) */}
                {stage === 'waiting' ? (
                  <div className="space-y-2">
                    <div className="w-full py-3.5 px-4 bg-[#F4EDE2] text-[#2C1810] font-semibold text-sm rounded-xl flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menunggu konfirmasi pembayaran…</span>
                    </div>
                    <p className="text-[11px] text-center text-[#7E6C5F]">
                      Selesaikan pembayaran Anda. Status diperbarui otomatis.
                    </p>
                  </div>
                ) : paymentEnabled ? (
                  <>
                    <button
                      onClick={handlePay}
                      disabled={stage === 'creating'}
                      className="w-full py-3.5 px-4 bg-[#2C1810] hover:bg-[#432618] disabled:opacity-60 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      {stage === 'creating' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Menyiapkan pembayaran…</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" />
                          <span>Bayar Sekarang</span>
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-center text-[#7E6C5F]">
                      Bayar dulu (QRIS / GoPay / e-wallet / transfer) — pesanan baru diteruskan ke barista setelah pembayaran berhasil.
                    </p>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
