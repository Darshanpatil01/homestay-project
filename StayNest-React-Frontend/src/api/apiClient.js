import axios from "axios";

import {
  clearAuthentication,
  getAccessToken,
} from "../utils/authStorage";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8080/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      clearAuthentication();

      const currentPath =
        window.location.pathname;

      if (
        currentPath.startsWith("/admin") &&
        currentPath !== "/admin"
      ) {
        window.location.replace("/admin");
      } else if (
        currentPath.startsWith("/client") &&
        currentPath !== "/client/login"
      ) {
        window.location.replace(
          "/client/login"
        );
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;