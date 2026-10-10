export type CategoryType = 'coffee' | 'non-coffee' | 'snack';

export interface MenuItem {
  id: string;
  name: string;
  category: CategoryType;
  description: string;
  price: number;
  image: string;
  isAvailable: boolean;
  isBestSeller?: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  category: 'coffee' | 'atmosphere' | 'barista';
}

export type TabType = 'beranda' | 'menu' | 'tentang' | 'galeri' | 'kontak';
