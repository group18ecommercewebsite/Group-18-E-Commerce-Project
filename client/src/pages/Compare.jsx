import React from 'react';
import { Link } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { IoCloseCircle, IoTrashOutline } from 'react-icons/io5';
import { IoIosGitCompare } from 'react-icons/io';
import { FaStar } from 'react-icons/fa';
import { formatCurrency } from '../utils/formatCurrency';

const Compare = () => {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();

  if (compareItems.length === 0) {
    return (
      <section className="py-16">
        <div className="container">
          <div className="text-center">
            <IoIosGitCompare className="text-8xl text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Chưa có sản phẩm để so sánh</h2>
            <p className="text-gray-500 mb-6">Thêm sản phẩm vào danh sách so sánh để xem chi tiết bên cạnh nhau</p>
            <Link 
              to="/productListing"
              className="inline-block px-6 py-3 bg-[#ff5252] text-white rounded-lg hover:bg-[#e04848] transition"
            >
              Khám phá sản phẩm
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10">
      <div className="container">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <IoIosGitCompare className="text-3xl text-[#ff5252]" />
            <h1 className="text-2xl font-bold">So sánh sản phẩm ({compareItems.length}/4)</h1>
          </div>
          <button
            onClick={clearCompare}
            className="flex items-center gap-2 px-4 py-2 text-red-500 border border-red-500 rounded-lg hover:bg-red-50 transition"
          >
            <IoTrashOutline />
            Xóa tất cả
          </button>
        </div>

        {/* Compare Table */}
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-md overflow-hidden">
            <tbody>
              {/* Product Images */}
              <tr className="border-b">
                <td className="p-4 bg-gray-50 font-semibold w-[150px]">Sản phẩm</td>
                {compareItems.map((product) => (
                  <td key={product._id} className="p-4 text-center min-w-[200px]">
                    <div className="relative">
                      <button
                        onClick={() => removeFromCompare(product._id)}
                        className="absolute -top-2 -right-2 text-red-500 hover:text-red-700 z-10"
                      >
                        <IoCloseCircle className="text-2xl" />
                      </button>
                      <Link to={`/product/${product._id}`}>
                        <img 
                          src={product.images?.[0] || 'https://via.placeholder.com/150'} 
                          alt={product.name}
                          className="w-32 h-32 object-contain mx-auto rounded-lg"
                        />
                      </Link>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Product Name */}
              <tr className="border-b">
                <td className="p-4 bg-gray-50 font-semibold">Tên</td>
                {compareItems.map((product) => (
                  <td key={product._id} className="p-4 text-center">
                    <Link 
                      to={`/product/${product._id}`}
                      className="font-medium text-gray-800 hover:text-[#ff5252] transition line-clamp-2"
                    >
                      {product.name}
                    </Link>
                  </td>
                ))}
              </tr>

              {/* Price */}
              <tr className="border-b">
                <td className="p-4 bg-gray-50 font-semibold">Giá</td>
                {compareItems.map((product) => (
                  <td key={product._id} className="p-4 text-center">
                    <span className="text-xl font-bold text-[#ff5252]">
                      {formatCurrency(product.price)}
                    </span>
                    {product.oldPrice && product.oldPrice > product.price && (
                      <span className="block text-sm text-gray-400 line-through">
                        {formatCurrency(product.oldPrice)}
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Rating */}
              <tr className="border-b">
                <td className="p-4 bg-gray-50 font-semibold">Đánh giá</td>
                {compareItems.map((product) => (
                  <td key={product._id} className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <FaStar className="text-yellow-400" />
                      <span className="font-medium">{product.rating?.toFixed(1) || '0.0'}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Category */}
              <tr className="border-b">
                <td className="p-4 bg-gray-50 font-semibold">Danh mục</td>
                {compareItems.map((product) => (
                  <td key={product._id} className="p-4 text-center text-gray-600">
                    {product.catName || product.category?.name || '-'}
                  </td>
                ))}
              </tr>

              {/* Brand */}
              <tr className="border-b">
                <td className="p-4 bg-gray-50 font-semibold">Thương hiệu</td>
                {compareItems.map((product) => (
                  <td key={product._id} className="p-4 text-center text-gray-600">
                    {product.brand || '-'}
                  </td>
                ))}
              </tr>

              {/* Stock */}
              <tr className="border-b">
                <td className="p-4 bg-gray-50 font-semibold">Tình trạng</td>
                {compareItems.map((product) => (
                  <td key={product._id} className="p-4 text-center">
                    {product.countInStock > 0 ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        Còn hàng ({product.countInStock})
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                        Hết hàng
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Description */}
              <tr>
                <td className="p-4 bg-gray-50 font-semibold align-top">Mô tả</td>
                {compareItems.map((product) => (
                  <td key={product._id} className="p-4 text-sm text-gray-600">
                    <p className="line-clamp-4">{product.description || 'Không có mô tả'}</p>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Compare;
