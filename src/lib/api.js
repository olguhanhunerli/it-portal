import { toast } from "react-toastify";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function request(path, options = {}) {
  let token = null;

  if (typeof window !== "undefined") {
    token = localStorage.getItem("accessToken");
  }

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  let data = null;

  try {
    const raw = await response.text();
    data = raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error("Error parsing response:", error);
  }

  if (!response.ok) {
    const status = response.status;

    switch (status) {
      case 400:
        toast.error(data?.message || "Geçersiz istek");
        break;
      case 401:
        toast.error("Giriş yapmanız gerekiyor");
        break;
      case 403:
        toast.error("Bu işlem için yetkiniz yok");
        break;
      case 404:
        toast.error("Kaynak bulunamadı");
        break;
      case 500:
        if (data?.errors) {
          Object.values(data.errors).forEach((arr) => {
            arr.forEach((err) => toast.error(err));
          });
        } else {
          toast.error(data?.message || "Sunucu hatası");
        }
        break;
      default:
        toast.error("Bir hata oluştu");
        break;
    }

    throw data || new Error("Request failed");
  }

  return data;
}

export const api = {
  get: (url) => request(url, { method: "GET" }),

  post: (url, body) =>
    request(url, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: (url, body) =>
    request(url, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: (url) =>
    request(url, {
      method: "DELETE",
    }),
};
