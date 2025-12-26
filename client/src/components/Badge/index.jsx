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
        return 'Paid';
      case 'confirmed':
        return 'Confirmed';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      case 'pending':
      default:
        return 'Pending';
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
