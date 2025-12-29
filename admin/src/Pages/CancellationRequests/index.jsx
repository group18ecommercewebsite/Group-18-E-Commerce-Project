import React, { useState, useEffect } from 'react';
import { FaSearch, FaMoneyBillWave, FaCheckCircle } from 'react-icons/fa';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { FiPackage } from 'react-icons/fi';
import { getCancellationRequests, markAsRefunded } from '../../api/orderApi';
import CircularProgress from '@mui/material/CircularProgress';

const CancellationRequests = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedRows, setExpandedRows] = useState({});
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await getCancellationRequests();
            if (response.success) {
                setRequests(response.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch cancellation requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkRefunded = async (orderId) => {
        if (!window.confirm('Xác nhận đã hoàn tiền cho đơn hàng này?')) {
            return;
        }

        try {
            setProcessing(orderId);
            const response = await markAsRefunded(orderId);
            if (response.success) {
                // Remove from list
                setRequests(prev => prev.filter(req => req.orderId !== orderId));
                alert('Đã đánh dấu hoàn tiền thành công!');
            }
        } catch (error) {
            console.error('Failed to mark as refunded:', error);
            alert('Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setProcessing(null);
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

    const toggleRow = (orderId) => {
        setExpandedRows(prev => ({
            ...prev,
            [orderId]: !prev[orderId]
        }));
    };

    const filteredRequests = requests.filter(req => 
        req.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.userEmail?.toLowerCase().includes(searchTerm.toLowerCase())
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
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <FaMoneyBillWave className="text-yellow-500" />
                            Yêu cầu hoàn tiền
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Có {requests.length} yêu cầu đang chờ xử lý
                        </p>
                    </div>
                    {/* Search Box */}
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2 min-w-[300px]">
                        <FaSearch className="text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm text-gray-700 flex-1"
                        />
                    </div>
                </div>
            </div>

            {/* Empty State */}
            {filteredRequests.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <FaCheckCircle className="text-6xl text-green-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Không có yêu cầu hoàn tiền</h3>
                    <p className="text-gray-500">Tất cả các yêu cầu đã được xử lý</p>
                </div>
            ) : (
                /* Requests Table */
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"></th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ORDER ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">KHÁCH HÀNG</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">SỐ TIỀN HOÀN</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">THÔNG TIN BANK</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">LÝ DO HỦY</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">NGÀY HỦY</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">THAO TÁC</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredRequests.map((request) => (
                                    <React.Fragment key={request.orderId}>
                                        <tr className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => toggleRow(request.orderId)}
                                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                                >
                                                    {expandedRows[request.orderId] ? (
                                                        <IoIosArrowUp className="w-5 h-5" />
                                                    ) : (
                                                        <IoIosArrowDown className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                                {request.orderId}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{request.userName}</p>
                                                    <p className="text-xs text-gray-500">{request.userEmail}</p>
                                                    <p className="text-xs text-gray-500">{request.userPhone}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className="text-lg font-bold text-red-600">
                                                    {formatCurrency(request.totalAmt)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                {request.refund_info?.bank_name ? (
                                                    <div className="bg-blue-50 rounded-lg p-2 text-xs">
                                                        <p className="font-semibold text-blue-800">
                                                            {request.refund_info.bank_name}
                                                        </p>
                                                        <p className="text-blue-700 font-mono">
                                                            {request.refund_info.account_number}
                                                        </p>
                                                        <p className="text-blue-600 uppercase">
                                                            {request.refund_info.account_holder}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">N/A</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-600 max-w-[150px] truncate block">
                                                    {request.cancel_reason || 'Không có lý do'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {formatDate(request.cancelled_at)}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleMarkRefunded(request.orderId)}
                                                    disabled={processing === request.orderId}
                                                    className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                >
                                                    {processing === request.orderId ? (
                                                        <>
                                                            <CircularProgress size={14} sx={{ color: 'white' }} />
                                                            Đang xử lý...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FaCheckCircle />
                                                            Xác nhận đã hoàn tiền
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                        
                                        {/* Expanded row with product details */}
                                        {expandedRows[request.orderId] && (
                                            <tr className="bg-gray-50">
                                                <td colSpan="8" className="px-4 py-4">
                                                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <FiPackage className="w-5 h-5 text-gray-600" />
                                                            <h3 className="text-sm font-semibold text-gray-900">Chi tiết sản phẩm</h3>
                                                        </div>
                                                        
                                                        <div className="space-y-3">
                                                            {request.products?.map((product, idx) => (
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
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CancellationRequests;
