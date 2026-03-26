import api from './api';

export const logService = {
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('/logs/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  async uploadRaw(rawContent) {
    const formData = new FormData();
    formData.append('rawContent', rawContent);
    const { data } = await api.post('/logs/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  async getLogs() {
    const { data } = await api.get('/logs');
    return data;
  },

  async getLog(id) {
    const { data } = await api.get(`/logs/${id}`);
    return data;
  },

  async getLogEntries(id, level, keyword) {
    const params = {};
    if (level) params.level = level;
    if (keyword) params.keyword = keyword;
    const { data } = await api.get(`/logs/${id}/entries`, { params });
    return data;
  },

  async getAnalysis(id) {
    const { data } = await api.get(`/logs/${id}/analysis`);
    return data;
  },

  async getAnalysisSummary() {
    const { data } = await api.get('/logs/analysis/summary');
    return data;
  },
};
