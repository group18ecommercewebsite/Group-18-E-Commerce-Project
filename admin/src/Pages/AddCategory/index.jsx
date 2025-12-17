import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiX, FiTrash2 } from 'react-icons/fi';

const AddCategory = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        image: null,
        imagePreview: null
    });

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const preview = URL.createObjectURL(file);
            setFormData(prev => ({
                ...prev,
                image: file,
                imagePreview: preview
            }));
        }
    };

    const removeImage = () => {
        setFormData(prev => ({
            ...prev,
            image: null,
            imagePreview: null
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Category Data:', formData);
        // TODO: Xử lý submit
        navigate('/categories');
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-6 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900">Thêm danh mục mới</h1>
                    <p className="text-gray-600 mt-1">Nhập thông tin để tạo danh mục mới</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tên danh mục <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="Nhập tên danh mục"
                        />
                    </div>

                    {/* Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Hình ảnh đại diện <span className="text-red-500">*</span>
                        </label>
                        {formData.imagePreview ? (
                            <div className="space-y-4">
                                <div className="relative group">
                                    <img
                                        src={formData.imagePreview}
                                        alt="Category preview"
                                        className="w-full h-64 object-cover rounded-lg border border-gray-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <FiTrash2 className="w-5 h-5" />
                                    </button>
                                </div>
                                <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors w-fit">
                                    <FiUpload className="w-5 h-5" />
                                    <span>Thay đổi ảnh</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <FiUpload className="w-12 h-12 text-gray-400 mb-4" />
                                    <p className="mb-2 text-sm text-gray-500">
                                        <span className="font-semibold">Click để tải ảnh</span> hoặc kéo thả
                                    </p>
                                    <p className="text-xs text-gray-500">PNG, JPG, WEBP (Tối đa 5MB)</p>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    required
                                />
                            </label>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => navigate('/categories')}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Thêm danh mục
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCategory;

