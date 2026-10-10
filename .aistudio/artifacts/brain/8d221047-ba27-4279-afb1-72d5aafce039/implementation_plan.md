# Implementasi Website Satu Meja Coffee & Roastery

Rencana pembuatan aplikasi web responsif untuk **Satu Meja** ("Coffee, Smoke, Talk") yang merefleksikan 100% desain UI yang telah dirancang: halaman **Tentang Kami**, **Menu**, **Galeri**, **Beranda**, dan **Kontak**, dilengkapi dengan fitur interaktif **Keranjang Belanja WhatsApp** dan **Dashboard Admin Barista**.

## User Review & Critical Decisions

> [!IMPORTANT]
> Berdasarkan jawaban klarifikasi yang telah Anda konfirmasi:
> - **Navigasi Tab Interaktif**: Beralih antara Beranda, Menu, Tentang Kami, Galeri, dan Kontak secara instan tanpa reload browser, dengan indikator aktif yang sesuai dengan desain UI.
> - **Login Admin & Dashboard Pengelola**: Tombol "Login Admin" membuka modal autentikasi barista untuk mengelola daftar menu (tambah, edit harga/stok/deskripsi, hapus) dan galeri foto.
> - **Pemesanan via WhatsApp**: Pelanggan dapat memilih varian minuman, melihat subtotal di keranjang, dan melakukan checkout instan yang otomatis membuka format pesanan siap kirim ke WhatsApp resmi Satu Meja (`081112131415`).

---

## 1. Overview & Core Concept

- **Apa yang Dibangun**: Sebuah platform web profil dan katalog kafe Satu Meja dengan nuansa hangat, vintage-rustic, dan intim. Merealisasikan filosofi *"Sebuah meja bukan hanya tempat untuk meletakkan secangkir kopi. Meja adalah tempat di mana banyak cerita dimulai."*
- **Target Pengguna**: Penikmat kopi, komunitas tongkrongan, kerabat diskusi malam di sekitar Pesantren Ekonomi Darul Uchwah, serta barista pengelola kafe.
- **Nilai Utama**: Tampilan visual yang persis dengan mockup UI, kemudahan melihat menu dan memesan kopi langsung via WhatsApp, serta kemudahan barista memperbarui menu dan foto galeri.

---

## 2. User Experience & Visual Design

### Identitas Visual & Tema
- **Warna & Palet**:
  - Dominant Dark Warm Espresso: `#2C1810` / `#382318` (Header, Hero Sub-banner, Footer, dan Aksen Tombol Utama).
  - Background Neutral Cream: `#F7F4ED` / `#FAF6F0` (Latar belakang lembut ramah mata).
  - Surface Card White: `#FFFFFF` dengan bayangan lembut dan border tipis hangat (`rgba(62, 39, 35, 0.08)`).
  - Text & Accents: Cokelat tua untuk tipografi judul, abu-abu netral hangat untuk deskripsi, dan aksen skrip kaligrafi *"Kopi yang baik, selalu punya cerita."*
- **Tipografi**:
  - Judul / Display: Serif elegan dan berkarakter (`Playfair Display` / `Cinzel` / Serif klasik) untuk merepresentasikan kehangatan kedai kopi artisanal.
  - Teks Isi: Sans-serif modern dan bersih (`Plus Jakarta Sans` / `Outfit`) untuk keterbacaan tinggi pada menu dan harga angka tabular (`tabular-nums`).
  - Slogan Kursif: Font skrip bertekstur tangan untuk *"Kopi yang baik, selalu punya cerita"*.

### Komponen & Halaman Utama
1. **Header Navigasi**:
   - Wordmark & Ikon Kopi "Satu Meja".
   - Menu Navigasi: Beranda, Menu, Tentang Kami, Galeri, Kontak dengan indikator garis bawah aktif (`border-b-2`).
   - Tombol "Login Admin" (pill gelap elegan).
   - Ikon Keranjang Belanja melayang dengan badge jumlah pesanan.
2. **Halaman Tentang Kami (Sesuai Mockup 1)**:
   - Hero banner cokelat: *"Selamat datang dan selamat menikmati kopi di SATU MEJA"*, judul besar *"Nikmati Kopi Pilihan"*, deskripsi suasana malam, dan tombol *"Lihat Menu →"*.
   - Konten 3 kolom seimbang:
     - Kiri: Badge stempel vintage melingkar *"SATU MEJA - fratellanza - 2026 - KOPI • ROKOK • DISKUSI"*.
     - Tengah: Teks narasi lengkap sejarah dan filosofi Satu Meja.
     - Kanan: Info Alamat (*Pesantren Ekonomi Darul Uchwah*), Jam Buka (*Tergantung Mood Barista*), dan kaligrafi *"Kopi yang baik, selalu punya cerita."*.
