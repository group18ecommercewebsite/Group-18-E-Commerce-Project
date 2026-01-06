import React, { useState, useContext } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { IoMdEye } from 'react-icons/io';
import { IoMdEyeOff } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import CircularProgress from '@mui/material/CircularProgress';
import { MyContext } from '../App';
import { loginUser, forgotPassword } from '../api/userApi';

const Login = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formFields, setFormFields] = useState({
    email: '',
    password: '',
  });

  const context = useContext(MyContext);
  const history = useNavigate();

  const forgetPassword = async (e) => {
    e.preventDefault();
    if (formFields.email === '') {
      context.openAlertBox("error", "Vui lòng nhập email để đặt lại mật khẩu");
      return;
    }

    try {
      setIsLoading(true);
      const response = await forgotPassword(formFields.email);
      if (response.success) {
        context.openAlertBox("success", response.message || `OTP sent to ${formFields.email}`);
        // Lưu email để sử dụng ở trang verify
        localStorage.setItem('resetEmail', formFields.email);
        history("/verify?type=forgot-password");
      } else {
        context.openAlertBox("error", response.message || "Failed to send OTP");
      }
    } catch (error) {
      context.openAlertBox("error", error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (formFields.email === '') {
      context.openAlertBox("error", "Vui lòng nhập email");
      return;
    }
    if (formFields.password === '') {
      context.openAlertBox("error", "Vui lòng nhập mật khẩu");
      return;
    }

    try {
      setIsLoading(true);
      const response = await loginUser({
        email: formFields.email,
        password: formFields.password,
      });

      if (response.success) {
        // Lưu access token và thông tin user
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Cập nhật global state
        context.setUser(response.data.user);
        context.setIsLogin(true);
        context.openAlertBox("success", "Đăng nhập thành công!");
        history("/");
      } else {
        context.openAlertBox("error", response.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      context.openAlertBox("error", error.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="section py-10">
      <div className="container">
        <div className="card shadow-md w-[400px] m-auto rounded-md bg-white p-5 px-10">
          <h3 className="text-center text-[18px] text-black">Đăng nhập tài khoản</h3>

          <form action="" className="w-full mt-5">
            <div className="form-group w-full mb-5">
              <TextField
                type="email"
                id="email"
                label="Email *"
                variant="outlined"
                className="w-full"
                name='email'
                value={formFields.email}
                onChange={(e) => setFormFields({ ...formFields, email: e.target.value })}
              />
            </div>

            <div className="form-group w-full mb-5 relative">
              <TextField
                type={isShowPassword === false ? 'password' : 'text'}
                id="password"
                label="Mật khẩu *"
                variant="outlined"
                className="w-full"
                name='password'
                value={formFields.password}
                onChange={(e) => setFormFields({ ...formFields, password: e.target.value })}
              />
              <Button
                className="!absolute top-[10px] right-[10px] z-50 !w-[35px] !h-[35px] !min-w-[35px] !rounded-full !text-black"
                onClick={() => {
                  setIsShowPassword(!isShowPassword);
                }}
              >
                {isShowPassword === false ? (
                  <IoMdEye className="text-[20px] opacity-75" />
                ) : (
                  <IoMdEyeOff className="text-[20px] opacity-75" />
                )}
              </Button>
            </div>

            <a href="" className="link cursor-pointer text-[14px] font-[600]" onClick={forgetPassword}>
              Quên mật khẩu?
            </a>

            <div className="flex items-center w-full mt-3 mb-3">
              <Button 
                className="btn-org w-full" 
                onClick={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Đăng nhập'}
              </Button>
            </div>

            <p className="text-center">
              Chưa có tài khoản?{' '}
              <Link className="link text-[14px] font-[600] mt-3 mb-3" to="/register">
                Đăng ký
              </Link>
            </p>

            <p className="text-center font-medium mt-3 mb-3">Hoặc tiếp tục với mạng xã hội</p>

            <Button className="flex gap-3 w-full !bg-[#f1f1f1] btn-lg !text-black">
              <FcGoogle className='text-[20px]' />
              Đăng nhập với Google
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
