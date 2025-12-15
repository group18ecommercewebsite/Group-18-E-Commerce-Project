import React, { useRef, useState, useEffect } from 'react';

const OTPBox = ({ length = 6, onComplete }) => {
    const [otp, setOtp] = useState(Array(length).fill(''));
    const inputRefs = useRef([]);

    useEffect(() => {
        // Focus vào input đầu tiên khi component mount
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (index, value) => {
        // Chỉ cho phép số
        if (value && !/^\d+$/.test(value)) {
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Chỉ lấy ký tự cuối cùng
        setOtp(newOtp);

        // Tự động chuyển sang ô tiếp theo
        if (value && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        // Kiểm tra nếu đã nhập đủ
        if (newOtp.every(digit => digit !== '') && newOtp.join('').length === length) {
            onComplete?.(newOtp.join(''));
        }
    };

    const handleKeyDown = (index, e) => {
        // Xử lý phím Backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, length);
        const newOtp = Array(length).fill('');
        
        for (let i = 0; i < pastedData.length && i < length; i++) {
            if (/^\d+$/.test(pastedData[i])) {
                newOtp[i] = pastedData[i];
            }
        }
        
        setOtp(newOtp);
        
        // Focus vào ô cuối cùng đã nhập
        const lastIndex = Math.min(pastedData.length - 1, length - 1);
        inputRefs.current[lastIndex]?.focus();
        
        // Kiểm tra nếu đã nhập đủ
        if (newOtp.every(digit => digit !== '') && newOtp.join('').length === length) {
            onComplete?.(newOtp.join(''));
        }
    };

    return (
        <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
                <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                />
            ))}
        </div>
    );
};

export default OTPBox;

