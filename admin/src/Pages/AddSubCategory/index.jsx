import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddSubCategory = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        parentCategory: ''
    });

    const parentCategories = [
        { id: 1, name: 'Thời trang' },
        { id: 2, name: 'Điện tử' },
        { id: 3, name: 'Phụ kiện' },
        { id: 4, name: 'Gia dụng' }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('SubCategory Data:', formData);
        // TODO: Xử lý submit
        navigate('/category/subCat');
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-6 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900">Thêm danh mục phụ</h1>
                    <p className="text-gray-600 mt-1">Nhập thông tin để tạo danh mục phụ mới</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
                    {/* Parent Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Danh mục cha <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.parentCategory}
                            onChange={(e) => setFormData(prev => ({ ...prev, parentCategory: e.target.value }))}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                        >
                            <option value="">Chọn danh mục cha</option>
                            {parentCategories.map((cat) => (
                                <option key={cat.id} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tên danh mục phụ <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="Nhập tên danh mục phụ"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => navigate('/category/subCat')}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Thêm danh mục phụ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSubCategory;

