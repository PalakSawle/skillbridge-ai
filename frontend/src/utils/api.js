import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  me: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const resumeAPI = {
  upload: async (formData) => {
    const response = await api.post('/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  getAll: async () => {
    const response = await api.get('/resumes');
    return response.data;
  },
  getOne: async (id) => {
    const response = await api.get(`/resumes/${id}`);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/resumes/${id}`);
    return response.data;
  },
};

export const jobAPI = {
  create: async (jobData) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },
  getAll: async () => {
    const response = await api.get('/jobs');
    return response.data;
  },
};

export const reportAPI = {
  generate: async (ids) => {
    const response = await api.post('/reports/generate', ids);
    return response.data;
  },
  getAll: async () => {
    const response = await api.get('/reports');
    return response.data;
  },
  getOne: async (id) => {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/reports/${id}`);
    return response.data;
  },
};

export const adminAPI = {
  getAnalytics: async () => {
    const response = await api.get('/admin/analytics');
    return response.data;
  },
};

export default api;
