import React, { useState, useEffect } from 'react';
import {
  FaSearch,
  FaMoneyBillWave,
  FaCheckCircle,
  FaUser,
  FaCalendarAlt,
  FaUniversity,
} from 'react-icons/fa';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { FiPackage, FiAlertCircle } from 'react-icons/fi';
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
        setRequests((prev) => prev.filter((req) => req.orderId !== orderId));
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
      minute: '2-digit',
    });
  };

  const toggleRow = (orderId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const filteredRequests = requests.filter(
    (req) =>
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

  // Component hiển thị chi tiết sản phẩm (dùng chung cho cả Mobile và Desktop)
  const ProductDetails = ({ products }) => (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mt-2">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
        <FiPackage className="w-4 h-4 text-gray-600" />
        <h3 className="text-sm font-semibold text-gray-900">Chi tiết sản phẩm hoàn trả</h3>
      </div>
      <div className="space-y-3">
        {products?.map((product, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 bg-white p-2 rounded border border-gray-100 shadow-sm"
          >
            <img
              src={product.image || 'https://via.placeholder.com/60'}
              alt={product.name}
              className="w-12 h-12 object-cover rounded border border-gray-200"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">{product.name}</h4>
              <p className="text-xs text-gray-500">SL: {product.quantity}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">
                {formatCurrency(product.subTotal)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 bg-white rounded-lg shadow-sm p-4 md:p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FaMoneyBillWave className="text-yellow-500" />
              Yêu cầu hoàn tiền
            </h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              Có <span className="font-semibold text-red-600">{requests.length}</span> yêu cầu đang
              chờ xử lý
            </p>
          </div>
          {/* Search Box */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2 w-full md:w-80">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo Mã đơn, Tên, Email..."
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
          <FaCheckCircle className="text-5xl md:text-6xl text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Không có yêu cầu hoàn tiền</h3>
          <p className="text-gray-500">Tất cả các yêu cầu đã được xử lý</p>
        </div>
      ) : (
        <>
          {/* DESKTOP VIEW: TABLE */}
          <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase"></th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Đơn hàng
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Khách hàng
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Hoàn trả
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Ngân hàng
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Lý do
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRequests.map((request) => (
                    <React.Fragment key={request.orderId}>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 w-10">
                          <button
                            onClick={() => toggleRow(request.orderId)}
                            className="text-gray-400 hover:text-blue-600"
                          >
                            {expandedRows[request.orderId] ? <IoIosArrowUp /> : <IoIosArrowDown />}
                          </button>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm font-semibold text-blue-600 block">
                            {request.orderId}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(request.cancelled_at)}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {request.userName}
                          </div>
                          <div className="text-xs text-gray-500">{request.userEmail}</div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm font-bold text-red-600">
                            {formatCurrency(request.totalAmt)}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          {request.refund_info?.bank_name ? (
                            <div className="text-xs">
                              <p className="font-bold text-gray-700">
                                {request.refund_info.bank_name}
                              </p>
                              <p className="font-mono text-blue-600">
                                {request.refund_info.account_number}
                              </p>
                              <p className="uppercase text-gray-500">
                                {request.refund_info.account_holder}
                              </p>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className="text-sm text-gray-600 line-clamp-2"
                            title={request.cancel_reason}
                          >
                            {request.cancel_reason || 'Không có lý do'}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => handleMarkRefunded(request.orderId)}
                            disabled={processing === request.orderId}
                            className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-semibold rounded hover:bg-green-200 disabled:opacity-50 flex items-center gap-1 transition-colors"
                          >
                            {processing === request.orderId ? (
                              <CircularProgress size={12} color="inherit" />
                            ) : (
                              <FaCheckCircle />
                            )}
                            Đã hoàn tiền
                          </button>
                        </td>
                      </tr>
                      {expandedRows[request.orderId] && (
                        <tr>
                          <td colSpan="7" className="px-4 pb-4 pt-0 border-none bg-gray-50/30">
                            <div className="pl-8">
                              <ProductDetails products={request.products} />
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

          {/* MOBILE VIEW: CARD LIST */}
          <div className="md:hidden space-y-4">
            {filteredRequests.map((request) => (
              <div
                key={request.orderId}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
              >
                {/* Card Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600 font-semibold text-sm">
                        #{request.orderId}
                      </span>
                      <span className="text-xs text-gray-400">
                        • {formatDate(request.cancelled_at).split(' ')[0]}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <FaUser className="w-3 h-3 text-gray-400" />
                      <span className="text-sm font-medium text-gray-800">{request.userName}</span>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-red-600">
                    {formatCurrency(request.totalAmt)}
                  </span>
                </div>

                {/* Bank Info Box */}
                <div className="bg-blue-50 rounded p-3 mb-3 border border-blue-100">
                  <div className="flex items-center gap-2 mb-1">
                    <FaUniversity className="text-blue-500 w-3 h-3" />
                    <span className="text-xs font-bold text-blue-800 uppercase">
                      Thông tin chuyển khoản
                    </span>
                  </div>
                  {request.refund_info?.bank_name ? (
                    <div className="text-sm pl-5">
                      <p className="font-semibold text-gray-800">{request.refund_info.bank_name}</p>
                      <div className="flex justify-between items-center mt-0.5">
                        <p className="font-mono text-blue-700 tracking-wide">
                          {request.refund_info.account_number}
                        </p>
                        <p className="text-xs text-gray-500 uppercase">
                          {request.refund_info.account_holder}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 pl-5">Chưa cập nhật thông tin</p>
                  )}
                </div>

                {/* Reason */}
                <div className="flex items-start gap-2 mb-4 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                  <FiAlertCircle className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  <span>Lý do: {request.cancel_reason || 'Không có lý do'}</span>
                </div>

                {/* Expand Details */}
                {expandedRows[request.orderId] && (
                  <div className="mb-4">
                    <ProductDetails products={request.products} />
                  </div>
                )}

                {/* Actions Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <button
                    onClick={() => toggleRow(request.orderId)}
                    className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1"
                  >
                    {expandedRows[request.orderId] ? (
                      <>
                        Thu gọn <IoIosArrowUp />
                      </>
                    ) : (
                      <>
                        Chi tiết SP <IoIosArrowDown />
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleMarkRefunded(request.orderId)}
                    disabled={processing === request.orderId}
                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2 shadow-sm"
                  >
                    {processing === request.orderId ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <>
                        <FaCheckCircle /> Xác nhận hoàn tiền
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CancellationRequests;
