import React, { useState } from 'react';
import { CgLogIn } from 'react-icons/cg';
import { FaRegUser, FaRegEye, FaEyeSlash } from 'react-icons/fa';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { FcGoogle } from 'react-icons/fc';
import { BsFacebook } from 'react-icons/bs';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../../Context/AuthContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingFb, setLoadingFb] = useState(false);

  function handleClickGoogle() {
    setLoadingGoogle(true);
    // Giả lập login google
    setTimeout(() => setLoadingGoogle(false), 2000);
  }

  function handleClickFb() {
    setLoadingFb(true);
    // Giả lập login fb
    setTimeout(() => setLoadingFb(false), 2000);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.');
      }
    } catch (err) {
      setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white w-full min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full fixed top-0 left-0 px-4 py-3 flex items-center justify-between z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <Link to="/">
          <img
            src="https://ecme-react.themenate.net/img/logo/logo-light-full.png"
            className="w-[140px] md:w-[200px]"
            alt="Logo"
          />
        </Link>

        <div className="flex items-center gap-2">
          <NavLink
            to="/login"
            className={({ isActive }) => (isActive ? 'text-blue-600' : 'text-gray-600')}
          >
            <Button className="!rounded-full !text-inherit !px-3 md:!px-5 flex gap-1 !text-sm md:!text-base !normal-case">
              <CgLogIn className="text-[18px]" />
              <span className="hidden sm:inline">Login</span>
            </Button>
          </NavLink>

          <NavLink
            to="/sign-up"
            className={({ isActive }) => (isActive ? 'text-blue-600' : 'text-gray-600')}
          >
            <Button className="!rounded-full !text-inherit !px-3 md:!px-5 flex gap-1 !text-sm md:!text-base !normal-case">
              <FaRegUser className="text-[15px]" />
              <span className="hidden sm:inline">Sign up</span>
            </Button>
          </NavLink>
        </div>
      </header>

      {/* Background Image Overlay (Optional) */}
      <div className="fixed top-0 left-0 w-full h-full bg-gray-50 -z-10"></div>

      {/* Main Content */}
      <div className="flex-1 flex justify-center px-4 w-full">
        <div className="loginBox card w-full max-w-[550px] bg-white rounded-xl shadow-xl border border-gray-100 p-6 md:p-10 mt-24 mb-10 relative z-10 h-fit">
          <div className="text-center mb-6">
            <img src="/icon.svg" className="m-auto w-12 h-12" alt="Icon" />
            <h1 className="text-center text-2xl md:text-[30px] font-[800] mt-4 text-gray-900 leading-tight">
              Welcome Back! <br />
              <span className="text-base md:text-lg font-normal text-gray-500">
                Sign in with your credentials.
              </span>
            </h1>
          </div>

          {/* Social Login Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center w-full gap-3 mb-6">
            <Button
              onClick={handleClickGoogle}
              disabled={loadingGoogle || loadingFb}
              variant="outlined"
              className="!w-full !border-gray-200 !py-2.5 !text-gray-700 !bg-white hover:!bg-gray-50 !capitalize !font-medium !rounded-lg flex items-center gap-2"
            >
              {loadingGoogle ? (
                <CircularProgress size={20} />
              ) : (
                <FcGoogle className="text-[24px]" />
              )}
              <span>Google</span>
            </Button>

            <Button
              onClick={handleClickFb}
              disabled={loadingGoogle || loadingFb}
              variant="outlined"
              className="!w-full !border-gray-200 !py-2.5 !text-gray-700 !bg-white hover:!bg-gray-50 !capitalize !font-medium !rounded-lg flex items-center gap-2"
            >
              {loadingFb ? (
                <CircularProgress size={20} />
              ) : (
                <BsFacebook className="text-[22px] text-[#1877F2]" />
              )}
              <span>Facebook</span>
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-[1px] w-full bg-gray-200"></div>
            <span className="text-sm text-gray-500 whitespace-nowrap px-2">Or with email</span>
            <div className="h-[1px] w-full bg-gray-200"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full">
            {error && (
              <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-center gap-2">
                ⚠️ {error}
              </div>
            )}

            <div className="form-group mb-4 w-full">
              <label className="text-[14px] font-[600] text-gray-700 mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-[45px] border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none px-4 transition-all"
                placeholder="admin@example.com"
              />
            </div>

            <div className="form-group mb-5 w-full">
              <label className="text-[14px] font-[600] text-gray-700 mb-1 block">Password</label>
              <div className="relative w-full">
                <input
                  type={isPasswordShow ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-[45px] border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none px-4 pr-12 transition-all"
                  placeholder="Nhập mật khẩu"
                />
                <button
                  type="button"
                  className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-500 hover:text-blue-600 transition-colors p-1"
                  onClick={() => setIsPasswordShow(!isPasswordShow)}
                >
                  {isPasswordShow ? <FaEyeSlash size={18} /> : <FaRegEye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
              <FormControlLabel
                control={<Checkbox defaultChecked size="small" style={{ color: '#2563eb' }} />}
                label={<span className="text-sm text-gray-600">Remember me</span>}
                className="!m-0"
              />

              <Link
                to="/forgot-password"
                className="text-blue-600 font-[600] text-sm hover:underline hover:text-blue-800"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="btn-blue btn-lg w-full !py-3 !rounded-lg !text-base !font-bold !capitalize !bg-blue-600 !text-white hover:!bg-blue-700 !shadow-md hover:!shadow-lg transition-all"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <CircularProgress size={20} color="inherit" />
                  <span>Đang đăng nhập...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
