import apiClient from './apiClient';

// Thêm sản phẩm vào danh sách yêu thích
export const addToMyList = async (productData) => {
  const response = await apiClient.post('/myList/add', productData);
  return response.data;
};

// Lấy danh sách yêu thích
export const getMyList = async () => {
  const response = await apiClient.get('/myList/get');
  return response.data;
};

// Xóa sản phẩm khỏi danh sách yêu thích
export const removeFromMyList = async (id) => {
  const response = await apiClient.delete(`/myList/remove/${id}`);
  return response.data;
};
