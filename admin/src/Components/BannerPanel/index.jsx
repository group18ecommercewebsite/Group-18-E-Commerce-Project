import React, { useState, useEffect } from 'react';
import { useBanner } from '../../Context/BannerContext';
import { FiX, FiUpload, FiTrash2 } from 'react-icons/fi';

const BannerPanel = () => {
    const { isOpen, closePanel, editingBanner } = useBanner();
    const [formData, setFormData] = useState({
        image: null,
        imagePreview: null
    });

    useEffect(() => {
        if (editingBanner) {
            setFormData({
                image: null,
                imagePreview: editingBanner.image
            });
        } else {
            setFormData({
                image: null,
                imagePreview: null
            });
        }
    }, [editingBanner, isOpen]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const preview = URL.createObjectURL(file);
            setFormData({
                image: file,
                imagePreview: preview
            });
        }
    };

    const removeImage = () => {
        setFormData({
            image: null,
            imagePreview: null
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Banner Data:', formData);
        // TODO: Xử lý submit
        closePanel();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div 
                className="fixed inset-0 z-[9998] bg-black bg-opacity-50 transition-opacity duration-300"
                onClick={closePanel}
            />
            
            {/* Panel trượt từ bên phải */}
            <div 
                className={`fixed right-0 top-0 h-full w-full lg:w-[90%] xl:w-[85%] bg-white shadow-2xl z-[9999] transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {editingBanner ? 'Chỉnh sửa Banner' : 'Thêm Banner mới'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Tải lên hình ảnh banner cho trang chủ</p>
                    </div>
                    <button
                        onClick={closePanel}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Đóng"
                    >
                        <FiX className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="h-[calc(100vh-80px)] overflow-y-auto px-6 py-6">
                    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                        {/* Image Upload Section */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hình ảnh Banner</h3>
                            
                            {formData.imagePreview ? (
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <img
                                            src={formData.imagePreview}
                                            alt="Banner preview"
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
                                        <p className="text-xs text-gray-500">PNG, JPG, WEBP (Tối đa 10MB)</p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        required={!editingBanner}
                                    />
                                </label>
                            )}

                            <div className="mt-4 text-sm text-gray-500">
                                <p>• Kích thước khuyến nghị: 1920 x 600px</p>
                                <p>• Định dạng: JPG, PNG, WEBP</p>
                                <p>• Kích thước tối đa: 10MB</p>
                            </div>
                        </div>

                        {/* Footer buttons */}
                        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 -mx-6 mt-6 flex items-center justify-end gap-4">
                            <button
                                type="button"
                                onClick={closePanel}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={!formData.imagePreview}
                                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                                    formData.imagePreview
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                {editingBanner ? 'Cập nhật Banner' : 'Thêm Banner'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default BannerPanel;

