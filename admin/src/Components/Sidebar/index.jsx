import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RxDashboard } from 'react-icons/rx';
import { FaRegImage } from 'react-icons/fa';
import {
  FiUsers,
  FiChevronDown,
  FiChevronRight,
  FiX,
  FiBox,
  FiList,
  FiShoppingBag,
  FiCreditCard,
} from 'react-icons/fi';
import { MdOutlineMoneyOff, MdLocalOffer } from 'react-icons/md';
import { IoMdLogOut } from 'react-icons/io';
import { Collapse } from 'react-collapse';
import { useAuth } from '../../Context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedMenu, setExpandedMenu] = useState(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleMenu = (menuId) => {
    // If sidebar is collapsed, opening a submenu should expand sidebar (optional UX choice)
    // Here we just toggle the accordion
    setExpandedMenu(expandedMenu === menuId ? null : menuId);
  };

  const isActive = (path) => location.pathname === path;
  const isParentActive = (item) => {
    if (item.path) return location.pathname === item.path;
    return item.submenu?.some((sub) => location.pathname === sub.path);
  };

  // Menu Configuration
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: RxDashboard,
      path: '/',
    },
    {
      id: 'home-slides',
      label: 'Home Slides',
      icon: FaRegImage,
      path: '/home-slides',
    },
    {
      id: 'users',
      label: 'Users',
      icon: FiUsers,
      path: '/users',
    },
    {
      id: 'products',
      label: 'Products',
      icon: FiBox,
      path: '/products',
    },
    {
      id: 'category',
      label: 'Category',
      icon: FiList,
      path: '/categories',
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: FiShoppingBag,
      path: '/orders',
    },
    {
      id: 'cancellation-requests',
      label: 'Yêu cầu hoàn tiền',
      icon: MdOutlineMoneyOff,
      path: '/cancellation-requests',
    },
    {
      id: 'coupons',
      label: 'Mã giảm giá',
      icon: MdLocalOffer,
      path: '/coupons',
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <div
        className={`fixed top-0 left-0 h-full bg-[#111827] text-white z-50 transition-all duration-300 ease-in-out shadow-xl flex flex-col
                ${
                  isOpen
                    ? 'w-[260px] translate-x-0'
                    : 'w-[260px] -translate-x-full lg:translate-x-0 lg:w-[80px]'
                }
            `}
      >
        {/* 1. Header (Logo) */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
          <Link to="/" className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span
              className={`font-bold text-lg tracking-wide transition-opacity duration-300 ${
                !isOpen && 'lg:opacity-0 lg:hidden'
              }`}
            >
              AdminPanel
            </span>
          </Link>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white p-1">
            <FiX size={24} />
          </button>
        </div>

        {/* 2. Navigation (Scrollable) */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
          {menuItems.map((item) => {
            const active = isParentActive(item);
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isExpanded = expandedMenu === item.id;

            return (
              <div key={item.id}>
                {hasSubmenu ? (
                  // Submenu Item
                  <div>
                    <button
                      onClick={() => toggleMenu(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200 group relative
                                                ${
                                                  active
                                                    ? 'bg-blue-600 text-white shadow-md'
                                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                                }
                                            `}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon
                          className={`text-xl flex-shrink-0 transition-colors ${
                            !active && 'group-hover:text-white'
                          }`}
                        />
                        <span
                          className={`text-sm font-medium transition-opacity ${
                            !isOpen && 'lg:hidden'
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>
                      {isOpen && (
                        <div className="text-gray-400">
                          {isExpanded ? <FiChevronDown /> : <FiChevronRight />}
                        </div>
                      )}
                    </button>

                    {/* Collapsible Content */}
                    <Collapse isOpened={isOpen && isExpanded}>
                      <ul className="mt-1 ml-3 pl-3 border-l border-gray-700 space-y-1">
                        {item.submenu.map((sub, idx) => (
                          <li key={idx}>
                            <Link
                              to={sub.path}
                              className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                                isActive(sub.path)
                                  ? 'text-white bg-gray-800'
                                  : 'text-gray-500 hover:text-gray-300'
                              }`}
                            >
                              {sub.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </Collapse>
                  </div>
                ) : (
                  // Single Item
                  <Link
                    to={item.path}
                    title={!isOpen ? item.label : ''}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative
                                            ${
                                              active
                                                ? 'bg-blue-600 text-white shadow-blue-900/20 shadow-lg'
                                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                            }
                                        `}
                  >
                    <item.icon
                      className={`text-xl flex-shrink-0 transition-colors ${
                        !active && 'group-hover:text-white'
                      }`}
                    />

                    <span
                      className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                        !isOpen ? 'lg:opacity-0 lg:w-0 lg:hidden' : 'opacity-100'
                      }`}
                    >
                      {item.label}
                    </span>

                    {/* Tooltip for collapsed state */}
                    {!isOpen && (
                      <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap hidden lg:block shadow-lg border border-gray-700">
                        {item.label}
                      </div>
                    )}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* 3. Footer (User Profile) */}
        <div className="p-4 border-t border-gray-800 bg-[#0f1523]">
          <div
            className={`flex items-center gap-3 transition-all duration-300 ${
              !isOpen && 'justify-center'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 p-[2px] flex-shrink-0">
              <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-bold text-xs">
                    {user?.name?.charAt(0) || 'A'}
                  </span>
                )}
              </div>
            </div>

            <div
              className={`flex-1 min-w-0 transition-opacity duration-300 ${!isOpen && 'lg:hidden'}`}
            >
              <p className="text-sm font-semibold text-white truncate">
                {user?.name || 'Admin User'}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@example.com'}</p>
            </div>

            <button
              onClick={handleLogout}
              className={`text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-gray-800 ${
                !isOpen && 'lg:hidden'
              }`}
              title="Logout"
            >
              <IoMdLogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
