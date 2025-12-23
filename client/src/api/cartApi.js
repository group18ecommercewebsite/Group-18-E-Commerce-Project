import apiClient from './apiClient';

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (productId, quantity = 1) => {
  const response = await apiClient.post('/cart/add', { productId, quantity });
  return response.data;
};

// Lấy giỏ hàng
export const getCart = async () => {
  const response = await apiClient.get('/cart/get');
  return response.data;
};

// Cập nhật số lượng sản phẩm trong giỏ
export const updateCartQuantity = async (cartItemId, qty) => {
  const response = await apiClient.put('/cart/update-qty', { _id: cartItemId, qty });
  return response.data;
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (cartItemId, productId) => {
  const response = await apiClient.delete('/cart/delete-cart-item', { 
    data: { _id: cartItemId, productId } 
  });
  return response.data;
};
