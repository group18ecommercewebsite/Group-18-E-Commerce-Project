import apiClient from './apiClient';

// Lấy tất cả sản phẩm
export const getProducts = async () => {
  const response = await apiClient.get('/product/getAllProducts');
  return response.data;
};

// Lấy chi tiết sản phẩm theo ID
export const getProductById = async (id) => {
  const response = await apiClient.get(`/product/getProduct/${id}`);
  return response.data;
};

// Lấy sản phẩm theo category ID
export const getProductsByCategoryId = async (categoryId) => {
  const response = await apiClient.get(`/product/getAllProductsByCatId/${categoryId}`);
  return response.data;
};

// Lấy sản phẩm theo subcategory ID
export const getProductsBySubCategoryId = async (subCatId) => {
  const response = await apiClient.get(`/product/getAllProductsBySubCatId/${subCatId}`);
  return response.data;
};

// Lấy sản phẩm theo third level category ID
export const getProductsByThirdLevelCatId = async (thirdCatId) => {
  const response = await apiClient.get(`/product/getAllProductsByThirdLavelCatId/${thirdCatId}`);
  return response.data;
};

// Lấy sản phẩm nổi bật
export const getFeaturedProducts = async () => {
  const response = await apiClient.get('/product/getAllFeaturedProducts');
  return response.data;
};

// Đếm số lượng sản phẩm
export const getProductCount = async () => {
  const response = await apiClient.get('/product/getAllProductsCount');
  return response.data;
};

// Lọc sản phẩm theo giá
export const getProductsByPrice = async (minPrice, maxPrice) => {
  const response = await apiClient.get(`/product/getAllProductsByPrice?minPrice=${minPrice}&maxPrice=${maxPrice}`);
  return response.data;
};

// Lọc sản phẩm theo rating
export const getProductsByRating = async (rating) => {
  const response = await apiClient.get(`/product/getAllProductsByRating?rating=${rating}`);
  return response.data;
};

// Tìm kiếm sản phẩm theo tên
export const searchProducts = async (query, limit = 10) => {
  const response = await apiClient.get(`/product/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  return response.data;
};
