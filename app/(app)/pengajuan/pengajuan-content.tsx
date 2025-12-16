// app/dashboard/dashboard-content.tsx
"use client";

import { useEffect } from "react";
import { usePageData } from "@/app/(app)/layout";
import { Button } from "@/components/ui/button";
import { Plus, Download, RefreshCw } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Permohonan } from "./types";
import { useRouter } from "next/navigation";

interface DashboardContentProps {
  initialData: Permohonan[];
}

export default function DashboardContent({ initialData }: DashboardContentProps) {
  const { setPageData } = usePageData();
  const router = useRouter();

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
            onClick={() => router.refresh()}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Permohonan Baru
          </Button>
        </>
      ),
    });

    return () => {
      setPageData(null);
    };
  }, [setPageData, router]);

  // Hitung statistik dari data
  const stats = {
    pending: initialData.filter(d => d.status === 1).length,
    processing: initialData.filter(d => d.status === 2).length,
    success: initialData.filter(d => d.status === 3).length,
    failed: initialData.filter(d => d.status === 4).length,
    total: initialData.length,
  };

  // Format angka dengan titik
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  return (
    <div className="p-6 space-y-6">
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
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold">Daftar Permohonan Terbaru</h3>
              <p className="text-gray-600 mt-1">Berikut adalah daftar permohonan legalisir ijazah.</p>
            </div>
            <div className="text-sm text-gray-500">
              Menampilkan <span className="font-semibold">{initialData.length}</span> data
            </div>
          </div>
        </div>
        <div className="p-1">
          <DataTable columns={columns} data={initialData} />
        </div>
      </div>
    </div>
  );
}