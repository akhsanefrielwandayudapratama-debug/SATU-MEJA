// Cloudflare Worker: API pembayaran Satu Meja (Midtrans Snap)
// Endpoint:
//   POST /create-order   -> buat transaksi Midtrans, kembalikan Snap token
//   POST /webhook        -> notifikasi pembayaran dari Midtrans (verifikasi tanda tangan)
//   GET  /order-status   -> cek status pesanan (pending/paid/expired/failed)
//
// Rahasia disimpan sebagai secret Cloudflare: MIDTRANS_SERVER_KEY, FONNTE_TOKEN (opsional).
// Konfigurasi publik (vars): MIDTRANS_ENV, MIDTRANS_CLIENT_KEY, ALLOWED_ORIGINS, OWNER_WA, OWNER_NAME.

// Menu kanonik: sumber yang sama dengan situs (../../menu.json). Dipakai untuk
// memvalidasi harga di sisi server agar tidak bisa dimanipulasi pelanggan.
import MENU_DATA from '../../menu.json';

interface CanonicalMenu {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
}

const MENU_MAP = new Map<string, CanonicalMenu>(
  (MENU_DATA as CanonicalMenu[]).map((m) => [
    m.id,
    { id: m.id, name: m.name, price: m.price, isAvailable: m.isAvailable !== false },
  ])
);

export interface Env {
  ORDERS: KVNamespace;
  MIDTRANS_SERVER_KEY: string;
  MIDTRANS_CLIENT_KEY: string;
  MIDTRANS_ENV?: string; // "sandbox" | "production"
  ALLOWED_ORIGINS?: string; // dipisah koma
  OWNER_WA?: string; // contoh: 6282216828280
  OWNER_NAME?: string;
  FONNTE_TOKEN?: string; // opsional, untuk notifikasi WhatsApp
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

interface Customer {
  name: string;
  phone: string;
  email?: string;
  table?: string;
  notes?: string;
}

interface StoredOrder {
  orderId: string;
  items: OrderItem[];
  customer: Customer;
  total: number;
  status: 'pending' | 'paid' | 'failed' | 'expired';
  createdAt: string;
  paidAt?: string;
  paymentType?: string;
  transactionId?: string;
}

const ORDER_TTL = 60 * 60 * 24 * 30; // 30 hari

const isProduction = (env: Env) =>
  (env.MIDTRANS_ENV || 'sandbox').toLowerCase() === 'production';

const snapApiBase = (env: Env) =>
  isProduction(env) ? 'https://app.midtrans.com' : 'https://app.sandbox.midtrans.com';

const snapScriptUrl = (env: Env) =>
  isProduction(env)
    ? 'https://app.midtrans.com/snap/snap.js'
    : 'https://app.sandbox.midtrans.com/snap/snap.js';

function corsHeaders(env: Env, origin: string | null): Record<string, string> {
  const allowed = (env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const allow = origin && allowed.includes(origin) ? origin : allowed[0] || '*';
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  };
}

function json(data: unknown, status: number, env: Env, origin: string | null): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(env, origin) },
  });
}

async function sha512Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest('SHA-512', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function formatRupiah(n: number): string {
  return 'Rp ' + n.toLocaleString('id-ID');
}

async function handleCreateOrder(
  request: Request,
  env: Env,
  origin: string | null
): Promise<Response> {
  const body: any = await request.json().catch(() => null);
  if (!body || !Array.isArray(body.items) || body.items.length === 0) {
    return json({ error: 'Keranjang kosong.' }, 400, env, origin);
  }
  const customer: Customer = body.customer || {};
  if (!customer.name || !customer.phone) {
    return json({ error: 'Nama dan nomor WhatsApp wajib diisi.' }, 400, env, origin);
  }

  // Validasi tiap item terhadap menu kanonik: id harus ada & tersedia, dan
  // harga/nama DIAMBIL DARI SERVER (bukan dari klien) agar tidak bisa dipalsukan.
  const items: OrderItem[] = [];
  for (const raw of body.items as any[]) {
    const menu = MENU_MAP.get(String(raw?.id ?? ''));
    if (!menu) {
      return json(
        { error: `Menu tidak dikenal: ${String(raw?.id ?? '')}.` },
        400,
        env,
        origin
      );
    }
    if (!menu.isAvailable) {
      return json({ error: `Menu tidak tersedia: ${menu.name}.` }, 400, env, origin);
    }
    const quantity = Math.min(50, Math.max(1, Math.round(Number(raw?.quantity) || 1)));
    items.push({
      id: menu.id,
      name: menu.name.slice(0, 50),
      price: menu.price,
      quantity,
      notes: raw?.notes ? String(raw.notes).slice(0, 100) : undefined,
    });
  }

  const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  if (items.length === 0 || total < 1) {
    return json({ error: 'Total pesanan tidak valid.' }, 400, env, origin);
  }

  const orderId =
    'SM-' +
    Date.now().toString(36).toUpperCase() +
    '-' +
    Math.random().toString(36).slice(2, 6).toUpperCase();

  const midtransPayload: Record<string, unknown> = {
    transaction_details: { order_id: orderId, gross_amount: total },
    item_details: items.map((it, i) => ({
      id: it.id || `item-${i + 1}`,
      price: it.price,
      quantity: it.quantity,
      name: it.name,
    })),
    customer_details: {
      first_name: String(customer.name).slice(0, 50),
      phone: String(customer.phone).slice(0, 20),
      ...(customer.email ? { email: String(customer.email).slice(0, 50) } : {}),
    },
  };
  if (body.finishUrl) {
    midtransPayload.callbacks = { finish: String(body.finishUrl) };
  }

  const auth = btoa(env.MIDTRANS_SERVER_KEY + ':');
  let data: any = {};
  try {
    const resp = await fetch(`${snapApiBase(env)}/snap/v1/transactions`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(midtransPayload),
    });
    data = await resp.json().catch(() => ({}));
    if (!resp.ok || !data.token) {
      const msg =
        data?.error_messages?.[0] || data?.status_message || 'Gagal membuat pembayaran.';
      return json({ error: msg }, 502, env, origin);
    }
  } catch (e) {
    return json(
      { error: 'Tidak dapat menghubungi Midtrans: ' + (e as Error).message },
      502,
      env,
      origin
    );
  }

  const order: StoredOrder = {
    orderId,
    items,
    customer,
    total,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  await env.ORDERS.put(`order:${orderId}`, JSON.stringify(order), {
    expirationTtl: ORDER_TTL,
  });

  return json(
    {
      orderId,
      token: data.token,
      redirectUrl: data.redirect_url,
      clientKey: env.MIDTRANS_CLIENT_KEY,
      snapScriptUrl: snapScriptUrl(env),
    },
    200,
    env,
    origin
  );
}

async function notifyOwner(env: Env, order: StoredOrder): Promise<void> {
  if (!env.FONNTE_TOKEN || !env.OWNER_WA) return;
  const lines = [
    '*PESANAN DIBAYAR* ☕',
    `ID: ${order.orderId}`,
    `Nama: ${order.customer.name}`,
    `WA: ${order.customer.phone}`,
  ];
  if (order.customer.table) lines.push(`Meja/Lokasi: ${order.customer.table}`);
  lines.push('', '*Rincian:*');
  order.items.forEach((it, i) => {
    lines.push(`${i + 1}. ${it.quantity}x ${it.name} — ${formatRupiah(it.price * it.quantity)}`);
  });
  lines.push('', `*Total: ${formatRupiah(order.total)}*`);
  if (order.paymentType) lines.push(`Metode: ${order.paymentType}`);
  if (order.customer.notes) lines.push(`Catatan: ${order.customer.notes}`);

  try {
    await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        Authorization: env.FONNTE_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ target: env.OWNER_WA, message: lines.join('\n') }),
    });
  } catch {
    // abaikan kegagalan notifikasi; pesanan tetap tercatat
  }
}

