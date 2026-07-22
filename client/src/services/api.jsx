// client/src/services/api.js
import axios from "axios";

const API_BASE_URL =
  "https://security-audit-dashboard-backend.onrender.com/api/logs";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching in development
    if (import.meta.env.DEV) {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }
    console.log(
      "API Request:",
      config.method.toUpperCase(),
      config.url,
      config.params,
    );
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.status, error.response.data);
    } else if (error.request) {
      console.error("Network Error:", error.message);
    } else {
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  },
);

export const logService = {
  uploadLogs: (logs) => api.post("/logs/upload", { logs }),
  getLogs: (params) => api.get("/logs", { params }),
  getLogById: (id) => api.get(`/logs/${id}`),
  deleteLog: (id) => api.delete(`/logs/${id}`),
  getFilterOptions: () => api.get("/logs/filter-options"),
};

export default api;
