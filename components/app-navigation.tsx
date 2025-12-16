// components/app-navigation.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

interface NavigationProps {
  user?: {
    name: string;
    email: string;
    role?: string;
  };
  onLogout?: () => void;
}

export function Navigation({ user, onLogout }: NavigationProps) {
  return (
    <nav className="border-b border-gray-200  px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Logo/Brand */}
          <Link href="/dashboard" className="font-bold text-lg">
            SILEGA
          </Link>

          {/* Navigation Menu - HARUS ada wrapper NavigationMenu */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-white">Legalisir</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white">
                  <ul className="grid gap-3 p-4 w-[200px] ">
                    <li>
                      <Link href="/legalisasi/baru">Ajukan Legalisir</Link>
                    </li>
                    <li>
                      <Link href="/legalisasi/riwayat">Riwayat</Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              {/* Tambahkan item lainnya di sini */}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* User Info & Logout */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="text-sm">
              <p className="font-medium">{user.name}</p>
              <p className="text-gray-500">{user.email}</p>
            </div>
          )}
          {onLogout && (
            <Button variant="outline" size="sm" onClick={onLogout}>
              Logout
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
