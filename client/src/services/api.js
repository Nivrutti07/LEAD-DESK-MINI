import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Auth APIs
export const authApi = {
  login: (data) => api.post("/auth/login", data),
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

// Leads APIs
export const leadsApi = {
  getAll: (
    page = 1,
    limit = 10,
    search = "",
    status = "",
    sortBy = "createdAt",
    order = "desc",
  ) =>
    api.get("/leads", {
      params: { page, limit, search, status, sortBy, order },
    }),
  getById: (id) => api.get(`/leads/${id}`),
  create: (data) => api.post("/leads", data),
  updateStatus: (id, status) => api.patch(`/leads/${id}`, { status }),
  getStats: () => api.get("/leads/stats/overview"),
  delete: (id) => api.delete(`/leads/${id}`),
};

export default api;
