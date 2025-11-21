import React, { useState } from "react";
import Button from '@mui/material/Button';
import {Link} from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { FaRegImage } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { RiProductHuntLine } from "react-icons/ri";
import { TbCategory } from "react-icons/tb";
import { IoBagCheckOutline } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa6";
import {Collapse} from 'react-collapse';

const Sidebar = ({ isOpen = true }) => {
const [submenuIndex, setSubmenuIndex] = useState(null);
    const isOpenSubMenu=(index)=>{
        if(submenuIndex === index){
            setSubmenuIndex(null);
        }else{
            setSubmenuIndex(index);
        }
        
    }

    return (
        <>
            <div className={`sidebar fixed top-[60px] left-0 bg-[#fff] h-[calc(100vh-60px)] border-r border-[rgba(0,0,0,0.1)] py-2 transition-all duration-300 z-40 ${
                isOpen ? 'w-[18%] px-2' : 'w-[70px] px-2'
            }`}>
                <div className={`py-2 w-full flex items-center justify-center transition-all duration-300 ${isOpen ? '' : 'px-0'}`}>
                    <Link to="/" className="flex items-center justify-center">
                        {isOpen ? (
                            <img src="https://ecme-react.themenate.net/img/logo/logo-light-full.png" className="w-[150px]"/>
                        ) : (
                            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                                E
                            </div>
                        )}
                    </Link>
                </div>

                <ul className="mt-4">
                    <li>
                        <Button 
                            className={`w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] font-500] items-center !py-2 hover:!bg-[#f1f1f1] ${isOpen ? '' : '!justify-center !px-0'}`}
                            title={!isOpen ? "Dashboard" : ""}
                        >
                            <RxDashboard className="text-[18px] flex-shrink-0"/> 
                            {isOpen && <span>Dashboard</span>}
                        </Button>
                    </li>

                    <li>
                        <Button 
                            className={`w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] font-500] items-center !py-2 hover:!bg-[#f1f1f1] ${isOpen ? '' : '!justify-center !px-0'}`}
                            onClick={()=>isOpenSubMenu(1)}
                            title={!isOpen ? "Home Slides" : ""}
                        >
                            <FaRegImage className="text-[20px] flex-shrink-0"/> 
                            {isOpen && <span>Home Slides</span>}
                            {isOpen && <span className="ml-auto block w-[30px] h-[30px] flex items-center justify-center">
                                <FaAngleDown className={`transition-all ${submenuIndex === 1 ? 'rotate-180' : ''} `} />
                            </span>}
                        </Button>

                        {isOpen && (
                            <Collapse isOpened={submenuIndex===1 ? true : false}>
                                <ul>
                                    <li><Button className="!text-[rgba(0,0,0,0.7)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 flex gap-3"><span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.1)]"></span>Home Slides List</Button></li>
                                    <li><Button className="!text-[rgba(0,0,0,0.7)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 flex gap-3"><span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.1)]"></span>Add Home Banner Slide</Button></li>
                                </ul>
                            </Collapse>
                        )}
                    </li>

                    <li>
                        <Button 
                            className={`w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] font-500] items-center !py-2 hover:!bg-[#f1f1f1] ${isOpen ? '' : '!justify-center !px-0'}`}
                            title={!isOpen ? "Users" : ""}
                        >
                            <FiUsers className="text-[20px] flex-shrink-0"/> 
                            {isOpen && <span>Users</span>}
                        </Button>
                    </li>

                    <li>
                        <Button 
                            className={`w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] font-500] items-center !py-2 hover:!bg-[#f1f1f1] ${isOpen ? '' : '!justify-center !px-0'}`}
                            onClick={()=>isOpenSubMenu(3)}
                            title={!isOpen ? "Products" : ""}
                        >
                            <RiProductHuntLine className="text-[20px] flex-shrink-0"/> 
                            {isOpen && <span>Products</span>}
                            {isOpen && <span className="ml-auto block w-[30px] h-[30px] flex items-center justify-center">
                                <FaAngleDown className={`transition-all ${submenuIndex === 3 ? 'rotate-180' : ''} `} />
                            </span>}
                        </Button>

                        {isOpen && (
                            <Collapse isOpened={submenuIndex===3 ? true : false}>
                                <ul>
                                    <li><Button className="!text-[rgba(0,0,0,0.7)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 flex gap-3"><span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.1)]"></span>Product List</Button></li>
                                    <li><Button className="!text-[rgba(0,0,0,0.7)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 flex gap-3"><span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.1)]"></span>Product Upload</Button></li>
                                </ul>
                            </Collapse>
                        )}
                    </li>

                    <li>
                        <Button 
                            className={`w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] font-500] items-center !py-2 hover:!bg-[#f1f1f1] ${isOpen ? '' : '!justify-center !px-0'}`}
                            onClick={()=>isOpenSubMenu(4)}
                            title={!isOpen ? "Category" : ""}
                        >
                            <TbCategory className="text-[20px] flex-shrink-0"/> 
                            {isOpen && <span>Category</span>}
                            {isOpen && <span className="ml-auto block w-[30px] h-[30px] flex items-center justify-center">
                                <FaAngleDown className={`transition-all ${submenuIndex === 4 ? 'rotate-180' : ''} `} />
                            </span>}
                        </Button>

                        {isOpen && (
                            <Collapse isOpened={submenuIndex===4 ? true : false}>
                                <ul>
                                    <li><Button className="!text-[rgba(0,0,0,0.7)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 flex gap-3"><span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.1)]"></span>Category List</Button></li>
                                    <li><Button className="!text-[rgba(0,0,0,0.7)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 flex gap-3"><span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.1)]"></span>Add A Category</Button></li>
                                    <li><Button className="!text-[rgba(0,0,0,0.7)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 flex gap-3"><span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.1)]"></span>Sub Category List</Button></li>
                                    <li><Button className="!text-[rgba(0,0,0,0.7)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 flex gap-3"><span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.1)]"></span>Add A Sub Category</Button></li>
                                </ul>
                            </Collapse>
                        )}
                    </li>

                    <li>
                        <Button 
                            className={`w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] font-500] items-center !py-2 hover:!bg-[#f1f1f1] ${isOpen ? '' : '!justify-center !px-0'}`}
                            title={!isOpen ? "Orders" : ""}
                        >
                            <IoBagCheckOutline className="text-[20px] flex-shrink-0"/> 
                            {isOpen && <span>Orders</span>}
                        </Button>
                    </li>

                    <li>
                        <Button 
                            className={`w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] font-500] items-center !py-2 hover:!bg-[#f1f1f1] ${isOpen ? '' : '!justify-center !px-0'}`}
                            title={!isOpen ? "Logout" : ""}
                        >
                            <IoMdLogOut className="text-[20px] flex-shrink-0"/> 
                            {isOpen && <span>Logout</span>}
                        </Button>
                    </li>
                </ul>
            </div>
        </>
    )
}

export default Sidebar;