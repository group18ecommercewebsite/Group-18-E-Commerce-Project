import React, { useState, useEffect, useMemo } from 'react';
import {
  FaSearch,
  FaBox,
  FaUser,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
} from 'react-icons/fa';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi';
import { getAllOrders, updateOrderStatus } from '../../api/orderApi';
import CircularProgress from '@mui/material/CircularProgress';

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRows, setExpandedRows] = useState({});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getAllOrders();
      if (response.success) {
        // Sắp xếp đơn mới nhất lên đầu
        const sortedOrders = (response.data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdating(orderId);
      const response = await updateOrderStatus(orderId, newStatus);
      if (response.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order.orderId === orderId ? { ...order, order_status: newStatus } : order
          )
        );
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Cập nhật trạng thái thất bại');
    } finally {
      setUpdating(null);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
      amount || 0
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return {
          label: 'Chờ xử lý',
          color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
          icon: <FiAlertCircle />,
        };
      case 'confirmed':
        return {
          label: 'Đã xác nhận',
          color: 'bg-blue-100 text-blue-700 border-blue-200',
          icon: <FiCheckCircle />,
        };
      case 'paid':
        return {
          label: 'Đã thanh toán',
          color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
          icon: <FaMoneyBillWave />,
        };
      case 'shipped':
        return {
          label: 'Đang giao',
          color: 'bg-purple-100 text-purple-700 border-purple-200',
          icon: <FiTruck />,
        };
      case 'delivered':
        return {
          label: 'Giao thành công',
          color: 'bg-green-100 text-green-700 border-green-200',
          icon: <FiCheckCircle />,
        };
      case 'cancelled':
        return {
          label: 'Đã hủy',
          color: 'bg-red-100 text-red-700 border-red-200',
          icon: <FiXCircle />,
        };
      default:
        return {
          label: status,
          color: 'bg-gray-100 text-gray-700 border-gray-200',
          icon: <FiPackage />,
        };
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'Chờ xử lý' },
    { value: 'confirmed', label: 'Đã xác nhận' },
    { value: 'paid', label: 'Đã thanh toán' },
    { value: 'shipped', label: 'Đang giao hàng' },
    { value: 'delivered', label: 'Giao thành công' },
    { value: 'cancelled', label: 'Hủy đơn hàng' },
  ];

  const toggleRow = (orderId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  // Optimize filter performance
  const filteredOrders = useMemo(() => {
    return orders.filter(
      (order) =>
        order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userPhone?.includes(searchTerm) ||
        order.order_status?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [orders, searchTerm]);

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  // Component hiển thị chi tiết sản phẩm (dùng chung cho Mobile và Desktop)
  const OrderDetails = ({ order }) => (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mt-2">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
        <FaBox className="text-gray-500" />
        <h3 className="text-sm font-bold text-gray-800">Chi tiết đơn hàng</h3>
      </div>

      {order.delivery_address && (
        <div className="mb-4 text-sm text-gray-600 bg-white p-3 rounded border border-gray-100">
          <p className="font-semibold text-gray-800 flex items-center gap-2 mb-1">
            <FaMapMarkerAlt className="text-red-500" /> Địa chỉ nhận hàng:
          </p>
          <p>
            {order.delivery_address.fullName} - {order.delivery_address.phone}
          </p>
          <p>
            {order.delivery_address.address}, {order.delivery_address.city}
          </p>
        </div>
      )}

      <div className="space-y-3">
        {order.products?.map((product, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 bg-white p-3 rounded border border-gray-100"
          >
            <img
              src={product.image || 'https://via.placeholder.com/60'}
              alt={product.name}
              className="w-14 h-14 object-cover rounded border border-gray-200"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{product.name}</h4>
              <p className="text-xs text-gray-500 mt-1">SL: x{product.quantity}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">{formatCurrency(product.price)}</p>
              <p className="text-xs text-gray-500">{formatCurrency(product.subTotal)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-3 mt-2 border-t border-gray-200">
        <div className="text-right">
          <p className="text-xs text-gray-500">Tổng tiền hàng</p>
          <p className="text-lg font-bold text-red-600">{formatCurrency(order.totalAmt)}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
          <p className="text-gray-500 mt-1 text-sm">Tổng cộng {filteredOrders.length} đơn hàng</p>
        </div>
        <div className="relative w-full md:w-80">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo Mã đơn, Tên, SĐT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
          />
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 w-10"></th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Mã đơn
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Ngày đặt
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Cập nhật
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center">
                      <FiPackage className="text-4xl mb-2 opacity-50" />
                      <p>Không tìm thấy đơn hàng nào.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const statusInfo = getStatusInfo(order.order_status);
                  return (
                    <React.Fragment key={order.orderId}>
                      <tr
                        className={`hover:bg-blue-50/30 transition-colors cursor-pointer ${
                          expandedRows[order.orderId] ? 'bg-blue-50/30' : ''
                        }`}
                        onClick={() => toggleRow(order.orderId)}
                      >
                        <td className="px-6 py-4 text-gray-400">
                          {expandedRows[order.orderId] ? <IoIosArrowUp /> : <IoIosArrowDown />}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          #{order.orderId ? order.orderId.slice(-6).toUpperCase() : 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">
                              {order.userName}
                            </span>
                            <span className="text-xs text-gray-500">{order.userPhone}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}
                          >
                            {statusInfo.icon} {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">
                          {formatCurrency(order.totalAmt)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                          {updating === order.orderId ? (
                            <CircularProgress size={20} className="ml-2" />
                          ) : (
                            <select
                              value={order.order_status || 'pending'}
                              onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                              className="text-xs border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 py-1.5 pl-2 pr-8"
                              disabled={order.order_status === 'cancelled'}
                            >
                              {statusOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          )}
                        </td>
                      </tr>
                      {expandedRows[order.orderId] && (
                        <tr>
                          <td colSpan="7" className="px-6 py-4 bg-gray-50/50">
                            <OrderDetails order={order} />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <FiPackage className="text-4xl mx-auto mb-2 opacity-50" />
            <p>Không tìm thấy đơn hàng nào.</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const statusInfo = getStatusInfo(order.order_status);
            return (
              <div
                key={order.orderId}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-blue-600">
                        #{order.orderId ? order.orderId.slice(-6).toUpperCase() : 'N/A'}
                      </span>
                      <span className="text-xs text-gray-400">
                        • {formatDate(order.createdAt).split(' ')[0]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <FaUser className="text-gray-400 text-xs" />
                      <span>{order.userName}</span>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${statusInfo.color}`}
                  >
                    {statusInfo.label}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm">
                      <span className="text-gray-500">Tổng tiền:</span>
                      <span className="ml-2 font-bold text-gray-900 text-lg">
                        {formatCurrency(order.totalAmt)}
                      </span>
                    </div>

                    <div onClick={(e) => e.stopPropagation()}>
                      {updating === order.orderId ? (
                        <CircularProgress size={16} />
                      ) : (
                        <select
                          value={order.order_status || 'pending'}
                          onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                          className="text-xs border-gray-300 rounded shadow-sm py-1 pr-6"
                          disabled={order.order_status === 'cancelled'}
                        >
                          {statusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>

                  {/* Expand/Collapse Button */}
                  <button
                    onClick={() => toggleRow(order.orderId)}
                    className="w-full flex items-center justify-center gap-1 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                  >
                    {expandedRows[order.orderId] ? 'Thu gọn' : 'Xem chi tiết'}
                    {expandedRows[order.orderId] ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </button>

                  {/* Details Panel */}
                  {expandedRows[order.orderId] && (
                    <div className="mt-3 animate-fade-in-down">
                      <OrderDetails order={order} />

                      <div className="mt-3 text-xs text-gray-500 space-y-1">
                        <p className="flex items-center gap-2">
                          <FaPhoneAlt /> {order.userPhone}
                        </p>
                        <p className="flex items-center gap-2">
                          <FaClock /> {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Orders;
