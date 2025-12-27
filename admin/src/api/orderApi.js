import apiClient from './apiClient';

// Lấy tất cả đơn hàng (Admin)
export const getAllOrders = async () => {
  const response = await apiClient.get('/admin/orders');
  return response.data;
};

// Lấy chi tiết đơn hàng
export const getOrderDetails = async (orderId) => {
  const response = await apiClient.get(`/admin/orders/${orderId}`);
  return response.data;
};

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (orderId, status) => {
  const response = await apiClient.put(`/admin/orders/${orderId}/status`, { status });
  return response.data;
};

// Lấy thống kê Dashboard
export const getDashboardStats = async () => {
  const response = await apiClient.get('/admin/dashboard-stats');
  return response.data;
};
