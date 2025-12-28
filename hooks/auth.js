"use client";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";

// Helper function untuk parse token
const parseToken = (token) => {
  if (!token) return null;
  if (token.includes("|")) {
    return token.split("|")[1];
  }
  return token;
};

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cek apakah user sudah login dari localStorage
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");
      const userData = localStorage.getItem("user_data");

      if (token && userData) {
        try {
          // Parse dan set user dari localStorage
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (err) {
          console.error("Error parsing user data:", err);
          localStorage.removeItem("user_data");
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) throw new Error("No refresh token");

      const response = await axios.post("/api/refresh", {
        refresh_token: refreshToken, // Token sudah tanpa id|
      });

      const { access_token, refresh_token, user } = response.data;

      // Simpan token ke localStorage - HILANGKAN ID
      localStorage.setItem("access_token", parseToken(access_token)); // ← Tanpa id|
      localStorage.setItem("refresh_token", parseToken(refresh_token)); // ← Tanpa id|
      localStorage.setItem("user_data", JSON.stringify(user));

      // Update state user
      setUser(user);
      return { 
        access_token: parseToken(access_token), 
        refresh_token: parseToken(refresh_token), 
        user 
      };
    } catch (err) {
      // Jika refresh gagal, logout
      logout();
      throw err;
    }
  };

  const saveAuthData = (data) => {
    const { access_token, refresh_token, user } = data;

    // Simpan ke localStorage - HILANGKAN ID
    localStorage.setItem("access_token", parseToken(access_token)); // ← Tanpa id|
    localStorage.setItem("refresh_token", parseToken(refresh_token)); // ← Tanpa id|
    localStorage.setItem("user_data", JSON.stringify(user));

    // Simpan ke cookies - juga tanpa id
    if (typeof document !== "undefined") {
      const cleanAccessToken = parseToken(access_token);
      const cleanRefreshToken = parseToken(refresh_token);
      
      document.cookie = `access_token=${cleanAccessToken}; path=/; max-age=${
        15 * 60
      }`; // 15 menit
      document.cookie = `refresh_token=${cleanRefreshToken}; path=/; max-age=${
        30 * 24 * 60 * 60
      }`; // 30 hari
    }

    setUser(user);
    setLoading(false);
  };

  const register = async ({ setErrors, ...props }) => {
    setErrors([]);

    try {
      const response = await axios.post("/api/register", props);
      saveAuthData(response.data);
    } catch (error) {
      if (error.response?.status !== 422) throw error;
      setErrors(error.response.data.errors);
    }
  };

  const login = async ({ setErrors, setStatus, ...props }) => {
    setErrors([]);
    setStatus(null);
    setLoading(true);

    try {
      const response = await axios.post("/api/login", props);
      saveAuthData(response.data);
    } catch (error) {
      setLoading(false);
      if (error.response?.status !== 422) throw error;
      setErrors(error.response.data.errors);
    }
  };

  const forgotPassword = async ({ setErrors, setStatus, email }) => {
    setErrors([]);
    setStatus(null);

    try {
      const response = await axios.post("/api/forgot-password", { email });
      setStatus(response.data.status);
    } catch (error) {
      if (error.response?.status !== 422) throw error;
      setErrors(error.response.data.errors);
    }
  };

  const resetPassword = async ({ setErrors, setStatus, ...props }) => {
    setErrors([]);
    setStatus(null);

    try {
      const response = await axios.post("/api/reset-password", {
        token: params.token,
        ...props,
      });
      router.push("/login?reset=" + btoa(response.data.status));
    } catch (error) {
      if (error.response?.status !== 422) throw error;
      setErrors(error.response.data.errors);
    }
  };

  const resendEmailVerification = async ({ setStatus }) => {
    try {
      const response = await axios.post("/api/email/verification-notification");
      setStatus(response.data.status);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (token) {
        await axios.post(
          "/api/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear localStorage
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_data");

      // Clear cookies
      if (typeof document !== "undefined") {
        document.cookie =
          "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie =
          "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }

      setUser(null);
      setError(null);
      setLoading(false);
      window.location.pathname = "/login";
    }
  };

  // Handle middleware dan redirect
  useEffect(() => {
    console.log("Middleware effect - state:", { loading, user, middleware });

    if (loading) {
      console.log("Still loading, skipping middleware check");
      return;
    }

    // ⚠️ CRITICAL FIX: Skip jika middleware undefined!
    if (middleware === undefined) {
      console.log("⚠️ Middleware undefined - skipping all redirect logic");
      return;
    }

    // Hanya jalankan untuk 'auth' atau 'guest'
    const checkAndRedirect = () => {
      console.log("Checking middleware...", { user, middleware });

      if (middleware === "guest" && redirectIfAuthenticated && user) {
        console.log("Redirecting guest to:", redirectIfAuthenticated);
        router.push(redirectIfAuthenticated);
        return;
      }

      if (middleware === "auth") {
        if (!user) {
          console.log("No user found, checking localStorage...");

          const token = localStorage.getItem("access_token");
          const userData = localStorage.getItem("user_data");

          if (token && userData) {
            try {
              console.log("Found user data in localStorage, parsing...");
              const parsedUser = JSON.parse(userData);
              setUser(parsedUser);
              return;
            } catch (err) {
              console.error("Failed to parse user data:", err);
            }
          }

          console.log("Still no user, redirecting to /login");
          router.push("/login");
          return;
        }

        console.log("User authenticated successfully:", user?.email);
      }
    };

    const timer = setTimeout(checkAndRedirect, 50);
    return () => clearTimeout(timer);
  }, [user, loading, middleware, redirectIfAuthenticated, router]);

  return {
    user,
    loading,
    error,
    register,
    login,
    forgotPassword,
    resetPassword,
    resendEmailVerification,
    logout,
    refreshToken,
  };
};