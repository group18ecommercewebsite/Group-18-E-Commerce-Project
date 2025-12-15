import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Button from '@mui/material/Button';
import { FiShield, FiMail } from 'react-icons/fi';
import OTPBox from '../../Components/OTPBox';

const VerifyOTP = () => {
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Lấy email từ state navigation hoặc từ localStorage
        const emailFromState = location.state?.email;
        if (emailFromState) {
            setEmail(emailFromState);
        } else {
            // Nếu không có email trong state, có thể lấy từ localStorage hoặc redirect về forgot password
            navigate('/forgot-password');
        }
    }, [location, navigate]);

    const handleOTPComplete = (completeOtp) => {
        setOtp(completeOtp);
    };

    const handleVerify = (e) => {
        e.preventDefault();
        if (otp.length !== 6) {
            alert('Vui lòng nhập đầy đủ 6 số OTP');
            return;
        }
        
        // TODO: Xử lý verify OTP
        console.log('Verifying OTP:', otp, 'for email:', email);
        
        // Sau khi verify thành công, chuyển đến trang đổi mật khẩu
        navigate('/change-password', { state: { email, otp } });
    };

    const handleResendOTP = () => {
        // TODO: Xử lý gửi lại OTP
        alert('Mã OTP mới đã được gửi đến email của bạn');
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
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiShield className="w-10 h-10 text-green-600" />
                    </div>
                </div>

                <h1 className="text-center text-[35px] font-[800] mt-4">
                    Xác thực OTP
                </h1>
                <p className="text-center text-gray-600 mt-2 mb-2">
                    Chúng tôi đã gửi mã OTP đến email của bạn
                </p>
                {email && (
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <FiMail className="w-4 h-4 text-gray-500" />
                        <span className="text-blue-600 font-semibold">{email}</span>
                    </div>
                )}

                <form className="w-full px-8 mt-3" onSubmit={handleVerify}>
                    <div className="form-group mb-6 w-full">
                        <OTPBox length={6} onComplete={handleOTPComplete} />
                    </div>

                    <Button 
                        type="submit"
                        className="btn-blue btn-lg w-full"
                    >
                        Verify OTP
                    </Button>

                    <div className="text-center mt-6 space-y-2">
                        <p className="text-gray-600 text-sm">
                            Không nhận được mã?{' '}
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                className="text-blue-600 font-[600] hover:underline"
                            >
                                Gửi lại mã
                            </button>
                        </p>
                        <Link
                            to="/login"
                            className="block text-blue-600 font-[600] text-[15px] hover:underline"
                        >
                            ← Quay lại đăng nhập
                        </Link>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default VerifyOTP;

