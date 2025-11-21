import React, { useState } from "react";
import { 
    FaUsers,
    FaShoppingCart, 
    FaBox, 
    FaPlus,
    FaSearch,
    FaEye,
    FaTrash,
    FaUserCircle,
    FaShoppingBag,
    FaChartBar
} from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";

const Dashboard = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPage, setOrdersPage] = useState(1);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const rowsPerPage = 50;

    // Statistics Cards Data
    const stats = [
        {
            title: "Total Users",
            value: "3,766",
            icon: FaUsers,
            color: "bg-green-500",
            bgColor: "bg-green-50",
            textColor: "text-green-700"
        },
        {
            title: "Total Orders",
            value: "1,038",
            icon: FaShoppingCart,
            color: "bg-blue-500",
            bgColor: "bg-blue-50",
            textColor: "text-blue-700"
        },
        {
            title: "Total Products",
            value: "50",
            icon: FaBox,
            color: "bg-purple-500",
            bgColor: "bg-purple-50",
            textColor: "text-purple-700"
        },
        {
            title: "Total Category",
            value: "8",
            icon: FaPlus,
            color: "bg-red-500",
            bgColor: "bg-red-50",
            textColor: "text-red-700"
        }
    ];

    // Products Data
    const products = [
        { 
            id: 1, 
            name: "Áo thun nam oversize", 
            image: "https://media.routine.vn/1200x1500/prod/variant/19f25tss005-black-1-jpg-fdg7.webp", 
            category: "Thời trang", 
            subCategory: "Nam", 
            price: "₫299.000", 
            sales: 210, 
            stock: 120, 
            rating: 5 
        },
        { 
            id: 2, 
            name: "Giày sneaker classic", 
            image: "https://product.hstatic.net/1000150581/product/__1__0abdd36a80ef4ed4862523a5f6027c95_e1ff1d4a49e3458d87445f58a94fd623_d611706ed43b4a2c874bed79e1e739f9_grande.jpg", 
            category: "Thời trang", 
            subCategory: "Giày dép", 
            price: "₫1.250.000", 
            sales: 98, 
            stock: 560, 
            rating: 4 
        },
        { 
            id: 3, 
            name: "Tai nghe bluetooth ANC", 
            image: "https://cdn11.dienmaycholon.vn/filewebdmclnew/DMCL21/Picture//Apro/Apro_product_25950/tai-nghe-marsha_main_935_1020.png.webp", 
            category: "Phụ kiện", 
            subCategory: "Âm thanh", 
            price: "₫1.890.000", 
            sales: 342, 
            stock: 74, 
            rating: 5 
        },
        { 
            id: 4, 
            name: "Balo laptop chống nước", 
            image: "https://gubag.vn/wp-content/uploads/2022/10/balo-dung-laptop-17-inch-chong-nuoc-cao-cap-gb-bl57-2-1.webp", 
            category: "Phụ kiện", 
            subCategory: "Đồ công nghệ", 
            price: "₫850.000", 
            sales: 156, 
            stock: 34, 
            rating: 4 
        }
    ];

    const toggleProductSelection = (productId) => {
        setSelectedProducts((prev) =>
            prev.includes(productId)
                ? prev.filter((id) => id !== productId)
                : [...prev, productId]
        );
    };

    const toggleSelectAllProducts = () => {
        if (selectedProducts.length === products.length) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(products.map((product) => product.id));
        }
    };

    const isAllProductsSelected = products.length > 0 && selectedProducts.length === products.length;

    // Recent Orders Data
    const recentOrders = [
        {
            orderId: "ORD-001",
            paymentId: "PAY-001",
            name: "Anuj TH",
            phone: "+84 987654321",
            address: "12 Nguyễn Huệ, Quận 1, TP.HCM",
            pincode: "700000",
            totalAmount: "₫1.200.000",
            email: "anh.nguyen@example.com",
            userId: "USER-001",
            status: "Delivered",
            date: "2025-11-20"
        },
        {
            orderId: "ORD-002",
            paymentId: "PAY-002",
            name: "Phạm Minh Châu",
            phone: "+84 936543210",
            address: "45 Lê Lợi, Huế",
            pincode: "530000",
            totalAmount: "₫899.000",
            email: "chau.pham@example.com",
            userId: "USER-002",
            status: "Confirm",
            date: "2025-11-20"
        },
        {
            orderId: "ORD-003",
            paymentId: "PAY-003",
            name: "Lê Quốc Huy",
            phone: "+84 912345678",
            address: "89 Phan Chu Trinh, Đà Nẵng",
            pincode: "550000",
            totalAmount: "₫2.500.000",
            email: "huy.le@example.com",
            userId: "USER-003",
            status: "Delivered",
            date: "2025-11-19"
        },
        {
            orderId: "ORD-004",
            paymentId: "PAY-004",
            name: "Đặng Thu Hà",
            phone: "+84 934567890",
            address: "210 Trần Phú, Hà Nội",
            pincode: "100000",
            totalAmount: "₫785.000",
            email: "ha.dang@example.com",
            userId: "USER-004",
            status: "Confirm",
            date: "2025-11-19"
        },
        {
            orderId: "ORD-005",
            paymentId: "PAY-005",
            name: "Vũ Thảo",
            phone: "+84 987600321",
            address: "68 Võ Văn Kiệt, Cần Thơ",
            pincode: "900000",
            totalAmount: "₫1.500.000",
            email: "thao.vu@example.com",
            userId: "USER-005",
            status: "Delivered",
            date: "2025-11-19"
        }
    ];

    // Chart Data
    const chartData = {
        months: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
        totalUsers: [500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600],
        totalSales: [100000, 150000, 200000, 4500000, 5000000, 300000, 4800000, 400000, 350000, 380000, 420000, 450000]
    };

    const maxValue = Math.max(...chartData.totalSales, ...chartData.totalUsers);
    const formatCurrency = (value) => `₫${value.toLocaleString("vi-VN")}`;
    const formatNumber = (value) => value.toLocaleString("vi-VN");

    const getStatusColor = (status) => {
        return status === "Delivered" 
            ? "bg-green-500 text-white" 
            : "bg-blue-500 text-white";
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>★</span>
        ));
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="mb-6 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Welcome, Admin</h1>
                        <p className="text-gray-600 mt-1">Here's What happening on your store today. See the statistics at once.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                            <FaPlus className="text-sm" />
                            Add Product
                        </button>
                        <div className="relative">
                            <FaShoppingBag className="text-2xl text-gray-600 cursor-pointer" />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
                        </div>
                        <FaUserCircle className="text-3xl text-gray-600 cursor-pointer" />
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className={`${stat.bgColor} rounded-lg shadow-sm p-6 border border-gray-200`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={`text-sm font-medium ${stat.textColor} mb-2`}>{stat.title}</p>
                                    <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
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
                })}
            </div>

            {/* Products Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Products</h2>
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                        <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>Phân loại</option>
                            <option>Thời trang</option>
                            <option>Phụ kiện</option>
                            <option>Đồ điện tử</option>
                            <option>Đồ gia dụng</option>
                        </select>
                        <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>Danh mục phụ</option>
                            <option>Nam</option>
                            <option>Nữ</option>
                            <option>Giày dép</option>
                            <option>Âm thanh</option>
                        </select>
                        <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>Danh mục cấp 3</option>
                            <option>Áo</option>
                            <option>Phụ kiện công nghệ</option>
                            <option>Phụ kiện thời trang</option>
                        </select>
                        <div className="ml-auto flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
                            <FaSearch className="text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search here..." 
                                className="bg-transparent border-none outline-none text-sm text-gray-700"
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <button 
                            onClick={toggleSelectAllProducts}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            {isAllProductsSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                        </button>
                        <button 
                            disabled={!selectedProducts.length}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${selectedProducts.length ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
                        >
                            Chỉnh sửa hàng loạt
                        </button>
                        <button 
                            disabled={!selectedProducts.length}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${selectedProducts.length ? "bg-red-100 text-red-600 hover:bg-red-200" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
                        >
                            Xóa sản phẩm đã chọn
                        </button>
                        <span className="text-sm text-gray-500">
                            Đã chọn {selectedProducts.length}/{products.length} sản phẩm
                        </span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left">
                                    <input 
                                        type="checkbox" 
                                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                        checked={isAllProductsSelected}
                                        onChange={toggleSelectAllProducts}
                                    />
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">PRODUCT</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">CATEGORY</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">SUB CATEGORY</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">PRICE</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">SALES</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">STOCK</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">RATING</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ACTION</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((product) => (
                                <tr key={product.id} className={`hover:bg-gray-50 transition-colors ${selectedProducts.includes(product.id) ? "bg-blue-50" : ""}`}>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                    <input 
                                        type="checkbox" 
                                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                        checked={selectedProducts.includes(product.id)}
                                        onChange={() => toggleProductSelection(product.id)}
                                    />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <img src={product.image} alt={product.name} className="w-12 h-12 rounded object-cover" />
                                            <span className="text-sm font-medium text-gray-900">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.subCategory}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{product.price}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.sales} đơn</td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${product.stock < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                                        {product.stock < 0 ? product.stock : formatNumber(product.stock)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-1">
                                            {renderStars(product.rating)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <button className="text-blue-600 hover:text-blue-800">
                                                <FaEye />
                                            </button>
                                            <button className="text-red-600 hover:text-red-800">
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-sm text-gray-600">Rows per page: {rowsPerPage}</span>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">1-{rowsPerPage} of 100</span>
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">Previous</button>
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">Next</button>
                    </div>
                </div>
            </div>

            {/* Recent Orders Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
                            <FaSearch className="text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search here..." 
                                className="bg-transparent border-none outline-none text-sm text-gray-700"
                            />
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"></th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ORDER ID</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">PAYMENT ID</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">NAME</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">PHONE NUMBER</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ADDRESS</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">PINCODE</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">TOTAL AMOUNT</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">EMAIL</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">USER ID</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ORDER STATUS</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">DATE</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recentOrders.map((order, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <IoIosArrowDown className="text-gray-400 cursor-pointer" />
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderId}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{order.paymentId}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{order.name}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{order.phone}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 max-w-xs truncate">{order.address}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{order.pincode}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{order.totalAmount}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{order.email}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{order.userId}</td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <button className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </button>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{order.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-gray-200 flex items-center justify-end gap-2">
                    <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">‹</button>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</button>
                    <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">2</button>
                    <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">3</button>
                    <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">4</button>
                    <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">5</button>
                    <span className="px-2 text-sm text-gray-600">...</span>
                    <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">208</button>
                    <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">›</button>
                </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Total Users & Total Sales</h2>
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Total Users</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Total Sales</span>
                    </div>
                </div>
                <div className="h-80 flex items-end justify-between gap-2 relative">
                    <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 pr-2">
                        {[5000000, 4000000, 3000000, 2000000, 1000000, 0].map((value, i) => (
                            <span key={i}>{formatCurrency(value)}</span>
                        ))}
                    </div>
                    <div className="flex-1 ml-12 flex items-end justify-between gap-1">
                        {chartData.months.map((month, index) => {
                            const userHeight = (chartData.totalUsers[index] / maxValue) * 100;
                            const salesHeight = (chartData.totalSales[index] / maxValue) * 100;
                            return (
                                <div key={index} className="flex-1 flex flex-col items-center group relative">
                                    <div className="w-full flex items-end justify-center gap-0.5 h-full">
                                        <div 
                                            className="w-1/2 bg-blue-500 rounded-t transition-all hover:opacity-80 cursor-pointer"
                                            style={{ height: `${userHeight}%` }}
                                            title={`Users: ${chartData.totalUsers[index].toLocaleString("vi-VN")}`}
                                        ></div>
                                        <div 
                                            className="w-1/2 bg-green-500 rounded-t transition-all hover:opacity-80 cursor-pointer"
                                            style={{ height: `${salesHeight}%` }}
                                            title={`Sales: ${formatCurrency(chartData.totalSales[index])}`}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-gray-600 mt-2 font-medium">{month}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
