// Klien API pembayaran (Cloudflare Worker + Midtrans Snap).
// Atur URL Worker di file .env: VITE_PAYMENT_API="https://satu-meja-pay.<subdomain>.workers.dev"
// Selama VITE_PAYMENT_API belum diisi, tombol bayar tidak muncul dan
// checkout lama (langsung ke WhatsApp) tetap dipakai.

const RAW_BASE = (import.meta.env.VITE_PAYMENT_API as string | undefined) || '';
const API_BASE = RAW_BASE.replace(/\/+$/, '');

export const isPaymentEnabled = () => API_BASE.length > 0;

export interface OrderItemInput {
  id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

export interface CustomerInput {
  name: string;
  phone: string;
  email?: string;
  table?: string;
  notes?: string;
}

export interface CreateOrderResult {
  orderId: string;
  token: string;
  redirectUrl?: string;
  clientKey: string;
  snapScriptUrl: string;
}

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'expired';

export interface OrderStatusResult {
  orderId: string;
  status: OrderStatus;
  total: number;
  items: OrderItemInput[];
  paidAt?: string;
}

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options?: {
          onSuccess?: (result: unknown) => void;
          onPending?: (result: unknown) => void;
          onError?: (result: unknown) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

export async function createOrder(
  items: OrderItemInput[],
  customer: CustomerInput,
  finishUrl: string
): Promise<CreateOrderResult> {
  if (!isPaymentEnabled()) {
    throw new Error('Pembayaran belum dikonfigurasi.');
  }
  const res = await fetch(`${API_BASE}/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items, customer, finishUrl }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.token) {
    throw new Error(data?.error || 'Gagal membuat pembayaran.');
  }
  return data as CreateOrderResult;
}

export async function getOrderStatus(orderId: string): Promise<OrderStatusResult> {
  const res = await fetch(
    `${API_BASE}/order-status?order_id=${encodeURIComponent(orderId)}`
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || 'Gagal mengecek status pesanan.');
  }
  return data as OrderStatusResult;
}

// Memuat snap.js Midtrans (dengan client key) satu kali saja.
export function loadSnapScript(scriptUrl: string, clientKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.snap) {
      resolve();
      return;
    }
    const existing = document.getElementById('midtrans-snap');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Gagal memuat Snap.')));
      return;
    }
    const script = document.createElement('script');
    script.id = 'midtrans-snap';
    script.src = scriptUrl;
    script.setAttribute('data-client-key', clientKey);
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Gagal memuat Snap.'));
    document.body.appendChild(script);
  });
}
