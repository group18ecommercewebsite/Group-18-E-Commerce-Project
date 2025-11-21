import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import { RiMenu2Line } from "react-icons/ri";
import { FaSearch, FaBell, FaUserCircle } from "react-icons/fa";

const Header = ({ onToggleSidebar, sidebarOpen = true }) => {
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === "undefined") return false;
        return window.innerWidth <= 1024;
    });

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1024);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const sideOffset = sidebarOpen ? "18%" : "70px";
    const headerPaddingLeft = isMobile ? "16px" : `calc(${sideOffset} + 1rem)`;

    return (
        <header 
            className="h-[60px] fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 flex items-center justify-between shadow-sm transition-all duration-300"
            style={{ paddingLeft: headerPaddingLeft, paddingRight: "1.5rem" }}
        >
            <div className="flex items-center gap-4">
                <Button 
                    className="!w-[40px] !h-[40px] !rounded-full !min-w-[40px] !p-0 hover:!bg-gray-100"
                    onClick={onToggleSidebar}
                >
                    <RiMenu2Line className="text-[22px] text-gray-700"/>
                </Button>
                <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2 w-64">
                    <FaSearch className="text-gray-400 text-sm"/>
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="bg-transparent border-none outline-none text-sm flex-1 text-gray-700 placeholder-gray-400"
                    />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Button className="!min-w-[40px] !w-[40px] !h-[40px] !rounded-full !p-0 hover:!bg-gray-100 relative">
                    <FaBell className="text-gray-600 text-lg"/>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>
                <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded-lg px-3 py-2">
                    <FaUserCircle className="text-gray-600 text-xl"/>
                    <span className="text-sm font-medium text-gray-700 hidden md:block">Admin</span>
                </div>
            </div>
        </header>
    )
}
    