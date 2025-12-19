import axios from "axios";

const API_URL = "http://localhost:5282/api";

// Get token
const getToken = () => localStorage.getItem("token");

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

// Auth
export const register = (data) => api.post("/Auth/register", data);
export const login = (data) => api.post("/Auth/login", data);

// Donor
export const getMyDonorProfile = () => api.get("/Donors/me");
export const updateMyDonorProfile = (data) => api.post("/Donors/me", data);
export const searchDonors = (bloodGroup, lat, lon) =>
  api.get(`/Donors/search?bloodGroup=${bloodGroup || ""}&lat=${lat || ""}&lon=${lon || ""}`);

// Admin
export const getAllUsers = () => api.get("/Admin/users");
export const toggleBanUser = (id) => api.post(`/Admin/toggleBan/${id}`);

export default api;
