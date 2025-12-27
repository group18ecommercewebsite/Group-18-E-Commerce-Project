import React, { useState, useEffect, useRef } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiUpload, FiX, FiImage } from 'react-icons/fi';
import { getAllBanners, createBanner, updateBanner, deleteBanner, uploadBannerImage } from '../../api/bannerApi';
import CircularProgress from '@mui/material/CircularProgress';

const HomeSlides = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [formData, setFormData] = useState({
        image: '',
        title: '',
        link: '',
        order: 0,
        isActive: true
    });
    const [imagePreview, setImagePreview] = useState('');
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const response = await getAllBanners();
            if (response.success) {
                setBanners(response.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch banners:', error);
        } finally {
            setLoading(false);
        }
    };



    // Open modal for add/edit
    const openModal = (banner = null) => {
        if (banner) {
            setEditingBanner(banner);
            setFormData({
                image: banner.image,
                title: banner.title || '',
                link: banner.link || '',
                order: banner.order || 0,
                isActive: banner.isActive !== false
            });
            setImagePreview(banner.image);
        } else {
            setEditingBanner(null);
            setFormData({
                image: '',
                title: '',
                link: '',
                order: banners.length + 1,
                isActive: true
            });
            setImagePreview('');
        }
        setShowModal(true);
    };

    // Handle image upload
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Preview
        const reader = new FileReader();
        reader.onloadend = async () => {
            setImagePreview(reader.result);
            
            try {
                setUploading(true);
                const response = await uploadBannerImage(reader.result);
                if (response.success) {
                    setFormData(prev => ({ ...prev, image: response.url }));
                }
            } catch (error) {
                console.error('Upload error:', error);
                alert('Lỗi upload ảnh');
            } finally {
                setUploading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.image) {
            alert('Vui lòng chọn hình ảnh');
            return;
        }

        try {
            setActionLoading(true);
            
            if (editingBanner) {
                const response = await updateBanner(editingBanner._id, formData);
                if (response.success) {
                    setBanners(prev => prev.map(b => 
                        b._id === editingBanner._id ? { ...b, ...formData } : b
                    ));
                }
            } else {
                const response = await createBanner(formData);
                if (response.success) {
                    setBanners(prev => [...prev, response.data]);
                }
            }
            
            setShowModal(false);
        } catch (error) {
            console.error('Save banner error:', error);
            alert(error.response?.data?.message || 'Lỗi lưu banner');
        } finally {
            setActionLoading(false);
        }
    };

    // Handle delete
    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa banner này?')) return;

        try {
            setActionLoading(true);
            const response = await deleteBanner(id);
            if (response.success) {
                setBanners(prev => prev.filter(b => b._id !== id));
            }
        } catch (error) {
            console.error('Delete banner error:', error);
            alert(error.response?.data?.message || 'Lỗi xóa banner');
        } finally {
            setActionLoading(false);
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Quản lý Banner trang chủ</h1>
                        <p className="text-gray-600 mt-1">
                            {loading ? 'Đang tải...' : `${banners.length} banner đang hiển thị`}
                        </p>
                    </div>
                    <button
                            onClick={() => openModal()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <FiPlus className="text-sm" />
                            Thêm Banner
                        </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="py-20 flex justify-center">
                        <CircularProgress />
                    </div>
                ) : banners.length === 0 ? (
                    <div className="py-20 text-center text-gray-500">
                        <FiImage className="mx-auto text-5xl text-gray-300 mb-4" />
                        <p>Chưa có banner nào. Hãy thêm banner mới.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        #
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Hình ảnh
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Tiêu đề
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Ngày tạo
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Hành động
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {banners.map((banner, index) => (
                                    <tr key={banner._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {banner.order || index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <img
                                                src={banner.image}
                                                alt={banner.title || `Banner ${index + 1}`}
                                                className="h-16 w-28 object-cover rounded-lg border border-gray-200"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {banner.title || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                                                banner.isActive 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {banner.isActive ? 'Hiển thị' : 'Ẩn'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {formatDate(banner.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openModal(banner)}
                                                    className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Chỉnh sửa"
                                                >
                                                    <FiEdit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(banner._id)}
                                                    className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Xóa"
                                                >
                                                    <FiTrash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-lg font-semibold">
                                {editingBanner ? 'Chỉnh sửa Banner' : 'Thêm Banner mới'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Hình ảnh *
                                </label>
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors"
                                >
                                    {imagePreview ? (
                                        <img 
                                            src={imagePreview} 
                                            alt="Preview" 
                                            className="max-h-40 mx-auto rounded-lg"
                                        />
                                    ) : (
                                        <div className="text-gray-500">
                                            <FiUpload className="mx-auto text-3xl mb-2" />
                                            <p>Click để chọn ảnh</p>
                                        </div>
                                    )}
                                    {uploading && (
                                        <div className="mt-2">
                                            <CircularProgress size={24} />
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tiêu đề
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="VD: Banner khuyến mãi"
                                />
                            </div>

                            {/* Order */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Thứ tự hiển thị
                                </label>
                                <input
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    min="0"
                                />
                            </div>

                            {/* Active */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                    className="w-4 h-4 text-blue-600 rounded"
                                />
                                <label htmlFor="isActive" className="text-sm text-gray-700">
                                    Hiển thị trên trang chủ
                                </label>
                            </div>

                            {/* Submit */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading || uploading}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {actionLoading ? 'Đang lưu...' : (editingBanner ? 'Cập nhật' : 'Thêm mới')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomeSlides;
