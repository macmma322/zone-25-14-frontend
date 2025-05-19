// This file is used to configure Next.js settings and behaviors.
// It includes settings for the API URL, authentication, and other global configurations.
// The API URL is set based on the environment (development or production) and is used to make requests to the backend.
// File: src/utils/api.ts
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Create an Axios instance with base settings
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include credentials (cookies) with requests
});

// Attach token to every request if user is logged in
// Only attach token if we're in the browser
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("authToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("authToken");
      // Optional: redirect to login
    }
    return Promise.reject(err);
  }
);

export default api;
