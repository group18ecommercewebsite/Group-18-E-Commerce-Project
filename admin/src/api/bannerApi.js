import apiClient from './apiClient';

// Lấy tất cả banners (admin)
export const getAllBanners = async () => {
  const response = await apiClient.get('/banner/admin/get');
  return response.data;
};

// Tạo banner mới
export const createBanner = async (data) => {
  const response = await apiClient.post('/banner/create', data);
  return response.data;
};

// Cập nhật banner
export const updateBanner = async (id, data) => {
  const response = await apiClient.put(`/banner/${id}`, data);
  return response.data;
};

// Xóa banner
export const deleteBanner = async (id) => {
  const response = await apiClient.delete(`/banner/${id}`);
  return response.data;
};

// Upload image cho banner
export const uploadBannerImage = async (imageBase64) => {
  const response = await apiClient.post('/banner/upload', { image: imageBase64 });
  return response.data;
};

