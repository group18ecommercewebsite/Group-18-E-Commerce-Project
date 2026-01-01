import React, { useState, useEffect } from 'react';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiChevronDown,
  FiChevronRight,
  FiImage,
  FiFolder,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { getCategories, deleteCategory } from '../../api/categoryApi';
import CircularProgress from '@mui/material/CircularProgress';

const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [deleting, setDeleting] = useState(null);

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategories();
      if (response.success) {
        setCategories(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleDeleteCategory = async (e, categoryId, categoryName) => {
    e.stopPropagation(); // Ngăn sự kiện click lan ra row (để không bị toggle expand)
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

  const handleEdit = (e, id) => {
    e.stopPropagation();
    navigate(`/categories/edit/${id}`);
  };

  const countAllChildren = (cats) => {
    let count = 0;
    cats.forEach((cat) => {
      if (cat.children?.length > 0) {
        count += cat.children.length;
        count += countAllChildren(cat.children);
      }
    });
    return count;
  };

  // Render category row (Recursive)
  const renderCategoryRow = (category, level = 0) => {
    const subCats = category.children || [];
    const isExpanded = expandedCategories[category._id];
    const hasSubCats = subCats.length > 0;

    // Responsive Padding: Mobile thụt vào ít hơn (16px) so với Desktop (32px) để tiết kiệm diện tích
    // Lưu ý: Tailwind không hỗ trợ dynamic padding arbitrary value tốt trong loop, nên dùng inline style cho paddingLeft
    const paddingStep = window.innerWidth < 768 ? 16 : 32;
    const paddingLeft = 16 + level * paddingStep;

    return (
      <div key={category._id} className="group">
        {/* Category Row */}
        <div
          onClick={() => hasSubCats && toggleExpand(category._id)}
          className={`
                        relative flex items-center gap-3 p-3 md:p-4 border-b border-gray-100 transition-colors cursor-pointer
                        ${level > 0 ? 'bg-gray-50/50' : 'bg-white hover:bg-gray-50'}
                    `}
          style={{ paddingLeft: `${paddingLeft}px` }}
        >
          {/* Visual Tree Line (Optional styling helper) */}
          {level > 0 && (
            <div
              className="absolute left-0 top-0 bottom-0 border-l border-gray-200"
              style={{ left: `${paddingLeft - 12}px` }}
            />
          )}

          {/* Expand Icon */}
          <div
            className={`
                        w-6 h-6 flex-shrink-0 flex items-center justify-center rounded transition-colors
                        ${hasSubCats ? 'text-gray-500 hover:bg-gray-200' : 'text-transparent'}
                    `}
          >
            {hasSubCats ? (
              isExpanded ? (
                <FiChevronDown size={18} />
              ) : (
                <FiChevronRight size={18} />
              )
            ) : (
              <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
            )}
          </div>

          {/* Image */}
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg border border-gray-200 overflow-hidden bg-white flex-shrink-0 flex items-center justify-center">
            {category.images?.[0] || category.image ? (
              <img
                src={category.images?.[0] || category.image}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <FiImage className="text-gray-300 text-lg" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                className={`font-medium text-gray-900 truncate ${
                  level === 0 ? 'text-base' : 'text-sm'
                }`}
              >
                {category.name}
              </h3>
              {level > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] bg-gray-100 text-gray-500 rounded border border-gray-200 whitespace-nowrap">
                  Cấp {level + 1}
                </span>
              )}
            </div>
            {hasSubCats && <p className="text-xs text-gray-500 mt-0.5">{subCats.length} mục con</p>}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 md:gap-2 pl-2">
            <button
              onClick={(e) => handleEdit(e, category._id)}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Chỉnh sửa"
            >
              <FiEdit2 size={16} />
            </button>
            <button
              onClick={(e) => handleDeleteCategory(e, category._id, category.name)}
              disabled={deleting === category._id}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              title="Xóa"
            >
              {deleting === category._id ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <FiTrash2 size={16} />
              )}
            </button>
          </div>
        </div>

        {/* Recursion for Children */}
        {isExpanded && hasSubCats && (
          <div className="transition-all duration-300 ease-in-out">
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
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 bg-white rounded-lg shadow-sm p-4 md:p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FiFolder className="text-blue-500" />
              Danh mục sản phẩm
            </h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              Tổng quan: <span className="font-semibold text-blue-600">{categories.length}</span>{' '}
              danh mục gốc,{' '}
              <span className="font-semibold text-blue-600">{countAllChildren(categories)}</span>{' '}
              danh mục con
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => navigate('/category/subCat/add')}
              className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 text-gray-700 bg-white rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <FiPlus className="text-lg" />
              Thêm danh mục con
            </button>
            <button
              onClick={() => navigate('/categories/add')}
              className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
            >
              <FiPlus className="text-lg" />
              Thêm danh mục gốc
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {categories.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FiFolder className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Chưa có danh mục nào</h3>
            <p className="text-gray-500 mb-6 max-w-sm">
              Hãy tạo danh mục đầu tiên để bắt đầu tổ chức sản phẩm của bạn.
            </p>
            <button
              onClick={() => navigate('/categories/add')}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Tạo danh mục ngay
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {categories.map((category) => renderCategoryRow(category, 0))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
