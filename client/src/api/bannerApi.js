import apiClient from './apiClient';

// Lấy tất cả banners (public - chỉ active)
export const getBanners = async () => {
  const response = await apiClient.get('/banner/get');
  return response.data;
};
