import { envs, prefix_api } from "@/constants/envs";
import axios from "axios";
import Cookies from "js-cookie";

console.log("API URL:", envs.API_URL);

const api = axios.create({
  baseURL: envs.API_URL + prefix_api,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("token");

  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

export default api;
