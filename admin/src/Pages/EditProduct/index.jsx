import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiUpload, FiTrash2, FiSave } from 'react-icons/fi';
import { getProductById, updateProduct, uploadProductImages } from '../../api/productApi';
import { getCategories } from '../../api/categoryApi';
import CircularProgress from '@mui/material/CircularProgress';

const EditProduct = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        brand: '',
        price: '',
        oldPrice: '',
        countInStock: '',
        catId: '',
        catName: '',
        subCatId: '',
        subCatName: '',
        isFeatured: false,
        discount: ''
    });
    
    // Separate state for images to avoid confusion
    const [existingImages, setExistingImages] = useState([]); // URLs from server
    const [newImages, setNewImages] = useState([]); // { file: File, preview: string }

    useEffect(() => {
        fetchProduct();
        fetchCategories();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await getProductById(id);
            console.log('Product response:', response);
            
            if (response.success && response.product) {
                const product = response.product;
                setFormData({
                    name: product.name || '',
                    description: product.description || '',
                    brand: product.brand || '',
                    price: product.price || '',
                    oldPrice: product.oldPrice || '',
                    countInStock: product.countInStock || '',
                    catId: product.catId || product.category?._id || '',
                    catName: product.catName || product.category?.name || '',
                    subCatId: product.subCatId || '',
                    subCatName: product.subCatName || '',
                    isFeatured: product.isFeatured || false,
                    discount: product.discount || ''
                });
                // Set existing images separately
                setExistingImages(product.images || []);
                setNewImages([]);
            } else {
                setError('Không tìm thấy sản phẩm');
            }
        } catch (err) {
            console.error('Failed to fetch product:', err);
            setError('Lỗi khi tải thông tin sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await getCategories();
            if (response.success) {
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
                setCategories(flattenCategories(response.data || []));
            }
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCategoryChange = (e) => {
        const catId = e.target.value;
        const selectedCat = categories.find(cat => cat._id === catId);
        setFormData(prev => ({
            ...prev,
            catId,
            catName: selectedCat?.name || ''
        }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // Create preview URLs and store with files
        const newImagesWithPreviews = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        
        setNewImages(prev => [...prev, ...newImagesWithPreviews]);
    };

    const removeExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeNewImage = (index) => {
        setNewImages(prev => {
            // Revoke the preview URL to free memory
            URL.revokeObjectURL(prev[index].preview);
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            setError('Vui lòng nhập tên sản phẩm');
            return;
        }

        try {
            setSaving(true);
            setError('');
            setSuccess('');

            // Start with existing images (already uploaded to server)
            let finalImages = [...existingImages];

            // Upload new images if any
            if (newImages.length > 0) {
                const imageFormData = new FormData();
                newImages.forEach(({ file }) => {
                    imageFormData.append('images', file);
                });

                const uploadRes = await uploadProductImages(imageFormData);
                console.log('Upload response:', uploadRes);
                
                if (uploadRes.images && uploadRes.images.length > 0) {
                    finalImages = [...finalImages, ...uploadRes.images];
                }
            }

            console.log('Final images to save:', finalImages);

            const updateData = {
                name: formData.name.trim(),
                description: formData.description,
                brand: formData.brand,
                price: parseFloat(formData.price) || 0,
                oldPrice: parseFloat(formData.oldPrice) || 0,
                countInStock: parseInt(formData.countInStock) || 0,
                catId: formData.catId,
                catName: formData.catName,
                subCatId: formData.subCatId,
                subCatName: formData.subCatName,
                isFeatured: formData.isFeatured,
                discount: parseFloat(formData.discount) || 0,
                images: finalImages
            };

            const response = await updateProduct(id, updateData);

            if (response.success) {
                setSuccess('Cập nhật sản phẩm thành công!');
                setTimeout(() => navigate('/products'), 1500);
            } else {
                throw new Error(response.message || 'Cập nhật thất bại');
            }

        } catch (err) {
            console.error('Error updating product:', err);
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
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/products')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <FiArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa sản phẩm</h1>
                            <p className="text-gray-600 mt-1">ID: {id?.slice(-8)}</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {/* Messages */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
                            {success}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Info */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cơ bản</h2>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tên sản phẩm <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            placeholder="Nhập tên sản phẩm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Mô tả
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                                            placeholder="Nhập mô tả sản phẩm"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Thương hiệu
                                            </label>
                                            <input
                                                type="text"
                                                name="brand"
                                                value={formData.brand}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                                placeholder="Nhập thương hiệu"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Danh mục
                                            </label>
                                            <select
                                                value={formData.catId}
                                                onChange={handleCategoryChange}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                                            >
                                                <option value="">Chọn danh mục</option>
                                                {categories.map(cat => (
                                                    <option key={cat._id} value={cat._id}>
                                                        {'—'.repeat(cat.level || 0)} {cat.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Images */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    Hình ảnh ({existingImages.length + newImages.length})
                                </h2>
                                
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                                    {/* Existing Images from server */}
                                    {existingImages.map((img, index) => (
                                        <div key={`existing-${index}`} className="relative group aspect-square">
                                            <img
                                                src={img}
                                                alt={`Product ${index + 1}`}
                                                className="w-full h-full object-cover rounded-lg border border-gray-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(index)}
                                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <FiTrash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    
                                    {/* New Images (previews) */}
                                    {newImages.map((imgObj, index) => (
                                        <div key={`new-${index}`} className="relative group aspect-square">
                                            <img
                                                src={imgObj.preview}
                                                alt={`New ${index + 1}`}
                                                className="w-full h-full object-cover rounded-lg border-2 border-blue-300"
                                            />
                                            <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-blue-500 text-white text-xs rounded">
                                                Mới
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeNewImage(index)}
                                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <FiTrash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    
                                    {/* Add Image Button */}
                                    <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                        <FiUpload className="text-gray-400 text-xl mb-2" />
                                        <span className="text-xs text-gray-500">Thêm ảnh</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Pricing */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Giá & Kho</h2>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Giá bán (VNĐ)
                                        </label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            placeholder="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Giá gốc (VNĐ)
                                        </label>
                                        <input
                                            type="number"
                                            name="oldPrice"
                                            value={formData.oldPrice}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            placeholder="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Giảm giá (%)
                                        </label>
                                        <input
                                            type="number"
                                            name="discount"
                                            value={formData.discount}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            placeholder="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Số lượng tồn kho
                                        </label>
                                        <input
                                            type="number"
                                            name="countInStock"
                                            value={formData.countInStock}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            placeholder="0"
                                        />
                                    </div>

                                    <div className="flex items-center gap-3 pt-2">
                                        <input
                                            type="checkbox"
                                            name="isFeatured"
                                            id="isFeatured"
                                            checked={formData.isFeatured}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="isFeatured" className="text-sm text-gray-700">
                                            Sản phẩm nổi bật
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {saving ? (
                                        <>
                                            <CircularProgress size={18} color="inherit" />
                                            <span>Đang lưu...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FiSave size={18} />
                                            <span>Lưu thay đổi</span>
                                        </>
                                    )}
                                </button>
                                
                                <button
                                    type="button"
                                    onClick={() => navigate('/products')}
                                    disabled={saving}
                                    className="w-full mt-3 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;
