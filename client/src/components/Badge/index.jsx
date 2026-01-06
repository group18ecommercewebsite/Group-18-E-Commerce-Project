import React from "react";

const Badge = (props) => {
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-green-500 text-white';
      case 'confirmed':
        return 'bg-blue-500 text-white';
      case 'shipped':
        return 'bg-purple-500 text-white';
      case 'delivered':
        return 'bg-green-700 text-white';
      case 'cancelled':
      case 'failed':
        return 'bg-red-500 text-white';
      case 'pending':
      default:
        return 'bg-primary text-white';
    }
  };

  const getDisplayText = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'Đã thanh toán';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'shipped':
        return 'Đang giao';
      case 'delivered':
        return 'Đã giao';
      case 'cancelled':
        return 'Đã hủy';
      case 'pending':
      default:
        return 'Chờ xử lý';
    }
  };

  return (
    <span
      className={`inline-block py-1 px-4 rounded-full text-[11px] capitalize ${getStatusStyle(props.status)}`}
    >
      {getDisplayText(props.status)}
    </span>
  );
};

export default Badge;
