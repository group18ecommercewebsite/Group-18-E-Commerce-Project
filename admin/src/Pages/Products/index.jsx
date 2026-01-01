import React, { useState, useEffect, useMemo } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiImage, FiFilter, FiBox } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { getProducts, getProductsByCatId, deleteProduct } from '../../api/productApi';
import { getCategories } from '../../api/categoryApi';
import CircularProgress from '@mui/material/CircularProgress';

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 10;

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch products when dependencies change
  useEffect(() => {
    fetchProducts();
  }, [currentPage, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let response;

      if (selectedCategory) {
        response = await getProductsByCatId(selectedCategory, currentPage, productsPerPage);
      } else {
        response = await getProducts({ page: currentPage, perPage: productsPerPage });
      }

      if (response.success) {
        setProducts(response.products || response.data || []);
        setTotalPages(response.totalPages || 1);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
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
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleDelete = async (productId, productName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${productName}"?`)) return;

    try {
      setDeleting(productId);
      const res = await deleteProduct(productId);
      if (res.success) {
        await fetchProducts();
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Xóa sản phẩm thất bại');
    } finally {
      setDeleting(null);
    }
  };

  // Optimize filtering
  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
      price || 0
    );
  };

  const getStockStatus = (count) => {
    if (!count || count === 0) return { label: 'Hết hàng', color: 'bg-red-100 text-red-700' };
    if (count < 10) return { label: 'Sắp hết', color: 'bg-yellow-100 text-yellow-700' };
    return { label: 'Còn hàng', color: 'bg-green-100 text-green-700' };
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Hiển thị {filteredProducts.length} sản phẩm (Trang {currentPage}/{totalPages})
          </p>
        </div>
        <button
          onClick={() => navigate('/products/add')}
          className="w-full md:w-auto px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95"
        >
          <FiPlus className="text-lg" />
          <span>Thêm sản phẩm</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="mb-6 bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, thương hiệu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="md:w-72 relative">
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none cursor-pointer"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {'— '.repeat(cat.level || 0) + cat.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiBox className="text-4xl text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Không tìm thấy sản phẩm</h3>
          <p className="text-gray-500 mt-1">Thử thay đổi bộ lọc hoặc thêm sản phẩm mới.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Sản phẩm
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Danh mục
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Thương hiệu
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Giá
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Tồn kho
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product.countInStock);
                    return (
                      <tr key={product._id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                              {product.images?.[0] ? (
                                <img
                                  src={product.images[0]}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <FiImage />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div
                                className="font-medium text-gray-900 truncate max-w-[200px]"
                                title={product.name}
                              >
                                {product.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                ID: {product._id.slice(-6).toUpperCase()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                            {product.catName || product.category?.name || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{product.brand || '-'}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="font-medium text-gray-900">
                            {formatPrice(product.price)}
                          </div>
                          {product.oldPrice > product.price && (
                            <div className="text-xs text-gray-400 line-through">
                              {formatPrice(product.oldPrice)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}
                          >
                            {product.countInStock || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => navigate(`/products/edit/${product._id}`)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Chỉnh sửa"
                            >
                              <FiEdit2 />
                            </button>
                            <button
                              onClick={() => handleDelete(product._id, product.name)}
                              disabled={deleting === product._id}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Xóa"
                            >
                              {deleting === product._id ? (
                                <CircularProgress size={16} color="inherit" />
                              ) : (
                                <FiTrash2 />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product.countInStock);
              return (
                <div
                  key={product._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0 relative">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <FiImage size={24} />
                          </div>
                        )}
                        {product.discount > 0 && (
                          <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-bl-lg">
                            -{product.discount}%
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wide">
                            {product.brand}
                          </span>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${stockStatus.color}`}
                          >
                            Kho: {product.countInStock || 0}
                          </span>
                        </div>
                        <h3 className="font-medium text-gray-900 line-clamp-2 mt-1 mb-1">
                          {product.name}
                        </h3>
                        <div className="flex items-baseline gap-2">
                          <span className="text-blue-600 font-bold">
                            {formatPrice(product.price)}
                          </span>
                          {product.oldPrice > product.price && (
                            <span className="text-xs text-gray-400 line-through">
                              {formatPrice(product.oldPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex gap-2">
                    <button
                      onClick={() => navigate(`/products/edit/${product._id}`)}
                      className="flex-1 py-2 text-sm font-medium text-blue-600 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <FiEdit2 /> Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(product._id, product.name)}
                      disabled={deleting === product._id}
                      className="flex-1 py-2 text-sm font-medium text-red-600 bg-white border border-gray-200 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                    >
                      {deleting === product._id ? (
                        <CircularProgress size={16} />
                      ) : (
                        <>
                          <FiTrash2 /> Xóa
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500">
                Trang <span className="font-medium text-gray-900">{currentPage}</span> trên{' '}
                <span className="font-medium text-gray-900">{totalPages}</span>
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Trước
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;
