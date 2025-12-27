import React, { useState, useEffect, useRef } from 'react';
import { FiMail, FiPhone, FiCalendar, FiSearch, FiUser, FiTrash2, FiChevronDown } from 'react-icons/fi';
import { getAllUsers, deleteUser, updateUserRole } from '../../api/userApi';
import CircularProgress from '@mui/material/CircularProgress';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleDropdown, setRoleDropdown] = useState(null); // userId of open dropdown
    const [actionLoading, setActionLoading] = useState(null); // userId being processed
    const dropdownRef = useRef(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setRoleDropdown(null);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await getAllUsers();
            
            if (response.success) {
                setUsers(response.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle delete user
    const handleDeleteUser = async (userId, userName) => {
        if (!window.confirm(`Bạn có chắc muốn xóa người dùng "${userName}"?`)) {
            return;
        }

        try {
            setActionLoading(userId);
            const response = await deleteUser(userId);
            
            if (response.success) {
                setUsers(prev => prev.filter(u => u._id !== userId));
                alert('Xóa người dùng thành công!');
            } else {
                alert(response.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Delete user error:', error);
            alert(error.response?.data?.message || 'Không thể xóa người dùng');
        } finally {
            setActionLoading(null);
        }
    };

    // Handle change role
    const handleChangeRole = async (userId, newRole) => {
        try {
            setActionLoading(userId);
            const response = await updateUserRole(userId, newRole);
            
            if (response.success) {
                setUsers(prev => prev.map(u => 
                    u._id === userId ? { ...u, role: newRole } : u
                ));
            } else {
                alert(response.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Update role error:', error);
            alert(error.response?.data?.message || 'Không thể cập nhật vai trò');
        } finally {
            setActionLoading(null);
            setRoleDropdown(null);
        }
    };

    // Filter users by search (fix: convert mobile to string)
    const filteredUsers = users.filter(user => {
        const name = user.name?.toLowerCase() || '';
        const email = user.email?.toLowerCase() || '';
        const mobile = String(user.mobile || '');
        const search = searchTerm.toLowerCase();
        
        return name.includes(search) || email.includes(search) || mobile.includes(search);
    });

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
                        <p className="text-gray-600 mt-1">
                            {loading ? 'Đang tải...' : `${users.length} người dùng đã đăng ký`}
                        </p>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="mb-6 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <div className="relative max-w-md">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm theo tên, email hoặc SĐT..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="py-20 flex justify-center">
                        <CircularProgress />
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="py-20 text-center text-gray-500">
                        <FiUser className="mx-auto text-5xl text-gray-300 mb-4" />
                        <p>Không tìm thấy người dùng nào</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Người dùng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Số điện thoại
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Vai trò
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Ngày tạo
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Hành động
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                                    {user.avatar ? (
                                                        <img
                                                            className="h-full w-full object-cover"
                                                            src={user.avatar}
                                                            alt={user.name}
                                                        />
                                                    ) : (
                                                        user.name?.charAt(0)?.toUpperCase() || 'U'
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user.name || 'Chưa có tên'}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        ID: {user._id?.slice(-8)}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <FiMail className="w-4 h-4 mr-2 text-gray-400" />
                                                {user.email || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <FiPhone className="w-4 h-4 mr-2 text-gray-400" />
                                                {user.mobile || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap relative">
                                            {/* Role dropdown */}
                                            <div className="relative" ref={roleDropdown === user._id ? dropdownRef : null}>
                                                <button
                                                    onClick={() => setRoleDropdown(roleDropdown === user._id ? null : user._id)}
                                                    disabled={actionLoading === user._id}
                                                    className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full cursor-pointer transition-all ${
                                                        user.role === 'ADMIN' 
                                                            ? 'bg-purple-100 text-purple-800 hover:bg-purple-200' 
                                                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                                    } ${actionLoading === user._id ? 'opacity-50' : ''}`}
                                                >
                                                    {user.role || 'USER'}
                                                    <FiChevronDown className={`w-3 h-3 transition-transform ${roleDropdown === user._id ? 'rotate-180' : ''}`} />
                                                </button>
                                                
                                                {roleDropdown === user._id && (
                                                    <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 min-w-[100px]">
                                                        <button
                                                            onClick={() => handleChangeRole(user._id, 'USER')}
                                                            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${user.role === 'USER' ? 'bg-gray-100 font-medium' : ''}`}
                                                        >
                                                            USER
                                                        </button>
                                                        <button
                                                            onClick={() => handleChangeRole(user._id, 'ADMIN')}
                                                            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${user.role === 'ADMIN' ? 'bg-purple-100 font-medium text-purple-800' : ''}`}
                                                        >
                                                            ADMIN
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <FiCalendar className="w-4 h-4 mr-2 text-gray-400" />
                                                {formatDate(user.createdAt)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <button
                                                onClick={() => handleDeleteUser(user._id, user.name)}
                                                disabled={actionLoading === user._id}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                title="Xóa người dùng"
                                            >
                                                {actionLoading === user._id ? (
                                                    <CircularProgress size={16} />
                                                ) : (
                                                    <FiTrash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Users;
