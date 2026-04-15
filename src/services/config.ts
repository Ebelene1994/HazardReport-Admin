import axios, { AxiosInstance } from "axios";

export const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3001";

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token dynamically
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only clear token on 401 (Unauthorized), not 404 or other errors
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("adminProfile");
      // Let components handle redirect - don't force page reload
    }
    return Promise.reject(error);
  }
);