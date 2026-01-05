import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { IoBagCheckOutline } from 'react-icons/io5';
import CircularProgress from '@mui/material/CircularProgress';
import { MyContext } from '../App';
import { createOrder } from '../api/orderApi';
import { createSePayPayment } from '../api/paymentApi';
import { validateCoupon } from '../api/couponApi';
import { formatCurrency } from '../utils/formatCurrency';

export const Checkout = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  
  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, discountAmount, description }

  const [formFields, setFormFields] = useState({
    fullName: '',
    email: '',
    streetAddress: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
  });

  // Load user info vào form
  useEffect(() => {
    if (context.user) {
      setFormFields(prev => ({
        ...prev,
        fullName: context.user.name || '',
        email: context.user.email || '',
        phone: context.user.mobile || ''
      }));
    }
  }, [context.user]);

  // Redirect nếu chưa login
  useEffect(() => {
    if (!context.isLogin) {
      context.openAlertBox('error', 'Vui lòng đăng nhập để thanh toán');
      navigate('/login');
    }
  }, [context.isLogin]);

  // Redirect nếu giỏ hàng trống (chỉ khi không phải vừa đặt hàng thành công)
  useEffect(() => {
    if (context.isLogin && !context.cartLoading && context.cartItems.length === 0 && !orderSuccess) {
      context.openAlertBox('error', 'Giỏ hàng trống');
      navigate('/cart');
    }
  }, [context.cartItems, context.cartLoading, context.isLogin, orderSuccess]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  // Tính tổng tiền
  const subtotal = context.cartItems.reduce((sum, item) => {
    const price = item.productId?.price || 0;
    const qty = item.quantity || 1;
    return sum + (price * qty);
  }, 0);

  // Tổng sau giảm giá
  const discountAmount = appliedCoupon?.discountAmount || 0;
  const total = subtotal - discountAmount;

  // Xử lý áp dụng mã giảm giá
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      context.openAlertBox('error', 'Vui lòng nhập mã giảm giá');
      return;
    }

    try {
      setCouponLoading(true);
      const response = await validateCoupon(couponCode, subtotal);
      
      if (response.success) {
        setAppliedCoupon({
          code: response.data.code,
          discountAmount: response.data.discountAmount,
          description: response.data.description,
          discountType: response.data.discountType,
          discountValue: response.data.discountValue
        });
        context.openAlertBox('success', response.message);
      } else {
        context.openAlertBox('error', response.message);
      }
    } catch (error) {
      context.openAlertBox('error', error.response?.data?.message || 'Mã giảm giá không hợp lệ');
    } finally {
      setCouponLoading(false);
    }
  };

  // Xóa mã giảm giá
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    context.openAlertBox('info', 'Đã xóa mã giảm giá');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formFields.fullName || !formFields.email || !formFields.streetAddress || !formFields.city || !formFields.phone) {
      context.openAlertBox('error', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      setLoading(true);

      // Prepare order data
      const orderData = {
        products: context.cartItems.map(item => ({
          productId: item.productId?._id,
          name: item.productId?.name,
          image: item.productId?.images?.[0] || '',
          quantity: item.quantity,
          price: item.productId?.price
        })),
        shippingAddress: {
          fullName: formFields.fullName,
          email: formFields.email,
          phone: formFields.phone,
          address: `${formFields.streetAddress}${formFields.apartment ? ', ' + formFields.apartment : ''}`,
          city: formFields.city,
          state: formFields.state,
          zipCode: formFields.zipCode
        },
        totalAmount: total,
        subTotalAmount: subtotal,
        couponCode: appliedCoupon?.code || '',
        discountAmount: discountAmount
      };

      if (paymentMethod === 'cod') {
        // COD - Tạo order trực tiếp
        const response = await createOrder(orderData);

        if (response.success) {
          setOrderSuccess(true);
          context.openAlertBox('success', 'Đặt hàng thành công!');
          navigate('/my-orders');
          context.setCartItems([]);
        } else {
          context.openAlertBox('error', response.message || 'Đặt hàng thất bại');
        }
      } else if (paymentMethod === 'sepay') {
        // SePay - Tạo payment và redirect bằng form
        context.openAlertBox('info', 'Đang chuyển đến cổng thanh toán...');
        
        const paymentResponse = await createSePayPayment(orderData);

        if (paymentResponse.success && paymentResponse.data.checkout_url && paymentResponse.data.fields) {
          // Tạo form và submit để redirect đến SePay
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = paymentResponse.data.checkout_url;

          // Thêm các hidden fields
          Object.keys(paymentResponse.data.fields).forEach(key => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = paymentResponse.data.fields[key];
            form.appendChild(input);
          });

          document.body.appendChild(form);
          form.submit();
        } else {
          context.openAlertBox('error', paymentResponse.message || 'Không thể tạo thanh toán');
        }
      }
    } catch (error) {
      console.error('Order error:', error);
      context.openAlertBox('error', error.response?.data?.message || 'Đặt hàng thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (context.cartLoading) {
    return (
      <section className="py-10 bg-[#f5f5f5]">
        <div className="container flex justify-center items-center min-h-[400px]">
          <CircularProgress sx={{ color: '#ff5252' }} />
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-[#f5f5f5]">
      <div className="container flex gap-5">
        {/* Left Column - Billing Details */}
        <div className="leftCol w-[70%]">
          <div className="card bg-white shadow-md p-8 rounded-md w-full">
            <h1 className="text-[18px] font-semibold mb-6">Billing Details</h1>
            
            <form className="w-full" onSubmit={handleSubmit}>
              {/* Full Name & Email */}
              <div className="flex items-center gap-5 mb-5">
                <div className="col w-[50%]">
                  <TextField
                    className="w-full"
                    label="Full Name *"
                    variant="outlined"
                    size="small"
                    name="fullName"
                    value={formFields.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col w-[50%]">
                  <TextField
                    className="w-full"
                    label="Email *"
                    variant="outlined"
                    size="small"
                    name="email"
                    value={formFields.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Street Address */}
              <p className="text-[14px] font-medium mb-2">Street address *</p>
              <div className="mb-4">
                <TextField
                  className="w-full"
                  placeholder="House No. and Street Name"
                  variant="outlined"
                  size="small"
                  name="streetAddress"
                  value={formFields.streetAddress}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-5">
                <TextField
                  className="w-full"
                  placeholder="Apartment, suite, unit, etc. (optional)"
                  variant="outlined"
                  size="small"
                  name="apartment"
                  value={formFields.apartment}
                  onChange={handleChange}
                />
              </div>

              {/* Town / City & State / County */}
              <div className="flex items-center gap-5 mb-5">
                <div className="col w-[50%]">
                  <TextField
                    className="w-full"
                    label="Town / City *"
                    variant="outlined"
                    size="small"
                    name="city"
                    value={formFields.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col w-[50%]">
                  <TextField
                    className="w-full"
                    label="State / County"
                    variant="outlined"
                    size="small"
                    name="state"
                    value={formFields.state}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* ZIP Code & Phone */}
              <div className="flex items-center gap-5">
                <div className="col w-[50%]">
                  <TextField
                    className="w-full"
                    label="Postcode / ZIP"
                    variant="outlined"
                    size="small"
                    name="zipCode"
                    value={formFields.zipCode}
                    onChange={handleChange}
                  />
                </div>
                <div className="col w-[50%]">
                  <TextField
                    className="w-full"
                    label="Phone Number *"
                    variant="outlined"
                    size="small"
                    name="phone"
                    value={formFields.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="rightCol w-[30%]">
          <div className="card bg-white shadow-md p-5 rounded-md w-full sticky top-5">
            <h2 className="text-[18px] font-semibold mb-4">Your Order</h2>

            {/* Header */}
            <div className="flex justify-between border-b border-gray-200 pb-3 mb-3">
              <span className="font-medium text-[14px]">Product</span>
              <span className="font-medium text-[14px]">Subtotal</span>
            </div>

            {/* Cart Items with scroll */}
            <div className="max-h-[180px] overflow-y-auto pr-2">
              {context.cartItems.map((item) => (
                <div key={item._id} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-[45px] h-[45px] rounded-md overflow-hidden border border-gray-200">
                      <img 
                        src={item.productId?.images?.[0] || 'https://via.placeholder.com/60'} 
                        alt={item.productId?.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div>
                      <p className="text-[12px] font-medium text-gray-800 line-clamp-1 max-w-[90px]">
                        {item.productId?.name}
                      </p>
                      <p className="text-[11px] text-gray-500">x{item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-[13px] font-medium">
                    {formatCurrency((item.productId?.price || 0) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon Input */}
            <div className="border-t border-gray-200 pt-3 mt-3">
              <p className="text-[13px] font-semibold mb-2">🎟️ Mã giảm giá</p>
              {appliedCoupon ? (
                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] font-bold text-green-700">✅ {appliedCoupon.code}</span>
                    <button 
                      onClick={handleRemoveCoupon}
                      className="text-[11px] text-red-500 hover:text-red-700"
                    >
                      Xóa
                    </button>
                  </div>
                  <p className="text-[12px] text-green-600 font-medium">
                    {appliedCoupon.discountType === 'percentage' 
                      ? `Giảm ${appliedCoupon.discountValue}%` 
                      : `Giảm ${formatCurrency(appliedCoupon.discountValue)}`}
                  </p>
                  <div className="text-[10px] text-gray-500 mt-1 space-y-0.5">
                    {appliedCoupon.minOrderAmount > 0 && (
                      <p>• Đơn tối thiểu: {formatCurrency(appliedCoupon.minOrderAmount)}</p>
                    )}
                    {appliedCoupon.discountType === 'percentage' && appliedCoupon.maxDiscountAmount > 0 && (
                      <p>• Giảm tối đa: {formatCurrency(appliedCoupon.maxDiscountAmount)}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nhập mã..."
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 px-3 py-2 text-[12px] border border-gray-300 rounded-md focus:outline-none focus:border-[#ff5252]"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                    className="px-3 py-2 text-[12px] bg-[#ff5252] text-white rounded-md hover:bg-[#e04848] disabled:bg-gray-300"
                  >
                    {couponLoading ? '...' : 'Áp dụng'}
                  </button>
                </div>
              )}
            </div>

            {/* Order Breakdown */}
            <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-600">Tạm tính</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[13px] text-green-600">
                  <span>Giảm giá</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold pt-2 border-t border-gray-100">
                <span className="text-[15px]">Tổng cộng</span>
                <span className="text-[16px] text-[#ff5252]">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <p className="text-[14px] font-semibold mb-3">Payment Method</p>
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel 
                  value="cod" 
                  control={<Radio size="small" sx={{ color: '#ff5252', '&.Mui-checked': { color: '#ff5252' } }} />} 
                  label={
                    <div className="flex items-center gap-2">
                      <span className="text-[13px]">💵 Cash On Delivery (COD)</span>
                    </div>
                  }
                />
                <FormControlLabel 
                  value="sepay" 
                  control={<Radio size="small" sx={{ color: '#ff5252', '&.Mui-checked': { color: '#ff5252' } }} />} 
                  label={
                    <div className="flex items-center gap-2">
                      <span className="text-[13px]">💳 SePay (VietQR / Card)</span>
                      <span className="text-[10px] text-purple-600 bg-purple-50 px-1 rounded">Online</span>
                    </div>
                  }
                />
              </RadioGroup>
              
              {paymentMethod === 'sepay' && (
                <div className="mt-2 p-2 bg-blue-50 rounded text-[11px] text-blue-700">
                  ⚠️ Bạn sẽ được chuyển đến cổng thanh toán SePay để hoàn tất
                </div>
              )}
            </div>

            {/* Checkout Button */}
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={loading || context.cartItems.length === 0}
              className="w-full mt-5"
              sx={{
                backgroundColor: paymentMethod === 'sepay' ? '#7c3aed' : '#ff5252',
                color: '#fff',
                height: 48,
                fontSize: 14,
                fontWeight: 600,
                borderRadius: '8px',
                display: 'flex',
                gap: 1,
                textTransform: 'uppercase',
                '&:hover': {
                  backgroundColor: paymentMethod === 'sepay' ? '#6d28d9' : '#e04848',
                },
                '&:disabled': {
                  backgroundColor: '#ccc',
                  color: '#fff',
                },
              }}
            >
              {loading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                <>
                  <IoBagCheckOutline className="text-[18px]" />
                  {paymentMethod === 'cod' ? 'Place Order' : 'Pay with SePay'}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
