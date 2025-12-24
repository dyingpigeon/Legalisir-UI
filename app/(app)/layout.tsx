"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Loading from "@/app/(app)/Loading";
import { useAuth } from "@/hooks/auth";
import Navigation from "@/components/app-navigation";
import Header from "@/app/(app)/Header";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Tipe data untuk PageData
interface PageData {
  title?: string;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: React.ReactNode;
}

// Buat context untuk data dari children
interface PageDataContextType {
  pageData: PageData | null;
  setPageData: (data: PageData | null) => void;
  clearPageData: () => void;
}

const PageDataContext = createContext<PageDataContextType>({
  pageData: null,
  setPageData: () => {},
  clearPageData: () => {},
});

// Hook untuk mengakses context
export const usePageData = () => useContext(PageDataContext);

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, logout, loading } = useAuth({
    middleware: "auth",
    redirectIfAuthenticated: "/pengajuan",
  });
  const [pageData, setPageData] = useState<PageData | null>(null);

  // Function untuk clear page data
  const clearPageData = () => setPageData(null);

  // Clear page data ketika user berubah
  useEffect(() => {
    if (!user) {
      clearPageData();
    }
  }, [user]);

  // Debug log untuk melihat auth state - FIX untuk JavaScript
  useEffect(() => {
    console.log("Layout - Auth state:", {
      user: user ? "User authenticated" : "No user",
      loading,
      hasToken:
        typeof window !== "undefined"
          ? !!localStorage.getItem("access_token")
          : false,
    });
  }, [user, loading]);

  // Tampilkan loading jika masih checking auth
  if (loading) {
    console.log("Layout: Still loading auth...");
    return <Loading />;
  }

  // Jika tidak ada user setelah loading selesai
  if (!user) {
    console.log("Layout: No user found, auth system should redirect to /login");

    // Tampilkan loading lebih lama sebelum redirect
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Menyiapkan sesi...</p>
          <p className="text-sm text-gray-400 mt-2">
            Jika terlalu lama, silakan{" "}
            <button
              onClick={() => router.push("/login")}
              className="text-blue-500 hover:text-blue-600"
            >
              login kembali
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <PageDataContext.Provider value={{ pageData, setPageData, clearPageData }}>
      {/* SidebarProvider harus wrap SEMUA elemen yang butuh SidebarTrigger dan AppSidebar */}
      <SidebarProvider className="max-h-[90dvh] flex">
        <div className="flex flex-col w-full flex-1 min-h-0 ">
          {/* Navbar */}
          <div className="w-full border-b bg-background sticky top-0 z-50">
            <div className=" bg-gray-300 flex items-center h-16">
              {/* SidebarTrigger sekarang berada di dalam SidebarProvider */}
              <div className="bg-flex items-center px-4">
                <SidebarTrigger />
              </div>
              <div className="flex-1">
                <Navigation user={user} onLogout={logout} />
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1 flex min-h-0">
            {/* Sidebar */}
            <AppSidebar />

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden min-h-0">
              {/* Header */}
              {pageData?.title && (
                <div className="border-b bg-white">
                  <Header
                    title={pageData.title}
                    subtitle={pageData.subtitle}
                    actions={pageData.actions}
                  />
                </div>
              )}

              {/* Scrollable content */}
              <div className="flex-1 overflow-auto">
                <main className="p-6">{children}</main>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </PageDataContext.Provider>
  );
}
