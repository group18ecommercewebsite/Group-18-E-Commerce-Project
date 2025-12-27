import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories, createCategory, uploadCategoryImages } from '../../api/categoryApi';
import { FiUpload, FiTrash2 } from 'react-icons/fi';
import CircularProgress from '@mui/material/CircularProgress';

const AddSubCategory = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [parentCategories, setParentCategories] = useState([]);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        parentId: '',
        image: null,
        imagePreview: null
    });

    // Fetch parent categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await getCategories();
                if (response.success) {
                    // Flatten all categories (including nested ones) for parent selection
                    const flattenCategories = (cats, level = 0) => {
                        let result = [];
                        cats.forEach(cat => {
                            result.push({ ...cat, level });
                            if (cat.children?.length > 0) {
                                result = result.concat(flattenCategories(cat.children, level + 1));
                            }
                        });
                        return result;
                    };
                    setParentCategories(flattenCategories(response.data || []));
                }
            } catch (err) {
                console.error('Failed to fetch categories:', err);
                setError('Lỗi khi tải danh mục');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleImageUpload = (e) => {
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
            imagePreview: null
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            setError('Vui lòng nhập tên danh mục');
            return;
        }

        if (!formData.parentId) {
            setError('Vui lòng chọn danh mục cha');
            return;
        }

        try {
            setSaving(true);
            setError('');

            let imageUrl = '';

            // Upload image if selected
            if (formData.image) {
                const imageFormData = new FormData();
                imageFormData.append('images', formData.image);

                const uploadRes = await uploadCategoryImages(imageFormData);
                const uploadedImages = uploadRes.images || uploadRes.data;
                
                if (uploadedImages?.[0]) {
                    imageUrl = uploadedImages[0];
                }
            }

            // Create subcategory (category with parentId)
            const categoryData = {
                name: formData.name.trim(),
                parentId: formData.parentId
            };

            if (imageUrl) {
                categoryData.images = [imageUrl];
            }

            const createRes = await createCategory(categoryData);

            if (createRes.success) {
                navigate('/categories');
            } else {
                throw new Error(createRes.message || 'Tạo danh mục phụ thất bại');
            }

        } catch (err) {
            console.error('Error creating subcategory:', err);
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
                    <h1 className="text-2xl font-bold text-gray-900">Thêm danh mục con</h1>
                    <p className="text-gray-600 mt-1">Nhập thông tin để tạo danh mục con mới</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
                    {/* Error */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Parent Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Danh mục cha <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.parentId}
                            onChange={(e) => setFormData(prev => ({ ...prev, parentId: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                        >
                            <option value="">Chọn danh mục cha</option>
                            {parentCategories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {'—'.repeat(cat.level)} {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tên danh mục con <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="Nhập tên danh mục con"
                        />
                    </div>

                    {/* Image (Optional) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Hình ảnh (Tùy chọn)
                        </label>
                        {formData.imagePreview ? (
                            <div className="space-y-4">
                                <div className="relative group">
                                    <img
                                        src={formData.imagePreview}
                                        alt="Preview"
                                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <FiTrash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors w-fit text-sm">
                                    <FiUpload className="w-4 h-4" />
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
                            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                <FiUpload className="w-10 h-10 text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500">Click để tải ảnh</p>
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
                                    <span>Đang tạo...</span>
                                </>
                            ) : (
                                'Thêm danh mục con'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSubCategory;
