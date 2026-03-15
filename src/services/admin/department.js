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

export const DepartmentCreate = {
  post: async (data) => {
    try {
      const repsonse = await api.post("Department", data);
      return repsonse;
    } catch (error) {
      console.error("Error creating department:", error);
      throw error;
    }
  },
};

export const DepartmentDelete = {
  delete: async (id) => {
    try {
      const response = await api.delete(`Department/${id}`);
      return response;
    } catch (error) {
      console.error("Error deleting department:", error);
      throw error;
    }
  },
};
