import React, { useState, useEffect } from 'react';
import { MdLocalOffer, MdContentCopy, MdCheck } from 'react-icons/md';
import CircularProgress from '@mui/material/CircularProgress';
import { getActiveCoupons } from '../api/couponApi';

const CouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await getActiveCoupons();
      if (response.success) {
        setCoupons(response.data);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value) + '₫';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <CircularProgress sx={{ color: '#ff5252' }} />
      </div>
    );
  }

  return (
    <section className="py-10">
      <div className="container">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <MdLocalOffer className="text-3xl text-[#ff5252]" />
          <h1 className="text-2xl font-bold">Mã Giảm Giá</h1>
        </div>

        {coupons.length === 0 ? (
          <div className="text-center py-20">
            <MdLocalOffer className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Hiện không có mã giảm giá nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((coupon) => (
              <div 
                key={coupon._id} 
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
              >
                {/* Coupon Header */}
                <div className="bg-gradient-to-r from-[#ff5252] to-[#ff7b7b] text-white p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xl tracking-wider">{coupon.code}</span>
                    <button
                      onClick={() => copyCode(coupon.code)}
                      className="flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-sm hover:bg-white/30 transition-colors"
                    >
                      {copiedCode === coupon.code ? (
                        <>
                          <MdCheck className="text-lg" />
                          Đã sao chép
                        </>
                      ) : (
                        <>
                          <MdContentCopy className="text-lg" />
                          Sao chép
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Coupon Body */}
                <div className="p-4">
                  {/* Discount Value */}
                  <div className="text-center mb-4">
                    <span className="text-3xl font-bold text-[#ff5252]">
                      {coupon.discountType === 'percentage' 
                        ? `Giảm ${coupon.discountValue}%` 
                        : `Giảm ${formatCurrency(coupon.discountValue)}`}
                    </span>
                  </div>

                  {/* Description */}
                  {coupon.description && (
                    <p className="text-gray-600 text-sm text-center mb-4">{coupon.description}</p>
                  )}

                  {/* Conditions */}
                  <div className="space-y-2 text-sm text-gray-500">
                    {coupon.minOrderAmount > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#ff5252] rounded-full"></span>
                        <span>Đơn tối thiểu: <strong className="text-gray-700">{formatCurrency(coupon.minOrderAmount)}</strong></span>
                      </div>
                    )}
                    {coupon.discountType === 'percentage' && coupon.maxDiscountAmount > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#ff5252] rounded-full"></span>
                        <span>Giảm tối đa: <strong className="text-gray-700">{formatCurrency(coupon.maxDiscountAmount)}</strong></span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                      <span>Hết hạn: <strong className="text-gray-700">{formatDate(coupon.endDate)}</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CouponsPage;
