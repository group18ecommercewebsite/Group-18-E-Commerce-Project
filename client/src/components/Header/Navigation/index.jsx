import React from 'react'
import { Button } from '@mui/material';
import { RiMenu2Line } from "react-icons/ri";
import { LiaAngleDownSolid, LiaAngleRightSolid } from "react-icons/lia";
import { Link } from 'react-router-dom';
import { GoRocket } from "react-icons/go";
import { CategoryPanel } from './CategoryPanel';
import { useState } from 'react';
import { useCategories } from '../../../context/CategoryContext';

export const Navigation = () => {
    const [isOpenCategoryPanel, setIsOpenCategoryPanel] = useState(false);
    const { categories, loading } = useCategories();

    const openCategoryPanel = () => {
        setIsOpenCategoryPanel(!isOpenCategoryPanel);
    };

    // Lấy tối đa 6 categories cho navigation bar
    const navCategories = categories?.slice(0, 6) || [];

    // Render nested subcategories (đệ quy - hỗ trợ nhiều cấp)
    const renderNestedSubMenu = (children) => {
        if (!children || children.length === 0) return null;
        
        return (
            <div className='nested-submenu rounded-md absolute min-w-[180px] bg-white shadow-lg p-2 left-full top-0 ml-1 z-20 invisible opacity-0 transition-all duration-200 group-hover/nested:visible group-hover/nested:opacity-100'>
                <ul>
                    {children.map((subCat) => (
                        <li key={subCat._id} className='list-none relative group/deep'>
                            <Link to={`/productListing/${subCat._id}`} className='flex items-center justify-between'>
                                <Button variant="text" className="w-full !justify-start !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !normal-case !text-[13px] !py-1">
                                    {subCat.name}
                                </Button>
                                {subCat.children && subCat.children.length > 0 && (
                                    <LiaAngleRightSolid className='text-[11px] text-gray-400' />
                                )}
                            </Link>
                            {subCat.children && subCat.children.length > 0 && (
                                <div className='rounded-md absolute min-w-[160px] bg-white shadow-lg p-2 left-full top-0 ml-1 z-30 invisible opacity-0 transition-all duration-200 group-hover/deep:visible group-hover/deep:opacity-100'>
                                    <ul>
                                        {subCat.children.map((deepCat) => (
                                            <li key={deepCat._id} className='list-none'>
                                                <Link to={`/productListing/${deepCat._id}`}>
                                                    <Button variant="text" className="w-full !justify-start !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !normal-case !text-[12px] !py-1">
                                                        {deepCat.name}
                                                    </Button>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    // Render subcategories cấp 1 trong dropdown
    const renderSubMenu = (children) => {
        if (!children || children.length === 0) return null;
        
        return (
            <div className='submenu rounded-md absolute min-w-[200px] bg-white shadow-lg p-3 top-full left-0 mt-3 z-10 invisible opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100'>
                <ul>
                    {children.map((subCat) => (
                        <li key={subCat._id} className='list-none relative group/nested'>
                            <Link to={`/productListing/${subCat._id}`} className='flex items-center justify-between'>
                                <Button variant="text" className="w-full !justify-start !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !normal-case">
                                    {subCat.name}
                                </Button>
                                {subCat.children && subCat.children.length > 0 && (
                                    <LiaAngleRightSolid className='text-[12px] text-gray-400' />
                                )}
                            </Link>
                            {subCat.children && subCat.children.length > 0 && renderNestedSubMenu(subCat.children)}
                        </li>
                    ))}
                </ul>
            </div>
        );
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
                                    <Button className='link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !normal-case'>Home</Button>
                                </Link>
                            </li>
                            {navCategories.map((category) => (
                                <li key={category._id} className='list-none relative group'>
                                    <Link to={`/productListing/${category._id}`} className='link transition text-[16px] font-[500]'>
                                        <Button className='link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !normal-case'>
                                            {category.name}
                                        </Button>
                                    </Link>
                                    {category.children && category.children.length > 0 && renderSubMenu(category.children)}
                                </li>
                            ))}
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
