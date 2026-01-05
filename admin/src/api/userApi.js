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
  const response = await apiClient.get('/admin/users');
  return response.data;
};

// Xóa user (admin only)
export const deleteUser = async (userId) => {
  const response = await apiClient.delete(`/admin/users/${userId}`);
  return response.data;
};

// Cập nhật role user (admin only)
export const updateUserRole = async (userId, role) => {
  const response = await apiClient.put(`/admin/users/${userId}/role`, { role });
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

