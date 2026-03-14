import api from './api';

export const accountService = {
  // Get all accounts with pagination and filters
  getAccounts: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key]) queryParams.append(key, params[key]);
    });
    
    const response = await api.get(`/admin/accounts?${queryParams}`);
    return response.data;
  },

  // Get single account
  getAccount: async (id) => {
    const response = await api.get(`/admin/accounts/${id}`);
    return response.data;
  },

  // Create account
  createAccount: async (data) => {
    const response = await api.post('/admin/accounts', data);
    return response.data;
  },

  // Update account
  updateAccount: async (id, data) => {
    const response = await api.put(`/admin/accounts/${id}`, data);
    return response.data;
  },

  // Delete account
  deleteAccount: async (id) => {
    const response = await api.delete(`/admin/accounts/${id}`);
    return response.data;
  },

  // Bulk delete accounts
  bulkDelete: async (ids) => {
    const response = await api.post('/admin/accounts/bulk-delete', { ids });
    return response.data;
  },

  // Get account stats
  getStats: async () => {
    const response = await api.get('/admin/accounts/stats');
    return response.data;
  }
};