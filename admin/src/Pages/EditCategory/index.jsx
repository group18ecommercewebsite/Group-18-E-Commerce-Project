import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiUpload, FiTrash2, FiArrowLeft, FiSave } from 'react-icons/fi';
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
    currentImage: '',
  });
  const [error, setError] = useState('');

  // Fetch category data
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const response = await getCategoryById(id);

        if (response.success && (response.data || response.category)) {
          const cat = response.data || response.category;
          const catImage = cat.images?.[0] || cat.image || '';
          setFormData({
            name: cat.name || '',
            image: null,
            imagePreview: catImage || null,
            currentImage: catImage,
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

  // Clean up memory from object URLs when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (formData.image && formData.imagePreview && formData.imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(formData.imagePreview);
      }
    };
  }, [formData.image, formData.imagePreview]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn file ảnh hợp lệ (jpg, png, webp...)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Kích thước ảnh tối đa 5MB');
      return;
    }

    setError('');

    // Clean up old blob if exists
    if (formData.image && formData.imagePreview && formData.imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(formData.imagePreview);
    }

    const preview = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      image: file,
      imagePreview: preview,
    }));
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
      imagePreview: null,
      currentImage: '',
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

      let imageUrl = formData.currentImage;

      // Upload new image if selected
      if (formData.image) {
        const imageFormData = new FormData();
        imageFormData.append('images', formData.image);

        const uploadRes = await uploadCategoryImages(imageFormData);

        // Kiểm tra cấu trúc response linh hoạt
        const uploadedImages = uploadRes.images || uploadRes.data;

        if (!uploadedImages || !uploadedImages[0]) {
          throw new Error('Upload ảnh thất bại');
        }

        imageUrl = uploadedImages[0];
      }

      const updateData = {
        name: formData.name.trim(),
        images: imageUrl ? [imageUrl] : [],
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
      <div className="flex items-center justify-center min-h-[400px]">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* Header & Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <button
            onClick={() => navigate('/categories')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors w-fit"
          >
            <FiArrowLeft />
            <span>Quay lại danh sách</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Chỉnh sửa danh mục</h1>
            <p className="text-sm text-gray-500 mt-1">
              Cập nhật thông tin chi tiết cho danh mục ID: {id}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm flex items-center gap-2">
                <span className="font-medium">Lỗi:</span> {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Info */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tên danh mục <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                    placeholder="Nhập tên danh mục..."
                  />
                </div>
              </div>

              {/* Right Column: Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hình ảnh đại diện
                </label>

                <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors p-4">
                  {formData.imagePreview ? (
                    <div className="relative group">
                      <div className="aspect-square w-full rounded-lg overflow-hidden bg-white shadow-sm">
                        <img
                          src={formData.imagePreview}
                          alt="Preview"
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Hover Actions */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 rounded-lg">
                        <label
                          className="p-2 bg-white text-gray-700 rounded-full cursor-pointer hover:bg-gray-100 hover:text-blue-600 transition-all shadow-lg"
                          title="Thay đổi ảnh"
                        >
                          <FiUpload className="w-5 h-5" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={removeImage}
                          className="p-2 bg-white text-gray-700 rounded-full hover:bg-red-50 hover:text-red-600 transition-all shadow-lg"
                          title="Xóa ảnh"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-64 cursor-pointer">
                      <div className="p-4 bg-blue-50 rounded-full mb-3 text-blue-600">
                        <FiUpload className="w-8 h-8" />
                      </div>
                      <span className="font-medium text-gray-700">Tải ảnh lên</span>
                      <span className="text-xs text-gray-500 mt-1">PNG, JPG tối đa 5MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate('/categories')}
                disabled={saving}
                className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                {saving ? (
                  <>
                    <CircularProgress size={16} color="inherit" />
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <FiSave className="w-4 h-4" />
                    <span>Lưu thay đổi</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCategory;
