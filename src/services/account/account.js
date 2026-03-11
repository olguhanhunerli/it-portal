import { api } from "@/lib/api";

const account = {
  login: (formData) => api.post("Auth/login", formData),
};

export default account;
