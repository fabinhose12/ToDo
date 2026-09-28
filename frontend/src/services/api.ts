import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Interceptor para injetar o token JWT automaticamente em cada requisição
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});