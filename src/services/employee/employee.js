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

export const createTicket = {
  createTicket: async (formData) => {
    try {
      const response = await api.post("portal/my-tickets", formData);
      return response;
    } catch (error) {
      console.error("Error creating ticket:", error);
      throw error;
    }
  },
};
