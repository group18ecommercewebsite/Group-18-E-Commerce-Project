import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { FiPackage } from 'react-icons/fi';
import { getAllOrders, updateOrderStatus } from '../../api/orderApi';
import CircularProgress from '@mui/material/CircularProgress';

const Orders = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedRows, setExpandedRows] = useState({});
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null); // orderId đang update

    // Fetch orders từ API
    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await getAllOrders();
            if (response.success) {
                setOrders(response.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    // Update order status
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            setUpdating(orderId);
            const response = await updateOrderStatus(orderId, newStatus);
            if (response.success) {
                // Update local state
                setOrders(prev => prev.map(order => 
                    order.orderId === orderId 
                        ? { ...order, order_status: newStatus }
                        : order
                ));
            }
        } catch (error) {
            console.error('Failed to update order status:', error);
            alert('Cập nhật trạng thái thất bại');
        } finally {
            setUpdating(null);
        }
    };

    const formatCurrency = (amount) => {
        if (!amount) return '₫0';
        return `₫${amount.toLocaleString('vi-VN')}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        const statusColors = {
            "delivered": "bg-green-600 text-white",
            "shipped": "bg-purple-500 text-white",
            "confirmed": "bg-blue-500 text-white",
            "paid": "bg-green-500 text-white",
            "pending": "bg-yellow-500 text-white",
            "cancelled": "bg-red-500 text-white"
        };
        return statusColors[status?.toLowerCase()] || "bg-gray-500 text-white";
    };

    const getStatusLabel = (status) => {
        const labels = {
            "pending": "Chờ xử lý",
            "paid": "Đã thanh toán",
            "confirmed": "Đã xác nhận",
            "shipped": "Đang giao",
            "delivered": "Đã giao",
            "cancelled": "Đã hủy"
        };
        return labels[status?.toLowerCase()] || status;
    };

    const statusOptions = [
        { value: 'pending', label: 'Chờ xử lý' },
        { value: 'paid', label: 'Đã thanh toán' },
        { value: 'confirmed', label: 'Đã xác nhận' },
        { value: 'shipped', label: 'Đang giao' },
        { value: 'delivered', label: 'Đã giao' },
        { value: 'cancelled', label: 'Đã hủy' }
    ];

    const toggleRow = (orderId) => {
        setExpandedRows(prev => ({
            ...prev,
            [orderId]: !prev[orderId]
        }));
    };

    const filteredOrders = orders.filter(order => 
        order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.order_status?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
                <CircularProgress />
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
                        <p className="text-gray-600 mt-1">Tổng cộng {orders.length} đơn hàng</p>
                    </div>
                    {/* Search Box */}
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2 min-w-[300px]">
                        <FaSearch className="text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm đơn hàng..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm text-gray-700 flex-1"
                        />
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"></th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ORDER ID</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">KHÁCH HÀNG</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">SĐT</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">THANH TOÁN</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">TỔNG TIỀN</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">TRẠNG THÁI</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">HOÀN TIỀN</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">NGÀY ĐẶT</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="px-4 py-12 text-center text-gray-500">
                                        {searchTerm ? 'Không tìm thấy đơn hàng phù hợp.' : 'Chưa có đơn hàng nào.'}
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <React.Fragment key={order.orderId}>
                                        <tr className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => toggleRow(order.orderId)}
                                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                                >
                                                    {expandedRows[order.orderId] ? (
                                                        <IoIosArrowUp className="w-5 h-5" />
                                                    ) : (
                                                        <IoIosArrowDown className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{order.orderId}</td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{order.userName}</p>
                                                    <p className="text-xs text-gray-500">{order.userEmail}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{order.userPhone || '-'}</td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-600">{order.payment_status || 'COD'}</span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                {formatCurrency(order.totalAmt)}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                {/* Status Dropdown */}
                                                <div className="relative">
                                                    {updating === order.orderId ? (
                                                        <CircularProgress size={20} />
                                                    ) : (
                                                        <select
                                                            value={order.order_status || 'pending'}
                                                            onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                                                            className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer border-0 ${getStatusColor(order.order_status)}`}
                                                        >
                                                            {statusOptions.map(opt => (
                                                                <option key={opt.value} value={opt.value} className="bg-white text-gray-800">
                                                                    {opt.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                {order.order_status === 'cancelled' && order.refund_status && order.refund_status !== 'none' ? (
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                        order.refund_status === 'pending_refund' 
                                                            ? 'bg-yellow-100 text-yellow-800' 
                                                            : 'bg-green-100 text-green-800'
                                                    }`}>
                                                        {order.refund_status === 'pending_refund' ? 'Chưa hoàn tiền' : 'Đã hoàn tiền'}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 text-xs">-</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {formatDate(order.createdAt)}
                                            </td>
                                        </tr>
                                        {/* Expanded row with product details */}
                                        {expandedRows[order.orderId] && (
                                            <tr className="bg-gray-50">
                                                <td colSpan="9" className="px-4 py-4">
                                                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <FiPackage className="w-5 h-5 text-gray-600" />
                                                            <h3 className="text-sm font-semibold text-gray-900">Chi tiết sản phẩm</h3>
                                                        </div>
                                                        
                                                        {/* Địa chỉ giao hàng */}
                                                        {order.delivery_address && (
                                                            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                                                                <p className="text-xs font-semibold text-blue-800 mb-1">Địa chỉ giao hàng:</p>
                                                                <p className="text-sm text-gray-700">
                                                                    {order.delivery_address.fullName} - {order.delivery_address.phone}
                                                                </p>
                                                                <p className="text-sm text-gray-600">
                                                                    {order.delivery_address.address}, {order.delivery_address.city}, {order.delivery_address.state}
                                                                </p>
                                                            </div>
                                                        )}

                                                        <div className="space-y-3">
                                                            {order.products?.map((product, idx) => (
                                                                <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                                                    <img 
                                                                        src={product.image || 'https://via.placeholder.com/60'} 
                                                                        alt={product.name}
                                                                        className="w-16 h-16 object-cover rounded border border-gray-200"
                                                                    />
                                                                    <div className="flex-1">
                                                                        <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                                                                        <p className="text-xs text-gray-500">Số lượng: {product.quantity}</p>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <p className="text-sm font-semibold text-gray-900">{formatCurrency(product.price)}</p>
                                                                        <p className="text-xs text-gray-500">Tổng: {formatCurrency(product.subTotal)}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            <div className="flex justify-end pt-3 border-t border-gray-200">
                                                                <div className="text-right">
                                                                    <p className="text-sm text-gray-600">Tổng cộng:</p>
                                                                    <p className="text-lg font-bold text-gray-900">{formatCurrency(order.totalAmt)}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Orders;
