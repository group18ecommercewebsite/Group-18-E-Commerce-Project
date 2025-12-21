import React, { useState, useContext } from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../App';
import OtpBox from '../components/OtpBox/OtpBox';

export const Verify = () => {
  const [otpCode, setOtpCode] = useState('');
  const context = useContext(MyContext);
  const navigate = useNavigate();

  const handleOtpChange = (code) => {
    setOtpCode(code);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (otpCode.length !== 6) {
      context.openAlertBox('error', 'Please enter complete 6-digit OTP');
      return;
    }

    // TODO: Gọi API verify OTP ở đây
    console.log('OTP submitted:', otpCode);
    context.openAlertBox('success', 'OTP verified successfully!');
    navigate('/reset-password'); // Chuyển đến trang đặt lại mật khẩu
  };

  const handleResendOTP = () => {
    // TODO: Gọi API gửi lại OTP
    context.openAlertBox('success', 'OTP has been resent to your email');
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
                Verify OTP
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
