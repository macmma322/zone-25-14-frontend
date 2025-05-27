import axios, { AxiosError, AxiosRequestConfig } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // send cookies with requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag to track token refreshing status
let isRefreshing = false;
// Queue to hold requests while refreshing token
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (error: unknown) => void;
}[] = [];

// Function to process queue after token refresh or failure
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

// Optional: Define a function to refresh token here if using refresh tokens.
// Since you're using JWT in cookies, you might just retry the original request after login or logout.
// If you plan to have a refresh endpoint, implement this function to call it.

api.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      !originalRequest._retry // avoid infinite loop
    ) {
      if (isRefreshing) {
        // If a refresh is already in progress, queue the request until done
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              if (!originalRequest.headers) return;
              if (token) {
                originalRequest.headers["Authorization"] = `Bearer ${token}`;
              }
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Optionally call your refresh token endpoint here
        // For now, just fail and logout user since token expired
        // e.g. await api.post("/auth/refresh");

        // Or just logout:
        // clear user data, tokens, cookies etc.

        // Reject all queued requests
        processQueue("Unauthorized");

        // Redirect user or trigger logout UI here if desired
        // For example:
        // window.location.href = "/auth/login";

        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
