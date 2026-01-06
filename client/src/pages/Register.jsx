import React, { useState, useContext } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { IoMdEye } from 'react-icons/io';
import { IoMdEyeOff } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import CircularProgress from '@mui/material/CircularProgress';
import { MyContext } from '../App';
import { registerUser, googleLogin } from '../api/userApi';

const Register = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formFields, setFormFields] = useState({
    name: '',
    email: '',
    password: '',
  });

  const context = useContext(MyContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formFields.name === '') {
      context.openAlertBox("error", "Vui lòng nhập họ tên");
      return;
    }
    if (formFields.email === '') {
      context.openAlertBox("error", "Vui lòng nhập email");
      return;
    }
    if (formFields.password === '') {
      context.openAlertBox("error", "Vui lòng nhập mật khẩu");
      return;
    }
    if (formFields.password.length < 6) {
      context.openAlertBox("error", "Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    try {
      setIsLoading(true);
      const response = await registerUser({
        name: formFields.name,
        email: formFields.email,
        password: formFields.password,
      });

      if (response.success) {
        context.openAlertBox("success", response.message || "Đăng ký thành công! Vui lòng xác minh email.");
        // Lưu email để sử dụng ở trang verify
        localStorage.setItem('verifyEmail', formFields.email);
        navigate("/verify?type=register");
      } else {
        context.openAlertBox("error", response.message || "Đăng ký thất bại");
      }
    } catch (error) {
      context.openAlertBox("error", error.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);
      const response = await googleLogin(credentialResponse.credential);

      if (response.success) {
        // Lưu access token và thông tin user
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Cập nhật global state
        context.setUser(response.data.user);
        context.setIsLogin(true);
        context.openAlertBox("success", "Đăng ký với Google thành công!");
        navigate("/");
      } else {
        context.openAlertBox("error", response.message || "Đăng ký với Google thất bại");
      }
    } catch (error) {
      context.openAlertBox("error", error.response?.data?.message || "Đăng ký với Google thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginError = () => {
    context.openAlertBox("error", "Đăng ký với Google thất bại. Vui lòng thử lại.");
  };

  return (
    <section className="section py-10">
      <div className="container">
        <div className="card shadow-md w-[400px] m-auto rounded-md bg-white p-5 px-10">
          <h3 className="text-center text-[18px] text-black">Đăng ký tài khoản mới</h3>

          <form action="" className="w-full mt-5">
            <div className="form-group w-full mb-5">
              <TextField
                type="text"
                id="name"
                label="Họ và tên"
                variant="outlined"
                className="w-full"
                name="name"
                value={formFields.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group w-full mb-5">
              <TextField
                type="email"
                id="email"
                label="Email *"
                variant="outlined"
                className="w-full"
                name="email"
                value={formFields.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group w-full mb-5 relative">
              <TextField
                type={isShowPassword === false ? 'password' : 'text'}
                id="password"
                label="Mật khẩu *"
                variant="outlined"
                className="w-full"
                name="password"
                value={formFields.password}
                onChange={handleChange}
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

            <div className="flex items-center w-full mt-3 mb-3">
              <Button 
                className="btn-org w-full"
                onClick={handleRegister}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Đăng ký'}
              </Button>
            </div>

            <p className="text-center">
              Đã có tài khoản?{' '}
              <Link className="link text-[14px] font-[600] mt-3 mb-3" to="/login">
                Đăng nhập
              </Link>
            </p>

            <p className="text-center font-medium mt-3 mb-3">Hoặc tiếp tục với mạng xã hội</p>

            <div className="flex justify-center w-full">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginError}
                useOneTap
                theme="outline"
                size="large"
                width="320"
                text="signup_with"
                shape="rectangular"
              />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;
