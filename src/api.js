import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers:{
    'Content-Type':'application/json',
  },
});

// use interceptor to inject the asic Authentication credentials in each request

api.interceptors.request.use((config) => {

  const credentials = localStorage.getItem('credentials');

  if (credentials) {
    config.headers['Authorization'] = `Basic ${credentials}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
