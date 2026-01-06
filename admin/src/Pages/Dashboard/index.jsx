import React, { useState, useEffect } from 'react';
import { FaUsers, FaShoppingCart, FaBox, FaPlus, FaChartBar, FaTags } from 'react-icons/fa';
import { useAddProduct } from '../../Context/AddProductContext';
import { getDashboardStats } from '../../api/orderApi';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  // Sử dụng context để mở panel thêm sản phẩm
  const { openPanel } = useAddProduct();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCategories: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const statsRes = await getDashboardStats();

      if (statsRes.success) {
        setStats(statsRes.data);
      } else {
        // Fallback nếu API trả về success: false
        setError('Không thể tải dữ liệu thống kê.');
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Lỗi kết nối máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: FaUsers,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      link: '/users',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: FaShoppingCart,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      link: '/orders',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: FaBox,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      link: '/products',
    },
    {
      title: 'Total Category',
      value: stats.totalCategories,
      icon: FaTags,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      link: '/categories',
    },
  ];

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-6 bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, Admin </h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">
            Tổng quan về hệ thống
          </p>
        </div>

        {/* Nút Add Product sử dụng context đã import */}
        <button
          onClick={openPanel}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition-colors font-medium shadow-sm active:scale-95"
        >
          <FaPlus className="text-sm" />
          <span>Thêm sản phẩm</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {loading ? (
          <div className="col-span-1 sm:col-span-2 lg:col-span-4 flex justify-center items-center py-20 min-h-[200px]">
            <CircularProgress size={40} />
          </div>
        ) : (
          statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`${stat.bgColor} rounded-xl p-5 border border-transparent hover:border-gray-200 cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
                onClick={() => navigate(stat.link)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <p
                      className={`text-sm font-semibold ${stat.textColor} uppercase tracking-wider mb-1`}
                    >
                      {stat.title}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mt-1">
                      {stat.value.toLocaleString('vi-VN')}
                    </h3>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg shadow-md`}>
                    <Icon className="text-white text-xl" />
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 border-t border-black/5 pt-3">
                  <FaChartBar className={`${stat.textColor} text-sm opacity-70`} />
                  <span className={`${stat.textColor} text-xs font-medium opacity-90`}>
                    Xem chi tiết
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Dashboard;
