import React, { useState } from 'react';
import { FiMail, FiPhone, FiCalendar } from 'react-icons/fi';

const Users = () => {
    const [users] = useState([
        {
            id: 1,
            name: 'Nguyễn Văn A',
            email: 'nguyenvana@example.com',
            phone: '+84 987 654 321',
            avatar: 'https://www.gravatar.com/avatar?d=mp&s=200',
            createdAt: '2025-01-15'
        },
        {
            id: 2,
            name: 'Trần Thị B',
            email: 'tranthib@example.com',
            phone: '+84 912 345 678',
            avatar: 'https://www.gravatar.com/avatar?d=mp&s=200',
            createdAt: '2025-01-14'
        },
        {
            id: 3,
            name: 'Lê Văn C',
            email: 'levanc@example.com',
            phone: '+84 934 567 890',
            avatar: 'https://www.gravatar.com/avatar?d=mp&s=200',
            createdAt: '2025-01-13'
        },
        {
            id: 4,
            name: 'Phạm Thị D',
            email: 'phamthid@example.com',
            phone: '+84 956 789 012',
            avatar: 'https://www.gravatar.com/avatar?d=mp&s=200',
            createdAt: '2025-01-12'
        },
        {
            id: 5,
            name: 'Hoàng Văn E',
            email: 'hoangvane@example.com',
            phone: '+84 923 456 789',
            avatar: 'https://www.gravatar.com/avatar?d=mp&s=200',
            createdAt: '2025-01-11'
        }
    ]);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
                    <p className="text-gray-600 mt-1">Danh sách khách hàng đã đăng ký tài khoản</p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
                                    Ngày tạo
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                        Chưa có người dùng nào.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <img
                                                    className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                                                    src={user.avatar}
                                                    alt={user.name}
                                                />
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <FiMail className="w-4 h-4 mr-2 text-gray-400" />
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <FiPhone className="w-4 h-4 mr-2 text-gray-400" />
                                                {user.phone}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <FiCalendar className="w-4 h-4 mr-2 text-gray-400" />
                                                {user.createdAt}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Users;

