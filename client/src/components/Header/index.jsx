import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Search } from '../Search'
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { BsCart3 } from "react-icons/bs";
import { IoIosGitCompare } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import Tooltip from '@mui/material/Tooltip';
import { Navigation } from './Navigation/index';
import { MyContext } from '../../App';

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
              <li className='list-none text-sm text-gray-700 flex items-center gap-2'>
                <FaUserCircle className='text-xl text-gray-600' />
                <div className='hidden sm:flex gap-2'>
                  <Link to='/login' className='link transition text-[15px] font-[500] hover:text-[#ff5252]'>Login</Link>
                  <span className='text-gray-400'>|</span>
                  <Link to='/register' className='link transition text-[15px] font-[500] hover:text-[#ff5252]'>Register</Link>
                </div>
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
                  <IconButton aria-label="wishlist">
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
