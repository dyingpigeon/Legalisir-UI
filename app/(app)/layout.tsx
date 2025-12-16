"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Loading from "@/app/(app)/Loading";
import { useAuth } from "@/hooks/auth";
import Navigation from "@/components/app-navigation";
import Header from "@/app/(app)/Header";
import { createContext, useContext, useState, useEffect } from "react";

// Tipe data untuk PageData
interface PageData {
  title?: string;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: React.ReactNode;
  // tambahkan properti lain sesuai kebutuhan
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
  const { user, logout } = useAuth();
  const [pageData, setPageData] = useState<PageData | null>(null);

  // Function untuk clear page data
  const clearPageData = () => setPageData(null);

  // Clear page data ketika user berubah
  useEffect(() => {
    if (!user) {
      clearPageData();
    }
  }, [user]);

  if (!user) {
    return <Loading />;
  }

  //  <div className="flex-1 flex flex-col w-full">

  return (
    <PageDataContext.Provider value={{ pageData, setPageData, clearPageData }}>
      {/* SidebarProvider harus wrap SEMUA elemen yang butuh SidebarTrigger dan AppSidebar */}
      <SidebarProvider className="">
        <div className="flex-1 flex flex-col w-full ">
          {/* Navbar */}
          <div className="w-full border-b bg-background sticky top-0 z-50">
            <div className=" bg-gray-300 flex items-center h-16">
              {/* SidebarTrigger sekarang berada di dalam SidebarProvider */}
              <div className="bg-flex  items-center px-4">
                <SidebarTrigger />
              </div>
              <div className="flex-1">
                <Navigation user={user} onLogout={logout} />
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1 flex">
            {/* Sidebar */}
            <AppSidebar />

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
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
