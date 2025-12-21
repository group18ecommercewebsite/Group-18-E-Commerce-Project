import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { IoBagCheckOutline } from 'react-icons/io5';

export const Checkout = () => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Xử lý đặt hàng
    console.log('Order submitted:', formFields);
  };

  // Dữ liệu giỏ hàng mẫu
  const cartItems = [
    { id: 1, name: 'A-Line Kurti With Sh...', quantity: 1, price: 1300, image: 'https://api.spicezgold.com/download/file_1734690981297_011618e4-4682-4123-be80-1fb7737d34ad1714702040213RARERABBITMenComfortOpaqueCasualShirt1.jpg' },
    { id: 2, name: 'A-Line Kurti With Sh...', quantity: 1, price: 1300, image: 'https://api.spicezgold.com/download/file_1734690981297_011618e4-4682-4123-be80-1fb7737d34ad1714702040213RARERABBITMenComfortOpaqueCasualShirt1.jpg' },
    { id: 3, name: 'A-Line Kurti With Sh...', quantity: 1, price: 1300, image: 'https://api.spicezgold.com/download/file_1734690981297_011618e4-4682-4123-be80-1fb7737d34ad1714702040213RARERABBITMenComfortOpaqueCasualShirt1.jpg' },
    { id: 4, name: 'A-Line Kurti With Sh...', quantity: 1, price: 1300, image: 'https://api.spicezgold.com/download/file_1734690981297_011618e4-4682-4123-be80-1fb7737d34ad1714702040213RARERABBITMenComfortOpaqueCasualShirt1.jpg' },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
                    placeholder="Full Name"
                    variant="outlined"
                    size="small"
                    name="fullName"
                    value={formFields.fullName}
                    onChange={handleChange}
                  />
                </div>
                <div className="col w-[50%]">
                  <TextField
                    className="w-full"
                    placeholder="Email"
                    variant="outlined"
                    size="small"
                    name="email"
                    value={formFields.email}
                    onChange={handleChange}
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
                    placeholder="Town / City *"
                    variant="outlined"
                    size="small"
                    name="city"
                    value={formFields.city}
                    onChange={handleChange}
                  />
                </div>
                <div className="col w-[50%]">
                  <TextField
                    className="w-full"
                    placeholder="State / County *"
                    variant="outlined"
                    size="small"
                    name="state"
                    value={formFields.state}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* ZIP Code */}
              <p className="text-[14px] font-medium mb-2">Postcode / ZIP *</p>
              <div className="mb-5">
                <TextField
                  className="w-full"
                  placeholder="Zip Code"
                  variant="outlined"
                  size="small"
                  name="zipCode"
                  value={formFields.zipCode}
                  onChange={handleChange}
                />
              </div>

              {/* Phone & Email */}
              <div className="flex items-center gap-5">
                <div className="col w-[50%]">
                  <TextField
                    className="w-full"
                    placeholder="Phone Number"
                    variant="outlined"
                    size="small"
                    name="phone"
                    value={formFields.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="col w-[50%]">
                  <TextField
                    className="w-full"
                    placeholder="Email Address"
                    variant="outlined"
                    size="small"
                    name="email"
                    value={formFields.email}
                    onChange={handleChange}
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
            <div className="max-h-[280px] overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-[60px] h-[60px] rounded-md overflow-hidden border border-gray-200">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-gray-800">{item.name}</p>
                      <p className="text-[12px] text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-[14px] font-medium">₹{item.price.toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Checkout Button */}
            <Button
              type="submit"
              onClick={handleSubmit}
              className="w-full mt-5"
              sx={{
                backgroundColor: '#ff5252',
                color: '#fff',
                height: 48,
                fontSize: 14,
                fontWeight: 600,
                borderRadius: '8px',
                display: 'flex',
                gap: 1,
                textTransform: 'uppercase',
                '&:hover': {
                  backgroundColor: '#e04848',
                },
              }}
            >
              <IoBagCheckOutline className="text-[18px]" />
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
