// app/(app)/pengajuan/pengajuan-content.tsx
"use client";

import { useState, useEffect } from "react";
import { usePageData } from "@/app/(app)/layout";
import { Button } from "@/components/ui/button";
import { Plus, Download, RefreshCw } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Permohonan } from "./types";
import { useRouter } from "next/navigation";
import { laravelFetch } from "@/lib/laravel-fetch";

interface PengajuanContentProps {
  initialData: Permohonan[];
}

export default function PengajuanContent({ initialData }: PengajuanContentProps) {
  const { setPageData } = usePageData();
  const router = useRouter();
  const [data, setData] = useState<Permohonan[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);

  console.log("PengajuanContent received data:", initialData); // Debugging

  const refreshData = async () => {
    setLoading(true);
    setRefreshError(null);
    try {
      const response = await laravelFetch("/api/permohonan/show");
      
      if (!response.ok) {
        throw new Error(`Failed to refresh: ${response.status}`);
      }

      const result = await response.json();
      
      console.log("Refresh response:", result); // Debugging
      
      // Handle different response structures - SESUAIKAN DENGAN RESPONSE BARU
      let newData: Permohonan[] = [];
      
      if (result.success && result.data && Array.isArray(result.data.data)) {
        newData = result.data.data;
        console.log("Refresh: Data from result.data.data", newData.length);
      } else if (Array.isArray(result)) {
        newData = result;
        console.log("Refresh: Data from array", newData.length);
      } else if (result.data && Array.isArray(result.data)) {
        newData = result.data;
        console.log("Refresh: Data from result.data", newData.length);
      } else if (result.permohonan && Array.isArray(result.permohonan)) {
        newData = result.permohonan;
        console.log("Refresh: Data from result.permohonan", newData.length);
      }
      
      setData(newData);
      
    } catch (error) {
      console.error("Error refreshing data:", error);
      setRefreshError(error instanceof Error ? error.message : "Refresh failed");
      
      // Show error toast
      if (typeof window !== 'undefined') {
        alert("Gagal merefresh data: " + (error instanceof Error ? error.message : "Unknown error"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await laravelFetch("/api/permohonan/export", {
        method: 'POST',
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'permohonan-export.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Export error:", error);
      alert("Gagal mengekspor data");
    }
  };

  const handleNewPermohonan = () => {
    router.push("/pengajuan/baru");
  };

  useEffect(() => {
    // Set data untuk Header
    setPageData({
      title: "Dashboard Permohonan Legalisir",
      subtitle: "Selamat datang kembali, berikut adalah statistik dan daftar permohonan yang perlu perhatian Anda.",
      actions: (
        <>
          <Button 
            variant="outline" 
            size="sm"
            onClick={refreshData}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Memuat..." : "Refresh"}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button 
            size="sm"
            onClick={handleNewPermohonan}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Permohonan Baru
          </Button>
        </>
      ),
    });

    return () => {
      setPageData(null);
    };
  }, [setPageData, loading]);

  // Hitung statistik dari data
  const stats = {
    pending: data.filter(d => d.status === 1).length,
    processing: data.filter(d => d.status === 2).length,
    success: data.filter(d => d.status === 3).length,
    failed: data.filter(d => d.status === 4).length,
    total: data.length,
  };

  // Format angka dengan titik
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Debug Info - bisa dihapus setelah fix */}
      <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded text-sm">
        <strong>Debug:</strong> Data diterima: {data.length} items | 
        Status: {stats.pending} pending, {stats.processing} processing
      </div>

      {/* Error Message */}
      {refreshError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>Gagal refresh: {refreshError}</span>
          </div>
        </div>
      )}

      {/* Statistik Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-700">Total Permohonan</h3>
          <p className="text-3xl font-bold mt-2 text-gray-800">{formatNumber(stats.total)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-700">Menunggu</h3>
          <p className="text-3xl font-bold mt-2 text-yellow-600">{formatNumber(stats.pending)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-700">Diproses</h3>
          <p className="text-3xl font-bold mt-2 text-blue-600">{formatNumber(stats.processing)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-700">Selesai</h3>
          <p className="text-3xl font-bold mt-2 text-green-600">{formatNumber(stats.success)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-700">Ditolak</h3>
          <p className="text-3xl font-bold mt-2 text-red-600">{formatNumber(stats.failed)}</p>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow border">
        <div className="p-6 border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-xl font-semibold">Daftar Permohonan Terbaru</h3>
              <p className="text-gray-600 mt-1">Berikut adalah daftar permohonan legalisir ijazah.</p>
            </div>
            <div className="text-sm text-gray-500">
              Menampilkan <span className="font-semibold">{data.length}</span> data
              {loading && " • Refreshing..."}
            </div>
          </div>
        </div>
        <div className="p-1 overflow-x-auto">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </div>
  );
}