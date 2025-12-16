// app/dashboard/types.ts
export interface Permohonan {
  id: number;
  user_id: number;
  username: string;
  nomor_ijazah: string;
  jumlah_lembar: number;
  keperluan: string;
  file: string;
  file_ijazah_verified: string | null;
  status: number; // 1 = pending, 2 = processing, 3 = success, 4 = failed?
  tanggal_diambil: string | null;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

// Untuk mapping status
export type StatusType = "pending" | "processing" | "success" | "failed";