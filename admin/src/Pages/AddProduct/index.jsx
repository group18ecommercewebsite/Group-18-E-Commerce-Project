import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUpload, FiTrash2, FiSave, FiX } from 'react-icons/fi';
import { createProduct, uploadProductImages } from '../../api/productApi';
import { getCategories } from '../../api/categoryApi';
import CircularProgress from '@mui/material/CircularProgress';

const AddProduct = () => {
  const navigate = useNavigate();
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
    isFeatured: false,
    discount: '',
  });

  const [images, setImages] = useState([]); // { file: File, preview: string }

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      if (response.success) {
        const flattenCategories = (cats, level = 0) => {
          let result = [];
          cats.forEach((cat) => {
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
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCategoryChange = (e) => {
    const catId = e.target.value;
    const selectedCat = categories.find((cat) => cat._id === catId);
    setFormData((prev) => ({
      ...prev,
      catId,
      catName: selectedCat?.name || '',
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newImagesWithPreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImagesWithPreviews]);
  };

  const removeImage = (index) => {
    setImages((prev) => {
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

    if (!formData.catId) {
      setError('Vui lòng chọn danh mục');
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Vui lòng nhập giá sản phẩm hợp lệ');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      let uploadedImageUrls = [];

      // Upload images if any
      if (images.length > 0) {
        const imageFormData = new FormData();
        images.forEach(({ file }) => {
          imageFormData.append('images', file);
        });

        const uploadRes = await uploadProductImages(imageFormData);

        if (uploadRes.images && uploadRes.images.length > 0) {
          uploadedImageUrls = uploadRes.images;
        }
      }

      const productData = {
        name: formData.name.trim(),
        description: formData.description,
        brand: formData.brand,
        price: parseFloat(formData.price) || 0,
        oldPrice: parseFloat(formData.oldPrice) || 0,
        countInStock: parseInt(formData.countInStock) || 0,
        catId: formData.catId,
        catName: formData.catName,
        isFeatured: formData.isFeatured,
        discount: parseFloat(formData.discount) || 0,
        images: uploadedImageUrls,
      };

      const response = await createProduct(productData);

      if (response.success) {
        setSuccess('Tạo sản phẩm thành công!');
        setTimeout(() => navigate('/products'), 1500);
      } else {
        throw new Error(response.message || 'Tạo sản phẩm thất bại');
      }
    } catch (err) {
      console.error('Error creating product:', err);
      setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4 md:p-6 border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
            >
              <FiArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Thêm sản phẩm mới</h1>
              <p className="text-sm text-gray-600 mt-1 hidden md:block">
                Điền thông tin chi tiết để tạo sản phẩm
              </p>
            </div>
          </div>
          {/* Nút Save nhanh trên Header (chỉ hiện desktop nếu muốn, hiện tại mình để trong form) */}
        </div>

        {/* Form Wrapper */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN: Main Info & Images (Chiếm 2 phần) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Error/Success Messages */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
                <FiX className="flex-shrink-0" /> {error}
              </div>
            )}
            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
                {success}
              </div>
            )}

            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Thông tin cơ bản
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Tên sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Nhập tên sản phẩm..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all"
                    placeholder="Nhập mô tả chi tiết sản phẩm..."
                  />
                </div>

                {/* Grid cho Thương hiệu và Danh mục */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Thương hiệu
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="VD: Apple, Samsung..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Danh mục <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="catId"
                      value={formData.catId}
                      onChange={handleCategoryChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white transition-all"
                    >
                      <option value="">-- Chọn danh mục --</option>
                      {categories.map((cat) => (
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex justify-between items-center">
                <span>Thư viện ảnh</span>
                <span className="text-sm font-normal text-gray-500">
                  {images.length} ảnh đã chọn
                </span>
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map((imgObj, index) => (
                  <div
                    key={index}
                    className="relative group aspect-square rounded-lg border border-gray-200 overflow-hidden bg-gray-50"
                  >
                    <img
                      src={imgObj.preview}
                      alt={`Preview ${index}`}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-2 bg-white text-red-500 rounded-full hover:bg-red-50 transition-colors shadow-sm"
                        title="Xóa ảnh"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-all group">
                  <div className="p-3 bg-gray-100 rounded-full group-hover:bg-blue-100 transition-colors mb-2">
                    <FiUpload className="text-gray-500 group-hover:text-blue-600 text-xl" />
                  </div>
                  <span className="text-xs font-medium text-gray-600 group-hover:text-blue-600">
                    Thêm ảnh
                  </span>
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

          {/* RIGHT COLUMN: Sidebar (Pricing, Stock, Actions) (Chiếm 1 phần) */}
          <div className="space-y-6">
            {/* Pricing & Stock */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Giá bán & Kho
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Giá bán (VNĐ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium"
                    placeholder="0"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Giá gốc
                    </label>
                    <input
                      type="number"
                      name="oldPrice"
                      min="0"
                      value={formData.oldPrice}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Giảm giá (%)
                    </label>
                    <input
                      type="number"
                      name="discount"
                      min="0"
                      max="100"
                      value={formData.discount}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="0%"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Số lượng tồn kho
                  </label>
                  <input
                    type="number"
                    name="countInStock"
                    min="0"
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
                    className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <label
                    htmlFor="isFeatured"
                    className="text-sm font-medium text-gray-700 cursor-pointer select-none"
                  >
                    Đánh dấu là Sản phẩm nổi bật
                  </label>
                </div>
              </div>
            </div>

            {/* Actions (Sticky or Normal) */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tác vụ</h2>
              <button
                type="submit"
                disabled={saving}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 shadow-sm mb-3"
              >
                {saving ? (
                  <>
                    <CircularProgress size={20} color="inherit" />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <FiSave size={18} />
                    <span>Lưu sản phẩm</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/products')}
                disabled={saving}
                className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
