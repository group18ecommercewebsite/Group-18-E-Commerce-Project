import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  FiMail,
  FiPhone,
  FiCalendar,
  FiSearch,
  FiUser,
  FiTrash2,
  FiChevronDown,
  FiShield,
} from 'react-icons/fi';
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

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Bạn có chắc muốn xóa người dùng "${userName}"?`)) return;

    try {
      setActionLoading(userId);
      const response = await deleteUser(userId);
      if (response.success) {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
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

  const handleChangeRole = async (userId, newRole) => {
    try {
      setActionLoading(userId);
      const response = await updateUserRole(userId, newRole);
      if (response.success) {
        setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
      }
    } catch (error) {
      console.error('Update role error:', error);
      alert(error.response?.data?.message || 'Không thể cập nhật vai trò');
    } finally {
      setActionLoading(null);
      setRoleDropdown(null);
    }
  };

  // Optimize filter
  const filteredUsers = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return users.filter(
      (user) =>
        (user.name?.toLowerCase() || '').includes(search) ||
        (user.email?.toLowerCase() || '').includes(search) ||
        String(user.mobile || '').includes(search)
    );
  }, [users, searchTerm]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const getRoleBadgeColor = (role) => {
    return role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {loading ? 'Đang tải...' : `${users.length} người dùng đã đăng ký`}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo tên, email, SĐT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
          />
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUser className="text-3xl text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Không tìm thấy người dùng</h3>
          <p className="text-gray-500 mt-1 text-sm">Thử thay đổi từ khóa tìm kiếm.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Người dùng
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Liên hệ
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Vai trò
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Ngày tham gia
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt=""
                                className="h-full w-full object-cover rounded-full"
                              />
                            ) : (
                              user.name?.charAt(0)?.toUpperCase() || 'U'
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                              {user.name || 'No Name'}
                            </div>
                            <div className="text-xs text-gray-500">ID: {user._id.slice(-6)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <FiMail className="w-3.5 h-3.5 mr-2 text-gray-400" />
                            <span className="truncate max-w-[180px]">{user.email}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <FiPhone className="w-3.5 h-3.5 mr-2 text-gray-400" />
                            <span>{user.mobile || '-'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative">
                          <button
                            onClick={() =>
                              setRoleDropdown(roleDropdown === user._id ? null : user._id)
                            }
                            disabled={actionLoading === user._id}
                            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full transition-colors border border-transparent hover:border-gray-200 ${getRoleBadgeColor(
                              user.role
                            )}`}
                          >
                            {user.role === 'ADMIN' ? (
                              <FiShield className="w-3 h-3" />
                            ) : (
                              <FiUser className="w-3 h-3" />
                            )}
                            {user.role || 'USER'}
                            <FiChevronDown
                              className={`w-3 h-3 transition-transform ${
                                roleDropdown === user._id ? 'rotate-180' : ''
                              }`}
                            />
                          </button>

                          {roleDropdown === user._id && (
                            <div
                              ref={dropdownRef}
                              className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50 w-32 animate-fade-in-up"
                            >
                              {['USER', 'ADMIN'].map((role) => (
                                <button
                                  key={role}
                                  onClick={() => handleChangeRole(user._id, role)}
                                  className={`w-full px-4 py-2 text-left text-xs font-medium hover:bg-gray-50 flex items-center justify-between ${
                                    user.role === role
                                      ? 'text-blue-600 bg-blue-50'
                                      : 'text-gray-700'
                                  }`}
                                >
                                  {role}
                                  {user.role === role && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                                  )}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="text-gray-400" />
                          {formatDate(user.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDeleteUser(user._id, user.name)}
                          disabled={actionLoading === user._id}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Xóa người dùng"
                        >
                          {actionLoading === user._id ? (
                            <CircularProgress size={16} color="inherit" />
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
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 relative overflow-hidden"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt=""
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        user.name?.charAt(0)?.toUpperCase() || 'U'
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.name || 'No Name'}</h3>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteUser(user._id, user.name)}
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    <FiTrash2 />
                  </button>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <FiPhone className="text-gray-400" /> {user.mobile || '---'}
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCalendar className="text-gray-400" /> {formatDate(user.createdAt)}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                    Vai trò
                  </span>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    {['USER', 'ADMIN'].map((role) => (
                      <button
                        key={role}
                        onClick={() => user.role !== role && handleChangeRole(user._id, role)}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                          user.role === role
                            ? 'bg-white shadow-sm text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                {actionLoading === user._id && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                    <CircularProgress size={24} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Users;
