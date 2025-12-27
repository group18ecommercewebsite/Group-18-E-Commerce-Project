import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiUpload, FiTrash2 } from 'react-icons/fi';
import { getCategoryById, updateCategory, uploadCategoryImages } from '../../api/categoryApi';
import CircularProgress from '@mui/material/CircularProgress';

const EditCategory = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        image: null,
        imagePreview: null,
        currentImage: ''
    });
    const [error, setError] = useState('');

    // Fetch category data
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                setLoading(true);
                const response = await getCategoryById(id);
                console.log('Category data:', response);
                
                if (response.success && (response.data || response.category)) {
                    const cat = response.data || response.category;
                    const catImage = cat.images?.[0] || cat.image || '';
                    setFormData({
                        name: cat.name || '',
                        image: null,
                        imagePreview: catImage || null,
                        currentImage: catImage
                    });
                } else {
                    setError('Không tìm thấy danh mục');
                }
            } catch (err) {
                console.error('Failed to fetch category:', err);
                setError('Lỗi khi tải thông tin danh mục');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCategory();
        }
    }, [id]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('Vui lòng chọn file ảnh');
            return;
        }

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
            currentImage: '' // Clear current image so it gets removed on save
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            setError('Vui lòng nhập tên danh mục');
            return;
        }

        try {
            setSaving(true);
            setError('');

            let imageUrl = formData.currentImage; // Will be empty if user removed the image

            // Upload new image if changed
            if (formData.image) {
                const imageFormData = new FormData();
                imageFormData.append('images', formData.image);

                const uploadRes = await uploadCategoryImages(imageFormData);
                console.log('Upload response:', uploadRes);
                
                // Server trả về {images: [...]} hoặc {success: true, data: [...]}
                const uploadedImages = uploadRes.images || uploadRes.data;
                
                if (!uploadedImages || !uploadedImages[0]) {
                    throw new Error('Upload ảnh thất bại');
                }

                imageUrl = uploadedImages[0];
            }

            // Update category - send images as array (empty array means no image)
            const updateData = {
                name: formData.name.trim(),
                images: imageUrl ? [imageUrl] : [] // Send as array, empty if removed
            };

            const updateRes = await updateCategory(id, updateData);

            if (updateRes.success) {
                navigate('/categories');
            } else {
                throw new Error(updateRes.message || 'Cập nhật danh mục thất bại');
            }

        } catch (err) {
            console.error('Error updating category:', err);
            setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
                <CircularProgress />
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-6 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa danh mục</h1>
                    <p className="text-gray-600 mt-1">Cập nhật thông tin danh mục</p>
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
                            placeholder="Nhập tên danh mục"
                        />
                    </div>

                    {/* Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Hình ảnh đại diện
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
                            disabled={saving}
                            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <CircularProgress size={18} color="inherit" />
                                    <span>Đang lưu...</span>
                                </>
                            ) : (
                                'Lưu thay đổi'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCategory;
