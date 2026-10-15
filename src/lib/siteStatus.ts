import { SiteStatus } from '../types';

const REPO_OWNER = 'akhsanefrielwandayudapratama-debug';
const REPO_NAME = 'SATU-MEJA';
const BRANCH = 'main';
const STATUS_FILE = 'site-status.json';

const RAW_URL = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/${STATUS_FILE}`;

export const STATUS_EDIT_URL = `https://github.com/${REPO_OWNER}/${REPO_NAME}/edit/${BRANCH}/${STATUS_FILE}`;
export const STATUS_VIEW_URL = `https://github.com/${REPO_OWNER}/${REPO_NAME}/blob/${BRANCH}/${STATUS_FILE}`;

export const DEFAULT_SITE_STATUS: SiteStatus = {
  open: true,
  message: 'Kami sedang istirahat sejenak. Silakan cek lagi nanti ya.',
  reopenInfo: '',
  updatedAt: '',
};

// Fail-open: jika gagal ambil status, anggap situs TERBUKA
// agar website tidak pernah salah tampil "tutup" karena masalah jaringan.
export const fetchSiteStatus = async (): Promise<SiteStatus> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`${RAW_URL}?t=${Date.now()}`, {
      cache: 'no-store',
      signal: controller.signal,
    });
    if (!res.ok) return DEFAULT_SITE_STATUS;
    const data = (await res.json()) as Partial<SiteStatus>;
    return {
      open: data.open !== false,
      message: data.message || DEFAULT_SITE_STATUS.message,
      reopenInfo: data.reopenInfo || '',
      updatedAt: data.updatedAt || '',
    };
  } catch {
    return DEFAULT_SITE_STATUS;
  } finally {
    clearTimeout(timeout);
  }
};
