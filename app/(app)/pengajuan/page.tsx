// app/(app)/pengajuan/page.tsx
"use client";

import { useEffect, useState } from "react";
import PengajuanContent from "./pengajuan-content";
import { Permohonan } from "./types";
import axios from "@/lib/axios";
import { setupCsrfToken } from "@/lib/axios";

export default function PengajuanPage() {
  const [data, setData] = useState<Permohonan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        
        // Setup CSRF token jika belum ada
        if (!document.cookie.includes('XSRF-TOKEN')) {
          await setupCsrfToken();
        }

        const response = await axios.get("/api/permohonan/show");
        
        const result = response.data;

        console.log("API Response:", result); // Debugging

        // SESUAIKAN DENGAN STRUKTUR RESPONSE BARU
        if (result.success && result.data && Array.isArray(result.data.data)) {
          // Ambil array data dari result.data.data
          setData(result.data.data);
          console.log("Data set from result.data.data:", result.data.data.length, "items");
        } else if (Array.isArray(result)) {
          setData(result);
          console.log("Data set from array result:", result.length, "items");
        } else if (result.data && Array.isArray(result.data)) {
          setData(result.data);
          console.log("Data set from result.data:", result.data.length, "items");
        } else if (result.permohonan && Array.isArray(result.permohonan)) {
          setData(result.permohonan);
          console.log("Data set from result.permohonan:", result.permohonan.length, "items");
        } else {
          console.warn("Unexpected API response structure:", result);
          setData([]);
        }
      } catch (error: any) {
        console.error("Error fetching permohonan data:", error);
        
        let errorMessage = "Failed to fetch data";
        if (error.response) {
          errorMessage = `HTTP ${error.response.status}: ${error.response.data?.message || error.response.statusText}`;
        } else if (error.request) {
          errorMessage = "No response from server";
        } else {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <div className="text-red-500 mb-4">
          <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.288 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2">Gagal Memuat Data</h2>
        <p className="text-gray-600 mb-4 text-center">{error}</p>
        <div className="flex gap-2">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Coba Lagi
          </button>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Ke Halaman Login
          </button>
        </div>
      </div>
    );
  }

  return <PengajuanContent initialData={data} />;
}