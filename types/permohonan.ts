// types/permohonan.ts
// export interface Permohonan {
//   id: number;
//   nomor_permohonan: string;
//   nama: string;
//   nim?: string;
//   prodi?: string;
//   fakultas?: string;
//   jenis_dokumen: string;
//   jumlah_dokumen: number;
//   status: number;
//   keterangan?: string;
//   tanggal_pengajuan: string;
//   tanggal_selesai?: string;
//   created_at: string;
//   updated_at: string;
// }

export interface Permohonan {
  id: number;
  user_id: number;
  username: string;
  nomor_ijazah: string;
  jumlah_lembar: number;
  keperluan: string;
  file: string;
  file_ijazah_verified: string | null;
  status: number;
  tanggal_diambil: string | null;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
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
