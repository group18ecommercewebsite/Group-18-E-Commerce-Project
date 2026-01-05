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
      context.openAlertBox('error', 'Please enter complete 6-digit OTP');
      return;
    }

    try {
      setIsLoading(true);
      
      if (verifyType === 'register') {
        // Verify email sau khi đăng ký
        const email = localStorage.getItem('verifyEmail');
        if (!email) {
          context.openAlertBox('error', 'Session expired. Please register again.');
          navigate('/register');
          return;
        }
        const response = await verifyEmail(email, otpCode);
        if (response.success) {
          context.openAlertBox('success', 'Email verified successfully!');
          localStorage.removeItem('verifyEmail');
          navigate('/login');
        } else {
          context.openAlertBox('error', response.message || 'Verification failed');
        }
      } else if (verifyType === 'forgot-password') {
        // Verify OTP forgot password
        const email = localStorage.getItem('resetEmail');
        const response = await verifyForgotPasswordOtp({ email, otp: otpCode });
        if (response.success) {
          context.openAlertBox('success', 'OTP verified successfully!');
          navigate('/reset-password');
        } else {
          context.openAlertBox('error', response.message || 'Verification failed');
        }
      }
    } catch (error) {
      context.openAlertBox('error', error.response?.data?.message || 'Verification failed');
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
        context.openAlertBox('error', 'Email not found. Please try again.');
        navigate(verifyType === 'register' ? '/register' : '/login');
        return;
      }

      // Gửi lại OTP (sử dụng forgot-password API cho cả hai trường hợp)
      const response = await forgotPassword(email);
      if (response.success) {
        context.openAlertBox('success', 'OTP has been resent to your email');
      } else {
        context.openAlertBox('error', response.message || 'Failed to resend OTP');
      }
    } catch (error) {
      context.openAlertBox('error', error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="section py-10">
      <div className="container">
        <div className="card shadow-md w-[450px] m-auto rounded-md bg-white p-5 px-10">
          <h3 className="text-center text-[18px] text-black font-semibold">Verify OTP</h3>
          <p className="text-center text-[14px] text-gray-500 mt-2">
            Please enter the 6-digit code sent to your email
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
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Verify OTP'}
              </Button>
            </div>

            <p className="text-center text-[14px] text-gray-500 mt-4">
              Didn't receive the code?{' '}
              <span 
                onClick={handleResendOTP}
                className="link text-[#ff5252] font-[600] cursor-pointer hover:underline"
              >
                Resend OTP
              </span>
            </p>

            <p className="text-center mt-3">
              <span 
                onClick={() => navigate('/login')}
                className="link text-[14px] font-[600] cursor-pointer"
              >
                ← Back to Login
              </span>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Verify;
