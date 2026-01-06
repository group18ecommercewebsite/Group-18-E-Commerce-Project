import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://group-18-e-commerce-project.onrender.com/api';

// Tạo axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Để gửi cookies (refresh token)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - thêm access token vào header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - xử lý refresh token khi access token hết hạn
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Gọi API refresh token
        const response = await axios.post(
          `${BASE_URL}/user/refresh-token`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = response.data.data;

        // Lưu access token mới
        localStorage.setItem('accessToken', accessToken);

        // Thử lại request với token mới
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Nếu refresh token cũng hết hạn, logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
