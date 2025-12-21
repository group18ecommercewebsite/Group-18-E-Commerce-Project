import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoCloseSharp } from 'react-icons/io5';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { GoTriangleDown } from 'react-icons/go';
import Rating from '@mui/material/Rating';

const MyListItems = (props) => {
  
  return (
    <div className="cartItem w-full p-3 flex items-center gap-4 pb-5 border-b border-[rgba(0,0,0,0.1)]">
      <div className="img w-[15%] rounded-md overflow-hidden">
        <Link to={'/product/7854'} className="group">
          <img
            src="https://serviceapi.spicezgold.com/download/1753722939206_125c18d6-592d-4082-84e5-49707ae9a4fd1749366193911-Flying-Machine-Women-Wide-Leg-High-Rise-Light-Fade-Stretchab-1.jpg"
            className="w-full group-hover:scale-105 transition-all"
          />
        </Link>
      </div>

      <div className="info w-[85%] relative">
        <IoCloseSharp className="absolute cursor-pointer top-[0px] right-[0px] text-[22px] link transition-all" />
        <span className="text-[13px]">Flying Machine</span>
        <h3 className="text-[15px]">
          <Link className="link" to={'/product/7854'}>
            Women Wide Leg Killer
          </Link>
        </h3>

        <Rating name="size-small" defaultValue={2} size="small" readOnly />


        <div className="flex items-center gap-4 mt-2">
          <span className="price text-[14px] font-[600]">$58.00</span>
          <span className="oldPrice line-through text-gray-500 text-[14px] font-medium">
            $58.00
          </span>
          <span className="price text-[#ff5252] text-[14px] font-[600]">55% OFF</span>
        </div>
      </div>
    </div>
  );
};

export default MyListItems;
