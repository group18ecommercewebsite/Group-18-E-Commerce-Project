import apiClient from './apiClient';

// Lấy tất cả danh mục
export const getCategories = async () => {
  const response = await apiClient.get('/category/get');
  return response.data;
};

// Lấy chi tiết danh mục theo ID
export const getCategoryById = async (id) => {
  const response = await apiClient.get(`/category/get/${id}`);
  return response.data;
};

// Đếm số lượng danh mục
export const getCategoryCount = async () => {
  const response = await apiClient.get('/category/get/count');
  return response.data;
};

// Lấy tất cả subcategory
export const getSubCategories = async () => {
  const response = await apiClient.get('/subcat/get');
  return response.data;
};

// Lấy subcategory theo ID
export const getSubCategoryById = async (id) => {
  const response = await apiClient.get(`/subcat/get/${id}`);
  return response.data;
};

// Đếm số lượng subcategory
export const getSubCategoryCount = async () => {
  const response = await apiClient.get('/subcat/get/count');
  return response.data;
};
