import React from 'react'
import { Button } from '@mui/material';
import { RiMenu2Line } from "react-icons/ri";
import { LiaAngleDownSolid } from "react-icons/lia";
import { Link } from 'react-router-dom';
import { GoRocket } from "react-icons/go";
import { CategoryPanel } from './CategoryPanel';
import { useState } from 'react';

export const Navigation = () => {
    const [isOpenCategoryPanel, setIsOpenCategoryPanel] = useState(false);
    const openCategoryPanel = () => {
        setIsOpenCategoryPanel(!isOpenCategoryPanel);
    };
    return (
        <>
            <nav className='py-2 border-t-[1px] border-b-[1px] border-gray-200 bg-white'>
                <div className='container flex items-center justify-end gap-8'>
                    <div className='col_1 w-[20%]'>
                        <Button className='!text-black gap-2 w-full' onClick={openCategoryPanel}>
                            <RiMenu2Line className='text-[18px]' />
                            Shop By Categories
                            <LiaAngleDownSolid className='text-[13px] ml-auto !font-bold' />
                        </Button>
                    </div>
                    <div className='col_2 w-[60%]'>
                        <ul className='flex items-center gap-3'>
                            <li className='list-none'>
                                <Link to="/" className='link transition text-[16px] font-[500]'>
                                    <Button className='link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !normal-case !py-4'>Home</Button>
                                </Link>
                            </li>
                            <li className='list-none relative group'>
                                <Link to="/" className='link transition text-[16px] font-[500]'>
                                    <Button className='link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !normal-case !py-4'>Fashion</Button>
                                </Link>
                                <div className='submenu rounded-md absolute min-w-[200px] bg-white shadow-lg p-4 top-full left-0 mt-3 z-10 invisible opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100'>
                                    <ul>
                                        <li className='list-none'>
                                            <Button variant="text" className="w-full !justify-start !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !normal-case">Men</Button>
                                        </li>
                                        <li className='list-none'>
                                            <Button variant="text" className="w-full !justify-start !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !normal-case">Women</Button>
                                        </li>
                                        <li className='list-none'>
                                            <Button variant="text" className="w-full !justify-start !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !normal-case">Girls</Button>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li className='list-none relative group'>
                                <Link to="/" className='link transition text-[16px] font-[500]'>
                                    <Button className='link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !normal-case !py-4'>Electronics</Button>
                                </Link>
                                <div className='submenu rounded-md absolute min-w-[200px] bg-white shadow-lg p-4 top-full left-0 mt-3 z-10 invisible opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100'>
                                    <ul>
                                        <li className='list-none'>
                                            <Button variant="text" className="w-full !justify-start !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !normal-case">Smart Watch</Button>
                                        </li>
                                        <li className='list-none'>
                                            <Button variant="text" className="w-full !justify-start !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !normal-case">Laptops</Button>
                                        </li>
                                        <li className='list-none'>
                                            <Button variant="text" className="w-full !justify-start !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !normal-case">Mobiles</Button>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li className='list-none relative group'>
                                <Link to="/" className='link transition text-[16px] font-[500]'>
                                    <Button className='link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !normal-case !py-4'>Bags</Button>
                                </Link>
                                <div className='submenu rounded-md absolute min-w-[200px] bg-white shadow-lg p-4 top-full left-0 mt-3 z-10 invisible opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100'>
                                    <ul>
                                        <li className='list-none'>
                                            <Button variant="text" className="w-full !justify-start !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !normal-case">Women Bags</Button>
                                        </li>
                                        <li className='list-none'>
                                            <Button variant="text" className="w-full !justify-start !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !normal-case">Men Bags</Button>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li className='list-none relative group'>
                                <Link to="/" className='link transition text-[16px] font-[500]'>
                                    <Button className='link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !normal-case !py-4'>Footwear</Button>
                                </Link>
                                <div className='submenu rounded-md absolute min-w-[250px] bg-white shadow-lg p-4 top-full left-0 mt-3 z-10 invisible opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100'>
                                    <ul>
                                        <li className='list-none'>
                                            <Button variant="text" className="w-full !justify-start !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !normal-case">Women Footwears</Button>
                                        </li>
                                        <li className='list-none'>
                                            <Button variant="text" className="w-full !justify-start !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !normal-case">Men Footwears</Button>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li className='list-none'>
                                <Link to="/" className='link transition text-[16px] font-[500]'>
                                    <Button className='link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !normal-case !py-4'>Groceries</Button>
                                </Link>
                            </li>
                            <li className='list-none'>
                                <Link to="/" className='link transition text-[16px] font-[500]'>
                                    <Button className='link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !normal-case !py-4'>Beauty</Button>
                                </Link>
                            </li>
                            <li className='list-none'>
                                <Link to="/" className='link transition text-[16px] font-[500]'>
                                    <Button className='link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !normal-case !py-4'>Wellness</Button>
                                </Link>
                            </li>
                            <li className='list-none'>
                                <Link to="/" className='link transition text-[16px] font-[500]'>
                                    <Button className='link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !normal-case !py-4'>Jewellery</Button>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className='col_3 w-[20%]'>
                        <p className='text-[14px] font-[500] flex items-center gap-3'><GoRocket className='text-[18px]' />Free International Delivery</p>
                    </div>
                </div>
            </nav>
            <CategoryPanel open={isOpenCategoryPanel} onClose={() => setIsOpenCategoryPanel(false)} />
        </>
    )
}
