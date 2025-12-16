// components/app-sidebar.tsx
"use client";

import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items dengan URL yang sesuai.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard", // Update URL
    icon: Home,
    matcher: "/dashboard", // Pattern untuk matching
  },
  {
    title: "Pengajuan Legalisir",
    url: "/pengajuan",
    icon: Inbox,
    matcher: "/pengajuan",
  },
  {
    title: "Riwayat Pengajuan",
    url: "/riwayat",
    icon: Calendar,
    matcher: "/riwayat",
  },
];

interface SidebarProps {
  user?: {
    name: string;
    email: string;
    role?: string;
  };
  onLogout?: () => void;
  variant?: "sidebar" | "floating" | "inset";
}

export function AppSidebar({
  user,
  onLogout,
  variant = "sidebar",
}: SidebarProps) {
  const pathname = usePathname();
  
  // Function untuk check apakah item aktif
  const isItemActive = (itemUrl: string, itemMatcher?: string) => {
    if (itemMatcher) {
      // Jika menggunakan matcher, check jika pathname dimulai dengan matcher
      return pathname.startsWith(itemMatcher);
    }
    // Default: exact match
    return pathname === itemUrl;
  };

  return (
    <Sidebar variant={variant}>
      <SidebarHeader className="py-8">
        {/* Header sidebar */}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = isItemActive(item.url, item.matcher);
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive} // Prop untuk highlight aktif
                    >
                      <a href={item.url} className="relative">
                        <item.icon />
                        <span>{item.title}</span>
                        
                        {/* Optional: Active indicator */}
                        {isActive && (
                          <span className="absolute -left-2 top-1/2 h-2/3 w-1 -translate-y-1/2 rounded-full bg-primary" />
                        )}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}