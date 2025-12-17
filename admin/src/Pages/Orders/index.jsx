import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { FiPackage } from 'react-icons/fi';

const Orders = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedRows, setExpandedRows] = useState({});
    
    // Tái sử dụng và mở rộng dữ liệu từ Dashboard với chi tiết sản phẩm
    const [orders] = useState([
        {
            orderId: "ORD-001",
            paymentId: "PAY-001",
            name: "Anuj TH",
            phone: "+84 987654321",
            address: "12 Nguyễn Huệ, Quận 1, TP.HCM",
            pincode: "700000",
            totalAmount: 1200000,
            email: "anh.nguyen@example.com",
            userId: "USER-001",
            status: "Delivered",
            date: "2025-11-20",
            products: [
                { id: 1, name: "Áo thun nam oversize", quantity: 2, price: 299000, image: "https://via.placeholder.com/100" },
                { id: 2, name: "Quần jean slim fit", quantity: 1, price: 602000, image: "https://via.placeholder.com/100" }
            ]
        },
        {
            orderId: "ORD-002",
            paymentId: "PAY-002",
            name: "Phạm Minh Châu",
            phone: "+84 936543210",
            address: "45 Lê Lợi, Huế",
            pincode: "530000",
            totalAmount: 899000,
            email: "chau.pham@example.com",
            userId: "USER-002",
            status: "Confirm",
            date: "2025-11-20",
            products: [
                { id: 3, name: "Giày sneaker classic", quantity: 1, price: 899000, image: "https://via.placeholder.com/100" }
            ]
        },
        {
            orderId: "ORD-003",
            paymentId: "PAY-003",
            name: "Lê Quốc Huy",
            phone: "+84 912345678",
            address: "89 Phan Chu Trinh, Đà Nẵng",
            pincode: "550000",
            totalAmount: 2500000,
            email: "huy.le@example.com",
            userId: "USER-003",
            status: "Delivered",
            date: "2025-11-19",
            products: [
                { id: 4, name: "Tai nghe bluetooth ANC", quantity: 1, price: 1890000, image: "https://via.placeholder.com/100" },
                { id: 5, name: "Balo laptop chống nước", quantity: 1, price: 610000, image: "https://via.placeholder.com/100" }
            ]
        },
        {
            orderId: "ORD-004",
            paymentId: "PAY-004",
            name: "Đặng Thu Hà",
            phone: "+84 934567890",
            address: "210 Trần Phú, Hà Nội",
            pincode: "100000",
            totalAmount: 785000,
            email: "ha.dang@example.com",
            userId: "USER-004",
            status: "Pending",
            date: "2025-11-19",
            products: [
                { id: 6, name: "Ví da nam", quantity: 1, price: 485000, image: "https://via.placeholder.com/100" },
                { id: 7, name: "Thắt lưng da thật", quantity: 1, price: 300000, image: "https://via.placeholder.com/100" }
            ]
        },
        {
            orderId: "ORD-005",
            paymentId: "PAY-005",
            name: "Vũ Thảo",
            phone: "+84 987600321",
            address: "68 Võ Văn Kiệt, Cần Thơ",
            pincode: "900000",
            totalAmount: 1500000,
            email: "thao.vu@example.com",
            userId: "USER-005",
            status: "Delivered",
            date: "2025-11-19",
            products: [
                { id: 8, name: "Áo khoác gió", quantity: 1, price: 850000, image: "https://via.placeholder.com/100" },
                { id: 9, name: "Mũ lưỡi trai", quantity: 2, price: 325000, image: "https://via.placeholder.com/100" }
            ]
        }
    ]);

    const formatCurrency = (amount) => {
        return `₫${amount.toLocaleString('vi-VN')}`;
    };

    const getStatusColor = (status) => {
        const statusColors = {
            "Delivered": "bg-green-500 text-white",
            "Confirm": "bg-blue-500 text-white",
            "Pending": "bg-yellow-500 text-white",
            "Cancelled": "bg-red-500 text-white",
            "Processing": "bg-purple-500 text-white"
        };
        return statusColors[status] || "bg-gray-500 text-white";
    };

    const toggleRow = (orderId) => {
        setExpandedRows(prev => ({
            ...prev,
            [orderId]: !prev[orderId]
        }));
    };

    const filteredOrders = orders.filter(order => 
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phone.includes(searchTerm) ||
        order.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
                        <p className="text-gray-600 mt-1">Danh sách tất cả đơn hàng của khách hàng</p>
                    </div>
                    {/* Search Box */}
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2 min-w-[300px]">
                        <FaSearch className="text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm đơn hàng..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm text-gray-700 flex-1"
                        />
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
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
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="12" className="px-4 py-12 text-center text-gray-500">
                                        Không tìm thấy đơn hàng nào.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order, index) => (
                                    <React.Fragment key={order.orderId}>
                                        <tr className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => toggleRow(order.orderId)}
                                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                                >
                                                    {expandedRows[order.orderId] ? (
                                                        <IoIosArrowUp className="w-5 h-5" />
                                                    ) : (
                                                        <IoIosArrowDown className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderId}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{order.paymentId}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{order.name}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{order.phone}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 max-w-xs truncate" title={order.address}>{order.address}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{order.pincode}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{formatCurrency(order.totalAmount)}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{order.email}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{order.userId}</td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{order.date}</td>
                                        </tr>
                                        {/* Expanded row with product details */}
                                        {expandedRows[order.orderId] && (
                                            <tr className="bg-gray-50">
                                                <td colSpan="12" className="px-4 py-4">
                                                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <FiPackage className="w-5 h-5 text-gray-600" />
                                                            <h3 className="text-sm font-semibold text-gray-900">Chi tiết sản phẩm</h3>
                                                        </div>
                                                        <div className="space-y-3">
                                                            {order.products.map((product) => (
                                                                <div key={product.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                                                    <img 
                                                                        src={product.image} 
                                                                        alt={product.name}
                                                                        className="w-16 h-16 object-cover rounded border border-gray-200"
                                                                    />
                                                                    <div className="flex-1">
                                                                        <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                                                                        <p className="text-xs text-gray-500">Số lượng: {product.quantity}</p>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <p className="text-sm font-semibold text-gray-900">{formatCurrency(product.price)}</p>
                                                                        <p className="text-xs text-gray-500">Tổng: {formatCurrency(product.price * product.quantity)}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            <div className="flex justify-end pt-3 border-t border-gray-200">
                                                                <div className="text-right">
                                                                    <p className="text-sm text-gray-600">Tổng cộng:</p>
                                                                    <p className="text-lg font-bold text-gray-900">{formatCurrency(order.totalAmount)}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-gray-200 flex items-center justify-end gap-2">
                    <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">‹</button>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</button>
                    <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">2</button>
                    <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">3</button>
                    <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">›</button>
                </div>
            </div>
        </div>
    );
};

export default Orders;