3. **Halaman Menu (Sesuai Mockup 3)**:
   - Sub-banner cokelat: *"Pilihan Rasa, Untuk Setiap Cerita - Menu Kami"*.
   - Kategori **Coffee** (Americano Rp 13.000, Kopi Susu Rp 18.000, Espresso Rp 10.000, Cappuccino Rp 15.000, dll.) dengan tombol *"Lihat semua"*.
   - Kategori **Non Coffee** (Matcha Rp 18.000, Chocolate Rp 18.000, Milkshake Rp 20.000, dll.) dengan tombol *"Lihat semua"*.
   - Setiap kartu menu memiliki foto produk estetik, nama, komposisi/deskripsi singkat, harga tabular, serta tombol "+ Tambah ke Pesanan".
   - Fitur filter cepat & kolom pencarian nama menu.
4. **Halaman Galeri (Sesuai Mockup 2)**:
   - Sub-banner cokelat: *"Galeri - Momen, rasa, dan suasana di satu meja"*.
   - Grid foto responsif 15 gambar (kopi latte art, biji kopi, espresso machine, suasana meja kayu, toast kopi kerabat).
   - Modal Lightbox: Klik gambar untuk melihat foto resolusi penuh dalam mode fokus.
5. **Halaman Kontak & Reservasi**:
   - Informasi lokasi peta, jam operasional, tautan WhatsApp langsung, dan akun Instagram `@SATU_MEJA`.
   - Formulir pesan/reservasi meja sederhana bagi pengunjung yang ingin mengadakan diskusi grup.
6. **Footer (Sesuai Mockup)**:
   - Logo bulat Satu Meja + "Coffee, Smoke, Talk".
   - Tautan navigasi footer.
   - Kontak WhatsApp `081112131415` dan Instagram `@SATU_MEJA`.
7. **Modal Admin Dashboard**:
   - Autentikasi barista (PIN/Password sederhana).
   - Manajemen katalog menu: Tambah menu baru, ubah harga, tandai status stok habis/tersedia, dan hapus menu.
   - Manajemen galeri foto: Tambah URL/foto baru atau hapus foto.

---

## 3. Key Product Decisions & Trade-Offs

- **Manajemen State Lokal & Sinkronisasi**:
  - *Pendekatan*: Menyimpan data katalog awal sesuai mockup, dengan perubahan admin (penambahan/pengeditan) tersimpan aman di `localStorage` agar tidak hilang saat refresh halaman.
  - *Alasan*: Cepat, instan, tanpa memerlukan dependensi server eksternal, dan langsung siap digunakan.
- **Pemesanan WhatsApp Tanpa Gerbang Pembayaran Rumit**:
  - *Pendekatan*: Keranjang belanja mengumpulkan item yang dipilih lalu menyusun URL WhatsApp API (`https://wa.me/6281112131415?text=...`) dengan rincian nama pesanan, jumlah, harga, dan total.
  - *Alasan*: Sangat cocok untuk model operasional kedai kopi lokal di mana pesanan diproses langsung oleh barista di bar.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────┐
│                      App Container                     │
├────────────────────────────────────────────────────────┤
│ Header: Logo | Nav Tabs | Cart Icon | Login Admin Btn  │
├────────────────────────────────────────────────────────┤
│ Active View Router (State-Driven SPA)                  │
│  ├── View: Tentang Kami (Banner + Stamp + Story + Info)│
│  ├── View: Menu (Coffee Grid + Non-Coffee Grid + Modal)│
│  ├── View: Galeri (15-Photo Grid + Lightbox Zoom)      │
│  ├── View: Beranda (Highlight Stories & Favorite Menu) │
│  └── View: Kontak (Location Details & Inquiries)       │
├────────────────────────────────────────────────────────┤
│ Global Overlays & Modals                               │
│  ├── Cart Drawer (Item Qty, Notes, Total, Checkout WA) │
│  ├── Admin Modal & Barista Management Dashboard        │
│  └── Photo Lightbox Modal                              │
├────────────────────────────────────────────────────────┤
│ Footer: Brand Emblem | Nav Links | WA & IG Socials     │
└────────────────────────────────────────────────────────┘
```

### Entitas Data Utama
- `MenuItem`: `id`, `name`, `category` ('coffee' | 'non-coffee' | 'snack'), `description`, `price`, `image`, `isAvailable`.
- `CartItem`: `menuItem`, `quantity`, `notes`.
- `GalleryItem`: `id`, `title`, `imageUrl`, `category`.
