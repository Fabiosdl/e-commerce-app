import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true, // Send cookies with requests
});

// Function to get CSRF token from cookies
export const getCsrfTokenFromCookies = () => {
  const csrfCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="));

  return csrfCookie ? csrfCookie.split("=")[1] : null;
};

// Add CSRF token to all requests
api.interceptors.request.use((config) => {
  const csrfToken = getCsrfTokenFromCookies();
  if (csrfToken) {
    config.headers["X-XSRF-TOKEN"] = csrfToken;
    console.log('Fetched CSRF token: ', csrfToken);
  } else {
    console.warn("⚠️ No CSRF Token found in cookies!");
  }
  return config;
});

export default api;
