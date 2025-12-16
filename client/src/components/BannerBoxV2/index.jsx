import React from 'react'
import BannerBox from '../BannerBox/BannerBox';
import { Link } from 'react-router-dom';

export default function BannerBoxV2(props) {
  return (
    <div className='bannerBoxV2 h-[255px] w-full rounded-md overflow-hidden group relative cursor-pointer'>
        <img src={props.image} alt="" className='w-full transition-all duration-150 group-hover:scale-105' />
        <div className={`info p-5 absolute top-0 ${props.info === "left" ? "left-0" : "right-0"} w-[60%] h-full z-50 flex  justify-center flex-col gap-2`}>
          <h2 className='text-[20px] font-[600]'>Buy women with low price</h2>
          <span className='text-[25px] text-[#ff5252] font-[600] w-full'>$20</span>
          <div className='w-full '>
            <Link to="/" className='text-[16px] font-[600] link'>SHOP NOW</Link>
          </div>
        </div>
    </div>
  )
}
