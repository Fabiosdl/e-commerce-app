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

// Add CSRF token and credentials to all requests
api.interceptors.request.use((config) => {
  //storing token in the header
  const csrfToken = getCsrfTokenFromCookies();
  if (csrfToken) {
    config.headers["X-XSRF-TOKEN"] = csrfToken;
    console.log('Fetched CSRF token: ', csrfToken);
  } else {
    console.warn("⚠️ No CSRF Token found in cookies!");
  }

  //storing credentials in the header
  const credentials = localStorage.getItem('credentials');
  if(credentials) {
    config.headers["Authentication"] = "Base " + credentials;
    console.log('The credentials are being sent to server');
  } else {
    console.warn("⚠️ No credentials are being sent");
  }

  return config;
});

export default api;
