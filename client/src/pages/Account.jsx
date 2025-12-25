import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FiUser } from 'react-icons/fi';
import { GoHeart } from 'react-icons/go';
import { IoBagCheckOutline } from 'react-icons/io5';
import { IoLogOutOutline } from 'react-icons/io5';
import { MyContext } from '../App';
import { getUserDetails, updateUser, logoutUser } from '../api/userApi';
import CircularProgress from '@mui/material/CircularProgress';

export const Account = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formFields, setFormFields] = useState({
    name: '',
    email: '',
    mobile: '',
  });

  // Lấy user từ localStorage ban đầu
  const storedUser = localStorage.getItem('user');
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);

  // Fetch user details từ API khi component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!context.isLogin) {
        setLoading(false);
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const response = await getUserDetails();
        if (response.success && response.data) {
          const userData = response.data;
          setUser(userData);
          setFormFields({
            name: userData.name || '',
            email: userData.email || '',
            mobile: userData.mobile || '',
          });
          // Update localStorage với data mới từ API
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } catch (error) {
        console.error('Failed to fetch user details:', error);
        context.openAlertBox('error', 'Không thể tải thông tin người dùng');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [context.isLogin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      const response = await updateUser({
        name: formFields.name,
        mobile: formFields.mobile,
        email: formFields.email
      });
      
      if (response.success) {
        context.openAlertBox('success', 'Cập nhật profile thành công!');
        // Update localStorage và global context với data mới
        const updatedUser = response.user || { ...user, ...formFields };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        // Cập nhật global context để Header cập nhật ngay
        context.setUser(updatedUser);
      } else {
        context.openAlertBox('error', response.message || 'Cập nhật thất bại');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      context.openAlertBox('error', error.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      context.setIsLogin(false);
      navigate('/login');
    }
  };

  const menuItems = [
    { id: 'profile', label: 'My Profile', icon: <FiUser className="text-[18px]" />, path: '/my-account' },
    { id: 'mylist', label: 'My List', icon: <GoHeart className="text-[18px]" />, path: '/my-list' },
    { id: 'orders', label: 'My Orders', icon: <IoBagCheckOutline className="text-[18px]" />, path: '/my-orders' },
  ];

  if (loading) {
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
      <div className="container">
        <div className="flex gap-5">
          {/* Left Sidebar */}
          <div className="w-[280px]">
            <div className="card bg-white shadow-md rounded-md p-5">
              {/* User Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-[100px] h-[100px] rounded-full bg-[#ff5252] flex items-center justify-center text-white text-[40px] font-semibold mb-3 overflow-hidden">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt="User Avatar" 
                      className="w-full h-full rounded-full object-cover" 
                    />
                  ) : (
                    <span>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                  )}
                </div>
                <h3 className="text-[16px] font-semibold">{user?.name || 'User'}</h3>
                <p className="text-[13px] text-gray-500">{user?.email || ''}</p>
              </div>

              {/* Menu */}
              <nav className="border-t border-gray-100 pt-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`flex items-center gap-3 w-full px-4 py-3 text-[14px] text-left transition rounded-md
                      ${activeTab === item.id 
                        ? 'text-[#ff5252] bg-red-50 border-l-3 border-[#ff5252]' 
                        : 'text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
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
                      name="name"
                      value={formFields.name}
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
                      helperText="Email không thể thay đổi"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <TextField
                    label="Phone Number"
                    variant="outlined"
                    size="small"
                    className="w-full max-w-[300px]"
                    name="mobile"
                    value={formFields.mobile}
                    onChange={handleChange}
                    placeholder="0912345678"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={saving}
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
                    '&:disabled': {
                      backgroundColor: '#ccc',
                      color: '#fff',
                    },
                  }}
                >
                  {saving ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    'Update Profile'
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Account;
