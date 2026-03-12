import { api } from "@/lib/api";

export const employee = {
  getEmployeeTickets: async (page = 1, pageSize = 10) => {
    try {
      const response = await api.get(
        `portal/my-tickets?pageNumber=${page}&pageSize=${pageSize}`,
      );
      return response;
    } catch (error) {
      console.error("Error fetching employee tickets:", error);
      throw error;
    }
  },
};
