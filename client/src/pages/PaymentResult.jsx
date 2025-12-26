import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { MyContext } from '../App';
import { confirmPayment } from '../api/paymentApi';

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const context = useContext(MyContext);
  
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);

  const orderId = searchParams.get('orderId');
  const urlStatus = searchParams.get('status');

  useEffect(() => {
    const processPayment = async () => {
      // Nếu thanh toán thành công, gọi API confirm để update status
      if (urlStatus === 'success' && orderId) {
        try {
          await confirmPayment(orderId);
          setConfirmed(true);
          console.log('✅ Payment confirmed for order:', orderId);
        } catch (error) {
          console.error('Error confirming payment:', error);
          // Vẫn hiển thị success vì SePay đã xác nhận
          setConfirmed(true);
        }
        
        // Clear cart
        if (context && context.setCartItems) {
          context.setCartItems([]);
        }
      }
      
      setLoading(false);
    };

    // Đợi 1 giây rồi xử lý
    const timer = setTimeout(processPayment, 1000);
    return () => clearTimeout(timer);
  }, [urlStatus, orderId, context]);

  if (loading) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <CircularProgress style={{ color: '#ff5252' }} />
          <p style={{ marginTop: '15px', color: '#666' }}>Đang xác nhận thanh toán...</p>
        </div>
      </div>
    );
  }

  // Success
  if (urlStatus === 'success') {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            margin: '0 auto 20px', 
            borderRadius: '50%', 
            background: '#dcfce7', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <span style={{ fontSize: '40px', color: '#22c55e' }}>✓</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>Thanh toán thành công!</h1>
          <p style={{ color: '#666', marginBottom: '20px' }}>Đơn hàng của bạn đã được xác nhận.</p>
          
          <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>Mã đơn hàng:</strong> {orderId}
            </p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>Trạng thái:</strong> <span style={{ color: '#22c55e', fontWeight: 'bold' }}>Đã thanh toán</span>
            </p>
          </div>

          <Link to="/my-orders" style={{ textDecoration: 'none', display: 'block', marginBottom: '10px' }}>
            <Button 
              variant="contained" 
              fullWidth
              style={{ backgroundColor: '#ff5252', padding: '12px' }}
            >
              Xem đơn hàng
            </Button>
          </Link>
          <Link to="/" style={{ textDecoration: 'none', display: 'block' }}>
            <Button variant="outlined" fullWidth style={{ padding: '12px' }}>
              Tiếp tục mua sắm
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Failed
  if (urlStatus === 'failed') {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            margin: '0 auto 20px', 
            borderRadius: '50%', 
            background: '#fee2e2', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <span style={{ fontSize: '40px', color: '#ef4444' }}>✕</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>Thanh toán thất bại</h1>
          <p style={{ color: '#666', marginBottom: '20px' }}>Giao dịch không thành công. Vui lòng thử lại.</p>
          
          <Link to="/cart" style={{ textDecoration: 'none' }}>
            <Button 
              variant="contained" 
              fullWidth
              style={{ backgroundColor: '#ff5252', padding: '12px' }}
            >
              Quay lại giỏ hàng
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // No status
  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '20px', marginBottom: '20px' }}>Không tìm thấy thông tin thanh toán</h1>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Button variant="contained" style={{ backgroundColor: '#ff5252' }}>
            Về trang chủ
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentResult;
