import apiClient from './apiClient';

// Thêm review cho sản phẩm
export const addReview = async (reviewData) => {
  const response = await apiClient.post('/review/add', reviewData);
  return response.data;
};

// Lấy danh sách review của sản phẩm
export const getProductReviews = async (productId) => {
  const response = await apiClient.get(`/review/product/${productId}`);
  return response.data;
};

// Xóa review (chỉ owner)
export const deleteReview = async (reviewId) => {
  const response = await apiClient.delete(`/review/${reviewId}`);
  return response.data;
};
