import React, { useState, useEffect } from 'react';
import { useAddProduct } from '../../Context/AddProductContext';
import { FiX, FiUpload, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { getCategories } from '../../api/categoryApi'; // Import API lấy danh mục
import { createProduct, uploadProductImages } from '../../api/productApi'; // Import API tạo sản phẩm
import CircularProgress from '@mui/material/CircularProgress';

const AddProductPanel = () => {
  const { isOpen, closePanel } = useAddProduct();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    oldPrice: '',
    stock: '',
    catId: '',
    subCatId: '', // Nếu có
    images: [], // Mảng chứa File object
    imagePreviews: [], // Mảng chứa URL preview
    variations: [{ name: '', value: '', price: '' }],
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');

  // Reset form khi mở panel
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      // Reset form data logic here if needed
    }
  }, [isOpen]);

  // Cleanup memory for image previews when component unmounts or panel closes
  useEffect(() => {
    return () => {
      formData.imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [formData.imagePreviews]);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      if (response.success) {
        setCategories(response.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Tạo preview URL
    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
      imagePreviews: [...prev.imagePreviews, ...newPreviews],
    }));
  };

  const removeImage = (index) => {
    // Revoke URL để giải phóng bộ nhớ
    URL.revokeObjectURL(formData.imagePreviews[index]);

    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== index),
    }));
  };

  const handleVariationChange = (index, field, value) => {
    const newVariations = [...formData.variations];
    newVariations[index][field] = value;
    setFormData((prev) => ({ ...prev, variations: newVariations }));
  };

  const addVariation = () => {
    setFormData((prev) => ({
      ...prev,
      variations: [...prev.variations, { name: '', value: '', price: '' }],
    }));
  };

  const removeVariation = (index) => {
    setFormData((prev) => ({
      ...prev,
      variations: prev.variations.filter((_, i) => i !== index),
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Upload ảnh trước (nếu API yêu cầu upload riêng)
      // Hoặc gửi kèm FormData nếu API hỗ trợ multipart/form-data
      // Ở đây giả lập logic upload

      let uploadedImages = [];
      if (formData.images.length > 0) {
        const imgFormData = new FormData();
        formData.images.forEach((file) => imgFormData.append('images', file));
        const uploadRes = await uploadProductImages(imgFormData);
        if (uploadRes.success) {
          uploadedImages = uploadRes.images || uploadRes.data;
        }
      }

      // 2. Tạo payload sản phẩm
      const productPayload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        countInStock: parseInt(formData.stock),
        category: formData.catId, // Gửi ID danh mục
        images: uploadedImages,
        variations: formData.variations.filter((v) => v.name && v.value), // Lọc biến thể rỗng
        tags: formData.tags,
      };

      const response = await createProduct(productPayload);

      if (response.success) {
        alert('Thêm sản phẩm thành công!');
        closePanel();
        // Có thể trigger function reload list sản phẩm ở đây nếu cần
      } else {
        setError(response.message || 'Thêm sản phẩm thất bại');
      }
    } catch (err) {
      console.error('Error creating product:', err);
      setError('Có lỗi xảy ra khi tạo sản phẩm.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-end">
      {/* Panel container with Flexbox Layout */}
      <div
        className={`h-full w-full md:w-[85%] lg:w-[70%] xl:w-[60%] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* 1. Header (Fixed) */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white z-10">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Thêm sản phẩm mới</h2>
            <p className="text-sm text-gray-500 mt-1">Điền thông tin chi tiết sản phẩm</p>
          </div>
          <button
            onClick={closePanel}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* 2. Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <form id="addProductForm" onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Basic Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                Thông tin cơ bản
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    placeholder="VD: Áo thun nam Cotton..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none transition-all"
                    placeholder="Mô tả chi tiết sản phẩm..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giá bán <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        ₫
                      </span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        min="0"
                        className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tồn kho <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Danh mục <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="catId"
                      value={formData.catId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Có thể thêm SubCategory ở đây nếu API hỗ trợ */}
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Hình ảnh</h3>
              <div className="space-y-4">
                <label className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                  <div className="flex flex-col items-center justify-center">
                    <FiUpload className="w-10 h-10 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600 font-medium">Click để tải ảnh lên</span>
                    <span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP (Max 10 ảnh)</span>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {formData.imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {formData.imagePreviews.map((url, index) => (
                      <div
                        key={index}
                        className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200"
                      >
                        <img src={url} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <FiTrash2 size={14} />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center py-1">
                            Ảnh bìa
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Variations */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4 border-b pb-2">
                <h3 className="text-lg font-bold text-gray-800">Biến thể</h3>
                <button
                  type="button"
                  onClick={addVariation}
                  className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <FaPlus className="w-3 h-3" /> Thêm
                </button>
              </div>
              <div className="space-y-3">
                {formData.variations.map((variation, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 items-start md:items-center"
                  >
                    <input
                      placeholder="Tên (vd: Size)"
                      value={variation.name}
                      onChange={(e) => handleVariationChange(index, 'name', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    />
                    <input
                      placeholder="Giá trị (vd: XL)"
                      value={variation.value}
                      onChange={(e) => handleVariationChange(index, 'value', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Giá (+)"
                      value={variation.price}
                      onChange={(e) => handleVariationChange(index, 'price', e.target.value)}
                      className="w-full md:w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeVariation(index)}
                      className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                      disabled={formData.variations.length === 1}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Tags</h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="Nhập tag và nhấn Enter..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                >
                  Thêm
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-500"
                    >
                      <FiX size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* 3. Footer Actions (Fixed) */}
        <div className="p-4 border-t border-gray-200 bg-white flex justify-end gap-3">
          <button
            type="button"
            onClick={closePanel}
            disabled={loading}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            form="addProductForm"
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-70"
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Lưu sản phẩm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductPanel;
