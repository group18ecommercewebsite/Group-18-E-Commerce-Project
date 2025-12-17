import React, { useState } from 'react';
import { Chip } from '@mui/material';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
    const navigate = useNavigate();
    const [categories] = useState([
        {
            id: 1,
            name: 'Thời trang',
            image: 'https://via.placeholder.com/200x200/4F46E5/FFFFFF?text=Thoi+Trang',
            subCategories: ['Nam', 'Nữ', 'Trẻ em']
        },
        {
            id: 2,
            name: 'Điện tử',
            image: 'https://via.placeholder.com/200x200/10B981/FFFFFF?text=Dien+Tu',
            subCategories: ['Điện thoại', 'Laptop', 'Tablet']
        },
        {
            id: 3,
            name: 'Phụ kiện',
            image: 'https://via.placeholder.com/200x200/F59E0B/FFFFFF?text=Phu+Kien',
            subCategories: ['Túi xách', 'Giày dép', 'Đồng hồ']
        }
    ]);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Danh mục sản phẩm</h1>
                        <p className="text-gray-600 mt-1">Quản lý các danh mục cha của sản phẩm</p>
                    </div>
                    <button
                        onClick={() => navigate('/categories/add')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <FiPlus className="text-sm" />
                        Thêm danh mục
                    </button>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                    <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="relative h-48 bg-gray-100">
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">{category.name}</h3>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                                {category.subCategories.map((subCat, index) => (
                                    <Chip
                                        key={index}
                                        label={subCat}
                                        size="small"
                                        sx={{
                                            backgroundColor: '#EFF6FF',
                                            color: '#1E40AF',
                                            fontWeight: 500,
                                            '&:hover': {
                                                backgroundColor: '#DBEAFE'
                                            }
                                        }}
                                    />
                                ))}
                            </div>

                            <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => navigate(`/categories/edit/${category.id}`)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                                >
                                    <FiEdit2 className="w-4 h-4" />
                                    <span className="text-sm font-medium">Sửa</span>
                                </button>
                                <button
                                    onClick={() => {
                                        if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
                                            // TODO: Xử lý xóa
                                        }
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                    <FiTrash2 className="w-4 h-4" />
                                    <span className="text-sm font-medium">Xóa</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Categories;

