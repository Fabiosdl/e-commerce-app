import axios from "axios";

const api = axios.create({
  baseURL: "https://fl-ecommerce-api-demo-env.eba-6xi5pz7m.us-east-1.elasticbeanstalk.com",
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
    console.log('The credentials are being sent to server');
  } else {
    console.warn("⚠️ No credentials are being sent");
  }

  return config;
});

export default api;