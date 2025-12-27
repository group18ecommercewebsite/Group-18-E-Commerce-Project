import apiClient from './apiClient';

// Lấy tất cả danh mục
export const getCategories = async () => {
  const response = await apiClient.get('/category/get');
  return response.data;
};

// Lấy chi tiết danh mục theo ID
export const getCategoryById = async (id) => {
  const response = await apiClient.get(`/category/${id}`);
  return response.data;
};

// Tạo danh mục mới
export const createCategory = async (data) => {
  const response = await apiClient.post('/category/create', data);
  return response.data;
};

// Cập nhật danh mục
export const updateCategory = async (id, data) => {
  const response = await apiClient.put(`/category/${id}`, data);
  return response.data;
};

// Xóa danh mục
export const deleteCategory = async (id) => {
  const response = await apiClient.delete(`/category/${id}`);
  return response.data;
};

// Upload ảnh danh mục
export const uploadCategoryImages = async (formData) => {
  const response = await apiClient.post('/category/uploadImages', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Đếm số lượng danh mục
export const getCategoryCount = async () => {
  const response = await apiClient.get('/category/get/count');
  return response.data;
};

// ===================== SUBCATEGORY APIs =====================

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

// Tạo subcategory mới
export const createSubCategory = async (data) => {
  const response = await apiClient.post('/subcat/create', data);
  return response.data;
};

// Cập nhật subcategory
export const updateSubCategory = async (id, data) => {
  const response = await apiClient.put(`/subcat/update/${id}`, data);
  return response.data;
};

// Xóa subcategory
export const deleteSubCategory = async (id) => {
  const response = await apiClient.delete(`/subcat/delete/${id}`);
  return response.data;
};

// Đếm số lượng subcategory
export const getSubCategoryCount = async () => {
  const response = await apiClient.get('/subcat/get/count');
  return response.data;
};
