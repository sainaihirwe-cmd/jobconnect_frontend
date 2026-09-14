import axios from 'axios';

const renderApiUrl = 'https://jobconnect-backend-xotx.onrender.com/api';
const localApiUrl = 'http://localhost:5000/api';
const isLocalDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (isLocalDevelopment ? localApiUrl : renderApiUrl),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jobconnect_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
