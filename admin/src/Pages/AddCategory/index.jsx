import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiTrash2 } from 'react-icons/fi';
import { uploadCategoryImages, createCategory } from '../../api/categoryApi';
import CircularProgress from '@mui/material/CircularProgress';

const AddCategory = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        image: null,
        imagePreview: null,
        imageUrl: ''
    });
    const [error, setError] = useState('');

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Vui lòng chọn file ảnh');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Kích thước ảnh tối đa 5MB');
            return;
        }

        setError('');
        const preview = URL.createObjectURL(file);
        setFormData(prev => ({
            ...prev,
            image: file,
            imagePreview: preview
        }));
    };

    const removeImage = () => {
        setFormData(prev => ({
            ...prev,
            image: null,
            imagePreview: null,
            imageUrl: ''
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            setError('Vui lòng nhập tên danh mục');
            return;
        }

        if (!formData.image) {
            setError('Vui lòng chọn hình ảnh');
            return;
        }

        try {
            setLoading(true);
            setError('');

            // 1. Upload image first
            const imageFormData = new FormData();
            imageFormData.append('images', formData.image);

            const uploadRes = await uploadCategoryImages(imageFormData);
            console.log('Upload response:', uploadRes);
            
            // Server trả về {images: [...]} hoặc {success: true, data: [...]}
            const uploadedImages = uploadRes.images || uploadRes.data;
            
            if (!uploadedImages || !uploadedImages[0]) {
                throw new Error('Upload ảnh thất bại');
            }

            const imageUrl = uploadedImages[0];

            // 2. Create category with image URL
            const categoryData = {
                name: formData.name.trim(),
                image: imageUrl
            };

            const createRes = await createCategory(categoryData);

            if (createRes.success) {
                navigate('/categories');
            } else {
                throw new Error(createRes.message || 'Tạo danh mục thất bại');
            }

        } catch (err) {
            console.error('Error creating category:', err);
            setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
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
                    {/* Error Message */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tên danh mục <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="Nhập tên danh mục (VD: Fashion, Electronics...)"
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
                                        className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
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
                            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-all">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <FiUpload className="w-12 h-12 text-gray-400 mb-4" />
                                    <p className="mb-2 text-sm text-gray-500">
                                        <span className="font-semibold text-blue-600">Click để tải ảnh</span> hoặc kéo thả
                                    </p>
                                    <p className="text-xs text-gray-500">PNG, JPG, WEBP (Tối đa 5MB)</p>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => navigate('/categories')}
                            disabled={loading}
                            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <CircularProgress size={18} color="inherit" />
                                    <span>Đang xử lý...</span>
                                </>
                            ) : (
                                'Thêm danh mục'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCategory;
