import { api } from "@/lib/api";

export const DepartmentService = {
  getAllDepartment: async (page = 1, pageSize = 10) => {
    try {
      const response = await api.get(
        `Department?pageNumber=${page}&pageSize=${pageSize}`,
      );
      return response;
    } catch (error) {
      console.error("Error fetching departments:", error);
      throw error;
    }
  },
};

export const DepartmentCard = {
  getById: async (id) => {
    try {
      const response = await api.get(`Department/${id}`);
      return response;
    } catch (error) {
      console.error("Error fetching department by ID:", error);
      throw error;
    }
  },
};

export const DepartmentUpdate = {
  put: async (id, data) => {
    try {
      const response = await api.put(`Department/update/${id}`, data);
      return response;
    } catch (error) {
      console.error("Error updating department:", error);
      throw error;
    }
  },
};
