import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import CircularProgress from '@mui/material/CircularProgress';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) return;

    setIsLoading(true);

    // Giả lập gọi API (Bạn có thể thay thế bằng API thật)
    setTimeout(() => {
      // TODO: Xử lý gửi OTP ở đây
      setIsLoading(false);

      // Chuyển hướng kèm theo email để trang OTP tự điền
      navigate('/verify-otp', { state: { email } });
    }, 1500);
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
          {/* Icon Circle */}
          <div className="text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiMail className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
            </div>
          </div>

          {/* Title & Desc */}
          <h1 className="text-center text-2xl md:text-[35px] font-[800] mt-4 text-gray-900">
            Quên mật khẩu?
          </h1>
          <p className="text-center text-gray-500 mt-2 mb-8 text-sm md:text-base px-4">
            Nhập email của bạn và chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu.
          </p>

          {/* Form */}
          <form className="w-full px-4 md:px-8 mt-3" onSubmit={handleSubmit}>
            <div className="form-group mb-6 w-full">
              <h4 className="text-[14px] font-[600] text-gray-700 mb-2">Email đăng ký</h4>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-[50px] border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none px-4 transition-all"
                placeholder="example@email.com"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="btn-blue btn-lg w-full !py-3 !rounded-lg !text-base !font-semibold !capitalize"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <CircularProgress size={20} color="inherit" />
                  <span>Đang gửi mã...</span>
                </div>
              ) : (
                'Gửi mã xác nhận'
              )}
            </Button>

            <div className="text-center mt-8">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-gray-600 font-[600] text-[15px] hover:text-blue-600 transition-colors"
              >
                <FiArrowLeft /> Quay lại đăng nhập
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
