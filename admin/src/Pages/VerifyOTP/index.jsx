import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import { FiShield, FiMail, FiArrowLeft } from 'react-icons/fi';
import CircularProgress from '@mui/material/CircularProgress';
import OTPBox from '../../Components/OTPBox';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30); // Đếm ngược 30s
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  // Lấy email và setup timer
  useEffect(() => {
    const emailFromState = location.state?.email;
    if (emailFromState) {
      setEmail(emailFromState);
    } else {
      navigate('/forgot-password');
    }
  }, [location, navigate]);

  // Xử lý đếm ngược
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOTPComplete = (completeOtp) => {
    setOtp(completeOtp);
    setError(''); // Xóa lỗi khi nhập đủ
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setError('Vui lòng nhập đầy đủ 6 số OTP');
      return;
    }

    setLoading(true);
    setError('');

    // Giả lập gọi API verify
    setTimeout(() => {
      // TODO: Thay bằng logic API thực tế
      console.log('Verifying OTP:', otp, 'for email:', email);

      // Nếu thành công
      setLoading(false);
      navigate('/change-password', { state: { email, otp } });

      // Nếu thất bại: setError('Mã OTP không chính xác');
    }, 1500);
  };

  const handleResendOTP = () => {
    setLoading(true);
    // Giả lập gửi lại OTP
    setTimeout(() => {
      setLoading(false);
      setTimer(30); // Reset timer
      alert('Mã OTP mới đã được gửi!');
    }, 1000);
  };

  return (
    <section className="bg-white w-full min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full fixed top-0 left-0 px-4 py-3 flex items-center justify-between z-50 bg-white border-b border-gray-200">
        <Link to="/">
          <img
            src="https://ecme-react.themenate.net/img/logo/logo-light-full.png"
            className="w-[150px] md:w-[200px]"
            alt="Logo"
          />
        </Link>
        <Link to="/login">
          <Button className="!rounded-full !text-[rgba(0,0,0,0.8)] !px-4 md:!px-5 !text-sm md:!text-base">
            Sign In
          </Button>
        </Link>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex justify-center w-full px-4">
        <div className="loginBox card w-full max-w-[600px] h-auto pb-10 pt-24 md:pt-32 relative z-50">
          {/* Icon */}
          <div className="text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiShield className="w-8 h-8 md:w-10 md:h-10 text-green-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-center text-2xl md:text-[35px] font-[800] mt-4 text-gray-900">
            Xác thực OTP
          </h1>
          <p className="text-center text-gray-500 mt-2 mb-2 text-sm md:text-base px-4">
            Chúng tôi đã gửi mã OTP gồm 6 chữ số đến email của bạn.
          </p>

          {/* Email Display */}
          {email && (
            <div className="flex items-center justify-center gap-2 mb-8 bg-blue-50 py-2 px-4 rounded-full w-fit mx-auto">
              <FiMail className="w-4 h-4 text-blue-500" />
              <span className="text-blue-700 font-semibold text-sm">{email}</span>
            </div>
          )}

          {/* Form */}
          <form className="w-full px-4 md:px-8 mt-3" onSubmit={handleVerify}>
            {/* OTP Input Component */}
            <div className="form-group mb-6 w-full flex justify-center">
              <OTPBox length={6} onComplete={handleOTPComplete} />
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-center mb-4 text-red-500 text-sm font-medium bg-red-50 py-1 rounded">
                {error}
              </div>
            )}

            {/* Verify Button */}
            <Button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="btn-blue btn-lg w-full !py-3 !rounded-lg !text-base !font-semibold !capitalize"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <CircularProgress size={20} color="inherit" />
                  <span>Đang xác thực...</span>
                </div>
              ) : (
                'Xác thực OTP'
              )}
            </Button>

            {/* Resend & Back Links */}
            <div className="text-center mt-8 space-y-4">
              <div className="text-gray-600 text-sm">
                Không nhận được mã?{' '}
                {timer > 0 ? (
                  <span className="text-gray-400 font-medium">Gửi lại sau {timer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="text-blue-600 font-[700] hover:underline cursor-pointer"
                  >
                    Gửi lại mã
                  </button>
                )}
              </div>

              <div>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-gray-600 font-[600] text-[15px] hover:text-blue-600 transition-colors"
                >
                  <FiArrowLeft /> Quay lại đăng nhập
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default VerifyOTP;
