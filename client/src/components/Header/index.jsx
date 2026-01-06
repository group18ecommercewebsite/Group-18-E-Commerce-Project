import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search } from '../Search'
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { BsCart3 } from "react-icons/bs";
import { IoIosGitCompare } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { CiLocationOn } from "react-icons/ci";
import { IoBagCheckOutline } from "react-icons/io5";
import { GoHeart } from "react-icons/go";
import { IoLogOutOutline } from "react-icons/io5";
import { MdLocalOffer } from "react-icons/md";
import Tooltip from '@mui/material/Tooltip';
import { Navigation } from './Navigation/index';
import { MyContext } from '../../App';
import { logoutUser } from '../../api/userApi';
import { useCompare } from '../../context/CompareContext';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -2,
    top: 1,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: '0 4px',
    backgroundColor: '#ff5252', 
  },
}));

export const Header = () => {

  const context = useContext(MyContext);
  const navigate = useNavigate();
  const { compareCount } = useCompare();
  
  // Sử dụng user từ global context thay vì local state
  const user = context.user;

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      // Vẫn logout ở client dù API lỗi
      console.error('Logout API error:', error);
    }
    
    // Clear localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    
    context.setIsLogin(false);
    context.openAlertBox('success', 'Đăng xuất thành công');
    navigate('/login');
  };

  return (
    <header className='bg-white shadow-sm'>
      {/* Top strip - hidden on mobile */}
      <div className='top-strip bg-gradient-to-r from-white to-gray-50 border-b border-gray-100 py-2 hidden md:block'>
        <div className='container'>
          <div className='flex justify-between items-center'>
            <div className='col1 w-[50%]'>
              <p className='text-[12px] font-[500] text-gray-600'>Giảm giá đến 20% cho bộ sưu tập mới</p>
            </div>
            <div className='col2 flex items-center justify-end'>
              <ul className='flex items-center gap-4'>
                <li className='list-none'>
                  <Link to="help-center" className='link text-[13px] font-[500] text-gray-600 hover:text-gray-900 transition'>Trợ giúp</Link>
                  <Link to="about-us" className='ml-4 link text-[13px] font-[500] text-gray-600 hover:text-gray-900 transition'>Thông tin về chúng tôi</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className='header py-2 md:py-3'>
        <div className='container flex items-center justify-between gap-2 md:gap-4'>
          {/* Logo */}
          <div className='col1 w-auto md:w-[15%] flex items-center flex-shrink-0'>
            <Link to='/' className='flex items-center'>
              <img src="/logo.webp" alt="logo image" className='h-10 md:h-16 object-contain' />
            </Link>
          </div>
          {/* Search - flexible width */}
          <div className='col2 flex-1 md:w-[45%] min-w-0'>
            <Search />
          </div>
          {/* Actions */}
          <div className='col3 w-auto md:w-[35%] flex items-center justify-end flex-shrink-0'>
            <ul className='flex items-center gap-1 md:gap-4'>
              <li className='list-none text-sm text-gray-700'>
                {context.isLogin ? (
                  <div className='relative group'>
                    <div className='flex items-center gap-2 cursor-pointer'>
                      {/* Avatar - hiển thị ảnh nếu có, otherwise icon hoặc chữ cái */}
                      <div className='w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#ff5252] flex items-center justify-center text-white overflow-hidden'>
                        {user?.avatar ? (
                          <img 
                            src={user.avatar} 
                            alt={user.name} 
                            className='w-full h-full object-cover'
                          />
                        ) : (
                          <span className='text-sm md:text-lg font-semibold'>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                        )}
                      </div>
                      <div className='hidden lg:block'>
                        <p className='text-[14px] font-[600] !m-0'>{user?.name}</p>
                      </div>
                    </div>
                    
                    {/* Dropdown Menu */}
                    <div className='absolute right-0 top-full pt-2 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50'>
                      <div className='bg-white rounded-md shadow-lg border border-gray-100 py-2 font-semibold'>
                        <Link to='/my-account' className='flex items-center gap-3 px-4 py-2 text-[14px] text-gray-700 hover:bg-gray-50 transition'>
                          <FiUser className='text-[20px]' />
                          Tài khoản của tôi
                        </Link>
                        <Link to='/address' className='flex items-center gap-3 px-4 py-2 text-[14px] text-gray-700 hover:bg-gray-50 transition'>
                          <CiLocationOn className='text-[20px]' />
                          Địa chỉ
                        </Link>
                        <Link to='/my-orders' className='flex items-center gap-3 px-4 py-2 text-[14px] text-gray-700 hover:bg-gray-50 transition'>
                          <IoBagCheckOutline className='text-[20px]' />
                          Đơn hàng
                        </Link>
                        <Link to='/my-list' className='flex items-center gap-3 px-4 py-2 text-[14px] text-gray-700 hover:bg-gray-50 transition'>
                          <GoHeart className='text-[20px] ' />
                          Danh sách yêu thích
                        </Link>
                        <div className='border-t border-gray-100 mt-1 pt-1'>
                          <button 
                            onClick={handleLogout}
                            className='flex items-center gap-3 px-4 py-2 text-[14px] text-gray-700 hover:bg-gray-50 transition w-full'
                          >
                            <IoLogOutOutline className='text-[20px]' />
                            Đăng xuất
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className='flex items-center gap-2'>
                    <FaUserCircle className='text-xl text-gray-600' />
                    <div className='hidden md:flex gap-2'>
                      <Link to='/login' className='link transition text-[14px] font-[500] hover:text-[#ff5252]'>Đăng nhập</Link>
                      <span className='text-gray-400'>|</span>
                      <Link to='/register' className='link transition text-[14px] font-[500] hover:text-[#ff5252]'>Đăng ký</Link>
                    </div>
                  </div>
                )}
              </li>
              <li className='hidden sm:block'>
                <Tooltip title="So sánh">
                  <IconButton aria-label="compare" component={Link} to="/compare" size="small">
                    <StyledBadge badgeContent={compareCount} color="secondary">
                      <IoIosGitCompare />
                    </StyledBadge>
                  </IconButton>
                </Tooltip>
              </li>
              <li>
                <Tooltip title="Giỏ hàng">
                  <IconButton aria-label="cart" onClick={()=>context.setOpenCartPanel(true)} size="small">
                    <StyledBadge badgeContent={context.cartItems?.length || 0} color="secondary">
                      <BsCart3 />
                    </StyledBadge>
                  </IconButton>
                </Tooltip>
              </li>
              <li className='hidden sm:block'>
                <Tooltip title="Danh sách yêu thích">
                  <IconButton aria-label="wishlist" component={Link} to="/my-list" size="small">
                    <StyledBadge badgeContent={context.wishlistItems?.length || 0} color="secondary">
                      <FaRegHeart />
                    </StyledBadge>
                  </IconButton>
                </Tooltip>
              </li>
              <li className='hidden md:block'>
                <Tooltip title="Mã giảm giá">
                  <IconButton aria-label="coupons" component={Link} to="/coupons" size="small">
                    <MdLocalOffer className="text-[20px] text-[#ff5252]" />
                  </IconButton>
                </Tooltip>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Navigation />
    </header>
  )
}
