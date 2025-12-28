// lib/api/permohonan.ts - SIMPLIFIED VERSION
import axios from "@/lib/axios";
import { Permohonan } from "@/types/permohonan";

class PermohonanService {
  /**
   * Untuk Server Components - GET request dengan Bearer token
   */
  async getAllServer(accessToken?: string): Promise<Permohonan[]> {
    try {
      const headers: Record<string, string> = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };

      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/permohonan/show?per_page=20`,
        {
          method: "GET",
          headers,
          cache: "no-store",
        }
      );

      if (!response.ok) {
        if (response.status === 401 || response.status === 419) {
          console.warn("Server fetch: Token expired/invalid");
          return [];
        }
        console.error(`HTTP error! status: ${response.status}`);
        return [];
      }

      const data = await response.json();
      return this.normalizeResponse(data);
    } catch (error) {
      console.error("Error fetching permohonan in server:", error);
      return [];
    }
  }

  // HAPUS metode getAllClient() karena tidak digunakan
  // HAPUS metode lainnya yang tidak digunakan di kode Anda

  // ==================== DATA PROCESSING ====================
  private normalizeResponse(data: any): Permohonan[] {
    if (data?.success && data?.data?.data && Array.isArray(data.data.data)) {
      return data.data.data;
    }
    if (data?.data && Array.isArray(data.data)) {
      return data.data;
    }
    if (Array.isArray(data)) {
      return data;
    }
    console.warn("Unknown data format:", data);
    return [];
  }

  private extractData(data: any): any {
    if (data?.success && data?.data) {
      return data.data;
    }
    return data;
  }
}

export const permohonanService = new PermohonanService();