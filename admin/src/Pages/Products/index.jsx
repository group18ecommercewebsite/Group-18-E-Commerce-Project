import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiImage } from 'react-icons/fi';
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

    // Fetch products
    useEffect(() => {
        fetchProducts();
    }, [currentPage, selectedCategory]);

    // Fetch categories for filter
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            let response;
            
            if (selectedCategory) {
                // Fetch by category
                response = await getProductsByCatId(selectedCategory, currentPage, productsPerPage);
            } else {
                // Fetch all products
                response = await getProducts({ page: currentPage, perPage: productsPerPage });
            }
            
            console.log('Products response:', response);
            
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
                // Flatten categories with level for hierarchy display
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

    const handleEditProduct = (productId) => {
        navigate(`/products/edit/${productId}`);
    };

    // Filter products by search term
    const filteredProducts = products.filter(product => 
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
                        <p className="text-gray-600 mt-1">Trang {currentPage} / {totalPages}</p>
                    </div>
                    <button
                        onClick={() => navigate('/products/add')}
                        className="px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <FiPlus className="text-lg" />
                        Thêm sản phẩm
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-6 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="sm:w-64">
                        <select
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                        >
                            <option value="">Tất cả danh mục</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat._id}>
                                    {'—'.repeat(cat.level || 0)} {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="py-20 flex justify-center">
                        <CircularProgress />
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="py-20 text-center text-gray-500">
                        <FiImage className="mx-auto text-5xl text-gray-300 mb-4" />
                        <p className="mb-2">Không tìm thấy sản phẩm nào</p>
                        <button
                            onClick={() => navigate('/products/add')}
                            className="text-blue-600 font-medium hover:underline"
                        >
                            Thêm sản phẩm đầu tiên
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Sản phẩm
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Danh mục
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Thương hiệu
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Giá
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Tồn kho
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Đánh giá
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredProducts.map((product) => (
                                        <tr 
                                            key={product._id} 
                                            className="hover:bg-gray-50 transition-colors cursor-pointer"
                                            onClick={() => handleEditProduct(product._id)}
                                        >
                                            {/* Product Info */}
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                        {product.images?.[0] ? (
                                                            <img
                                                                src={product.images[0]}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                <FiImage />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-medium text-gray-900 truncate max-w-[200px]">
                                                            {product.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500 truncate max-w-[200px]">
                                                            ID: {product._id?.slice(-8)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Category */}
                                            <td className="px-4 py-4">
                                                <span className="px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                    {product.catName || product.category?.name || '-'}
                                                </span>
                                            </td>

                                            {/* Brand */}
                                            <td className="px-4 py-4 text-sm text-gray-600">
                                                {product.brand || '-'}
                                            </td>

                                            {/* Price */}
                                            <td className="px-4 py-4 text-right">
                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {formatPrice(product.price)}
                                                    </p>
                                                    {product.oldPrice && product.oldPrice > product.price && (
                                                        <p className="text-xs text-gray-400 line-through">
                                                            {formatPrice(product.oldPrice)}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Stock */}
                                            <td className="px-4 py-4 text-center">
                                                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                                                    (product.countInStock || 0) > 10 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : (product.countInStock || 0) > 0 
                                                            ? 'bg-yellow-100 text-yellow-800' 
                                                            : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {product.countInStock || 0}
                                                </span>
                                            </td>

                                            {/* Rating */}
                                            <td className="px-4 py-4 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <span className="text-yellow-400">★</span>
                                                    <span className="text-sm text-gray-600">
                                                        {product.rating?.toFixed(1) || '0.0'}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center justify-center gap-1">
                                                    <button
                                                        onClick={() => handleEditProduct(product._id)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Sửa"
                                                    >
                                                        <FiEdit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product._id, product.name)}
                                                        disabled={deleting === product._id}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                        title="Xóa"
                                                    >
                                                        {deleting === product._id ? (
                                                            <CircularProgress size={18} color="inherit" />
                                                        ) : (
                                                            <FiTrash2 size={18} />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                                <p className="text-sm text-gray-500">
                                    Trang {currentPage} / {totalPages}
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Trước
                                    </button>
                                    <span className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg">
                                        {currentPage}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Sau
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Products;
