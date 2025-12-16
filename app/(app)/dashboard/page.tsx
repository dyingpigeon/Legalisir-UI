// app/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { usePageData } from "@/app/(app)/layout";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";

export default function DashboardPage() {
  const { setPageData } = usePageData();

  useEffect(() => {
    // Set data untuk Header
    setPageData({
      title: "Dashboard Overview",
      subtitle: "Welcome back, Here's what's happening today.",
      actions: (
        <>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </>
      ),
    });

    // Cleanup ketika komponen unmount
    return () => {
      setPageData(null);
    };
  }, [setPageData]);

  return (
    <div className="p-3">
      {/* Konten dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Permohonan Masuk Hari Ini</h3>
          <p className="text-3xl font-bold mt-2">50</p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Permohonan Diverifikasi</h3>
          <p className="text-3xl font-bold mt-2">12</p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Dokumen Sudah Ditandatangani</h3>
          <p className="text-3xl font-bold mt-2">1,254</p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Total semua permohonan</h3>
          <p className="text-3xl font-bold mt-2">5454</p>
        </div>
        {/* ... konten lainnya */}
      </div>
    </div>
  );
}
