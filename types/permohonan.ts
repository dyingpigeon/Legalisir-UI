export interface Permohonan {
  id: number;
  userId: number;
  userName: string;
  username: string | number;
  nomorIjazah: string | number;
  jumlahLembar: number;
  keperluan: string;
  file: string;
  file_url: string;
  file_ijazah_verified?: string | null;
  status: number;
  statusText: string;
  tanggalDiambil: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
  };
}