import { apiRequest } from "./http";
import { getToken } from "../utils/storage";

const authHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});

const adminJsonRequest = (path, { method = "GET", payload, includeAuth = true } = {}) =>
  apiRequest(path, {
    method,
    headers: includeAuth ? authHeaders() : undefined,
    body: payload,
  });

const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    searchParams.set(key, String(value));
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

export const adminApi = {
  login: (payload) => adminJsonRequest("/admin/auth/login", { method: "POST", payload, includeAuth: false }),
  me: () => apiRequest("/admin/auth/me", { headers: authHeaders() }),
  getDashboard: () => apiRequest("/admin/dashboard", { headers: authHeaders() }),
  getDashboardOverview: () => apiRequest("/admin/dashboard/overview", { headers: authHeaders() }),
  getDashboardStats: () => apiRequest("/admin/dashboard/stats", { headers: authHeaders() }),
  getActivity: (limit = 30) => apiRequest(`/admin/activity?limit=${limit}`, { headers: authHeaders() }),
  getProfile: () => apiRequest("/admin/profile", { headers: authHeaders() }),
  updateProfile: (payload) => adminJsonRequest("/admin/profile", { method: "PUT", payload }),
  listResource: (endpoint, params = {}) => apiRequest(`${endpoint}${buildQueryString(params)}`, { headers: authHeaders() }),
  getResource: (endpoint, id) => apiRequest(`${endpoint}/${id}`, { headers: authHeaders() }),
  createResource: (endpoint, payload) => adminJsonRequest(endpoint, { method: "POST", payload }),
  updateResource: (endpoint, id, payload) => adminJsonRequest(`${endpoint}/${id}`, { method: "PUT", payload }),
  deleteResource: (endpoint, id) =>
    apiRequest(`${endpoint}/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    }),
  updateMessageStatus: (id, status) => adminJsonRequest(`/admin/messages/${id}`, { method: "PATCH", payload: { status } }),
  deleteMessage: (id) =>
    apiRequest(`/admin/messages/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    }),
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return apiRequest("/admin/uploads/image", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: formData,
    });
  },
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append("resume", file);
    return apiRequest("/admin/uploads/resume", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: formData,
    });
  },
};
