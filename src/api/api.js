import axios from "axios";

const API_URL = "http://localhost:5282/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ================= AUTH ================= */
export const login = (data) => api.post("/auth/login", data);
export const register = (data) => api.post("/auth/register", data);

/* ================= DONOR ================= */
export const getMyDonorProfile = () => api.get("/donors/me");

export const updateMyDonorProfile = (data) =>
  api.post("/donors/me", data);

export const searchDonors = (bloodGroup, lat, lon) =>
  api.get("/donors/search", {
    params: { bloodGroup, lat, lon },
  });

/* ================= ADMIN ================= */
export const getAllUsers = () => api.get("/admin/users");

export const toggleBanUser = (id) =>
  api.post(`/admin/toggleBan/${id}`);

/* ================= CONTACT ================= */
export const sendContactMessage = (data) =>
  api.post("/contacts", data);

export const getAllContactMessages = () =>
  api.get("/contacts");
