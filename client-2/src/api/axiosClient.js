import axios from 'axios';
import { getStoredAuth, clearStoredAuth } from '@/utils/storage';

const baseURL = import.meta.env.VITE_API_URL || '/api/v1';

const axiosClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

axiosClient.interceptors.request.use((config) => {
  const auth = getStoredAuth();
  if (auth?.token) {
    config.headers.Authorization = auth.token;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearStoredAuth();
      if (!window.location.pathname.startsWith('/auth')) {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;

export const getProductPhotoUrl = (productId) =>
  `${baseURL}/product/product-photo/${productId}`;

export { baseURL };
