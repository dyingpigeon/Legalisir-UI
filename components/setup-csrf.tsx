// components/setup-csrf.tsx
"use client";

import { useEffect } from "react";
import { setupCsrfToken } from "@/lib/axios";

export function SetupCsrf() {
  useEffect(() => {
    // Setup CSRF token saat aplikasi pertama load
    setupCsrfToken();
  }, []);

  return null; // Komponen tidak render apa-apa
}