import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
  withCredentials: true,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const uploadAPI = {
  upload: (formData) =>
    api.post('/uploads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getAll: () => api.get('/uploads'),
  delete: (id) => api.delete(`/uploads/${id}`),
};

export const itineraryAPI = {
  generate: (data) => api.post('/itineraries/generate', data),
  getAll: () => api.get('/itineraries'),
  getById: (id) => api.get(`/itineraries/${id}`),
  getShared: (shareId) => api.get(`/itineraries/share/${shareId}`),
  delete: (id) => api.delete(`/itineraries/${id}`),
};

export default api;
