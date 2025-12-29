import React, { useState, useEffect } from "react";
import { 
    FaUsers,
    FaShoppingCart, 
    FaBox, 
    FaPlus,
    FaChartBar,
    FaTags
} from "react-icons/fa";
import { useAddProduct } from "../../Context/AddProductContext";
import { getDashboardStats } from "../../api/orderApi";
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { openPanel } = useAddProduct();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalCategories: 0
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const statsRes = await getDashboardStats();
            
            if (statsRes.success) {
                setStats(statsRes.data);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const statsCards = [
        {
            title: "Total Users",
            value: stats.totalUsers,
            icon: FaUsers,
            color: "bg-green-500",
            bgColor: "bg-green-50",
            textColor: "text-green-700",
            link: "/users"
        },
        {
            title: "Total Orders",
            value: stats.totalOrders,
            icon: FaShoppingCart,
            color: "bg-blue-500",
            bgColor: "bg-blue-50",
            textColor: "text-blue-700",
            link: "/orders"
        },
        {
            title: "Total Products",
            value: stats.totalProducts,
            icon: FaBox,
            color: "bg-purple-500",
            bgColor: "bg-purple-50",
            textColor: "text-purple-700",
            link: "/products"
        },
        {
            title: "Total Category",
            value: stats.totalCategories,
            icon: FaTags,
            color: "bg-red-500",
            bgColor: "bg-red-50",
            textColor: "text-red-700",
            link: "/categories"
        }
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="mb-6 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Welcome, Admin</h1>
                        <p className="text-gray-600 mt-1">Here's What happening on your store today. See the statistics at once.</p>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                    <div className="col-span-4 flex justify-center py-10">
                        <CircularProgress />
                    </div>
                ) : (
                    statsCards.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div 
                                key={index} 
                                className={`${stat.bgColor} rounded-lg shadow-sm p-6 border border-gray-200 cursor-pointer hover:shadow-md transition-shadow`}
                                onClick={() => navigate(stat.link)}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className={`text-sm font-medium ${stat.textColor} mb-2`}>{stat.title}</p>
                                        <h3 className="text-3xl font-bold text-gray-900">{stat.value.toLocaleString('vi-VN')}</h3>
                                    </div>
                                    <div className={`${stat.color} p-4 rounded-lg`}>
                                        <Icon className="text-white text-2xl" />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center gap-2">
                                    <FaChartBar className="text-gray-400 text-sm" />
                                    <span className="text-xs text-gray-500">View details</span>
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
