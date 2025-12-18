import React, { useState } from 'react';
import { useBanner } from '../../Context/BannerContext';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

const HomeSlides = () => {
    const { openPanel } = useBanner();
    const [banners, setBanners] = useState([
        {
            id: 1,
            image: 'https://via.placeholder.com/1920x600/4F46E5/FFFFFF?text=Banner+1',
            createdAt: '2025-01-15'
        },
        {
            id: 2,
            image: 'https://via.placeholder.com/1920x600/10B981/FFFFFF?text=Banner+2',
            createdAt: '2025-01-14'
        },
        {
            id: 3,
            image: 'https://via.placeholder.com/1920x600/F59E0B/FFFFFF?text=Banner+3',
            createdAt: '2025-01-13'
        }
    ]);

    const handleEdit = (banner) => {
        openPanel(banner);
    };

    const handleDelete = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa banner này?')) {
            setBanners(banners.filter(banner => banner.id !== id));
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Quản lý Banner trang chủ</h1>
                        <p className="text-gray-600 mt-1">Danh sách các banner slide đang hiển thị trên trang chủ</p>
                    </div>
                    <button
                        onClick={() => openPanel()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <FiPlus className="text-sm" />
                        Thêm Banner
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Hình ảnh
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Ngày tạo
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {banners.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
                                        Chưa có banner nào. Hãy thêm banner mới.
                                    </td>
                                </tr>
                            ) : (
                                banners.map((banner) => (
                                    <tr key={banner.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <img
                                                    src={banner.image}
                                                    alt={`Banner ${banner.id}`}
                                                    className="h-20 w-32 object-cover rounded-lg border border-gray-200"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {banner.createdAt}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    onClick={() => handleEdit(banner)}
                                                    className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Chỉnh sửa"
                                                >
                                                    <FiEdit2 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(banner.id)}
                                                    className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Xóa"
                                                >
                                                    <FiTrash2 className="w-5 h-5" />
                                                </button>
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

export default HomeSlides;