async function handleWebhook(request: Request, env: Env): Promise<Response> {
  const body: any = await request.json().catch(() => null);
  if (!body || !body.order_id) return new Response('bad request', { status: 400 });

  const { order_id, status_code, gross_amount, signature_key } = body;
  const transaction_status: string = body.transaction_status || '';
  const fraud_status: string = body.fraud_status || '';

  const expected = await sha512Hex(
    `${order_id}${status_code}${gross_amount}${env.MIDTRANS_SERVER_KEY}`
  );
  if (expected !== signature_key) return new Response('invalid signature', { status: 401 });

  const key = `order:${order_id}`;
  const raw = await env.ORDERS.get(key);
  if (!raw) return new Response('order not found', { status: 404 });
  const order: StoredOrder = JSON.parse(raw);

  let paid = false;
  if (transaction_status === 'capture') paid = fraud_status === 'accept';
  else if (transaction_status === 'settlement') paid = true;
  const failed = ['deny', 'cancel', 'expire', 'failure'].includes(transaction_status);

  if (paid && order.status !== 'paid') {
    order.status = 'paid';
    order.paidAt = new Date().toISOString();
    order.paymentType = body.payment_type;
    order.transactionId = body.transaction_id;
    await env.ORDERS.put(key, JSON.stringify(order), { expirationTtl: ORDER_TTL });
    await notifyOwner(env, order);
  } else if (failed && order.status === 'pending') {
    order.status = transaction_status === 'expire' ? 'expired' : 'failed';
    await env.ORDERS.put(key, JSON.stringify(order), { expirationTtl: ORDER_TTL });
  }

  return new Response('ok', { status: 200 });
}

async function handleOrderStatus(
  url: URL,
  env: Env,
  origin: string | null
): Promise<Response> {
  const orderId = url.searchParams.get('order_id');
  if (!orderId) return json({ error: 'order_id wajib diisi.' }, 400, env, origin);
  const raw = await env.ORDERS.get(`order:${orderId}`);
  if (!raw) return json({ error: 'Pesanan tidak ditemukan.' }, 404, env, origin);
  const o: StoredOrder = JSON.parse(raw);
  return json(
    {
      orderId: o.orderId,
      status: o.status,
      total: o.total,
      items: o.items,
      paidAt: o.paidAt,
    },
    200,
    env,
    origin
  );
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(env, origin) });
    }

    try {
      if (url.pathname === '/create-order' && request.method === 'POST') {
        return await handleCreateOrder(request, env, origin);
      }
      if (url.pathname === '/webhook' && request.method === 'POST') {
        return await handleWebhook(request, env);
      }
      if (url.pathname === '/order-status' && request.method === 'GET') {
        return await handleOrderStatus(url, env, origin);
      }
      if (url.pathname === '/') {
        return json({ ok: true, service: 'satu-meja-pay' }, 200, env, origin);
      }
      return json({ error: 'Not found' }, 404, env, origin);
    } catch (e) {
      return json({ error: (e as Error).message || 'Terjadi kesalahan.' }, 500, env, origin);
    }
  },
};
