import { useState, useRef, useEffect } from 'react';
import {
  FiMenu,
  FiBell,
  FiChevronDown,
  FiSettings,
  FiUser,
  FiLogOut,
  FiSearch,
  FiX,
} from 'react-icons/fi';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

// 1. Helper Hook: Handles clicking outside of dropdowns to close them
function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

export default function Header({ onToggleSidebar = () => {} }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // State
  const [activeDropdown, setActiveDropdown] = useState(null); // 'menu', 'notif', or null

  // Refs
  const menuRef = useRef(null);
  const notifRef = useRef(null);

  const notifications = 5; // Example data

  // 2. Apply the custom hook to close dropdowns
  useClickOutside(menuRef, () => {
    if (activeDropdown === 'menu') setActiveDropdown(null);
  });
  useClickOutside(notifRef, () => {
    if (activeDropdown === 'notif') setActiveDropdown(null);
  });

  // 3. Toggle Logic: Ensures only one is open at a time
  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const handleLogout = async () => {
    try {
      await logout(); // Ensure logout completes before redirecting
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      <div className="px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* --- Left Side: Toggle & Search --- */}
          <div className="flex items-center gap-4">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100"
              aria-label="Toggle sidebar"
            >
              <FiMenu className="h-6 w-6" />
            </button>

            <div className="hidden md:flex items-center">
              <div className="relative group">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors h-4 w-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="pl-10 pr-4 py-2 w-64 bg-gray-50 border border-transparent rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* --- Right Side: Actions --- */}
          <div className="flex items-center gap-3">
            {/* Notifications Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => toggleDropdown('notif')}
                className={`relative p-2.5 rounded-lg transition-colors ${
                  activeDropdown === 'notif'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`}
              >
                <FiBell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                )}
              </button>

              {/* Dropdown Content */}
              {activeDropdown === 'notif' && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transform origin-top-right transition-all animate-fade-in-down">
                  <div className="px-4 py-3 bg-white border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-gray-800">Thông báo</h3>
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      {notifications} mới
                    </span>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {/* Mock Notification Items */}
                    {[1, 2, 3].map((_, i) => (
                      <div
                        key={i}
                        className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 transition-colors cursor-pointer flex gap-3"
                      >
                        <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                        <div>
                          <p className="text-sm text-gray-800 font-medium">Đơn hàng mới #102{i}</p>
                          <p className="text-xs text-gray-500 mt-0.5">Vừa xong</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 bg-gray-50 border-t border-gray-100">
                    <button className="w-full py-2 text-sm text-center text-gray-600 hover:text-blue-600 font-medium transition-colors">
                      Đánh dấu tất cả là đã đọc
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="h-6 w-px bg-gray-200 mx-1"></div>

            {/* User Profile Dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => toggleDropdown('menu')}
                className={`flex items-center gap-3 p-1.5 pr-3 rounded-lg transition-colors border ${
                  activeDropdown === 'menu'
                    ? 'bg-gray-50 border-gray-200'
                    : 'border-transparent hover:bg-gray-50'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    (user?.name?.charAt(0) || 'A').toUpperCase()
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-gray-700 leading-none">
                    {user?.name || 'Admin'}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-1">Administrator</p>
                </div>
                <FiChevronDown
                  className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                    activeDropdown === 'menu' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* User Menu Content */}
              {activeDropdown === 'menu' && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transform origin-top-right transition-all animate-fade-in-down">
                  <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                    <p className="text-sm font-semibold text-gray-900">Xin chào,</p>
                    <p className="text-sm text-gray-600 truncate font-medium">{user?.name}</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{user?.email}</p>
                  </div>

                  <div className="py-2">
                    <button className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      <FiUser className="h-4 w-4" /> Hồ sơ cá nhân
                    </button>
                    <button className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      <FiSettings className="h-4 w-4" /> Cài đặt
                    </button>
                  </div>

                  <div className="border-t border-gray-100 py-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                    >
                      <FiLogOut className="h-4 w-4" /> Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
