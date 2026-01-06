import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { MyContext } from '../App';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { IoArrowForward } from 'react-icons/io5';
import apiClient from '../api/apiClient';

export const VNPayReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const context = useContext(MyContext);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const processResult = async () => {
      try {
        // Lấy all query params và gửi đến backend để verify
        const queryString = window.location.search;
        
        console.log('VNPay return - calling backend with query:', queryString);

        // Gọi backend API để verify và cập nhật order
        const response = await apiClient.get(`/payment/vnpay/return${queryString}`);
        
        console.log('VNPay return - backend response:', response.data);

        if (response.data.success && response.data.code === '00') {
          // Thanh toán thành công
          setResult({
            success: true,
            orderId: response.data.data?.orderId,
            transactionNo: response.data.data?.transactionNo,
            amount: response.data.data?.amount,
            message: 'Thanh toán thành công!'
          });
          // Clear cart
          context.setCartItems([]);
        } else {
          // Thanh toán thất bại
          const errorMessages = {
            '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ.',
            '09': 'Thẻ/Tài khoản chưa đăng ký InternetBanking.',
            '10': 'Xác thực thông tin thẻ không đúng quá 3 lần.',
            '11': 'Đã hết hạn chờ thanh toán.',
            '12': 'Thẻ/Tài khoản bị khóa.',
            '13': 'Nhập sai mật khẩu OTP.',
            '24': 'Giao dịch bị hủy.',
            '51': 'Tài khoản không đủ số dư.',
            '65': 'Vượt quá hạn mức giao dịch trong ngày.',
            '75': 'Ngân hàng thanh toán đang bảo trì.',
            '79': 'Nhập sai mật khẩu thanh toán quá số lần.',
            '97': 'Chữ ký không hợp lệ.',
            '99': 'Lỗi không xác định.'
          };

          const responseCode = response.data.code || searchParams.get('vnp_ResponseCode');
          setResult({
            success: false,
            orderId: response.data.data?.orderId || searchParams.get('vnp_TxnRef'),
            responseCode,
            message: errorMessages[responseCode] || response.data.message || 'Thanh toán không thành công'
          });
        }
      } catch (error) {
        console.error('VNPay return error:', error);
        setResult({
          success: false,
          message: error.response?.data?.message || 'Có lỗi xảy ra khi xử lý kết quả thanh toán'
        });
      } finally {
        setLoading(false);
      }
    };

    processResult();
  }, [searchParams]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (loading) {
    return (
      <section className="py-20 bg-[#f5f5f5] min-h-screen">
        <div className="container flex flex-col justify-center items-center">
          <CircularProgress sx={{ color: '#2563eb' }} size={50} />
          <p className="mt-4 text-gray-600">Đang xử lý kết quả thanh toán...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-[#f5f5f5] min-h-screen">
      <div className="container max-w-[500px] mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 text-center">
          {result?.success ? (
            <>
              {/* Success Icon */}
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                <FaCheckCircle className="text-green-500 text-4xl" />
              </div>
              
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Thanh toán thành công!
              </h1>
              <p className="text-gray-600 mb-6">
                Cảm ơn bạn đã mua hàng tại HUSTSHOP
              </p>

              {/* Order Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600 text-sm">Mã đơn hàng:</span>
                  <span className="font-semibold text-blue-600">{result.orderId}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600 text-sm">Mã giao dịch VNPay:</span>
                  <span className="font-semibold">{result.transactionNo}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600 text-sm">Số tiền:</span>
                  <span className="font-bold text-lg text-green-600">
                    {formatCurrency(result.amount)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/my-orders"
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  Xem đơn hàng <IoArrowForward />
                </Link>
                <Link
                  to="/"
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Trang chủ
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* Error Icon */}
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
                <FaTimesCircle className="text-red-500 text-4xl" />
              </div>
              
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Thanh toán thất bại
              </h1>
              <p className="text-gray-600 mb-4">
                {result?.message || 'Giao dịch không thành công'}
              </p>

              {result?.orderId && (
                <p className="text-sm text-gray-500 mb-6">
                  Mã đơn hàng: <span className="font-semibold">{result.orderId}</span>
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/checkout"
                  className="flex-1 bg-red-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-600 transition"
                >
                  Thử lại
                </Link>
                <Link
                  to="/cart"
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Quay lại giỏ hàng
                </Link>
              </div>
            </>
          )}
        </div>

        {/* VNPay Badge */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            Thanh toán được bảo mật bởi
          </p>
          <p className="text-sm font-semibold text-blue-600 mt-1">
            🏦 VNPay
          </p>
        </div>
      </div>
    </section>
  );
};

export default VNPayReturn;
