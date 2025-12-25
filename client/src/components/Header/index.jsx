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
import Tooltip from '@mui/material/Tooltip';
import { Navigation } from './Navigation/index';
import { MyContext } from '../../App';
import { logoutUser } from '../../api/userApi';

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
    context.openAlertBox('success', 'Logged out successfully');
    navigate('/login');
  };

  return (
    <header className='bg-white shadow-sm'>
      <div className='top-strip bg-gradient-to-r from-white to-gray-50 border-b border-gray-100 py-2'>
        <div className='container'>
          <div className='flex justify-between items-center'>
            <div className='col1 w-[50%]'>
              <p className='text-[12px] font-[500] text-gray-600'>Get up to 50% off new season styles — limited time only</p>
            </div>
            <div className='col2 flex items-center justify-end'>
              <ul className='flex items-center gap-4'>
                <li className='list-none'>
                  <Link to="help-center" className='link text-[13px] font-[500] text-gray-600 hover:text-gray-900 transition'>Help center</Link>
                </li>
                <li className='list-none'>
                  <Link to="order-tracking" className='link text-[13px] font-[500] text-gray-600 hover:text-gray-900 transition'>Order Tracking</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className='header py-3'>
        <div className='container flex items-center justify-between'>
          <div className='col1 w-[25%] flex items-center'>
            <Link to='/' className='flex items-center'>
              <img src="/logo.webp" alt="logo image" className='h-16 object-contain' />

            </Link>
          </div>
          <div className='col2 w-[45%]'>
            <Search />
          </div>
          <div className='col3 w-[30%] flex items-center justify-end'>
            <ul className='flex items-center gap-4'>
              <li className='list-none text-sm text-gray-700'>
                {context.isLogin ? (
                  <div className='relative group'>
                    <div className='flex items-center gap-2 cursor-pointer'>
                      <FaUserCircle className='text-4xl text-gray-600' />
                      <div className='hidden sm:block'>
                        <p className='text-[14px] font-[600] !m-0'>{user?.name}</p>
                        <p className='text-[11px] text-gray-500 !m-0'>{user?.email}</p>
                      </div>
                    </div>
                    
                    {/* Dropdown Menu */}
                    <div className='absolute right-0 top-full pt-2 w-[80%] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50'>
                      <div className='bg-white rounded-md shadow-lg border border-gray-100 py-2 font-semibold'>
                        <Link to='/my-account' className='flex items-center gap-3 px-4 py-2 text-[14px] text-gray-700 hover:bg-gray-50 transition'>
                          <FiUser className='text-[20px]' />
                          My Account
                        </Link>
                        <Link to='/address' className='flex items-center gap-3 px-4 py-2 text-[14px] text-gray-700 hover:bg-gray-50 transition'>
                          <CiLocationOn className='text-[20px]' />
                          Address
                        </Link>
                        <Link to='/my-orders' className='flex items-center gap-3 px-4 py-2 text-[14px] text-gray-700 hover:bg-gray-50 transition'>
                          <IoBagCheckOutline className='text-[20px]' />
                          Orders
                        </Link>
                        <Link to='/my-list' className='flex items-center gap-3 px-4 py-2 text-[14px] text-gray-700 hover:bg-gray-50 transition'>
                          <GoHeart className='text-[20px] ' />
                          My List
                        </Link>
                        <div className='border-t border-gray-100 mt-1 pt-1'>
                          <button 
                            onClick={handleLogout}
                            className='flex items-center gap-3 px-4 py-2 text-[14px] text-gray-700 hover:bg-gray-50 transition w-full'
                          >
                            <IoLogOutOutline className='text-[20px]' />
                            Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className='flex items-center gap-2'>
                    <FaUserCircle className='text-xl text-gray-600' />
                    <div className='hidden sm:flex gap-2'>
                      <Link to='/login' className='link transition text-[15px] font-[500] hover:text-[#ff5252]'>Login</Link>
                      <span className='text-gray-400'>|</span>
                      <Link to='/register' className='link transition text-[15px] font-[500] hover:text-[#ff5252]'>Register</Link>
                    </div>
                  </div>
                )}
              </li>
              <li>
                <Tooltip title="Compare">
                  <IconButton aria-label="compare">
                    <StyledBadge badgeContent={4} color="secondary">
                      <IoIosGitCompare />
                    </StyledBadge>
                  </IconButton>
                </Tooltip>
              </li>
              <li>
                <Tooltip title="Cart">
                  <IconButton aria-label="cart" onClick={()=>context.setOpenCartPanel(true)}>
                    <StyledBadge badgeContent={4} color="secondary">
                      <BsCart3 />
                    </StyledBadge>
                  </IconButton>
                </Tooltip>
              </li>
              <li>
                <Tooltip title="Wishlist">
                  <IconButton aria-label="wishlist" component={Link} to="/my-list">
                    <StyledBadge badgeContent={4} color="secondary">
                      <FaRegHeart />
                    </StyledBadge>
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
