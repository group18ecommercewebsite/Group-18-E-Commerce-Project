import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import { FiMail } from 'react-icons/fi';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Xử lý gửi OTP
        // Sau khi gửi thành công, chuyển đến trang OTP
        navigate('/verify-otp', { state: { email } });
    };

    return (
        <section className="bg-white w-full min-h-screen">
            <header className="w-full fixed top-0 left-0 px-4 py-3 flex items-center justify-between z-50 bg-white border-b border-gray-200">
                <Link to="/">
                    <img src="https://ecme-react.themenate.net/img/logo/logo-light-full.png" className="w-[200px]" alt="Logo" />
                </Link>
                <Link to="/login">
                    <Button className="!round-full !text-[rgba(0,0,0,0.8)] !px-5">
                        Sign In
                    </Button>
                </Link>
            </header>

            <div className="loginBox card w-[600px] h-[auto] pb-20 mx-auto pt-32 relative z-50">
                <div className="text-center">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiMail className="w-10 h-10 text-blue-600" />
                    </div>
                </div>

                <h1 className="text-center text-[35px] font-[800] mt-4">
                    Quên mật khẩu?
                </h1>
                <p className="text-center text-gray-600 mt-2 mb-8">
                    Nhập email của bạn và chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu
                </p>

                <form className="w-full px-8 mt-3" onSubmit={handleSubmit}>
                    <div className="form-group mb-6 w-full">
                        <h4 className="text-[14px] font-[500] mb-1">Email</h4>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full h-[50px] border-2 border-[rgba(0,0,0,0.1)] rounded-md focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3"
                            placeholder="Nhập email của bạn"
                        />
                    </div>

                    <Button 
                        type="submit"
                        className="btn-blue btn-lg w-full"
                    >
                        Reset Password
                    </Button>

                    <div className="text-center mt-6">
                        <Link
                            to="/login"
                            className="text-blue-600 font-[600] text-[15px] hover:underline"
                        >
                            ← Quay lại đăng nhập
                        </Link>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default ForgotPassword;

