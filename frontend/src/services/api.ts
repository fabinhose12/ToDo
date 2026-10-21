import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://todo-backend-direto.onrender.com',
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