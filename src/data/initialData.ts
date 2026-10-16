import { MenuItem, GalleryPhoto } from '../types';
import menuData from '../../menu.json';

// Menu kanonik bersama. File ../../menu.json juga dipakai oleh Cloudflare Worker
// (worker/src/index.ts) untuk memvalidasi harga di sisi server, sehingga harga
// tidak bisa dimanipulasi dari sisi pelanggan.
export const INITIAL_MENU_ITEMS: MenuItem[] = menuData as MenuItem[];

// 15 Photos matching GALERI SATU MEJA.png (3 rows x 5 columns)
export const INITIAL_GALLERY_PHOTOS: GalleryPhoto[] = [
  // Row 1
  {
    id: 'g1',
    title: 'Espresso Single Origin',
    subtitle: 'Kopi hitam murni di atas meja kayu rustik',
    imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80',
    category: 'coffee',
  },
  {
    id: 'g2',
    title: 'Es Kopi Susu Aren Dingin',
    subtitle: 'Segarnya kopi susu gula aren di luar ruangan',
    imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80',
    category: 'coffee',
  },
  {
    id: 'g3',
    title: 'Latte Art Hati',
    subtitle: 'Sentuhan seni barista dalam cangkir keramik abu',
    imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80',
    category: 'coffee',
  },
  {
    id: 'g4',
    title: 'Biji & Bubuk Kopi Sangrai',
    subtitle: 'Biji kopi pilihan dalam karung goni tradisional',
    imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=600&q=80',
    category: 'coffee',
  },
  {
    id: 'g5',
    title: 'Ekstraksi Mesin Portafilter',
    subtitle: 'Proses ekstraksi espresso bertekanan presisi',
    imageUrl: 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=600&q=80',
    category: 'barista',
  },

  // Row 2
  {
    id: 'g6',
    title: 'Limpahan Biji Kopi Sangrai',
    subtitle: 'Biji kopi bermutu tinggi disangrai sempurna',
    imageUrl: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=600&q=80',
    category: 'coffee',
  },
  {
    id: 'g7',
    title: 'Cold Brew Sore Hari',
    subtitle: 'Secangkir seduhan dingin di teras alam',
    imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
    category: 'atmosphere',
  },
  {
    id: 'g8',
    title: 'Satu Meja Kerja & Diskusi',
    subtitle: 'Meja kayu lapang ditemani laptop dan kopi',
    imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80',
    category: 'atmosphere',
  },
  {
    id: 'g9',
    title: 'Bersulang di Satu Meja',
    subtitle: 'Tiga cangkir kopi, tiga cerita kerabat',
    imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=600&q=80',
    category: 'atmosphere',
  },
  {
    id: 'g10',
    title: 'Keheningan Senja',
    subtitle: 'Cahaya matahari senja menyinari secangkir latte',
    imageUrl: 'https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=600&q=80',
    category: 'atmosphere',
  },

  // Row 3
  {
    id: 'g11',
    title: 'Secangkir Hangat Berbiji Kopi',
    subtitle: 'Aroma khas kopi hitam di pagi atau larut malam',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    category: 'coffee',
  },
  {
    id: 'g12',
    title: 'Barista Pouring Foam',
    subtitle: 'Ketelitian menuang susu ke dalam cangkir espresso',
    imageUrl: 'https://images.unsplash.com/photo-1518832553480-cd0e625ed3e6?auto=format&fit=crop&w=600&q=80',
    category: 'barista',
  },
  {
    id: 'g13',
    title: 'Mesin Grinder Roastery',
    subtitle: 'Peralatan penggiling biji kopi berkualitas tinggi',
    imageUrl: 'https://images.unsplash.com/photo-1520970014086-2208d157c9e2?auto=format&fit=crop&w=600&q=80',
    category: 'barista',
  },
  {
    id: 'g14',
    title: 'Cangkir Putih & Hamparan Biji',
    subtitle: 'Kopi hitam otentik kaya cita rasa',
    imageUrl: 'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?auto=format&fit=crop&w=600&q=80',
    category: 'coffee',
  },
  {
    id: 'g15',
    title: 'Kreasi Seni Tulip Barista',
    subtitle: 'Detail indah latte art disajikan dengan ketulusan',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80',
    category: 'barista',
  },
];
