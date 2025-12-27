import { useState, useRef, useEffect } from 'react'
import { FiMenu, FiBell, FiChevronDown, FiSettings, FiUser, FiLogOut, FiSearch } from 'react-icons/fi'
import { useAuth } from '../../Context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Header({ onToggleSidebar = () => { } }) {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)
    const [notifOpen, setNotifOpen] = useState(false)
    const menuRef = useRef(null)
    const notifRef = useRef(null)
    const notifications = 5

    useEffect(() => {
        function handleClick(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false)
            }
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setNotifOpen(false)
            }
        }
        document.addEventListener('click', handleClick)
        return () => document.removeEventListener('click', handleClick)
    }, [])

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Left side */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onToggleSidebar}
                            aria-label="Toggle sidebar"
                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                        >
                            <FiMenu className="h-5 w-5" />
                        </button>

                        {/* Search Bar */}
                        <div className="hidden md:flex items-center">
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm..."
                                    className="pl-10 pr-4 py-2 w-64 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-2">
                        {/* Notifications */}
                        <div className="relative" ref={notifRef}>
                            <button
                                onClick={() => setNotifOpen(!notifOpen)}
                                className="relative p-2.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                                aria-label="Notifications"
                            >
                                <FiBell className="h-5 w-5" />
                                {notifications > 0 && (
                                    <span className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full">
                                        {notifications > 99 ? '99+' : notifications}
                                    </span>
                                )}
                            </button>

                            {notifOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                                        <h3 className="text-sm font-semibold text-gray-800">Thông báo</h3>
                                    </div>
                                    <div className="max-h-80 overflow-auto">
                                        <div className="p-4 text-center text-gray-500 text-sm">
                                            <p>Bạn có {notifications} thông báo mới</p>
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                            Xem tất cả
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Divider */}
                        <div className="h-8 w-px bg-gray-200 mx-1"></div>

                        {/* User Menu */}
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="flex items-center gap-3 p-1.5 pr-3 rounded-lg hover:bg-gray-100 transition-colors"
                                aria-haspopup="true"
                                aria-expanded={menuOpen}
                            >
                                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        user?.name?.charAt(0)?.toUpperCase() || 'A'
                                    )}
                                </div>
                                <div className="hidden sm:block text-left">
                                    <p className="text-sm font-medium text-gray-700 leading-tight">{user?.name || 'Admin'}</p>
                                    <p className="text-xs text-gray-500">Admin</p>
                                </div>
                                <FiChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {menuOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                                        <p className="text-sm font-medium text-gray-800">{user?.name || 'Admin'}</p>
                                        <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
                                    </div>
                                    <div className="py-1">
                                        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                            <FiUser className="h-4 w-4 text-gray-400" />
                                            Hồ sơ cá nhân
                                        </button>
                                        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                            <FiSettings className="h-4 w-4 text-gray-400" />
                                            Cài đặt
                                        </button>
                                    </div>
                                    <div className="border-t border-gray-200 py-1">
                                        <button 
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <FiLogOut className="h-4 w-4" />
                                            Đăng xuất
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}