import { api } from "@/lib/api";

export const location = {
  getAllLocations: async (pageNumber = 1, pageSize = 10) => {
    try {
      const response = await api.get(
        `Location?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      );
      return response;
    } catch (error) {
      console.error("Error fetching locations:", error);
      throw error;
    }
  },
  getLocationbyId: async (id) => {
    try {
      const response = await api.get(`Location/${id}`);
      return response;
    } catch (error) {
      console.error("Error fetching location by ID:", error);
      throw error;
    }
  },
  updateLocation: async (id, data) => {
    try {
      const response = await api.put(`Location/${id}`, data);
      return response;
    } catch (error) {
      console.error("Error updating location:", error);
      throw error;
    }
  },
  createLocation: async (data) => {
    try {
      const response = await api.post("Location", data);
      return response;
    } catch (error) {
      console.error("Error creating location:", error);
      throw error;
    }
  },
  deleteLocation: async (id) => {
    try {
      const response = await api.delete(`Location/${id}`);
      return response;
    } catch (error) {
      console.error("Error deleting location:", error);
      throw error;
    }
  },
  lookupLocation: async (search, take = 50) => {
    try {
      const response = await api.get(
        `Location/lookup?search=${search}&take=${take}`,
      );
      return response;
    } catch (error) {
      console.error("Error looking up location:", error);
      throw error;
    }
  },
};
