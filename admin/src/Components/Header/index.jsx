import { useState, useRef, useEffect } from 'react'
import { FiMenu, FiBell, FiChevronDown } from 'react-icons/fi'

export default function Header({ onToggleSidebar = () => { } }) {
    const [menuOpen, setMenuOpen] = useState(false)
    const [notifOpen, setNotifOpen] = useState(false)
    const menuRef = useRef(null)
    const notifRef = useRef(null)
    const notifications = 99

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

    return (
        <header className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onToggleSidebar}
                            aria-label="Toggle sidebar"
                            className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
                        >
                            <FiMenu className="h-6 w-6" />
                        </button>

                        <div className="flex items-center">
                            <img src="/logo192.png" alt="logo" className="h-10 w-10 object-contain" />
                            <div className="ml-3 hidden sm:block">
                                <div className="text-lg font-bold text-gray-800">DOGEDOGSHOP</div>
                                <div className="text-xs text-gray-500">BIG MEGA GIGA SUPER ULTRA STORE</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative" ref={notifRef}>
                            <button
                                onClick={() => setNotifOpen(!notifOpen)}
                                className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100"
                                aria-label="Notifications"
                            >
                                <FiBell className="h-6 w-6" />
                                {notifications > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">{notifications}</span>
                                )}
                            </button>

                            {notifOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                                    <div className="py-2">
                                        <div className="px-4 py-2 text-sm text-gray-700 border-b">Notifications</div>
                                        <div className="max-h-48 overflow-auto">
                                            <div className="px-4 py-2 text-sm text-gray-600">You have {notifications} new notifications.</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="flex items-center gap-2 rounded-full focus:outline-none"
                                aria-haspopup="true"
                                aria-expanded={menuOpen}
                            >
                                <img className="h-9 w-9 rounded-full object-cover" src="https://www.gravatar.com/avatar?d=mp&s=200" alt="User" />
                                <FiChevronDown className="h-4 w-4 text-gray-500" />
                            </button>

                            {menuOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                                    <div className="py-1">
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</a>
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