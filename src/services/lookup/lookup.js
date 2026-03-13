import { api } from "@/lib/api";

export const Lookup = {
  getLookupTypes: async ({ search = "", take = 20 } = {}) => {
    try {
      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (take) params.append("take", take);

      const response = await api.get(`Lookup/types?${params.toString()}`);
      return response;
    } catch (error) {
      console.error("Error fetching lookup types:", error);
      throw error;
    }
  },
};
