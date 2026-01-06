import apiClient from './apiClient';

// Tạo thanh toán SePay
export const createSePayPayment = async (paymentData) => {
  const response = await apiClient.post('/payment/sepay/create', paymentData);
  return response.data;
};

// Tạo thanh toán VNPay
export const createVNPayPayment = async (paymentData) => {
  const response = await apiClient.post('/payment/vnpay/create', paymentData);
  return response.data;
};

// Kiểm tra trạng thái thanh toán theo orderId
export const getOrderPaymentStatus = async (orderId) => {
  const response = await apiClient.get(`/payment/order-status/${orderId}`);
  return response.data;
};

// Xác nhận thanh toán thành công
export const confirmPayment = async (orderId) => {
  const response = await apiClient.post('/payment/confirm-payment', { orderId });
  return response.data;
};
