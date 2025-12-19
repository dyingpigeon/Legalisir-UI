// // lib/axios.js
// import axios from 'axios';

// // Helper untuk ambil cookie
// const getCookie = (name) => {
//   if (typeof document === 'undefined') return null;
//   const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
//   return match ? decodeURIComponent(match[2]) : null;
// };

// // Buat instance axios dengan konfigurasi default
// const instance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000',
//   withCredentials: true, // Penting untuk mengirim cookies
//   headers: {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json',
//     'X-Requested-With': 'XMLHttpRequest',
//   },
// });

// // Interceptor untuk request: tambahkan X-XSRF-TOKEN
// instance.interceptors.request.use(
//   (config) => {
//     // Untuk semua metode kecuali GET dan HEAD, tambahkan X-XSRF-TOKEN
//     const method = config.method?.toLowerCase();
//     if (method && !['get', 'head'].includes(method)) {
//       const xsrfToken = getCookie('XSRF-TOKEN');
//       if (xsrfToken) {
//         config.headers['X-XSRF-TOKEN'] = xsrfToken;
//       }
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Interceptor untuk response: handle errors
// instance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Handle 419 CSRF token mismatch
//     if (error.response?.status === 419) {
//       console.log('CSRF token mismatch, refreshing...');
//       // Redirect ke login atau refresh token
//       if (typeof window !== 'undefined') {
//         window.location.href = '/login?expired=true';
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// // Fungsi untuk setup CSRF token (digunakan di awal app)
// export const setupCsrfToken = async () => {
//   try {
//     // Dapatkan CSRF cookie dari Laravel
//     await axios.get(
//       `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/sanctum/csrf-cookie`,
//       { withCredentials: true }
//     );
//     console.log('CSRF token setup successful');
//   } catch (error) {
//     console.error('Failed to setup CSRF token:', error);
//   }
// };

// // Fungsi untuk cek apakah sudah ada CSRF token
// export const hasCsrfToken = () => {
//   return !!getCookie('XSRF-TOKEN');
// };

// export default instance;

// lib/axios.ts
import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000",
  withCredentials: true,
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// CSRF token helper
const getCsrfToken = (): string | null => {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    const method = config.method?.toLowerCase();

    // Tambahkan X-XSRF-TOKEN untuk non-GET requests
    if (method && !["get", "head", "options"].includes(method)) {
      const token = getCsrfToken();
      if (token) {
        config.headers["X-XSRF-TOKEN"] = token;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 419) {
      // CSRF token mismatch
      console.warn("CSRF token expired, refreshing...");
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

// Setup CSRF token function
export const setupCsrfToken = async () => {
  try {
    await axios.get(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
      }/sanctum/csrf-cookie`,
      { withCredentials: true }
    );
    return true;
  } catch (error) {
    console.error("Failed to setup CSRF token:", error);
    return false;
  }
};

export default instance;
