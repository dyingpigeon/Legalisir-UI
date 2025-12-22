// app/(app)/pengajuan/pengajuan-content.tsx
"use client";

import { useEffect } from "react";
import { usePageData } from "@/app/(app)/layout";
import { Button } from "@/components/ui/button";
import { Plus, Download, RefreshCw, AlertCircle } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { usePermohonan, useExportPermohonan } from "@/hooks/usePermohonan";
import { Permohonan } from "@/types/permohonan";
import { ScrollArea } from "@/components/ui/scroll-area"

interface PengajuanContentProps {
  initialData: Permohonan[];
}

export default function PengajuanContent({
  initialData,
}: PengajuanContentProps) {
  const { setPageData } = usePageData();
  const router = useRouter();

  // Gunakan SWR hook dengan initialData dari server
  const { data, error, isLoading, isValidating, refresh, isEmpty } =
    usePermohonan(initialData);

  const { exportData, isExporting, error: exportError } = useExportPermohonan();

  // Setup page header
  useEffect(() => {
    setPageData({
      title: "Dashboard Permohonan Legalisir",
      subtitle:
        "Selamat datang kembali, berikut adalah statistik dan daftar permohonan yang perlu perhatian Anda.",
      actions: (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refresh()}
            disabled={isValidating}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`w-4 h-4 ${isValidating ? "animate-spin" : ""}`}
            />
            {isValidating ? "Memuat..." : "Refresh"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportData}
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {isExporting ? "Mengekspor..." : "Export"}
          </Button>
          <Button
            size="sm"
            onClick={() => router.push("/pengajuan/baru")}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Permohonan Baru
          </Button>
        </>
      ),
    });

    return () => setPageData(null);
  }, [setPageData, refresh, isValidating, isExporting, router]);

  // Hitung statistik
  const stats = {
    total: data.length,
    dimulai: data.filter((d) => d.status === 1).length,
    verifikasi: data.filter((d) => d.status === 2).length,
    tandatangan: data.filter((d) => d.status === 3).length,
    ready: data.filter((d) => d.status === 4).length,
    ambil: data.filter((d) => d.status === 5).length,
    tolak: data.filter((d) => d.status === 6).length,
    batal: data.filter((d) => d.status === 7).length,
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("id-ID").format(num);
  };

  // Show export error jika ada
  useEffect(() => {
    if (exportError) {
      console.error("Export error:", exportError);
    }
  }, [exportError]);

  // Loading state (hanya jika tidak ada initial data sama sekali)
  if (isLoading && initialData.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  // Error state (hanya jika ada error dan tidak ada data sama sekali)
  if (error && data.length === 0) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>
              Gagal memuat data: {error.message || "Terjadi kesalahan"}
            </span>
          </div>
          <div className="mt-2 flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refresh()}>
              Coba Lagi
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/login")}
            >
              Ke Halaman Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Debug info (bisa dihapus nanti) */}
      <div className="text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <span>Data dari server: {initialData.length} item</span>
          <span>•</span>
          <span>Data terkini: {data.length} item</span>
          <span>•</span>
          <span>Status: {isLoading ? "Loading..." : "Ready"}</span>
          {error && (
            <span className="text-red-500">• Error: {error.message}</span>
          )}
        </div>
      </div>

      {/* Statistik Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-700">
            Total Permohonan
          </h3>
          <p className="text-3xl font-bold mt-2 text-gray-800">
            {formatNumber(stats.total)}
          </p>
          <p className="text-sm text-gray-500 mt-1">Semua status</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">Menunggu</h3>
            <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
              {stats.dimulai}
            </span>
          </div>
          <p className="text-3xl font-bold mt-2 text-yellow-600">
            {formatNumber(stats.dimulai)}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Status: Menunggu Persetujuan
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">
              Diverifikasi
            </h3>
            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
              {stats.verifikasi}
            </span>
          </div>
          <p className="text-3xl font-bold mt-2 text-blue-600">
            {formatNumber(stats.verifikasi)}
          </p>
          <p className="text-sm text-gray-500 mt-1">Status: Diverifikkasi</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">Sudah TTD</h3>
            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
              {stats.tandatangan}
            </span>
          </div>
          <p className="text-3xl font-bold mt-2 text-green-600">
            {formatNumber(stats.tandatangan)}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Status: Sudah DItandatangani
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">Ditolak</h3>
            <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
              {stats.tolak}
            </span>
          </div>
          <p className="text-3xl font-bold mt-2 text-red-600">
            {formatNumber(stats.tolak)}
          </p>
          <p className="text-sm text-gray-500 mt-1">Status: Ditolak</p>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow border">
        <div className="p-6 border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-xl font-semibold">Daftar Permohonan</h3>
              <p className="text-gray-600 mt-1">
                Berikut adalah daftar permohonan legalisir ijazah.
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Menampilkan <span className="font-semibold">{data.length}</span>{" "}
              data
              {isValidating && " • Memperbarui..."}
              {isExporting && " • Mengekspor..."}
            </div>
          </div>
        </div>
        <div className="p-1 overflow-x-auto">
          {isEmpty ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Belum ada data
              </h3>
              <p className="text-gray-500 mb-6">
                Tidak ada permohonan yang ditemukan.
              </p>
              <Button onClick={() => router.push("/pengajuan/baru")}>
                <Plus className="w-4 h-4 mr-2" />
                Buat Permohonan Baru
              </Button>
            </div>
          ) : (
            // <div className="flex-1 flex flex-col w-full">
              <Tabs defaultValue="Semua">
                <TabsList>
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>
                 <ScrollArea className="h-80 rounded-md border">

                <TabsContent value="account">
                  <DataTable columns={columns} data={data} />
                </TabsContent>
                <TabsContent value="password">
                  Change your password here.
                </TabsContent>
                </ScrollArea>
              </Tabs>

            // </div>
          )}
        </div>
      </div>
    </div>
  );
}
