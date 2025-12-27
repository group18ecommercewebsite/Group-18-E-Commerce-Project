import apiClient from './apiClient';

// Lấy danh sách sản phẩm
export const getProducts = async (params = {}) => {
  const response = await apiClient.get('/product/getAllProducts', { params });
  return response.data;
};

// Lấy sản phẩm theo danh mục ID
export const getProductsByCatId = async (catId, page = 1, perPage = 10) => {
  const response = await apiClient.get(`/product/getAllProductsByCatId/${catId}`, {
    params: { page, perPage }
  });
  return response.data;
};

// Lấy chi tiết sản phẩm theo ID
export const getProductById = async (id) => {
  const response = await apiClient.get(`/product/getProduct/${id}`);
  return response.data;
};

// Tạo sản phẩm mới
export const createProduct = async (data) => {
  const response = await apiClient.post('/product/create', data);
  return response.data;
};

// Cập nhật sản phẩm
export const updateProduct = async (id, data) => {
  const response = await apiClient.put(`/product/updateProduct/${id}`, data);
  return response.data;
};

// Xóa sản phẩm
export const deleteProduct = async (id) => {
  const response = await apiClient.delete(`/product/deleteProduct/${id}`);
  return response.data;
};

// Upload ảnh sản phẩm
export const uploadProductImages = async (formData) => {
  const response = await apiClient.post('/product/uploadImages', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Đếm số lượng sản phẩm
export const getProductCount = async () => {
  const response = await apiClient.get('/product/getAllProductsCount');
  return response.data;
};

// Lấy sản phẩm nổi bật
export const getFeaturedProducts = async () => {
  const response = await apiClient.get('/product/getAllFeaturedProducts');
  return response.data;
};

