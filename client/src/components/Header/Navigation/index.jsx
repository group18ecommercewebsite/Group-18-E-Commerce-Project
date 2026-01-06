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
                <div className='container flex items-center justify-between gap-2 md:gap-4 lg:gap-8'>
                    {/* Categories button */}
                    <div className='col_1 w-auto md:w-[20%] flex-shrink-0'>
                        <Button className='!text-black gap-1 md:gap-2 !px-2 md:!px-4 !text-[12px] md:!text-[14px]' onClick={openCategoryPanel}>
                            <RiMenu2Line className='text-[16px] md:text-[18px]' />
                            <span className='hidden sm:inline'>Mua sắm theo <br /> danh mục</span>
                            <span className='sm:hidden'>Menu</span>
                            <LiaAngleDownSolid className='text-[11px] md:text-[13px] ml-auto !font-bold' />
                        </Button>
                    </div>
                    {/* Navigation links */}
                    <div className='col_2 flex-1 overflow-x-auto scrollbar-hide'>
                        <ul className='flex items-center gap-1 md:gap-3 whitespace-nowrap'>
                            <li className='list-none'>
                                <Link to="/" className='link transition text-[14px] md:text-[16px] font-[500]'>
                                    <Button className='link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !normal-case !text-[13px] md:!text-[14px] !px-2 md:!px-3'>Home</Button>
                                </Link>
                            </li>
                            {navCategories.map((category) => (
                                <li key={category._id} className='list-none relative group'>
                                    <Link to={`/productListing/${category._id}`} className='link transition text-[14px] md:text-[16px] font-[500]'>
                                        <Button className='link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !normal-case !text-[13px] md:!text-[14px] !px-2 md:!px-3'>
                                            {category.name}
                                        </Button>
                                    </Link>
                                    {category.children && category.children.length > 0 && renderSubMenu(category.children)}
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Free delivery badge - hidden on mobile/tablet */}
                    <div className='col_3 hidden lg:block w-auto flex-shrink-0'>
                        <p className='text-[13px] font-[500] flex items-center gap-2 whitespace-nowrap'><GoRocket className='text-[16px]' />Free Ship trên toàn quốc</p>
                    </div>
                </div>
            </nav>
            <CategoryPanel open={isOpenCategoryPanel} onClose={() => setIsOpenCategoryPanel(false)} />
        </>
    )
}
