// lib/axios.ts - FIXED VERSION
import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000",
  withCredentials: false,
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Helper untuk get tokens
const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  const fullToken = localStorage.getItem("access_token");

  if (!fullToken) return null;

  // Jika token mengandung "|", ambil bagian setelah "|"
  if (fullToken.includes("|")) {
    return fullToken.split("|")[1]; // Ambil bagian token saja
  }

  return fullToken;
};

const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;
  const fullToken = localStorage.getItem("refresh_token");

  if (!fullToken) return null;

  // Jika token mengandung "|", ambil bagian setelah "|"
  if (fullToken.includes("|")) {
    return fullToken.split("|")[1]; // Ambil bagian token saja
  }

  return fullToken; // Jika tidak ada "|", return as-is
};

// Simpan status refresh sedang berjalan
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token && !config.headers["Authorization"]) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - DENGAN REFRESH TOKEN LOGIC
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Jika error 401/419 dan belum di-retry
    if (
      (error.response?.status === 401 || error.response?.status === 419) &&
      originalRequest &&
      !originalRequest._retry
    ) {
      // Jika sedang refresh, tambahkan ke queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return instance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Refresh token
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Gunakan fetch API untuk menghindari interceptor loop sama sekali
        const refreshResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/refresh`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
          }
        );

        if (!refreshResponse.ok) {
          throw new Error(`Refresh failed: ${refreshResponse.status}`);
        }

        const data = await refreshResponse.json();
        const { access_token, refresh_token, user } = data;

        // Update localStorage
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        if (user) {
          localStorage.setItem("user_data", JSON.stringify(user));
        }

        // Update header untuk request berikutnya
        instance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${access_token}`;

        // Proses queue yang pending
        processQueue(null, access_token);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return instance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);

        // Clear semua token
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user_data");

        // Proses queue dengan error
        processQueue(refreshError, null);

        // Redirect ke login
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
