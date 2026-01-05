import apiClient from './apiClient';

/**
 * Validate mã giảm giá
 * @param {string} code - Mã giảm giá
 * @param {number} cartTotal - Tổng tiền giỏ hàng
 */
export const validateCoupon = async (code, cartTotal) => {
  const response = await apiClient.post('/coupon/validate', { code, cartTotal });
  return response.data;
};

/**
 * Lấy danh sách mã giảm giá đang hoạt động
 */
export const getActiveCoupons = async () => {
  const response = await apiClient.get('/coupon/list');
  return response.data;
};
