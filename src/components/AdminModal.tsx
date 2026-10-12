import React, { useState, useRef } from 'react';
import { MenuItem, GalleryPhoto, CategoryType } from '../types';
import { X, Lock, Plus, Trash2, Edit2, RotateCcw, Check, LogOut, Coffee, Image as ImageIcon } from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  galleryPhotos: GalleryPhoto[];
  onSaveMenuItems: (items: MenuItem[]) => void;
  onSaveGalleryPhotos: (photos: GalleryPhoto[]) => void;
  onResetToDefault: () => void;
}

// Max file mentah 10MB, hasil kompres max 1024px sisi panjang, JPEG kualitas 0.82
const MAX_RAW_FILE_BYTES = 10 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 1024;

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File harus berupa gambar.'));
      return;
    }
    if (file.size > MAX_RAW_FILE_BYTES) {
      reject(new Error('Ukuran foto terlalu besar (maks 10MB).'));
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Gagal memproses foto.'));
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Gagal membaca foto.'));
    };
    img.src = objectUrl;
  });
};

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  menuItems,
  galleryPhotos,
  onSaveMenuItems,
  onSaveGalleryPhotos,
  onResetToDefault,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeAdminTab, setActiveAdminTab] = useState<'menu' | 'gallery'>('menu');

  // Menu Form State
  const [editingMenuId, setEditingMenuId] = useState<string | null>(null);
  const [menuName, setMenuName] = useState('');
  const [menuCategory, setMenuCategory] = useState<CategoryType>('coffee');
  const [menuPrice, setMenuPrice] = useState('15000');
  const [menuDesc, setMenuDesc] = useState('');
  const [menuImage, setMenuImage] = useState('');

  // Gallery Form State
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoSubtitle, setPhotoSubtitle] = useState('');
  const [photoCategory, setPhotoCategory] = useState<'coffee' | 'atmosphere' | 'barista'>('coffee');
  const [photoUrl, setPhotoUrl] = useState('');

  // File picker state (pratinjau + error + ref untuk reset input)
  const [menuImageError, setMenuImageError] = useState('');
  const [photoImageError, setPhotoImageError] = useState('');
  const [isReadingMenuImage, setIsReadingMenuImage] = useState(false);
  const [isReadingPhotoImage, setIsReadingPhotoImage] = useState(false);
  const menuFileRef = useRef<HTMLInputElement>(null);
  const photoFileRef = useRef<HTMLInputElement>(null);

  const resetMenuForm = () => {
    setEditingMenuId(null);
    setMenuName('');
    setMenuDesc('');
    setMenuPrice('15000');
    setMenuImage('');
    setMenuImageError('');
    if (menuFileRef.current) menuFileRef.current.value = '';
  };

  const resetPhotoForm = () => {
    setPhotoTitle('');
    setPhotoSubtitle('');
    setPhotoUrl('');
    setPhotoImageError('');
    if (photoFileRef.current) photoFileRef.current.value = '';
  };

  const handleMenuFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsReadingMenuImage(true);
    setMenuImageError('');
    try {
      const dataUrl = await compressImage(file);
      setMenuImage(dataUrl);
    } catch (err) {
      setMenuImageError(err instanceof Error ? err.message : 'Gagal membaca foto.');
      if (menuFileRef.current) menuFileRef.current.value = '';
    } finally {
      setIsReadingMenuImage(false);
    }
  };

  const handlePhotoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsReadingPhotoImage(true);
    setPhotoImageError('');
    try {
      const dataUrl = await compressImage(file);
      setPhotoUrl(dataUrl);
    } catch (err) {
      setPhotoImageError(err instanceof Error ? err.message : 'Gagal membaca foto.');
      if (photoFileRef.current) photoFileRef.current.value = '';
    } finally {
      setIsReadingPhotoImage(false);
    }
  };

  if (!isOpen) return null;

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pinInput === 'baristaDU26') {
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Password salah. Silakan coba lagi.');
    }
  };

  // MENU CRUD
  const handleSaveMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuName.trim()) return;

    const parsedPrice = parseInt(menuPrice.replace(/\D/g, ''), 10) || 10000;
    const fallbackImg = menuCategory === 'coffee'
      ? 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80'
      : 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80';

    if (editingMenuId) {
      const updated = menuItems.map((item) =>
        item.id === editingMenuId
          ? {
              ...item,
              name: menuName,
              category: menuCategory,
              price: parsedPrice,
              description: menuDesc,
              image: menuImage.trim() || item.image,
            }
          : item
      );
      onSaveMenuItems(updated);
      setEditingMenuId(null);
    } else {
      const newItem: MenuItem = {
        id: 'm_' + Date.now(),
        name: menuName,
        category: menuCategory,
        price: parsedPrice,
        description: menuDesc,
        image: menuImage.trim() || fallbackImg,
        isAvailable: true,
      };
      onSaveMenuItems([newItem, ...menuItems]);
    }

    // Reset Form
    resetMenuForm();
  };

  const handleEditMenu = (item: MenuItem) => {
    setEditingMenuId(item.id);
    setMenuName(item.name);
    setMenuCategory(item.category);
    setMenuPrice(item.price.toString());
    setMenuDesc(item.description);
    setMenuImage(item.image);
  };

  const handleDeleteMenu = (id: string) => {
    onSaveMenuItems(menuItems.filter((i) => i.id !== id));
  };

  const handleToggleAvailable = (id: string) => {
    onSaveMenuItems(
      menuItems.map((i) =>
        i.id === id ? { ...i, isAvailable: !i.isAvailable } : i
      )
    );
  };

  // GALLERY CRUD
  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoTitle.trim()) return;

    const newPhoto: GalleryPhoto = {
      id: 'g_' + Date.now(),
      title: photoTitle,
      subtitle: photoSubtitle || 'Momen di Satu Meja',
      category: photoCategory,
      imageUrl:
        photoUrl.trim() ||
        'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=600&q=80',
    };
    onSaveGalleryPhotos([newPhoto, ...galleryPhotos]);

    resetPhotoForm();
  };

  const handleDeletePhoto = (id: string) => {
    onSaveGalleryPhotos(galleryPhotos.filter((p) => p.id !== id));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-[#FAF6F0] rounded-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden border border-[#D9CEBA]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E2D6C0] bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2C1810] text-[#FAF6F0] flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2C1810]">
                Dashboard Barista Satu Meja
              </h3>
              <p className="text-xs text-[#7A685A]">
                {isAuthenticated
                  ? 'Kelola menu kopi & galeri kedai'
                  : 'Autentikasi barista'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => setIsAuthenticated(false)}
                className="p-2 text-xs font-semibold text-[#8D3B2B] hover:bg-[#F2ECE1] rounded-lg flex items-center gap-1 cursor-pointer"
                title="Keluar"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#5C4535] hover:bg-[#EFE7D8] cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {!isAuthenticated ? (
            /* Login Form */
            <div className="max-w-sm mx-auto py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#EAE0D0] flex items-center justify-center mx-auto text-[#2C1810]">
                <Lock className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-xl font-bold text-[#2C1810]">
                Masuk Akun Barista
              </h4>
              <p className="text-xs text-[#6E594B]">
                Masukkan password Barista untuk mengedit katalog menu & galeri.
              </p>

              {errorMsg && (
                <p className="text-xs text-[#D32F2F] font-semibold bg-[#FFEBEE] p-2 rounded-lg">
                  {errorMsg}
                </p>
              )}

              <form onSubmit={handleLogin} className="space-y-3 pt-2">
                <input
                  type="password"
                  placeholder="Masukkan password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full text-center px-4 py-2.5 bg-white border border-[#D9CDB8] rounded-xl text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-[#2C1810]/20"
                />

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#2C1810] hover:bg-[#432618] text-white font-bold text-sm rounded-xl transition-all cursor-pointer"
                >
                  Masuk
                </button>
              </form>
            </div>
          ) : (
            /* Admin Management Interface */
            <div className="space-y-6">
              {/* Tab Selector */}
              <div className="flex items-center justify-between border-b border-[#E2D6C0] pb-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveAdminTab('menu')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      activeAdminTab === 'menu'
                        ? 'bg-[#2C1810] text-white'
                        : 'bg-[#EAE0D0] text-[#5C4535] hover:bg-[#E0D4C2]'
                    }`}
                  >
                    <Coffee className="w-4 h-4" />
                    <span>Kelola Menu ({menuItems.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveAdminTab('gallery')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      activeAdminTab === 'gallery'
                        ? 'bg-[#2C1810] text-white'
                        : 'bg-[#EAE0D0] text-[#5C4535] hover:bg-[#E0D4C2]'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Kelola Galeri ({galleryPhotos.length})</span>
                  </button>
                </div>

                <button
                  onClick={onResetToDefault}
                  className="text-xs text-[#8D3B2B] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  title="Kembalikan ke data awal bawaan"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset Default</span>
                </button>
              </div>

              {/* TAB 1: KELOLA MENU */}
              {activeAdminTab === 'menu' && (
                <div className="space-y-6">
                  {/* Add / Edit Form */}
                  <form
                    onSubmit={handleSaveMenu}
                    className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8DFC8] space-y-3"
                  >
                    <h5 className="font-bold text-sm text-[#2C1810] flex items-center gap-1.5">
                      {editingMenuId ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      <span>{editingMenuId ? 'Edit Menu' : 'Tambah Menu Baru'}</span>
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#4E382A] mb-1">
                          Nama Menu *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Nama minuman / makanan"
                          value={menuName}
                          onChange={(e) => setMenuName(e.target.value)}
                          className="w-full px-3 py-1.5 bg-[#FAF7F2] rounded-lg text-xs border border-[#D9CDB8]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#4E382A] mb-1">
                          Kategori
                        </label>
                        <select
                          value={menuCategory}
                          onChange={(e) => setMenuCategory(e.target.value as CategoryType)}
                          className="w-full px-3 py-1.5 bg-[#FAF7F2] rounded-lg text-xs border border-[#D9CDB8]"
                        >
                          <option value="coffee">Coffee</option>
                          <option value="non-coffee">Non Coffee</option>
                          <option value="snack">Camilan</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#4E382A] mb-1">
                          Harga (Rp)
                        </label>
                        <input
                          type="number"
                          value={menuPrice}
                          onChange={(e) => setMenuPrice(e.target.value)}
                          className="w-full px-3 py-1.5 bg-[#FAF7F2] rounded-lg text-xs border border-[#D9CDB8]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#4E382A] mb-1">
                          Deskripsi Singkat
                        </label>
                        <input
                          type="text"
                          placeholder="Contoh: Espresso, steamed milk, dan foam"
                          value={menuDesc}
                          onChange={(e) => setMenuDesc(e.target.value)}
                          className="w-full px-3 py-1.5 bg-[#FAF7F2] rounded-lg text-xs border border-[#D9CDB8]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#4E382A] mb-1">
                          Foto Menu
                        </label>
                        <input
                          ref={menuFileRef}
                          type="file"
                          accept="image/*"
                          onChange={handleMenuFile}
                          className="w-full px-3 py-1.5 bg-[#FAF7F2] rounded-lg text-xs border border-[#D9CDB8] text-[#4E382A] file:mr-2 file:px-2.5 file:py-1 file:rounded-md file:border-0 file:bg-[#2C1810] file:text-white file:text-[11px] file:font-bold file:cursor-pointer"
                        />
                        {isReadingMenuImage && (
                          <p className="text-[11px] text-[#7A685A] mt-1">Memproses foto...</p>
                        )}
                        {menuImageError && (
                          <p className="text-[11px] text-[#D32F2F] font-semibold mt-1">
                            {menuImageError}
                          </p>
                        )}
                        {menuImage && (
                          <div className="relative mt-2 w-24 h-24 rounded-lg overflow-hidden border border-[#D9CDB8] bg-[#EFE9DD]">
                            <img
                              src={menuImage}
                              alt="Pratinjau foto menu"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setMenuImage('');
                                setMenuImageError('');
                                if (menuFileRef.current) menuFileRef.current.value = '';
                              }}
                              className="absolute top-1 right-1 p-1 rounded-md bg-[#D32F2F] text-white cursor-pointer"
                              title="Hapus foto"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#2C1810] hover:bg-[#432618] text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{editingMenuId ? 'Perbarui Menu' : 'Simpan Menu'}</span>
                      </button>

                      {editingMenuId && (
                        <button
                          type="button"
                          onClick={resetMenuForm}
                          className="px-3 py-2 bg-[#EAE0D0] text-[#4E382A] text-xs font-semibold rounded-lg cursor-pointer"
                        >
                          Batal
                        </button>
                      )}
                    </div>
                  </form>

                  {/* Menu Items Table */}
                  <div className="bg-white rounded-2xl border border-[#E8DFC8] overflow-hidden">
                    <div className="divide-y divide-[#EFE7D8]">
                      {menuItems.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 sm:p-4 flex items-center justify-between gap-3 hover:bg-[#FAF7F2] transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 rounded-lg object-cover shrink-0 bg-[#EFE9DD]"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h6 className="font-bold text-xs sm:text-sm text-[#2C1810] truncate">
                                  {item.name}
                                </h6>
                                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#F2EAE0] text-[#7A685A]">
                                  {item.category}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#7A685A] truncate">
                                Rp {item.price.toLocaleString('id-ID')} · {item.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleToggleAvailable(item.id)}
                              className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer ${
                                item.isAvailable
                                  ? 'bg-[#E8F5E9] text-[#2E7D32]'
                                  : 'bg-[#FFEBEE] text-[#D32F2F]'
                              }`}
                            >
                              {item.isAvailable ? 'Tersedia' : 'Habis'}
                            </button>

                            <button
                              onClick={() => handleEditMenu(item)}
                              className="p-1.5 text-[#5C4535] hover:bg-[#EAE0D0] rounded cursor-pointer"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteMenu(item.id)}
                              className="p-1.5 text-[#8D3B2B] hover:bg-[#FFEBEE] rounded cursor-pointer"
                              title="Hapus"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: KELOLA GALERI */}
              {activeAdminTab === 'gallery' && (
                <div className="space-y-6">
                  {/* Add Photo Form */}
                  <form
                    onSubmit={handleAddPhoto}
                    className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8DFC8] space-y-3"
                  >
                    <h5 className="font-bold text-sm text-[#2C1810] flex items-center gap-1.5">
                      <Plus className="w-4 h-4" />
                      <span>Tambah Foto Baru ke Galeri</span>
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#4E382A] mb-1">
                          Judul Foto *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Seduhan V60 Pagi"
                          value={photoTitle}
                          onChange={(e) => setPhotoTitle(e.target.value)}
                          className="w-full px-3 py-1.5 bg-[#FAF7F2] rounded-lg text-xs border border-[#D9CDB8]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#4E382A] mb-1">
                          Keterangan / Subtitle
                        </label>
                        <input
                          type="text"
                          placeholder="Momen hangat di sudut meja"
                          value={photoSubtitle}
                          onChange={(e) => setPhotoSubtitle(e.target.value)}
                          className="w-full px-3 py-1.5 bg-[#FAF7F2] rounded-lg text-xs border border-[#D9CDB8]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#4E382A] mb-1">
                          Kategori
                        </label>
                        <select
                          value={photoCategory}
                          onChange={(e) => setPhotoCategory(e.target.value as any)}
                          className="w-full px-3 py-1.5 bg-[#FAF7F2] rounded-lg text-xs border border-[#D9CDB8]"
                        >
                          <option value="coffee">Cita Rasa Kopi</option>
                          <option value="atmosphere">Suasana Kedai</option>
                          <option value="barista">Seni Barista</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#4E382A] mb-1">
                        Foto Galeri
                      </label>
                      <input
                        ref={photoFileRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoFile}
                        className="w-full px-3 py-1.5 bg-[#FAF7F2] rounded-lg text-xs border border-[#D9CDB8] text-[#4E382A] file:mr-2 file:px-2.5 file:py-1 file:rounded-md file:border-0 file:bg-[#2C1810] file:text-white file:text-[11px] file:font-bold file:cursor-pointer"
                      />
                      {isReadingPhotoImage && (
                        <p className="text-[11px] text-[#7A685A] mt-1">Memproses foto...</p>
                      )}
                      {photoImageError && (
                        <p className="text-[11px] text-[#D32F2F] font-semibold mt-1">
                          {photoImageError}
                        </p>
                      )}
                      {photoUrl && (
                        <div className="relative mt-2 w-24 h-24 rounded-lg overflow-hidden border border-[#D9CDB8] bg-[#E2D7C5]">
                          <img
                            src={photoUrl}
                            alt="Pratinjau foto galeri"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setPhotoUrl('');
                              setPhotoImageError('');
                              if (photoFileRef.current) photoFileRef.current.value = '';
                            }}
                            className="absolute top-1 right-1 p-1 rounded-md bg-[#D32F2F] text-white cursor-pointer"
                            title="Hapus foto"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#2C1810] hover:bg-[#432618] text-white text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Tambahkan ke Galeri
                    </button>
                  </form>

                  {/* Photo Grid Preview & Delete */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {galleryPhotos.map((photo) => (
                      <div
                        key={photo.id}
                        className="relative group rounded-xl overflow-hidden aspect-4/3 bg-[#E2D7C5] border border-[#D9CEBA]"
                      >
                        <img
                          src={photo.imageUrl}
                          alt={photo.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between text-white">
                          <p className="text-[11px] font-bold truncate">
                            {photo.title}
                          </p>
                          <button
                            onClick={() => handleDeletePhoto(photo.id)}
                            className="self-end p-1 rounded bg-[#D32F2F] text-white text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
