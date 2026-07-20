import axios, { AxiosError } from 'axios';
import { ENDPOINTS } from './endpoints';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001';

/** Axios instance duy nhất cho toàn bộ app. */
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: tự động đính kèm access token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Flag tránh lặp vô hạn khi refresh thất bại
let isRefreshing = false;

// Response interceptor: tự động refresh token khi nhận 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && originalRequest && !isRefreshing) {
      isRefreshing = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${BASE_URL}${ENDPOINTS.AUTH.REFRESH}`, { refreshToken });
        const newAccessToken: string = data.data.accessToken;
        localStorage.setItem('access_token', newAccessToken);

        // Retry request gốc với token mới
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch {
        // Refresh thất bại: xóa token, để useAuth xử lý redirect
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
