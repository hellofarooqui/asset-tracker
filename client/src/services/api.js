import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("assettrack_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// // Response interceptor to handle errors
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Unauthorized - clear token and redirect to login
//       localStorage.removeItem("assettrack_token");
//       localStorage.removeItem("assettrack_user");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  logout: () => api.post("/auth/logout"),
  register: (userData) => api.post("/auth/register", userData),
  getCurrentUser: () => api.get("/auth/me"),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (token, password) =>
    api.post("/auth/reset-password", { token, password }),
};

// Assets API calls
export const assetsAPI = {
  getAll: (params) => api.get("/assets", { params }),
  getById: (id) => api.get(`/assets/${id}`),
  create: (assetData) => api.post("/assets", assetData),
  update: (id, assetData) => api.put(`/assets/${id}`, assetData),
  delete: (id) => api.delete(`/assets/${id}`),
  getAssetTypes: () => api.get("/assets/category"),
  addAssetType: (typeData) => api.post("/assets/category", typeData),
  updateAssetType: (typeData) => api.put("/assets/category", typeData),
  deleteAssetType: (type) =>
    api.delete("/assets/assetTypes", { data: { type } }),
  getAllAssetModels: () => api.get("/assets/models"),
  addAssetModel: (modelData) => api.post("/assets/models", modelData),
  updateAssetModel: (modelData) => api.put("/assets/models", modelData),
  deleteAssetModel: (modelId) =>
    api.delete("/assets/models", { data: { id: modelId } }),
  updateStatus: (id, status) => api.patch(`/assets/${id}/status`, { status }),
  getStats: () => api.get("/assets/stats"),
  getRecentActivity: (limit) =>
    api.get("/assets/recent", { params: { limit } }),
  addMaintenanceRecord: (id, record) =>
    api.post(`/assets/${id}/maintenance`, record),
};

export const manufacturersAPI = {
  getAllManufacturers: () => api.get("/manufacturers"),
  addNewManufacturer: (manufacturerData) => {
    // If caller passed a FormData (file upload), remove the default JSON content-type so
    // the browser/axios sets proper multipart/form-data with boundary.
    if (manufacturerData instanceof FormData) {
      return api.post("/manufacturers", manufacturerData, {
        headers: { "Content-Type": undefined }, // let browser set multipart boundary
        // optional: prevent axios from transforming FormData
        transformRequest: (data, headers) => {
          // axios may re-add default headers; ensure Content-Type is removed
          if (headers && headers["Content-Type"] === undefined) {
            delete headers["Content-Type"];
          }
          return data;
        },
      });
    }
    return api.post("/manufacturers", manufacturerData);
  },
  update: (manufacturerData) => api.put("/manufacturers", manufacturerData),
  delete: (manufacturerId) =>
    api.delete("/assets/manufacturers", { data: { id: manufacturerId } }),
};

// Users API calls
export const usersAPI = {
  getAll: (params) => api.get("/users", { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (userData) => api.post("/users", userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
};

// Reports API calls
export const reportsAPI = {
  getAssetReport: (params) => api.get("/reports/assets", { params }),
  getMaintenanceReport: (params) => api.get("/reports/maintenance", { params }),
  getUserReport: (params) => api.get("/reports/users", { params }),
  exportReport: (type, format) =>
    api.get(`/reports/export/${type}`, {
      params: { format },
      responseType: "blob",
    }),
};

export default api;
