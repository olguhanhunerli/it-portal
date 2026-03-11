import { api } from "@/lib/api";

export const adminTickets = {
  getAllTickets: async (page = 1, pageSize = 10) => {
    try {
      const response = await api.get(
        `admin/tickets?pageNumber=${page}&pageSize=${pageSize}`,
      );
      return response;
    } catch (error) {
      console.error("Error fetching tickets:", error);
      throw error;
    }
  },
};
