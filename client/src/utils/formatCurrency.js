/**
 * Format số tiền thành VND
 * @param {number} amount - Số tiền
 * @returns {string} - Chuỗi formatted, VD: "1.500.000₫"
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0₫';
  }
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

/**
 * Format số tiền thành VND (không có ký hiệu ₫)
 * @param {number} amount - Số tiền
 * @returns {string} - Chuỗi formatted, VD: "1.500.000"
 */
export const formatNumber = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0';
  }
  return new Intl.NumberFormat('vi-VN').format(amount);
};
