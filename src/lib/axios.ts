import axios from 'axios';
import { TokenStore } from './token';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  withCredentials: true,               // keep for cookie fallback on localhost
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor ─────────────────────────────────────────────────────
// Attach stored access token as Authorization header on every outbound request.
// The backend reads cookies first, then falls back to this header — so both
// localhost (cookie via proxy) and Vercel (header, no cross-origin cookie) work.
api.interceptors.request.use((config) => {
  const token = TokenStore.getAccess();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor ────────────────────────────────────────────────────
// On 401: attempt a silent token refresh, then replay the original request.
// If the refresh also fails, clear stored tokens and redirect to /login (only
// when the user is inside a protected /dashboard route).
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.url?.includes('/auth/refresh')
    ) {
      original._retry = true;

      try {
        const refreshToken = TokenStore.getRefresh();

        // Send the stored refresh token in the body so it works cross-origin
        // (cookies may be blocked). Backend reads req.body.refreshToken as fallback.
        const { data } = await api.post('/api/v1/auth/refresh', refreshToken ? { refreshToken } : {});

        // Persist the new access token (and refresh token if returned)
        if (data?.data?.accessToken) TokenStore.setAccess(data.data.accessToken);
        if (data?.data?.refreshToken) TokenStore.setRefresh(data.data.refreshToken);

        // Replay the original request — interceptor will attach the new token
        return api(original);
      } catch {
        TokenStore.clear();
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/dashboard')) {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
