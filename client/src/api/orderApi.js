import apiClient from './apiClient';

// Tạo đơn hàng (Cash on Delivery)
export const createOrder = async (orderData) => {
  const response = await apiClient.post('/order/create', orderData);
  return response.data;
};

// Lấy danh sách đơn hàng của user
export const getMyOrders = async () => {
  const response = await apiClient.get('/order/my-orders');
  return response.data;
};

// Lấy chi tiết đơn hàng theo ID
export const getOrderById = async (orderId) => {
  const response = await apiClient.get(`/order/${orderId}`);
  return response.data;
};
