import React, { useState } from "react";
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { FaRegImage } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { RiProductHuntLine } from "react-icons/ri";
import { TbCategory } from "react-icons/tb";
import { IoBagCheckOutline } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa6";
import { FiX } from "react-icons/fi";
import { Collapse } from "react-collapse";
import { useAddProduct } from "../../Context/AddProductContext";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const AddProductButton = () => {
    const { openPanel } = useAddProduct();
    
    return (
        <Button 
            onClick={openPanel}
            className="!text-[rgba(0,0,0,0.7)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 flex gap-3"
        >
            <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.1)] flex-shrink-0 mt-2"></span>
            <span className="truncate">Product Upload</span>
        </Button>
    );
};

const Sidebar = ({ isOpen, onClose }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [submenuIndex, setSubmenuIndex] = useState(null);

    const handleLogout = (e) => {
        e?.preventDefault();
        e?.stopPropagation();
        
        // Xóa authentication data
        logout();
        
        // Force redirect với window.location để đảm bảo reload hoàn toàn
        setTimeout(() => {
            window.location.href = '/login';
        }, 50);
    };
    const isOpenSubMenu = (index) => {
        if (submenuIndex === index) {
            setSubmenuIndex(null);
        } else {
            setSubmenuIndex(index);
        }
    }

    return (
        <>
            {/* Overlay khi sidebar mở trên mobile */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onClose}
                ></div>
            )}
            
            <div className={`sidebar fixed top-0 left-0 bg-[#fff] h-full border-r border-[rgba(0,0,0,0.1)] py-2 transition-all duration-300 ease-in-out z-50 overflow-y-auto ${
                isOpen 
                    ? 'w-[280px] lg:translate-x-0 translate-x-0' 
                    : 'w-[80px] lg:translate-x-0 -translate-x-full lg:!translate-x-0'
            }`}>
                {/* Header với logo và nút đóng */}
                <div className={`py-2 px-2 flex items-center justify-between sticky top-0 bg-white z-10 border-b border-gray-100 ${!isOpen ? 'flex-col gap-2' : ''}`}>
                    {isOpen && (
                        <Link to="/" className="flex-1">
                            <img src="https://ecme-react.themenate.net/img/logo/logo-light-full.png" className="w-[150px]" alt="Logo" />
                        </Link>
                    )}
                    {!isOpen && (
                        <Link to="/" className="flex items-center justify-center w-full">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                                D
                            </div>
                        </Link>
                    )}
                    {isOpen && onClose && (
                        <button
                            onClick={onClose}
                            className="p-2 rounded-md hover:bg-gray-100 transition-colors lg:hidden"
                            aria-label="Đóng sidebar"
                        >
                            <FiX className="w-5 h-5 text-gray-600" />
                        </button>
                    )}
                </div>

                <ul className="mt-4 px-2">
                    <li>
                        <Link to="/">
                            <Button 
                                className={`w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] font-500] items-center !py-2 hover:!bg-[#f1f1f1] ${!isOpen ? '!justify-center !px-2' : ''}`}
                                title={!isOpen ? "Dashboard" : ""}
                            >
                                <RxDashboard className="text-[18px] flex-shrink-0" /> 
                                {isOpen && <span className="truncate">Dashboard</span>}
                            </Button>
                        </Link>
                    </li>

                    <li>
                        <Button 
                            className={`w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] font-500] items-center !py-2 hover:!bg-[#f1f1f1] ${!isOpen ? '!justify-center !px-2' : ''}`}
                            onClick={() => isOpenSubMenu(1)}
                            title={!isOpen ? "Home Slides" : ""}
                        >
                            <FaRegImage className="text-[20px] flex-shrink-0" /> 
                            {isOpen && <span className="truncate flex-1">Home Slides</span>}
                            {isOpen && (
                                <span className="ml-auto block w-[30px] h-[30px] flex items-center justify-center flex-shrink-0">
                                    <FaAngleDown className={`transition-all ${submenuIndex === 1 ? 'rotate-180' : ''}`} />
                                </span>
                            )}
                        </Button>

                        {isOpen && (
                            <Collapse isOpened={submenuIndex === 1 ? true : false}>
                                <ul>
                                    <li>
                                        <Link to="/home-slides">
                                            <Button className="!text-[rgba(0,0,0,0.7)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 flex gap-3">
                                                <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.1)] flex-shrink-0 mt-2"></span>
                                                <span className="truncate">Home Slides List</span>
                                            </Button>
                                        </Link>
                                    </li>
                                </ul>
                            </Collapse>
                        )}
                    </li>

                    <li>
                        <Link to="/users">
                            <Button 
                                className={`w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] font-500] items-center !py-2 hover:!bg-[#f1f1f1] ${!isOpen ? '!justify-center !px-2' : ''}`}
                                title={!isOpen ? "Users" : ""}
                            >
                                <FiUsers className="text-[20px] flex-shrink-0" /> 
                                {isOpen && <span className="truncate">Users</span>}
                            </Button>
                        </Link>
                    </li>

                    <li>
                        <Button 
                            className={`w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] font-500] items-center !py-2 hover:!bg-[#f1f1f1] ${!isOpen ? '!justify-center !px-2' : ''}`}
                            onClick={() => isOpenSubMenu(3)}
                            title={!isOpen ? "Products" : ""}
                        >
                            <RiProductHuntLine className="text-[20px] flex-shrink-0" /> 
                            {isOpen && <span className="truncate flex-1">Products</span>}
                            {isOpen && (
                                <span className="ml-auto block w-[30px] h-[30px] flex items-center justify-center flex-shrink-0">
                                    <FaAngleDown className={`transition-all ${submenuIndex === 3 ? 'rotate-180' : ''}`} />
                                </span>
                            )}
                        </Button>

                        {isOpen && (
                            <Collapse isOpened={submenuIndex === 3 ? true : false}>
                                <ul className="w-full">
                                    <li className="w-full">
                                        <Link to="/products">
                                            <Button className="!text-[rgba(0,0,0,0.7)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 flex gap-3">
                                                <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.1)] flex-shrink-0 mt-2"></span>
                                                <span className="truncate">Product List</span>
                                            </Button>
                                        </Link>
                                    </li>
                                    <li className="w-full">
                                        <AddProductButton />
                                    </li>
                                </ul>
                            </Collapse>
                        )}
                    </li>

                    <li>
                        <Button 
                            className={`w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] font-500] items-center !py-2 hover:!bg-[#f1f1f1] ${!isOpen ? '!justify-center !px-2' : ''}`}
                            onClick={() => isOpenSubMenu(4)}
                            title={!isOpen ? "Category" : ""}
                        >
                            <TbCategory className="text-[20px] flex-shrink-0" /> 
                            {isOpen && <span className="truncate flex-1">Category</span>}
                            {isOpen && (
                                <span className="ml-auto block w-[30px] h-[30px] flex items-center justify-center flex-shrink-0">
                                    <FaAngleDown className={`transition-all ${submenuIndex === 4 ? 'rotate-180' : ''}`} />
                                </span>
                            )}
                        </Button>

                        {isOpen && (
                            <Collapse isOpened={submenuIndex === 4 ? true : false}>
                                <ul className="w-full">
                                    <li className="w-full">
                                        <Link to="/categories">
                                            <Button className="!text-[rgba(0,0,0,0.7)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 flex gap-3">
                                                <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.1)] flex-shrink-0 mt-2"></span>
                                                <span className="truncate">Category List</span>
                                            </Button>
                                        </Link>
                                    </li>
                                    <li className="w-full">
                                        <Link to="/categories/add">
                                            <Button className="!text-[rgba(0,0,0,0.7)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 flex gap-3">
                                                <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.1)] flex-shrink-0 mt-2"></span>
                                                <span className="truncate">Add A Category</span>
                                            </Button>
                                        </Link>
                                    </li>
                                    <li className="w-full">
                                        <Link to="/category/subCat">
                                            <Button className="!text-[rgba(0,0,0,0.7)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 flex gap-3">
                                                <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.1)] flex-shrink-0 mt-2"></span>
                                                <span className="truncate">Sub Category List</span>
                                            </Button>
                                        </Link>
                                    </li>
                                    <li className="w-full">
                                        <Link to="/category/subCat/add">
                                            <Button className="!text-[rgba(0,0,0,0.7)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 flex gap-3">
                                                <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.1)] flex-shrink-0 mt-2"></span>
                                                <span className="truncate">Add A Sub Category</span>
                                            </Button>
                                        </Link>
                                    </li>
                                </ul>
                            </Collapse>
                        )}
                    </li>

                    <li>
                        <Link to="/category/subCar/add">
                            <Button 
                                className={`w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] font-500] items-center !py-2 hover:!bg-[#f1f1f1] ${!isOpen ? '!justify-center !px-2' : ''}`}
                                title={!isOpen ? "Orders" : ""}
                            >
                                <IoBagCheckOutline className="text-[20px] flex-shrink-0" /> 
                                {isOpen && <span className="truncate">Orders</span>}
                            </Button>
                        </Link>
                    </li>

                    <li>
                        <Button 
                            type="button"
                            onClick={handleLogout}
                            className={`w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] font-500] items-center !py-2 hover:!bg-[#f1f1f1] ${!isOpen ? '!justify-center !px-2' : ''}`}
                            title={!isOpen ? "Logout" : ""}
                        >
                            <IoMdLogOut className="text-[20px] flex-shrink-0" /> 
                            {isOpen && <span className="truncate">Logout</span>}
                        </Button>
                    </li>
                </ul>
            </div>
        </>
    )
}

export default Sidebar;