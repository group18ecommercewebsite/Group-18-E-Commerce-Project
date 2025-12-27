import React, { useState } from "react";
import Button from '@mui/material/Button';
import { Link, useLocation } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { FaRegImage } from "react-icons/fa";
import { FiUsers, FiChevronDown, FiChevronRight, FiX } from "react-icons/fi";
import { RiProductHuntLine } from "react-icons/ri";
import { TbCategory } from "react-icons/tb";
import { IoBagCheckOutline } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";
import { Collapse } from "react-collapse";
import { useAddProduct } from "../../Context/AddProductContext";
import { useAuth } from "../../Context/AuthContext";

const Sidebar = ({ isOpen, onClose }) => {
    const { logout, user } = useAuth();
    const location = useLocation();
    const [expandedMenu, setExpandedMenu] = useState(null);
    const { openPanel } = useAddProduct();

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    };

    const toggleMenu = (menuId) => {
        setExpandedMenu(expandedMenu === menuId ? null : menuId);
    };

    const isActive = (path) => location.pathname === path;
    const isMenuActive = (paths) => paths.some(p => location.pathname.startsWith(p));

    // Menu items configuration
    const menuItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: RxDashboard,
            path: '/'
        },
        {
            id: 'home-slides',
            label: 'Home Slides',
            icon: FaRegImage,
            path: '/home-slides'
        },
        {
            id: 'users',
            label: 'Users',
            icon: FiUsers,
            path: '/users'
        },
        {
            id: 'products',
            label: 'Products',
            icon: RiProductHuntLine,
            path: '/products'
        },
        {
            id: 'category',
            label: 'Category',
            icon: TbCategory,
            path: '/categories'
        },
        {
            id: 'orders',
            label: 'Orders',
            icon: IoBagCheckOutline,
            path: '/orders'
        }
    ];

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}
            
            {/* Sidebar Container */}
            <div className={`sidebar fixed top-0 left-0 h-full bg-gradient-to-b from-slate-900 to-slate-800 z-50 transition-all duration-300 shadow-2xl ${
                isOpen ? 'w-[260px]' : 'w-[70px]'
            } ${!isOpen && 'max-lg:hidden'}`}>
                
                {/* Logo Header */}
                <div className={`h-16 flex items-center border-b border-slate-700/50 ${isOpen ? 'px-5 justify-between' : 'justify-center'}`}>
                    {isOpen ? (
                        <>
                            <Link to="/" className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">A</span>
                                </div>
                                <span className="text-white font-semibold text-lg">Admin Panel</span>
                            </Link>
                            <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
                                <FiX size={20} />
                            </button>
                        </>
                    ) : (
                        <Link to="/">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold">A</span>
                            </div>
                        </Link>
                    )}
                </div>

                {/* Navigation */}
                <nav className="py-4 px-2 flex-1 overflow-y-auto">
                    <ul className="space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const hasSubmenu = item.submenu && item.submenu.length > 0;
                            const isExpanded = expandedMenu === item.id;
                            const active = item.path ? isActive(item.path) : isMenuActive(item.submenu?.map(s => s.path).filter(Boolean) || []);

                            return (
                                <li key={item.id}>
                                    {hasSubmenu ? (
                                        <>
                                            <button
                                                onClick={() => toggleMenu(item.id)}
                                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
                                                    ${active ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'}`}
                                            >
                                                <Icon className={`text-lg flex-shrink-0 ${active ? 'text-blue-400' : ''}`} />
                                                {isOpen && (
                                                    <>
                                                        <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                                                        {isExpanded ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
                                                    </>
                                                )}
                                            </button>
                                            {isOpen && (
                                                <Collapse isOpened={isExpanded}>
                                                    <ul className="mt-1 ml-4 pl-4 border-l border-slate-700/50 space-y-1">
                                                        {item.submenu.map((sub, idx) => (
                                                            <li key={idx}>
                                                                {sub.path ? (
                                                                    <Link
                                                                        to={sub.path}
                                                                        className={`block px-3 py-2 text-sm rounded-lg transition-colors
                                                                            ${isActive(sub.path) 
                                                                                ? 'text-blue-400 bg-blue-600/10' 
                                                                                : 'text-slate-400 hover:text-white hover:bg-slate-700/30'}`}
                                                                    >
                                                                        {sub.label}
                                                                    </Link>
                                                                ) : (
                                                                    <button
                                                                        onClick={sub.onClick}
                                                                        className="block w-full text-left px-3 py-2 text-sm rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/30 transition-colors"
                                                                    >
                                                                        {sub.label}
                                                                    </button>
                                                                )}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </Collapse>
                                            )}
                                        </>
                                    ) : (
                                        <Link
                                            to={item.path}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                                                ${active 
                                                    ? 'bg-blue-600/20 text-blue-400' 
                                                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'}`}
                                            title={!isOpen ? item.label : ''}
                                        >
                                            <Icon className={`text-lg flex-shrink-0 ${active ? 'text-blue-400' : ''}`} />
                                            {isOpen && <span className="text-sm font-medium">{item.label}</span>}
                                        </Link>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Footer - User & Logout */}
                <div className="border-t border-slate-700/50 p-3">
                    {isOpen && user && (
                        <div className="flex items-center gap-3 px-2 py-2 mb-2">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                                {user.name?.charAt(0)?.toUpperCase() || 'A'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{user.name || 'Admin'}</p>
                                <p className="text-xs text-slate-400 truncate">{user.email || ''}</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-colors ${!isOpen && 'justify-center'}`}
                        title={!isOpen ? 'Logout' : ''}
                    >
                        <IoMdLogOut className="text-lg" />
                        {isOpen && <span className="text-sm font-medium">Logout</span>}
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;