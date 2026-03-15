import api from './api';

export const settingsService = {
  getSettings: async () => {
    const response = await api.get('/admin/settings');
    return response.data;
  },
  updateSettings: async (data) => {
    const response = await api.put('/admin/settings', data);
    return response.data;
  }
};