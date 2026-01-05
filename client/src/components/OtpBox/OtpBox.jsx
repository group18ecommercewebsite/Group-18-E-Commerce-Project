import React, { useState, useRef } from 'react';

const OtpBox = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Gọi callback khi nhập đủ
    if (onComplete) {
      const otpCode = newOtp.join('');
      onComplete(otpCode);
    }

    // Tự động chuyển sang ô tiếp theo
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < length) newOtp[index] = char;
    });
    setOtp(newOtp);

    // Gọi callback
    if (onComplete) {
      onComplete(newOtp.join(''));
    }

    const lastIndex = Math.min(pastedData.length - 1, length - 1);
    inputRefs.current[lastIndex]?.focus();
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
          className="w-[50px] h-[55px] text-center text-[22px] font-semibold border-2 border-gray-300 rounded-md 
            focus:border-[#ff5252] focus:outline-none transition-all"
        />
      ))}
    </div>
  );
};

export default OtpBox;
