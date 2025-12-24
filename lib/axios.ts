// lib/axios.ts
import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000",
  withCredentials: false, // Nonaktifkan karena menggunakan Bearer token
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Token helper
const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
};

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    // Tambahkan Bearer token jika tersedia
    const token = getAuthToken();
    if (token && !config.headers["Authorization"]) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - hanya handle error umum
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle error umum
    const originalRequest = error.config;
    
    // Jika error 419 (unauthenticated) dan belum di-retry
    if (error.response?.status === 419 && !originalRequest._retry) {
      // Beri sinyal ke useAuth hook untuk handle refresh token
      // Hook akan handle sendiri melalui interceptor-nya
      return Promise.reject(error);
    }
    
    // Handle error lain
    return Promise.reject(error);
  }
);

export default instance;