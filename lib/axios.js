// lib/axios.js
import axios from 'axios';

// Helper untuk ambil cookie
const getCookie = (name) => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
};

// Buat instance axios dengan konfigurasi default
const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000',
  withCredentials: true, // Penting untuk mengirim cookies
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Interceptor untuk request: tambahkan X-XSRF-TOKEN
instance.interceptors.request.use(
  (config) => {
    // Untuk semua metode kecuali GET dan HEAD, tambahkan X-XSRF-TOKEN
    const method = config.method?.toLowerCase();
    if (method && !['get', 'head'].includes(method)) {
      const xsrfToken = getCookie('XSRF-TOKEN');
      if (xsrfToken) {
        config.headers['X-XSRF-TOKEN'] = xsrfToken;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk response: handle errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 419 CSRF token mismatch
    if (error.response?.status === 419) {
      console.log('CSRF token mismatch, refreshing...');
      // Redirect ke login atau refresh token
      if (typeof window !== 'undefined') {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

// Fungsi untuk setup CSRF token (digunakan di awal app)
export const setupCsrfToken = async () => {
  try {
    // Dapatkan CSRF cookie dari Laravel
    await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/sanctum/csrf-cookie`,
      { withCredentials: true }
    );
    console.log('CSRF token setup successful');
  } catch (error) {
    console.error('Failed to setup CSRF token:', error);
  }
};

// Fungsi untuk cek apakah sudah ada CSRF token
export const hasCsrfToken = () => {
  return !!getCookie('XSRF-TOKEN');
};

export default instance;