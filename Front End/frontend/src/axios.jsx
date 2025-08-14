import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,  // keep this if your backend requires cookies
  headers: {
    Accept: 'application/json',
  },
});

// Add a request interceptor to add Authorization header if token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');  // get token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;  // add it to the headers
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
