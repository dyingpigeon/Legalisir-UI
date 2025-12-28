// hooks/usePermohonan.ts - FINAL CLEAN VERSION
"use client";

import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import axios from "@/lib/axios";
import { Permohonan } from "@/types/permohonan";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Fetcher sederhana - biarkan interceptor handle errors
const fetcher = async (url: string) => {
  const response = await axios.get(url);
  return response.data;
};

export const usePermohonan = (initialData?: Permohonan[]) => {
  const router = useRouter();

  const {
    data: rawData,
    error,
    isLoading,
    mutate,
    isValidating,
  } = useSWR("/api/permohonan/show?per_page=20", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    revalidateOnMount: initialData ? false : true,
    dedupingInterval: 2000,
    fallbackData: initialData ? { data: initialData } : undefined,
    shouldRetryOnError: false, // Biarkan interceptor handle refresh
  });

  // Normalize data dengan fallback ke initialData
  const normalizeData = (data: any): Permohonan[] => {
    if (!data) return [];
    
    // Format 1: { success: true, data: { data: [] } }
    if (data?.success && data?.data?.data && Array.isArray(data.data.data)) {
      return data.data.data;
    }
    
    // Format 2: { data: [] }
    if (data?.data && Array.isArray(data.data)) {
      return data.data;
    }
    
    // Format 3: Array langsung
    if (Array.isArray(data)) {
      return data;
    }
    
    // Format 4: { permohonan: [] }
    if (data?.permohonan && Array.isArray(data.permohonan)) {
      return data.permohonan;
    }

    // Fallback ke initialData jika ada
    if (initialData && Array.isArray(initialData)) {
      return initialData;
    }

    console.warn("Unknown data format:", data);
    return [];
  };

  const data = rawData ? normalizeData(rawData) : initialData || [];

  // Jika error dan data kosong, bisa redirect atau show error
  useEffect(() => {
    if (error && data.length === 0) {
      console.error("Error fetching permohonan:", error);
      
      // Jika error 401/419, refresh token sudah dihandle interceptor
      if (error.response?.status === 401 || error.response?.status === 419) {
        console.log("Auth error - refresh token should be triggered");
      }
    }
  }, [error, data]);

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
    const response = await axios.post(url, {}, { responseType: "blob" });
    return response.data;
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
      if (error.response?.status === 401 || error.response?.status === 419) {
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

  const create = async (data: Partial<Permohonan>) => {
    const response = await axios.post("/api/permohonan", data);
    mutate(); // Refresh data setelah create
    return response.data;
  };

  const update = async (id: number, data: Partial<Permohonan>) => {
    const response = await axios.put(`/api/permohonan/${id}`, data);
    mutate(); // Refresh data setelah update
    return response.data;
  };

  const remove = async (id: number) => {
    await axios.delete(`/api/permohonan/${id}`);
    mutate(); // Refresh data setelah delete
  };

  return {
    create,
    update,
    remove,
  };
};