// lib/api/permohonan.ts (VERSI DIUPDATE)
import axios from '@/lib/axios';
import { Permohonan, ApiResponse, PaginatedResponse } from '@/types/permohonan';

class PermohonanService {
  // ==================== SERVER COMPONENTS ====================
  
  /**
   * Untuk Server Components - GET request dengan Bearer token
   * @param accessToken Token dari session/cookie
   */
  async getAllServer(accessToken?: string): Promise<Permohonan[]> {
    try {
      const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };

      // Tambahkan Bearer token jika ada
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/permohonan/show?per_page=20`,
        {
          method: 'GET',
          headers,
          cache: 'no-store',
        }
      );
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 419) {
          console.warn('Unauthorized - token mungkin expired');
          return [];
        }
        console.error(`HTTP error! status: ${response.status}`);
        return [];
      }
      
      const data = await response.json();
      return this.normalizeResponse(data);
    } catch (error) {
      console.error('Error fetching permohonan in server:', error);
      return [];
    }
  }

  /**
   * Untuk Server Actions dengan Bearer token
   */
  async createServer(
    data: Partial<Permohonan>, 
    accessToken?: string
  ): Promise<Permohonan> {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/permohonan`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      if (response.status === 419 || response.status === 401) {
        throw new Error('Token expired or invalid');
      }
      throw new Error(`Failed to create: ${response.statusText}`);
    }

    const result = await response.json();
    return this.extractData(result);
  }

  // ==================== CLIENT COMPONENTS ====================
  // SEMUA method client-side sudah OK karena pakai axios yang sudah di-configure
  
  async getAllClient(): Promise<Permohonan[]> {
    try {
      const response = await axios.get<ApiResponse<PaginatedResponse<Permohonan>>>(
        '/api/permohonan/show'
      );
      return this.normalizeResponse(response.data);
    } catch (error: any) {
      console.error('Error fetching permohonan in client:', error);
      
      if (error.response?.status === 401 || error.response?.status === 419) {
        console.warn('Token expired, will be handled by auth system');
        // Tidak perlu reload page - auth system akan handle refresh
        return [];
      }
      
      throw error;
    }
  }

  // Export ke Excel
  async exportExcel(): Promise<Blob> {
    try {
      const response = await axios.post(
        '/api/permohonan/export',
        {},
        { responseType: 'blob' }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 419) {
        throw new Error('Token expired');
      }
      throw error;
    }
  }

  // GET by ID
  async getById(id: number): Promise<Permohonan> {
    const response = await axios.get<ApiResponse<Permohonan>>(
      `/api/permohonan/${id}`
    );
    return this.extractData(response.data);
  }

  // CREATE
  async create(data: Partial<Permohonan>): Promise<Permohonan> {
    const response = await axios.post<ApiResponse<Permohonan>>(
      '/api/permohonan',
      data
    );
    return this.extractData(response.data);
  }

  // UPDATE
  async update(id: number, data: Partial<Permohonan>): Promise<Permohonan> {
    const response = await axios.put<ApiResponse<Permohonan>>(
      `/api/permohonan/${id}`,
      data
    );
    return this.extractData(response.data);
  }

  // DELETE
  async delete(id: number): Promise<void> {
    await axios.delete(`/api/permohonan/${id}`);
  }

  // ==================== DATA PROCESSING ====================
  
  private normalizeResponse(data: any): Permohonan[] {
    if (data?.success && data?.data?.data && Array.isArray(data.data.data)) {
      return data.data.data;
    }
    if (Array.isArray(data)) {
      return data;
    }
    if (data?.data && Array.isArray(data.data)) {
      return data.data;
    }
    if (data?.permohonan && Array.isArray(data.permohonan)) {
      return data.permohonan;
    }
    console.warn('Unknown data format:', data);
    return [];
  }

  private extractData(data: any): any {
    if (data?.success && data?.data) {
      return data.data;
    }
    if (data?.data) {
      return data.data;
    }
    return data;
  }

  // HAPUS metode setupCsrfToken() karena tidak diperlukan lagi
}

export const permohonanService = new PermohonanService();