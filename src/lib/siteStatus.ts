import { SiteStatus } from '../types';

const REPO_OWNER = 'akhsanefrielwandayudapratama-debug';
const REPO_NAME = 'SATU-MEJA';
const BRANCH = 'main';
const STATUS_FILE = 'site-status.json';

const RAW_URL = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/${STATUS_FILE}`;
const API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${STATUS_FILE}`;

const TOKEN_KEY = 'satu_meja_gh_token';

export const DEFAULT_SITE_STATUS: SiteStatus = {
  open: true,
  message: 'Kami sedang istirahat sejenak. Silakan cek lagi nanti ya.',
  reopenInfo: '',
  updatedAt: '',
};

export const getGithubToken = (): string => {
  try {
    return localStorage.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
};

export const setGithubToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token.trim());
};

export const clearGithubToken = () => {
  localStorage.removeItem(TOKEN_KEY);
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

const toBase64 = (text: string): string => {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
};

export const pushSiteStatus = async (
  status: Pick<SiteStatus, 'open' | 'message' | 'reopenInfo'>,
  token: string
): Promise<SiteStatus> => {
  if (!token.trim()) {
    throw new Error('Token GitHub belum diisi.');
  }

  const headers = {
    Authorization: `Bearer ${token.trim()}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  // Ambil sha file saat ini (wajib untuk update)
  const getRes = await fetch(`${API_URL}?ref=${BRANCH}`, { headers });
  let sha: string | undefined;
  if (getRes.ok) {
    const current = (await getRes.json()) as { sha?: string };
    sha = current.sha;
  } else if (getRes.status !== 404) {
    throw new Error(
      getRes.status === 401 || getRes.status === 403
        ? 'Token tidak valid atau tidak punya izin (butuh Contents: Read and write).'
        : `Gagal membaca status (${getRes.status}).`
    );
  }

  const nextStatus: SiteStatus = {
    open: status.open,
    message: status.message.trim() || DEFAULT_SITE_STATUS.message,
    reopenInfo: status.reopenInfo?.trim() || '',
    updatedAt: new Date().toISOString(),
  };

  const putRes = await fetch(API_URL, {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: `chore: ${nextStatus.open ? 'buka' : 'tutup'} website`,
      content: toBase64(JSON.stringify(nextStatus, null, 2) + '\n'),
      sha,
      branch: BRANCH,
    }),
  });

  if (!putRes.ok) {
    throw new Error(
      putRes.status === 401 || putRes.status === 403
        ? 'Token tidak valid atau tidak punya izin menulis.'
        : `Gagal menyimpan status (${putRes.status}).`
    );
  }

  return nextStatus;
};
