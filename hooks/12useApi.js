// hooks/useApi.js
"use client";
import { useAuth } from './auth';
import axios from '@/lib/axios';

export const useApi = () => {
  const { user, getToken } = useAuth();

  // Fungsi untuk fetch data dengan auth
  const fetchWithAuth = async (url, options = {}) => {
    const token = getToken();
    
    const config = {
      ...options,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
      },
    };

    try {
      const response = await axios(url, config);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  // Fungsi khusus untuk fetch permohonan
  const fetchPermohonan = async () => {
    return fetchWithAuth('/api/permohonan/show');
  };

  return {
    user,
    fetchWithAuth,
    fetchPermohonan,
  };
};