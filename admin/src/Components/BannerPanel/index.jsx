import React, { useState, useEffect } from 'react';
import { useBanner } from '../../Context/BannerContext';
import { FiX, FiUpload, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import CircularProgress from '@mui/material/CircularProgress';
// import { createBanner, updateBanner, uploadBannerImage } from '../../api/bannerApi'; // Uncomment when ready

const BannerPanel = () => {
    const { isOpen, closePanel, editingBanner } = useBanner();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const [formData, setFormData] = useState({
        imageFile: null,      // The actual File object to upload
        imagePreview: null,   // The URL for display (blob: or http:)
        title: '',            // Optional: Title/Alt text
        link: ''              // Optional: Click link
    });

    // Initialize or Reset Form
    useEffect(() => {
        if (isOpen) {
            setError('');
            setLoading(false);
            if (editingBanner) {
                setFormData({
                    imageFile: null,
                    imagePreview: editingBanner.image,
                    title: editingBanner.title || '',
                    link: editingBanner.link || ''
                });
            } else {
                setFormData({
                    imageFile: null,
                    imagePreview: null,
                    title: '',
                    link: ''
                });
            }
        }
    }, [isOpen, editingBanner]);

    // Memory Cleanup: Revoke object URLs to avoid memory leaks
    useEffect(() => {
        return () => {
            if (formData.imagePreview && formData.imagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(formData.imagePreview);
            }
        };
    }, [formData.imagePreview]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate size/type if needed
            if (file.size > 5 * 1024 * 1024) {
                setError('File quá lớn (Tối đa 5MB)');
                return;
            }

            // Create local preview
            const preview = URL.createObjectURL(file);
            setFormData(prev => ({
                ...prev,
                imageFile: file,
                imagePreview: preview
            }));
            setError('');
        }
    };

    const removeImage = () => {
        // Revoke old URL before clearing
        if (formData.imagePreview && formData.imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(formData.imagePreview);
        }
        
        setFormData(prev => ({
            ...prev,
            imageFile: null,
            imagePreview: null
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.imagePreview) {
            setError('Vui lòng chọn hình ảnh');
            return;
        }

        setLoading(true);
        setError('');

        try {
            console.log('Submitting Banner Data:', formData);
            
            // TODO: Implement API Logic
            // 1. If formData.imageFile exists -> Upload Image -> Get URL
            // 2. Call createBanner or updateBanner with the URL
            
            // Simulating API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            closePanel();
        } catch (err) {
            console.error(err);
            setError('Có lỗi xảy ra khi lưu banner.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9998] flex justify-end">
            {/* Overlay */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={closePanel}
            />
            
            {/* Sliding Panel */}
            <div 
                className={`relative w-full md:w-[500px] lg:w-[600px] h-full bg-white shadow-2xl z-[9999] transform transition-transform duration-300 ease-in-out flex flex-col ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* 1. Header (Fixed) */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white z-10">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {editingBanner ? 'Chỉnh sửa Banner' : 'Thêm Banner mới'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Quản lý hình ảnh hiển thị trên trang chủ</p>
                    </div>
                    <button
                        onClick={closePanel}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
                    >
                        <FiX className="w-6 h-6" />
                    </button>
                </div>

                {/* 2. Scrollable Content Body */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <form id="bannerForm" onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Error Alert */}
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                                <FiAlertCircle /> {error}
                            </div>
                        )}

                        {/* Image Upload Area */}
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <label className="block text-sm font-medium text-gray-700 mb-3">Hình ảnh Banner <span className="text-red-500">*</span></label>
                            
                            {formData.imagePreview ? (
                                <div className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                                    <img
                                        src={formData.imagePreview}
                                        alt="Banner preview"
                                        className="w-full h-auto object-contain max-h-[300px]"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                        <label className="p-2 bg-white text-blue-600 rounded-full cursor-pointer hover:bg-blue-50 transition-colors shadow-lg">
                                            <FiUpload className="w-5 h-5" />
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                className="hidden" 
                                                onChange={handleImageUpload} 
                                            />
                                        </label>
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="p-2 bg-white text-red-600 rounded-full hover:bg-red-50 transition-colors shadow-lg"
                                        >
                                            <FiTrash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-all bg-gray-50">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <div className="p-3 bg-blue-100 text-blue-600 rounded-full mb-3">
                                            <FiUpload className="w-6 h-6" />
                                        </div>
                                        <p className="mb-1 text-sm text-gray-700 font-medium">Click để tải ảnh lên</p>
                                        <p className="text-xs text-gray-500">PNG, JPG, WEBP (Max 5MB)</p>
                                    </div>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="hidden" 
                                        onChange={handleImageUpload} 
                                    />
                                </label>
                            )}
                        </div>

                        {/* Additional Info Fields */}
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề (Optional)</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Nhập tiêu đề banner..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Đường dẫn (Link)</label>
                                <input
                                    type="text"
                                    name="link"
                                    value={formData.link}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                    </form>
                </div>

                {/* 3. Footer (Fixed) */}
                <div className="p-4 border-t border-gray-200 bg-white flex justify-end gap-3 z-10">
                    <button
                        type="button"
                        onClick={closePanel}
                        disabled={loading}
                        className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        type="submit"
                        form="bannerForm"
                        disabled={loading || !formData.imagePreview}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <CircularProgress size={18} color="inherit" /> : 'Lưu Banner'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BannerPanel;