import apiClient from './apiClient';

/**
 * Lấy danh sách tất cả coupons
 */
export const getAllCoupons = async () => {
  const response = await apiClient.get('/admin/coupons');
  return response.data;
};

/**
 * Tạo coupon mới
 */
export const createCoupon = async (couponData) => {
  const response = await apiClient.post('/admin/coupons', couponData);
  return response.data;
};

/**
 * Cập nhật coupon
 */
export const updateCoupon = async (id, couponData) => {
  const response = await apiClient.put(`/admin/coupons/${id}`, couponData);
  return response.data;
};

/**
 * Xóa coupon
 */
export const deleteCoupon = async (id) => {
  const response = await apiClient.delete(`/admin/coupons/${id}`);
  return response.data;
};
