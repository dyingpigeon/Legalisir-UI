// lib/api/permohonan.ts
import axios from '@/lib/axios';
import { Permohonan, ApiResponse, PaginatedResponse } from '@/types/permohonan';

class PermohonanService {
  // ==================== SERVER COMPONENTS ====================
  
  /**
   * Untuk Server Components - GET request dengan forwarding headers
   * @param userHeaders Headers dari request user (dari next/headers)
   */
  async getAllServer(userHeaders?: Headers): Promise<Permohonan[]> {
    try {
      // Prepare headers untuk request ke backend
      const headers = this.prepareServerHeaders(userHeaders);
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/permohonan/show`,
        {
          method: 'GET',
          headers,
          cache: 'no-store',
          // credentials: 'include' tidak perlu karena cookies sudah di-forward
        }
      );
      
      if (!response.ok) {
        if (response.status === 401) {
          console.warn('Unauthorized - user mungkin belum login');
          return [];
        }
        if (response.status === 419) {
          console.warn('CSRF token mismatch/expired');
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
   * Untuk Server Actions - POST/PUT/DELETE dari server
   */
  async createServer(
    data: Partial<Permohonan>, 
    userHeaders?: Headers
  ): Promise<Permohonan> {
    const headers = this.prepareServerHeaders(userHeaders, true);
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/permohonan`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      if (response.status === 419) {
        throw new Error('CSRF token expired or invalid');
      }
      if (response.status === 401) {
        throw new Error('Unauthorized - please login');
      }
      throw new Error(`Failed to create: ${response.statusText}`);
    }

    const result = await response.json();
    return this.extractData(result);
  }

  // ==================== HELPER METHODS ====================
  
  /**
   * Prepare headers untuk server-side request ke backend
   * @param userHeaders Headers dari request user
   * @param requireCsrf Apakah memerlukan CSRF token (untuk non-GET requests)
   */
  private prepareServerHeaders(
    userHeaders?: Headers, 
    requireCsrf: boolean = false
  ): Record<string, string> {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      // User agent yang lebih browser-like
      'User-Agent': 'Mozilla/5.0 (compatible; Next.js-Server-Fetch/1.0)',
    };

    if (userHeaders) {
      // Forward cookies dari user request
      const cookies = userHeaders.get('cookie');
      if (cookies) {
        headers['Cookie'] = cookies;
        
        // Ekstrak CSRF token dari cookies jika diperlukan
        if (requireCsrf) {
          const csrfToken = this.extractCsrfToken(cookies);
          if (!csrfToken) {
            throw new Error('CSRF token not found in cookies');
          }
          headers['X-XSRF-TOKEN'] = csrfToken;
        }
      }

      // Forward origin header
      const origin = userHeaders.get('origin');
      if (origin) {
        headers['Origin'] = origin;
      } else {
        // Fallback ke NEXT_PUBLIC_BACKEND_URL jika origin tidak ada
        headers['Origin'] = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';
      }

      // Forward referer header
      const referer = userHeaders.get('referer');
      if (referer) {
        headers['Referer'] = referer;
      }

      // Forward accept-language
      const acceptLanguage = userHeaders.get('accept-language');
      if (acceptLanguage) {
        headers['Accept-Language'] = acceptLanguage;
      }

      // Forward x-forwarded-for jika ada
      const xForwardedFor = userHeaders.get('x-forwarded-for');
      if (xForwardedFor) {
        headers['X-Forwarded-For'] = xForwardedFor;
      }
    }

    return headers;
  }

  /**
   * Ekstrak CSRF token dari cookies string
   */
  private extractCsrfToken(cookiesString: string): string | null {
    if (!cookiesString) return null;
    
    // Mencari XSRF-TOKEN di cookies
    const match = cookiesString.match(/XSRF-TOKEN=([^;]+)/);
    if (!match) return null;
    
    try {
      return decodeURIComponent(match[1]);
    } catch {
      return match[1]; // Return as-is jika decode gagal
    }
  }

  // ==================== CLIENT COMPONENTS ====================
  // (Method untuk client components tetap sama seperti sebelumnya)
  
  async getAllClient(): Promise<Permohonan[]> {
    try {
      const response = await axios.get<ApiResponse<PaginatedResponse<Permohonan>>>(
        '/api/permohonan/show'
      );
      return this.normalizeResponse(response.data);
    } catch (error: any) {
      console.error('Error fetching permohonan in client:', error);
      
      if (error.response?.status === 401) {
        console.warn('Unauthorized access in client');
        return [];
      }
      if (error.response?.status === 419) {
        console.warn('CSRF token expired, page will reload');
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
        return [];
      }
      
      throw error;
    }
  }

  // Export ke Excel (client only)
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
        throw new Error('CSRF token expired. Please refresh the page.');
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

  /**
   * Helper untuk setup CSRF token (client-side)
   */
  static async setupCsrfToken(): Promise<boolean> {
    try {
      await axios.get('/sanctum/csrf-cookie', {
        withCredentials: true,
      });
      console.log('CSRF token setup successful');
      return true;
    } catch (error) {
      console.error('Failed to setup CSRF token:', error);
      return false;
    }
  }
}

export const permohonanService = new PermohonanService();