import axios from "axios";

const API = axios.create({
  baseURL: "https://fropro-production.up.railway.app/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;

export const getCategories = () => API.get("/categories");
export const getCities = () => API.get("/cities");
export const getContact = (data) => API.post("/contact", data);