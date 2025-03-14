import axios from "axios";

const api = axios.create({
  baseURL: "https://app.fslwebsolutions.com",
  //withCredentials: true, // Send cookies with requests
  headers:{
    'Content-Type':'application/json',
  },
});

// Add JWT token to all requests
api.interceptors.request.use((config) => {

  //storing token in the header
  const token = localStorage.getItem('token');

  if(token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  } else {
    console.warn("⚠️ No credentials are being sent");
  }

  return config;
});

export default api;