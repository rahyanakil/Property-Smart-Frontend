// Safe localStorage wrapper — no-ops on SSR
const isBrowser = typeof window !== 'undefined';

const ACCESS_KEY = 'ps_access_token';
const REFRESH_KEY = 'ps_refresh_token';

export const TokenStore = {
  getAccess: (): string | null => (isBrowser ? localStorage.getItem(ACCESS_KEY) : null),
  setAccess: (token: string) => isBrowser && localStorage.setItem(ACCESS_KEY, token),
  clearAccess: () => isBrowser && localStorage.removeItem(ACCESS_KEY),

  getRefresh: (): string | null => (isBrowser ? localStorage.getItem(REFRESH_KEY) : null),
  setRefresh: (token: string) => isBrowser && localStorage.setItem(REFRESH_KEY, token),
  clearRefresh: () => isBrowser && localStorage.removeItem(REFRESH_KEY),

  clear: () => {
    if (!isBrowser) return;
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};
