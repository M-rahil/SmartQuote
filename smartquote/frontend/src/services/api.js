import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || ''}/api`,
  timeout: 15000
});

// Response interceptor - handle auth errors globally
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sq_token');
      delete api.defaults.headers.common['Authorization'];
    }
    return Promise.reject(err);
  }
);

export const skillsApi = {
  getAll: () => api.get('/skills'),
  getRate: (skill) => api.get(`/rates/${skill}`)
};

export const quoteApi = {
  calculate: (data) => api.post('/quote', data),
  save: (data) => api.post('/quote/save', data),
  getById: (id) => api.get(`/quote/${id}`),
  getUserQuotes: () => api.get('/user/quotes'),
  delete: (id) => api.delete(`/quote/${id}`),
  updateStatus: (id, status) => api.patch(`/quote/${id}/status`, { status }),
  downloadPDF: async (id) => {
    const token = localStorage.getItem('sq_token');
    const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/quote/${id}/pdf`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to generate PDF');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SmartQuote-${id}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
};

export const userApi = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.patch('/user/profile', data),
  updatePassword: (data) => api.patch('/user/password', data)
};

export default api;
