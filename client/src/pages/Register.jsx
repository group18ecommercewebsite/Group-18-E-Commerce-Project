import React, { useState, useContext } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { IoMdEye } from 'react-icons/io';
import { IoMdEyeOff } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import CircularProgress from '@mui/material/CircularProgress';
import { MyContext } from '../App';
import { registerUser } from '../api/userApi';

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
      context.openAlertBox("error", "Please enter your name");
      return;
    }
    if (formFields.email === '') {
      context.openAlertBox("error", "Please enter your email");
      return;
    }
    if (formFields.password === '') {
      context.openAlertBox("error", "Please enter your password");
      return;
    }
    if (formFields.password.length < 6) {
      context.openAlertBox("error", "Password must be at least 6 characters");
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
        context.openAlertBox("success", response.message || "Registration successful! Please verify your email.");
        // Lưu email để sử dụng ở trang verify
        localStorage.setItem('verifyEmail', formFields.email);
        navigate("/verify?type=register");
      } else {
        context.openAlertBox("error", response.message || "Registration failed");
      }
    } catch (error) {
      context.openAlertBox("error", error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="section py-10">
      <div className="container">
        <div className="card shadow-md w-[400px] m-auto rounded-md bg-white p-5 px-10">
          <h3 className="text-center text-[18px] text-black">Register to a new account</h3>

          <form action="" className="w-full mt-5">
            <div className="form-group w-full mb-5">
              <TextField
                type="text"
                id="name"
                label="Full Name"
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
                label="Email Id *"
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
                label="Password *"
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
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
              </Button>
            </div>

            <p className="text-center">
              Already have an account?{' '}
              <Link className="link text-[14px] font-[600] mt-3 mb-3" to="/login">
                Login
              </Link>
            </p>

            <p className="text-center font-medium mt-3 mb-3">Or continue with social account</p>

            <Button className="flex gap-3 w-full !bg-[#f1f1f1] btn-lg !text-black">
              <FcGoogle className='text-[20px]' />
              Login with Google
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;
