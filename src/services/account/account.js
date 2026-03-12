import { api } from "@/lib/api";

const account = {
  login: (formData) => api.post("Auth/login", formData),
  getMe: () => api.get("Auth/me"),
};

export default account;
