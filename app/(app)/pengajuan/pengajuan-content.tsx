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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface PengajuanContentProps {
  initialData: Permohonan[];
}

// Komponen PDF Viewer terpisah (opsional)
function PDFViewer({ pdfUrl }: { pdfUrl: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Viewer</CardTitle>
      </CardHeader>
      <CardContent>
        <embed
          src={pdfUrl}
          type="application/pdf"
          width="100%"
          height="600px"
          className="rounded-lg shadow-lg"
        />
        <p className="mt-4 text-sm text-gray-500">
          Jika dokumen tidak muncul, Anda dapat
          <a
            href={pdfUrl}
            download
            className="text-blue-600 hover:underline ml-1"
          >
            download PDF
          </a>
          .
        </p>
      </CardContent>
    </Card>
  );
}

export default function PengajuanContent({
  initialData,
}: PengajuanContentProps) {
  const { setPageData } = usePageData();
  const router = useRouter();

  const { data, error, isLoading, isValidating, refresh, isEmpty } =
    usePermohonan(initialData);

  const { exportData, isExporting, error: exportError } = useExportPermohonan();

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

  const stats = {
    total: data.length,
    dimulai: data.filter((d) => d.status === 1).length,
    verifikasi: data.filter((d) => d.status === 2).length,
    tandatangan: data.filter((d) => d.status === 3).length,
    tolak: data.filter((d) => d.status === 6).length,
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("id-ID").format(num);
  };

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
      {/* Contoh penggunaan Drawer dengan PDF Viewer */}
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline">Lihat PDF Contoh</Button>
        </DrawerTrigger>
        <DrawerContent className="h-[80vh]">
          <DrawerHeader>
            <DrawerTitle>Pratinjau Dokumen</DrawerTitle>
            <DrawerDescription>
              Dokumen PDF akan ditampilkan di bawah
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 flex-1 overflow-auto">
            {/* Ganti dengan URL PDF yang sesungguhnya */}
            <PDFViewer pdfUrl="/contoh-dokumen.pdf" />
          </div>
          <DrawerFooter>
            <Button>Download</Button> 
            <DrawerClose>
              <Button>Tutup</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      {/* Data Table */}
      <div className="bg-white rounded-lg shadow border">
        <div className="p-4 border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-xl font-semibold">Daftar Permohonan</h3>
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
              <Tabs defaultValue="Semua">
                <TabsList>
                  <TabsTrigger value="Semua">Semua</TabsTrigger>
                  <TabsTrigger value="Menunggu">Menunggu</TabsTrigger>
                  <TabsTrigger value="Diverifikasi">Diverifikasi</TabsTrigger>
                </TabsList>
                <ScrollArea className="h-[400px] rounded-md border mt-4">
                  <TabsContent value="Semua" className="p-4">
                    <DataTable columns={columns} data={data} />
                  </TabsContent>
                  <TabsContent value="Menunggu" className="p-4">
                    <DataTable 
                      columns={columns} 
                      data={data.filter(d => d.status === 1)} 
                    />
                  </TabsContent>
                  <TabsContent value="Diverifikasi" className="p-4">
                    <DataTable 
                      columns={columns} 
                      data={data.filter(d => d.status === 2)} 
                    />
                  </TabsContent>
                </ScrollArea>
              </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}