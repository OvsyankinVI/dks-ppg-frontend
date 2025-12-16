import axios from 'axios';

const API = axios.create({
  baseURL: 'https://dks-ppg-backend.onrender.com' || 'http://localhost:5001'
});

// interceptor добавляет Authorization если есть token
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
