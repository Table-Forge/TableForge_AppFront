import axios from "axios";

import { authTokenStore } from "@/src/features/auth-token-store";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    let token = authTokenStore.getToken();

    if (!token) {
      await authTokenStore.hydrate();
      token = authTokenStore.getToken();
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (__DEV__) {
      console.tron.display({
        name: `REQ: ${config.method?.toUpperCase()}`,
        preview: config.url,
        value: {
          url: config.url,
          method: config.method,
          params: config.params,
          data: config.data,
        },
        important: true,
      });
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.tron.display({
        name: `RES: ${response.status}`,
        preview: response.config.url,
        value: response.data,
      });
    }
    return response;
  },
  (error) => {
    if (__DEV__) {
      console.tron.display({
        name: "API ERROR",
        preview: error.config?.url,
        value: {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        },
        important: true,
      });
    }
    return Promise.reject(error);
  },
);

export { api };
