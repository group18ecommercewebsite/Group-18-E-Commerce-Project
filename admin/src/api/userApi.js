import apiClient from './apiClient';

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

// Lấy tất cả users (admin only)
export const getAllUsers = async () => {
  const response = await apiClient.get('/user/get-all-users');
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
