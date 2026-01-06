import React, { useState, useContext } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MyContext } from '../App';
import OtpBox from '../components/OtpBox/OtpBox';
import { verifyEmail, verifyForgotPasswordOtp, forgotPassword } from '../api/userApi';

export const Verify = () => {
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Xác định loại verify: register hoặc forgot-password
  const verifyType = searchParams.get('type') || 'register';

  const handleOtpChange = (code) => {
    setOtpCode(code);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (otpCode.length !== 6) {
      context.openAlertBox('error', 'Vui lòng nhập đủ 6 chữ số OTP');
      return;
    }

    try {
      setIsLoading(true);
      
      if (verifyType === 'register') {
        // Verify email sau khi đăng ký
        const email = localStorage.getItem('verifyEmail');
        if (!email) {
          context.openAlertBox('error', 'Phiên làm việc hết hạn. Vui lòng đăng ký lại.');
          navigate('/register');
          return;
        }
        const response = await verifyEmail(email, otpCode);
        if (response.success) {
          context.openAlertBox('success', 'Xác minh email thành công!');
          localStorage.removeItem('verifyEmail');
          navigate('/login');
        } else {
          context.openAlertBox('error', response.message || 'Xác minh thất bại');
        }
      } else if (verifyType === 'forgot-password') {
        // Verify OTP forgot password
        const email = localStorage.getItem('resetEmail');
        const response = await verifyForgotPasswordOtp({ email, otp: otpCode });
        if (response.success) {
          context.openAlertBox('success', 'Xác minh OTP thành công!');
          navigate('/reset-password');
        } else {
          context.openAlertBox('error', response.message || 'Xác minh thất bại');
        }
      }
    } catch (error) {
      context.openAlertBox('error', error.response?.data?.message || 'Xác minh thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setIsLoading(true);
      const email = verifyType === 'register' 
        ? localStorage.getItem('verifyEmail') 
        : localStorage.getItem('resetEmail');
      
      if (!email) {
        context.openAlertBox('error', 'Không tìm thấy email. Vui lòng thử lại.');
        navigate(verifyType === 'register' ? '/register' : '/login');
        return;
      }

      // Gửi lại OTP (sử dụng forgot-password API cho cả hai trường hợp)
      const response = await forgotPassword(email);
      if (response.success) {
        context.openAlertBox('success', 'OTP đã được gửi lại vào email của bạn');
      } else {
        context.openAlertBox('error', response.message || 'Không thể gửi lại OTP');
      }
    } catch (error) {
      context.openAlertBox('error', error.response?.data?.message || 'Không thể gửi lại OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="section py-10">
      <div className="container">
        <div className="card shadow-md w-[450px] m-auto rounded-md bg-white p-5 px-10">
          <h3 className="text-center text-[18px] text-black font-semibold">Xác minh OTP</h3>
          <p className="text-center text-[14px] text-gray-500 mt-2">
            Vui lòng nhập mã 6 số đã gửi đến email của bạn
          </p>

          <form onSubmit={handleSubmit} className="w-full mt-8">
            <div className="mb-6">
              <OtpBox length={6} onComplete={handleOtpChange} />
            </div>

            <div className="flex items-center w-full mt-5 mb-3">
              <Button 
                type="submit" 
                className="btn-org w-full"
                disabled={isLoading}
                sx={{
                  backgroundColor: '#ff5252',
                  color: '#fff',
                  height: 48,
                  fontSize: 15,
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#e04848',
                  },
                }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Xác minh OTP'}
              </Button>
            </div>

            <p className="text-center text-[14px] text-gray-500 mt-4">
              Không nhận được mã?{' '}
              <span 
                onClick={handleResendOTP}
                className="link text-[#ff5252] font-[600] cursor-pointer hover:underline"
              >
                Gửi lại OTP
              </span>
            </p>

            <p className="text-center mt-3">
              <span 
                onClick={() => navigate('/login')}
                className="link text-[14px] font-[600] cursor-pointer"
              >
                ← Quay lại đăng nhập
              </span>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Verify;
