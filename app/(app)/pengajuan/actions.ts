// app/dashboard/actions.ts
"use server";

import { Permohonan } from "./types";

export async function fetchPermohonanData(): Promise<Permohonan[]> {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/permohonan/show", {
      // cache: "no-store", // Uncomment jika ingin selalu fresh data
      next: { revalidate: 60 }, // Revalidate setiap 60 detik
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Asumsi API mengembalikan array dalam property tertentu
    // Sesuaikan dengan struktur response API Anda
    if (Array.isArray(data)) {
      return data;
    } else if (data.data && Array.isArray(data.data)) {
      return data.data;
    } else if (data.permohonan && Array.isArray(data.permohonan)) {
      return data.permohonan;
    }

    return [];
  } catch (error) {
    console.error("Error fetching permohonan data:", error);
    return [];
  }
}
