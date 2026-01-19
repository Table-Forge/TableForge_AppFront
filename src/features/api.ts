import axios from "axios";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    // const token = await getStorageItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    console.log(`[API] Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Sessão expirada ou não autorizado");
    }
    return Promise.reject(error);
  }
);

export { api };
