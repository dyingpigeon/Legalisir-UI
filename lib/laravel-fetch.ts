// lib/laravel-fetch.ts
/**
 * Helper function untuk fetch request ke Laravel API
 * dengan handling XSRF token dan credentials otomatis
 */

// Fungsi untuk mengambil XSRF token dari cookie
const getXsrfToken = (): string | null => {
  if (typeof document === "undefined") return null; // SSR safety

  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

// Fungsi utama untuk fetch ke Laravel API
export const laravelFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const xsrfToken = getXsrfToken();

  // Default headers
  const defaultHeaders: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(xsrfToken && { "X-XSRF-TOKEN": xsrfToken }),
  };

  // URL base untuk Laravel API
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;

  return fetch(fullUrl, {
    credentials: "include",
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });
};

// Fungsi khusus untuk GET request
export const laravelGet = <T>(url: string): Promise<T> => {
  return laravelFetch(url).then((res) => res.json());
};

// Fungsi untuk POST request
export const laravelPost = <T>(url: string, data: any): Promise<T> => {
  return laravelFetch(url, {
    method: "POST",
    body: JSON.stringify(data),
  }).then((res) => res.json());
};

// Fungsi untuk PUT/PATCH request
export const laravelPut = <T>(url: string, data: any): Promise<T> => {
  return laravelFetch(url, {
    method: "PUT",
    body: JSON.stringify(data),
  }).then((res) => res.json());
};

// Fungsi untuk DELETE request
export const laravelDelete = <T>(url: string): Promise<T> => {
  return laravelFetch(url, {
    method: "DELETE",
  }).then((res) => res.json());
};
