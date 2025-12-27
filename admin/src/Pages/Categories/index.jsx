import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { getCategories, deleteCategory } from '../../api/categoryApi';
import CircularProgress from '@mui/material/CircularProgress';

const Categories = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedCategories, setExpandedCategories] = useState({}); // Dùng object để track nhiều expanded
    const [deleting, setDeleting] = useState(null);

    // Fetch categories
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await getCategories();
            console.log('Categories response:', response);
            
            if (response.success) {
                setCategories(response.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally {
            setLoading(false);
        }
    };

    // Toggle expand category (support nested)
    const toggleExpand = (categoryId) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    // Delete category
    const handleDeleteCategory = async (categoryId, categoryName) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${categoryName}"?`)) return;
        
        try {
            setDeleting(categoryId);
            const res = await deleteCategory(categoryId);
            if (res.success) {
                await fetchCategories();
            }
        } catch (error) {
            console.error('Failed to delete category:', error);
            alert('Xóa danh mục thất bại');
        } finally {
            setDeleting(null);
        }
    };

    // Đếm tổng số subcategories (recursive)
    const countAllChildren = (cats) => {
        let count = 0;
        cats.forEach(cat => {
            if (cat.children?.length > 0) {
                count += cat.children.length;
                count += countAllChildren(cat.children);
            }
        });
        return count;
    };

    // Render category row (recursive)
    const renderCategoryRow = (category, level = 0) => {
        const subCats = category.children || [];
        const isExpanded = expandedCategories[category._id];
        const hasSubCats = subCats.length > 0;
        const paddingLeft = 16 + (level * 40); // Indent based on level

        return (
            <div key={category._id}>
                {/* Category Row */}
                <div 
                    className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${level > 0 ? 'bg-gray-50 border-t border-gray-100' : ''}`}
                    style={{ paddingLeft: `${paddingLeft}px` }}
                >
                    {/* Expand button */}
                    <button
                        onClick={() => hasSubCats && toggleExpand(category._id)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                            hasSubCats 
                                ? 'hover:bg-gray-200 text-gray-600 cursor-pointer' 
                                : 'text-gray-300 cursor-default'
                        }`}
                        disabled={!hasSubCats}
                    >
                        {hasSubCats ? (
                            isExpanded ? <FiChevronDown size={18} /> : <FiChevronRight size={18} />
                        ) : (
                            <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                        )}
                    </button>

                    {/* Image */}
                    <div className={`rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 ${level === 0 ? 'w-14 h-14' : 'w-10 h-10'}`}>
                        {(category.images?.[0] || category.image) ? (
                            <img
                                src={category.images?.[0] || category.image}
                                alt={category.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                -
                            </div>
                        )}
                    </div>

                    {/* Name & Badge */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className={`font-semibold text-gray-900 ${level > 0 ? 'text-sm' : ''}`}>{category.name}</h3>
                            {level > 0 && (
                                <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded">
                                    Cấp {level + 1}
                                </span>
                            )}
                        </div>
                        {hasSubCats && (
                            <p className="text-sm text-gray-500">
                                {subCats.length} danh mục con
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate(`/categories/edit/${category._id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Sửa"
                        >
                            <FiEdit2 size={level === 0 ? 18 : 16} />
                        </button>
                        <button
                            onClick={() => handleDeleteCategory(category._id, category.name)}
                            disabled={deleting === category._id}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Xóa"
                        >
                            {deleting === category._id ? (
                                <CircularProgress size={level === 0 ? 18 : 16} color="inherit" />
                            ) : (
                                <FiTrash2 size={level === 0 ? 18 : 16} />
                            )}
                        </button>
                    </div>
                </div>

                {/* Children (Recursive) */}
                {isExpanded && hasSubCats && (
                    <div className="border-l-2 border-blue-200 ml-6">
                        {subCats.map((subCat) => renderCategoryRow(subCat, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
                <CircularProgress />
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Danh mục sản phẩm</h1>
                        <p className="text-gray-600 mt-1">
                            Quản lý {categories.length} danh mục và {countAllChildren(categories)} danh mục con
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/category/subCat/add')}
                            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center gap-2"
                        >
                            <FiPlus className="text-sm" />
                            Thêm danh mục con
                        </button>
                        <button
                            onClick={() => navigate('/categories/add')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <FiPlus className="text-sm" />
                            Thêm danh mục
                        </button>
                    </div>
                </div>
            </div>

            {/* Categories List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {categories.length === 0 ? (
                    <div className="py-20 text-center text-gray-500">
                        <p className="mb-4">Chưa có danh mục nào</p>
                        <button
                            onClick={() => navigate('/categories/add')}
                            className="text-blue-600 font-medium hover:underline"
                        >
                            Thêm danh mục đầu tiên
                        </button>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {categories.map((category) => renderCategoryRow(category, 0))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Categories;
