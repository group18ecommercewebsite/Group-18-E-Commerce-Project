import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Button from '@mui/material/Button';
import { FaRegEye, FaEyeSlash } from "react-icons/fa";
import { FiLock } from 'react-icons/fi';

const ChangePassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Kiểm tra nếu không có email/otp từ state, redirect về forgot password
        if (!location.state?.email) {
            navigate('/forgot-password');
        }
    }, [location, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            alert('Mật khẩu xác nhận không khớp!');
            return;
        }

        if (newPassword.length < 6) {
            alert('Mật khẩu phải có ít nhất 6 ký tự!');
            return;
        }

        // TODO: Xử lý đổi mật khẩu
        console.log('Changing password for:', location.state?.email);
        
        // Sau khi đổi mật khẩu thành công
        alert('Đổi mật khẩu thành công!');
        navigate('/login');
    };

    return (
        <section className="bg-white w-full min-h-screen flex flex-col">
            {/* Header */}
            <header className="w-full fixed top-0 left-0 px-4 py-3 flex items-center justify-between z-50 bg-white border-b border-gray-200">
                <Link to="/">
                    {/* Responsive Logo width */}
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

            {/* Main Content Wrapper */}
            <div className="flex-1 flex justify-center w-full px-4">
                {/* Thay đổi chính ở đây: 
                   - w-full max-w-[600px]: Chiếm hết chiều rộng nhưng tối đa chỉ 600px.
                   - pt-24 md:pt-32: Cách lề trên ít hơn khi ở mobile.
                */}
                <div className="loginBox card w-full max-w-[600px] pb-10 pt-24 md:pt-32 relative z-50">
                    <div className="text-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiLock className="w-8 h-8 md:w-10 md:h-10 text-purple-600" />
                        </div>
                    </div>

                    <h1 className="text-center text-2xl md:text-[35px] font-[800] mt-4">
                        Đổi mật khẩu
                    </h1>
                    <p className="text-center text-gray-600 mt-2 mb-8 text-sm md:text-base">
                        Nhập mật khẩu mới của bạn
                    </p>

                    <form className="w-full px-0 md:px-8 mt-3" onSubmit={handleSubmit}>
                        <div className="form-group mb-4 w-full">
                            <h4 className="text-[14px] font-[500] mb-1">Mật khẩu mới</h4>
                            <div className="relative w-full">
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    className="w-full h-[50px] border-2 border-[rgba(0,0,0,0.1)] rounded-md focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3 pr-12"
                                    placeholder="Nhập mật khẩu mới"
                                />
                                <Button
                                    type="button"
                                    className="!absolute top-[7px] right-[10px] z-10 !rounded-full !w-[35px] !h-[35px] !min-w-[35px] !text-gray-600"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? (
                                        <FaEyeSlash className="text-[18px]" />
                                    ) : (
                                        <FaRegEye className="text-[18px]" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="form-group mb-6 w-full">
                            <h4 className="text-[14px] font-[500] mb-1">Xác nhận mật khẩu</h4>
                            <div className="relative w-full">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full h-[50px] border-2 border-[rgba(0,0,0,0.1)] rounded-md focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3 pr-12"
                                    placeholder="Nhập lại mật khẩu mới"
                                />
                                <Button
                                    type="button"
                                    className="!absolute top-[7px] right-[10px] z-10 !rounded-full !w-[35px] !h-[35px] !min-w-[35px] !text-gray-600"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <FaEyeSlash className="text-[18px]" />
                                    ) : (
                                        <FaRegEye className="text-[18px]" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        <Button 
                            type="submit"
                            className="btn-blue btn-lg w-full !py-3 !text-base"
                        >
                            Đổi mật khẩu
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
            </div>
        </section>
    );
};

export default ChangePassword;