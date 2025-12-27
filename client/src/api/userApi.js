import apiClient from './apiClient';

// Đăng ký
export const registerUser = async (data) => {
  const response = await apiClient.post('/user/register', data);
  return response.data;
};

// Xác thực email
export const verifyEmail = async (email, otp) => {
  const response = await apiClient.post('/user/verifyEmail', { email, otp });
  return response.data;
};

// Đăng nhập
export const loginUser = async (data) => {
  const response = await apiClient.post('/user/login', data);
  return response.data;
};

// Đăng xuất
export const logoutUser = async () => {
  const response = await apiClient.get('/user/logout');
  return response.data;
};

// Lấy thông tin user
export const getUserDetails = async () => {
  const response = await apiClient.get('/user/user-details');
  return response.data;
};

// Cập nhật thông tin user
export const updateUser = async (data) => {
  const response = await apiClient.put('/user/update-user', data);
  return response.data;
};

// Upload avatar
export const uploadAvatar = async (formData) => {
  const response = await apiClient.put('/user/user-avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Quên mật khẩu
export const forgotPassword = async (email) => {
  const response = await apiClient.post('/user/forgot-password', { email });
  return response.data;
};

// Xác thực OTP quên mật khẩu
export const verifyForgotPasswordOtp = async (data) => {
  const response = await apiClient.post('/user/verify-forgot-password-otp', data);
  return response.data;
};

// Đặt lại mật khẩu
export const resetPassword = async (data) => {
  const response = await apiClient.post('/user/reset-password', data);
  return response.data;
};

// Refresh token
export const refreshToken = async () => {
  const response = await apiClient.post('/user/refresh-token');
  return response.data;
};
