import React, { useState, useEffect, useRef } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiUpload, FiX, FiImage, FiMoreVertical } from 'react-icons/fi';
import {
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  uploadBannerImage,
} from '../../api/bannerApi';
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
    isActive: true,
  });

  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
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

  const openModal = (banner = null) => {
    setError('');
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        image: banner.image,
        title: banner.title || '',
        link: banner.link || '',
        order: banner.order || 0,
        isActive: banner.isActive !== false,
      });
      setImagePreview(banner.image);
    } else {
      setEditingBanner(null);
      setFormData({
        image: '',
        title: '',
        link: '',
        order: banners.length > 0 ? Math.max(...banners.map((b) => b.order || 0)) + 1 : 1,
        isActive: true,
      });
      setImagePreview('');
    }
    setShowModal(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Kích thước ảnh không được vượt quá 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      setImagePreview(reader.result);
      setError('');

      try {
        setUploading(true);
        const response = await uploadBannerImage(reader.result);
        if (response.success) {
          setFormData((prev) => ({ ...prev, image: response.url }));
        }
      } catch (error) {
        console.error('Upload error:', error);
        setError('Lỗi khi tải ảnh lên server');
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);

    // Reset value để có thể chọn lại cùng 1 file nếu muốn
    e.target.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.image) {
      setError('Vui lòng chọn hình ảnh cho banner');
      return;
    }

    try {
      setActionLoading(true);

      if (editingBanner) {
        const response = await updateBanner(editingBanner._id, formData);
        if (response.success) {
          setBanners((prev) =>
            prev.map((b) => (b._id === editingBanner._id ? { ...b, ...formData } : b))
          );
        }
      } else {
        const response = await createBanner(formData);
        if (response.success) {
          setBanners((prev) => [...prev, response.data]);
        }
      }

      setShowModal(false);
    } catch (error) {
      console.error('Save banner error:', error);
      setError(error.response?.data?.message || 'Có lỗi xảy ra khi lưu banner');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa banner này không?')) return;

    try {
      // Optimistic update: Xóa trên UI trước để cảm giác nhanh hơn
      const previousBanners = [...banners];
      setBanners((prev) => prev.filter((b) => b._id !== id));

      const response = await deleteBanner(id);
      if (!response.success) {
        // Nếu lỗi thì revert lại
        setBanners(previousBanners);
        alert('Lỗi xóa banner');
      }
    } catch (error) {
      console.error('Delete banner error:', error);
      alert('Lỗi kết nối server');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Banner</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {loading ? 'Đang tải dữ liệu...' : `Tổng số ${banners.length} banner`}
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95"
        >
          <FiPlus className="text-lg" />
          <span>Thêm Banner</span>
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <CircularProgress />
          </div>
        ) : banners.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-gray-400">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <FiImage className="text-4xl text-gray-300" />
            </div>
            <p className="text-lg font-medium text-gray-500">Chưa có banner nào</p>
            <p className="text-sm">Hãy thêm banner mới để hiển thị trên trang chủ</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Thứ tự
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Hình ảnh
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Tiêu đề / Link
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {banners.map((banner) => (
                    <tr key={banner._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{banner.order}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-16 w-32 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 relative group">
                          <img
                            src={banner.image}
                            alt="Banner"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900 line-clamp-1">
                            {banner.title || '(Không có tiêu đề)'}
                          </span>
                          <span className="text-xs text-gray-500 line-clamp-1">
                            {banner.link || '#'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            banner.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {banner.isActive ? 'Đang hiện' : 'Đã ẩn'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openModal(banner)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Sửa"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(banner._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

            {/* Mobile Card View */}
            <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
              {banners.map((banner) => (
                <div
                  key={banner._id}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col gap-3"
                >
                  <div className="relative aspect-video w-full rounded-md overflow-hidden bg-gray-100 border border-gray-100">
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded text-xs font-bold shadow-sm">
                      #{banner.order}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 line-clamp-1">
                      {banner.title || 'Banner'}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{banner.link}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-auto">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        banner.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {banner.isActive ? 'Hiển thị' : 'Đã ẩn'}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openModal(banner)}
                        className="p-2 text-blue-600 bg-blue-50 rounded-md"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(banner._id)}
                        className="p-2 text-red-600 bg-red-50 rounded-md"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {editingBanner ? 'Chỉnh sửa Banner' : 'Thêm Banner Mới'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Error Alert */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
                  {error}
                </div>
              )}

              {/* Image Upload Area */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hình ảnh banner <span className="text-red-500">*</span>
                </label>
                <div
                  onClick={() => !uploading && fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all h-48 flex flex-col items-center justify-center ${
                    imagePreview
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                  }`}
                >
                  {imagePreview ? (
                    <div className="w-full h-full relative group">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-contain rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                        <span className="text-white font-medium flex items-center gap-2">
                          <FiUpload /> Thay đổi ảnh
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-500">
                        <FiUpload className="text-xl" />
                      </div>
                      <p className="font-medium text-gray-700">Click để tải ảnh lên</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP (Max 5MB)</p>
                    </div>
                  )}

                  {uploading && (
                    <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center rounded-xl z-10">
                      <CircularProgress size={30} />
                      <span className="text-sm font-medium text-blue-600 mt-2">
                        Đang tải ảnh...
                      </span>
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

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Tiêu đề (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    placeholder="Nhập tiêu đề banner..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Thứ tự hiển thị
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))
                      }
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      min="0"
                    />
                  </div>
                  <div className="flex flex-col justify-end pb-2">
                    <div className="flex items-center justify-between bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
                      <span className="text-sm font-medium text-gray-700">Trạng thái</span>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input
                          type="checkbox"
                          name="isActive"
                          id="isActive"
                          checked={formData.isActive}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
                          }
                          className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer"
                          style={{
                            right: formData.isActive ? '0' : 'auto',
                            left: formData.isActive ? 'auto' : '0',
                            borderColor: formData.isActive ? '#3b82f6' : '#e5e7eb',
                          }}
                        />
                        <label
                          htmlFor="isActive"
                          className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${
                            formData.isActive ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                        ></label>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Đường dẫn (Link)
                  </label>
                  <input
                    type="text"
                    value={formData.link}
                    onChange={(e) => setFormData((prev) => ({ ...prev, link: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || uploading}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  {actionLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : editingBanner ? (
                    'Cập nhật'
                  ) : (
                    'Thêm mới'
                  )}
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
