import apiClient from './apiClient';

// Lấy danh sách sản phẩm với filter
export const getProducts = async (filters = {}) => {
  const response = await apiClient.post('/product/get', filters);
  return response.data;
};

// Lấy chi tiết sản phẩm theo ID
export const getProductById = async (id) => {
  const response = await apiClient.get(`/product/get/${id}`);
  return response.data;
};

// Lấy sản phẩm theo danh mục
export const getProductsByCategory = async (data) => {
  const response = await apiClient.post('/product/get-product-by-category', data);
  return response.data;
};

// Lấy sản phẩm nổi bật
export const getFeaturedProducts = async () => {
  const response = await apiClient.get('/product/featured');
  return response.data;
};

// Đếm số lượng sản phẩm
export const getProductCount = async () => {
  const response = await apiClient.get('/product/get/count');
  return response.data;
};

// Lấy sản phẩm theo subcategory
export const getProductsBySubCategory = async (data) => {
  const response = await apiClient.post('/product/get-product-by-subcategory', data);
  return response.data;
};

// Lọc sản phẩm theo giá
export const filterProductsByPrice = async (data) => {
  const response = await apiClient.post('/product/get-filtered-products-by-price', data);
  return response.data;
};

// Lọc sản phẩm theo rating
export const filterProductsByRating = async (data) => {
  const response = await apiClient.post('/product/get-filtered-products-by-rating', data);
  return response.data;
};
