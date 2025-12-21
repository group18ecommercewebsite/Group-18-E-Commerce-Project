import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FiUser } from 'react-icons/fi';
import { CiLocationOn } from 'react-icons/ci';
import { GoHeart } from 'react-icons/go';
import { IoBagCheckOutline } from 'react-icons/io5';
import { IoLogOutOutline } from 'react-icons/io5';
import { MyContext } from '../App';

export const Account = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [formFields, setFormFields] = useState({
    fullName: 'Kiệt Nguyễn Tuấn',
    email: 'tuankiet24022020@gmail.com',
    phone: '',
  });

  const user = {
    name: 'Kiệt Nguyễn Tuấn',
    email: 'tuankiet24022020@gmail.com',
    avatar: 'https://img.freepik.com/premium-vector/person-with-blue-shirt-that-says-name-person_1029948-7040.jpg?semt=ais_hybrid&w=740&q=80',
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Gọi API cập nhật profile
    console.log('Update profile:', formFields);
    context.openAlertBox('success', 'Profile updated successfully!');
  };

  const handleLogout = () => {
    context.setIsLogin(false);
    navigate('/login');
  };

  const menuItems = [
    { id: 'profile', label: 'My Profile', icon: <FiUser className="text-[18px]" /> },
    { id: 'address', label: 'Address', icon: <CiLocationOn className="text-[18px]" /> },
    { id: 'mylist', label: 'My List', icon: <GoHeart className="text-[18px]" /> },
    { id: 'orders', label: 'My Orders', icon: <IoBagCheckOutline className="text-[18px]" /> },
  ];

  return (
    <section className="py-10 bg-[#f5f5f5]">
      <div className="container">
        <div className="flex gap-5">
          {/* Left Sidebar */}
          <div className="w-[280px]">
            <div className="card bg-white shadow-md rounded-md p-5">
              {/* User Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-[100px] h-[100px] rounded-full bg-[#ff5252] flex items-center justify-center text-white text-[40px] font-semibold mb-3">
                  <img src={user.avatar} alt="User Avatar" className="w-full h-full rounded-full object-cover" />
                </div>
                <h3 className="text-[16px] font-semibold">{user.name}</h3>
                <p className="text-[13px] text-gray-500">{user.email}</p>
              </div>

              {/* Menu */}
              <nav className="border-t border-gray-100 pt-4">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-3 w-full px-4 py-3 text-[14px] text-left transition rounded-md
                      ${activeTab === item.id 
                        ? 'text-[#ff5252] bg-red-50 border-l-3 border-[#ff5252]' 
                        : 'text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-[14px] text-gray-700 hover:bg-gray-50 transition rounded-md mt-2"
                >
                  <IoLogOutOutline className="text-[18px]" />
                  Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1">
            <div className="card bg-white shadow-md rounded-md p-6">
              {activeTab === 'profile' && (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-[18px] font-semibold">My Profile</h2>
                    <Link to="/reset-password" className="text-[#ff5252] text-[14px] font-medium hover:underline">
                      CHANGE PASSWORD
                    </Link>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="flex gap-5 mb-5">
                      <div className="w-[50%]">
                        <TextField
                          label="Full Name"
                          variant="outlined"
                          size="small"
                          className="w-full"
                          name="fullName"
                          value={formFields.fullName}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="w-[50%]">
                        <TextField
                          label="Email"
                          variant="outlined"
                          size="small"
                          className="w-full"
                          name="email"
                          value={formFields.email}
                          onChange={handleChange}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="mb-5">
                      <TextField
                        label="Phone Number"
                        variant="outlined"
                        size="small"
                        className="w-full max-w-[300px]"
                        name="phone"
                        value={formFields.phone}
                        onChange={handleChange}
                        placeholder="+84"
                      />
                    </div>

                    <Button
                      type="submit"
                      sx={{
                        backgroundColor: '#ff5252',
                        color: '#fff',
                        height: 40,
                        px: 4,
                        fontSize: 13,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        '&:hover': {
                          backgroundColor: '#e04848',
                        },
                      }}
                    >
                      Update Profile
                    </Button>
                  </form>
                </>
              )}

              {activeTab === 'address' && (
                <>
                  <h2 className="text-[18px] font-semibold mb-6">My Addresses</h2>
                  <p className="text-gray-500">No addresses saved yet.</p>
                  {/* TODO: Thêm form thêm địa chỉ */}
                </>
              )}

              {activeTab === 'mylist' && (
                <>
                  <h2 className="text-[18px] font-semibold mb-6">My Wishlist</h2>
                  <p className="text-gray-500">Your wishlist is empty.</p>
                  {/* TODO: Hiển thị danh sách sản phẩm yêu thích */}
                </>
              )}

              {activeTab === 'orders' && (
                <>
                  <h2 className="text-[18px] font-semibold mb-6">My Orders</h2>
                  <p className="text-gray-500">You haven't placed any orders yet.</p>
                  {/* TODO: Hiển thị danh sách đơn hàng */}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Account;
