// hooks/usePermohonan.ts
"use client";

import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import axios from "@/lib/axios";
import { Permohonan } from "@/types/permohonan";
import { useRouter } from "next/navigation";

// Fetcher dengan error handling
const fetcher = async (url: string) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error: any) {
    console.error("Fetcher error:", error);

    // Handle token expired errors
    if (error.response?.status === 401 || error.response?.status === 419) {
      console.warn("Token expired - auth system will handle refresh");
      // Return empty untuk prevent UI crash
      return { data: [] };
    }

    throw error;
  }
};

export const usePermohonan = (initialData?: Permohonan[]) => {
  const router = useRouter();

  const {
    data: rawData,
    error,
    isLoading,
    mutate,
    isValidating,
  // } = useSWR("/api/permohonan/show", fetcher, {
  } = useSWR("/api/permohonan/show?per_page=20", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    revalidateOnMount: initialData ? false : true,
    dedupingInterval: 2000,
    fallbackData: initialData ? { data: initialData } : undefined,
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      // Jangan retry untuk 401 error
      if (error.response?.status === 401 || error.response?.status === 419)
        return;

      // Retry maksimal 3 kali untuk error lainnya
      if (retryCount >= 3) return;

      // Retry setelah 5 detik
      setTimeout(() => revalidate({ retryCount }), 5000);
    },
  });

  // Normalize data dengan fallback ke initialData
  const normalizeData = (data: any): Permohonan[] => {
    // Jika data dari fetcher adalah { data: [] } karena 401 error
    if (data?.data && Array.isArray(data.data) && data.data.length === 0) {
      return data.data; // Return empty array
    }

    // Normalize seperti biasa
    if (data?.success && data?.data?.data) return data.data.data;
    if (Array.isArray(data)) return data;
    if (data?.data && Array.isArray(data.data)) return data.data;
    if (data?.permohonan && Array.isArray(data.permohonan))
      return data.permohonan;

    // Fallback ke initialData jika ada
    if (initialData && Array.isArray(initialData)) {
      return initialData;
    }

    return [];
  };

  const data = rawData ? normalizeData(rawData) : initialData || [];

  return {
    data,
    error,
    isLoading,
    isValidating,
    refresh: mutate,
    isEmpty: data.length === 0,
  };
};

// Hook untuk export
export const useExportPermohonan = () => {
  const router = useRouter();

  const triggerExport = async (url: string) => {
    try {
      const response = await axios.post(url, {}, { responseType: "blob" });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Redirect ke login jika unauthorized
        router.push("/login");
        throw new Error("Unauthorized - please login");
      }
      throw error;
    }
  };

  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    "/api/permohonan/export",
    triggerExport
  );

  const handleExport = async () => {
    try {
      const blob = await trigger();

      // Download file
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `permohonan-${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return { success: true };
    } catch (error: any) {
      console.error("Export error:", error);

      // Show user-friendly error message
      let errorMessage = "Gagal mengekspor data";
      if (error.message.includes("Unauthorized")) {
        errorMessage = "Sesi telah berakhir, silakan login kembali";
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  return {
    exportData: handleExport,
    isExporting: isMutating,
    error,
    reset,
  };
};

// Hook untuk create/update/delete
export const usePermohonanMutation = () => {
  const { mutate } = useSWR("/api/permohonan/show");
  const router = useRouter();

  const handleApiError = (error: any) => {
    if (error.response?.status === 401) {
      router.push("/login");
      throw new Error("Session expired. Please login again.");
    }
    throw error;
  };

  const create = async (data: Partial<Permohonan>) => {
    try {
      const response = await axios.post("/api/permohonan", data);

      // Refresh data setelah create
      mutate();

      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  };

  const update = async (id: number, data: Partial<Permohonan>) => {
    try {
      const response = await axios.put(`/api/permohonan/${id}`, data);

      // Refresh data setelah update
      mutate();

      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  };

  const remove = async (id: number) => {
    try {
      await axios.delete(`/api/permohonan/${id}`);

      // Refresh data setelah delete
      mutate();
    } catch (error) {
      return handleApiError(error);
    }
  };

  return {
    create,
    update,
    remove,
  };
};
