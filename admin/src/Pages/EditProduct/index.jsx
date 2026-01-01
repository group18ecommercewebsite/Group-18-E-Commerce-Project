import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiUpload, FiTrash2, FiSave, FiImage, FiCheck } from 'react-icons/fi';
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
    discount: '',
  });

  const [existingImages, setExistingImages] = useState([]); // URLs from server
  const [newImages, setNewImages] = useState([]); // { file: File, preview: string }

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, [id]);

  // Cleanup memory for object URLs
  useEffect(() => {
    return () => {
      newImages.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [newImages]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await getProductById(id);

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
          discount: product.discount || '',
        });
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

    setNewImages((prev) => [...prev, ...newImagesWithPreviews]);
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => {
      const imageToRemove = prev[index];
      if (imageToRemove) URL.revokeObjectURL(imageToRemove.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('Vui lòng nhập tên sản phẩm');
      window.scrollTo(0, 0);
      return;
    }

    try {
      setSaving(true);
      setError('');

      let finalImages = [...existingImages];

      if (newImages.length > 0) {
        const imageFormData = new FormData();
        newImages.forEach(({ file }) => {
          imageFormData.append('images', file);
        });

        const uploadRes = await uploadProductImages(imageFormData);

        // Hỗ trợ cả 2 định dạng trả về phổ biến
        const uploadedUrls = uploadRes.images || uploadRes.data || [];
        if (uploadedUrls.length > 0) {
          finalImages = [...finalImages, ...uploadedUrls];
        }
      }

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
        images: finalImages,
      };

      const response = await updateProduct(id, updateData);

      if (response.success) {
        navigate('/products');
      } else {
        throw new Error(response.message || 'Cập nhật thất bại');
      }
    } catch (err) {
      console.error('Error updating product:', err);
      setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra');
      window.scrollTo(0, 0);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
            >
              <FiArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Chỉnh sửa sản phẩm</h1>
              <p className="text-sm text-gray-500">ID: {id}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info - Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-5 border-b pb-2">
                  Thông tin cơ bản
                </h2>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tên sản phẩm <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      placeholder="Nhập tên sản phẩm..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mô tả chi tiết
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-y"
                      placeholder="Nhập mô tả sản phẩm..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Thương hiệu
                      </label>
                      <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Danh mục
                      </label>
                      <select
                        name="catId"
                        value={formData.catId}
                        onChange={handleCategoryChange}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      >
                        <option value="">Chọn danh mục</option>
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

              {/* Images Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-5 border-b pb-2">
                  <h2 className="text-lg font-bold text-gray-800">
                    Hình ảnh ({existingImages.length + newImages.length})
                  </h2>
                  <label className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors text-sm font-medium">
                    <FiUpload />
                    <span>Thêm ảnh</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* Existing Images */}
                  {existingImages.map((img, index) => (
                    <div
                      key={`existing-${index}`}
                      className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200"
                    >
                      <img
                        src={img}
                        alt={`Product ${index}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="p-2 bg-white text-red-600 rounded-full hover:bg-red-50 transition-colors shadow-lg"
                          title="Xóa ảnh"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* New Images */}
                  {newImages.map((imgObj, index) => (
                    <div
                      key={`new-${index}`}
                      className="relative group aspect-square rounded-lg overflow-hidden border-2 border-blue-500"
                    >
                      <img
                        src={imgObj.preview}
                        alt={`New ${index}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 left-1 bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        MỚI
                      </div>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="p-2 bg-white text-red-600 rounded-full hover:bg-red-50 transition-colors shadow-lg"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Empty State if no images */}
                  {existingImages.length === 0 && newImages.length === 0 && (
                    <div className="col-span-full py-8 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                      <FiImage size={32} className="mb-2" />
                      <p className="text-sm">Chưa có hình ảnh nào</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar - Right Column - Sticky on Desktop */}
            <div className="space-y-6 lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                {/* Pricing & Stock */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-5 border-b pb-2">
                    Giá & Kho hàng
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Giá bán (VNĐ)
                      </label>
                      <input
                        type="number"
                        name="price"
                        min="0"
                        onWheel={(e) => e.target.blur()}
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Giá gốc
                        </label>
                        <input
                          type="number"
                          name="oldPrice"
                          min="0"
                          onWheel={(e) => e.target.blur()}
                          value={formData.oldPrice}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Giảm (%)
                        </label>
                        <input
                          type="number"
                          name="discount"
                          min="0"
                          max="100"
                          onWheel={(e) => e.target.blur()}
                          value={formData.discount}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tồn kho
                      </label>
                      <input
                        type="number"
                        name="countInStock"
                        min="0"
                        onWheel={(e) => e.target.blur()}
                        value={formData.countInStock}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      />
                    </div>

                    {/* Toggle Switch */}
                    <div className="flex items-center justify-between pt-2">
                      <label
                        className="text-sm font-semibold text-gray-700 cursor-pointer"
                        htmlFor="isFeatured"
                      >
                        Sản phẩm nổi bật
                      </label>
                      <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input
                          type="checkbox"
                          name="isFeatured"
                          id="isFeatured"
                          checked={formData.isFeatured}
                          onChange={handleInputChange}
                          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                          style={{
                            right: formData.isFeatured ? '0' : 'auto',
                            left: formData.isFeatured ? 'auto' : '0',
                            borderColor: formData.isFeatured ? '#3b82f6' : '#e5e7eb',
                          }}
                        />
                        <label
                          htmlFor="isFeatured"
                          className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                            formData.isFeatured ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                        ></label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <CircularProgress size={20} color="inherit" />
                        <span>Đang xử lý...</span>
                      </>
                    ) : (
                      <>
                        <FiSave size={20} />
                        <span>Lưu thay đổi</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/products')}
                    disabled={saving}
                    className="w-full mt-3 py-2.5 text-gray-600 bg-gray-50 border border-gray-200 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                  >
                    Hủy bỏ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
