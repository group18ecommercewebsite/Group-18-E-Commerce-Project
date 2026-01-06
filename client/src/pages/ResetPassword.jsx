import React, { useState, useContext } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../App';
import { resetPassword } from '../api/userApi';

const ResetPassword = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formFields, setFormFields] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const context = useContext(MyContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formFields.newPassword === '') {
      context.openAlertBox('error', 'Vui lòng nhập mật khẩu mới');
      return;
    }

    if (formFields.newPassword.length < 6) {
      context.openAlertBox('error', 'Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (formFields.confirmPassword === '') {
      context.openAlertBox('error', 'Vui lòng xác nhận mật khẩu');
      return;
    }

    if (formFields.newPassword !== formFields.confirmPassword) {
      context.openAlertBox('error', 'Mật khẩu không khớp');
      return;
    }

    try {
      setIsLoading(true);
      
      // Xác định email: ưu tiên user đã đăng nhập, nếu không thì dùng resetEmail từ forgot password flow
      let email = null;
      const isLoggedIn = context.isLogin;
      
      if (isLoggedIn && context.user?.email) {
        email = context.user.email;
      } else {
        email = localStorage.getItem('resetEmail');
      }
      
      if (!email) {
        context.openAlertBox('error', 'Phiên làm việc hết hạn. Vui lòng thử lại.');
        navigate('/login');
        return;
      }

      const response = await resetPassword({
        email,
        newPassword: formFields.newPassword,
        confirmPassword: formFields.confirmPassword,
      });

      if (response.success) {
        context.openAlertBox('success', 'Đặt lại mật khẩu thành công!');
        localStorage.removeItem('resetEmail');
        
        // Nếu đang đăng nhập thì quay về trang account, nếu không thì về login
        if (isLoggedIn) {
          navigate('/my-account');
        } else {
          navigate('/login');
        }
      } else {
        context.openAlertBox('error', response.message || 'Đặt lại mật khẩu thất bại');
      }
    } catch (error) {
      context.openAlertBox('error', error.response?.data?.message || 'Đặt lại mật khẩu thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="section py-10">
      <div className="container">
        <div className="card shadow-md w-[400px] m-auto rounded-md bg-white p-5 px-10">
          <h3 className="text-center text-[18px] text-black font-semibold">Đặt lại mật khẩu</h3>
          <p className="text-center text-[14px] text-gray-500 mt-2">
            Nhập mật khẩu mới của bạn
          </p>

          <form onSubmit={handleSubmit} className="w-full mt-5">
            <div className="form-group w-full mb-5 relative">
              <TextField
                type={isShowPassword ? 'text' : 'password'}
                id="newPassword"
                label="Mật khẩu mới *"
                variant="outlined"
                className="w-full"
                name="newPassword"
                value={formFields.newPassword}
                onChange={handleChange}
              />
              <Button
                className="!absolute top-[10px] right-[10px] z-50 !w-[35px] !h-[35px] !min-w-[35px] !rounded-full !text-black"
                onClick={() => setIsShowPassword(!isShowPassword)}
              >
                {isShowPassword ? (
                  <IoMdEyeOff className="text-[20px] opacity-75" />
                ) : (
                  <IoMdEye className="text-[20px] opacity-75" />
                )}
              </Button>
            </div>

            <div className="form-group w-full mb-5 relative">
              <TextField
                type={isShowConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                label="Xác nhận mật khẩu *"
                variant="outlined"
                className="w-full"
                name="confirmPassword"
                value={formFields.confirmPassword}
                onChange={handleChange}
              />
              <Button
                className="!absolute top-[10px] right-[10px] z-50 !w-[35px] !h-[35px] !min-w-[35px] !rounded-full !text-black"
                onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
              >
                {isShowConfirmPassword ? (
                  <IoMdEyeOff className="text-[20px] opacity-75" />
                ) : (
                  <IoMdEye className="text-[20px] opacity-75" />
                )}
              </Button>
            </div>

            <div className="flex items-center w-full mt-3 mb-3">
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
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Đặt lại mật khẩu'}
              </Button>
            </div>

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

export default ResetPassword;
