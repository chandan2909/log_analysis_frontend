import api from './api';

export const authService = {
  async register(username, email, password) {
    const { data } = await api.post('/auth/register', { username, email, password });
    return data;
  },

  async login(username, password) {
    const { data } = await api.post('/auth/login', { username, password });
    return data;
  },
};
