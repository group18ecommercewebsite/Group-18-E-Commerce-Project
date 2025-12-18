import React, { useState } from 'react';
import { Chip } from '@mui/material';
import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const SubCategories = () => {
    const navigate = useNavigate();
    const [subCategories] = useState([
        { id: 1, name: 'Nam', parentCategory: 'Thời trang' },
        { id: 2, name: 'Nữ', parentCategory: 'Thời trang' },
        { id: 3, name: 'Trẻ em', parentCategory: 'Thời trang' },
        { id: 4, name: 'Điện thoại', parentCategory: 'Điện tử' },
        { id: 5, name: 'Laptop', parentCategory: 'Điện tử' },
        { id: 6, name: 'Tablet', parentCategory: 'Điện tử' },
        { id: 7, name: 'Túi xách', parentCategory: 'Phụ kiện' },
        { id: 8, name: 'Giày dép', parentCategory: 'Phụ kiện' }
    ]);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Danh mục phụ</h1>
                        <p className="text-gray-600 mt-1">Quản lý các danh mục con của sản phẩm</p>
                    </div>
                    <button
                        onClick={() => navigate('/category/subCat/add')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <FiPlus className="text-sm" />
                        Thêm danh mục phụ
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
                                    Tên danh mục phụ
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Danh mục cha
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {subCategories.map((subCat) => (
                                <tr key={subCat.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-medium text-gray-900">{subCat.name}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Chip
                                            label={subCat.parentCategory}
                                            sx={{
                                                backgroundColor: '#F3F4F6',
                                                color: '#374151',
                                                fontWeight: 600,
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SubCategories;

