import React from 'react'
import { IoIosArrowForward, IoMdTime } from "react-icons/io";
import { Link } from 'react-router-dom';
import blogImg from '@/assets/blogitemimg1.png';

export const BlogItem = () => {
  return (
    <div className='blogItem group'>
        <div className='relative imgWrapper w-full overflow-hidden rounded-md cursor-pointer'>
            <img src={blogImg} alt="blog image" className='w-full transition-all group-hover:scale-105 group-hover:rotate-1' />
            <span className='flex items-center justify-center text-white absolute bottom-[15px] right-[15px] z-50 bg-primary rounded-md p-1 text-[11px] font-[500] gap-1'>
                <IoMdTime className='text-[16px]' /> 02 Jan 2026
            </span>
        </div>

        <div className='info py-4'>
          <h2 className='text-[16px] font-[600] text-black'><Link to="/" className='link'>Lorem ipsum dolor sit amet consectetur </Link></h2>
          <p className='text-[13px] font-[400] text-[rgba(0,0,0,0.8)] mb-4'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...</p>
          <Link className="link font-[500] text-[14px] flex items-center gap-1">Read more <IoIosArrowForward /></Link>
        </div>

    </div>
  )
}
