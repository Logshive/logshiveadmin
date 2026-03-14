import api from './api';

export const userService = {
  // Get all users
  getUsers: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await api.get(`/admin/users?${queryParams}`);
    return response.data;
  },

  // Get single user
  getUser: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  // Create user
  createUser: async (data) => {
    const response = await api.post('/admin/users', data);
    return response.data;
  },

  // Update user
  updateUser: async (id, data) => {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data;
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  // Update user role
  updateRole: async (id, role) => {
    const response = await api.patch(`/admin/users/${id}/role`, { role });
    return response.data;
  },

  // Toggle user status
  toggleStatus: async (id) => {
    const response = await api.patch(`/admin/users/${id}/toggle-status`);
    return response.data;
  }
};