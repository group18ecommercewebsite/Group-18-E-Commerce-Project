import React, { useState, useEffect, useContext } from "react";
import { MyContext } from "../App";
import { FiUser } from "react-icons/fi";
import { GoHeart } from "react-icons/go";
import { IoBagCheckOutline, IoLogOutOutline, IoClose } from "react-icons/io5";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import Badge from "../components/Badge";
import { getMyOrders, cancelOrder } from "../api/orderApi";
import { logoutUser } from "../api/userApi";
import CircularProgress from "@mui/material/CircularProgress";
import { formatCurrency } from "../utils/formatCurrency";

// Danh sách ngân hàng Việt Nam
const VIETNAM_BANKS = [
  "Vietcombank",
  "VietinBank",
  "BIDV",
  "Agribank",
  "Techcombank",
  "MBBank",
  "ACB",
  "VPBank",
  "TPBank",
  "Sacombank",
  "HDBank",
  "VIB",
  "SHB",
  "SeABank",
  "OCB",
  "MSB",
  "Eximbank",
  "LienVietPostBank",
  "NamABank",
  "BacABank",
  "PVcomBank",
  "Khác"
];

// Lý do hủy đơn
const CANCEL_REASONS = [
  "Đổi ý không muốn mua nữa",
  "Tìm thấy giá rẻ hơn ở nơi khác",
  "Đặt nhầm sản phẩm",
  "Muốn thay đổi địa chỉ giao hàng",
  "Muốn thay đổi phương thức thanh toán",
  "Thời gian giao hàng quá lâu",
  "Lý do khác"
];

export const Orders = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("orders");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Cancel order states
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [cancelling, setCancelling] = useState(false);

  // Sử dụng user từ global context
  const user = context.user;

  // Fetch orders từ API
  useEffect(() => {
    const fetchOrders = async () => {
      if (!context.isLogin) {
        setLoading(false);
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const response = await getMyOrders();
        if (response.success) {
          setOrders(response.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        context.openAlertBox('error', 'Không thể tải danh sách đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [context.isLogin]);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      context.setIsLogin(false);
      context.setUser(null);
      navigate("/login");
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Mở modal hủy đơn
  const openCancelModal = (order) => {
    setSelectedOrder(order);
    setCancelReason("");
    setBankName("");
    setAccountNumber("");
    setAccountHolder("");
    setShowCancelModal(true);
  };

  // Đóng modal
  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedOrder(null);
  };

  // Kiểm tra xem đơn có cần nhập thông tin bank không
  const needsBankInfo = (order) => {
    return order.order_status === 'paid' && 
           (order.payment_status?.includes('SePay') || order.payment_status?.includes('Paid'));
  };

  // Xử lý hủy đơn
  const handleCancelOrder = async () => {
    if (!cancelReason) {
      context.openAlertBox('error', 'Vui lòng chọn lý do hủy đơn');
      return;
    }

    if (needsBankInfo(selectedOrder)) {
      if (!bankName || !accountNumber || !accountHolder) {
        context.openAlertBox('error', 'Vui lòng điền đầy đủ thông tin ngân hàng để nhận hoàn tiền');
        return;
      }
    }

    try {
      setCancelling(true);
      
      const cancelData = {
        cancel_reason: cancelReason,
      };

      if (needsBankInfo(selectedOrder)) {
        cancelData.refund_info = {
          bank_name: bankName,
          account_number: accountNumber,
          account_holder: accountHolder.toUpperCase()
        };
      }

      const response = await cancelOrder(selectedOrder.orderId, cancelData);
      
      if (response.success) {
        context.openAlertBox('success', response.message);
        // Refresh orders
        const ordersResponse = await getMyOrders();
        if (ordersResponse.success) {
          setOrders(ordersResponse.data || []);
        }
        closeCancelModal();
      } else {
        context.openAlertBox('error', response.message || 'Không thể hủy đơn hàng');
      }
    } catch (error) {
      console.error('Cancel order error:', error);
      context.openAlertBox('error', error.response?.data?.message || 'Không thể hủy đơn hàng');
    } finally {
      setCancelling(false);
    }
  };

  // Kiểm tra xem đơn có thể hủy không
  const canCancelOrder = (order) => {
    return ['pending', 'paid'].includes(order.order_status);
  };

  const menuItems = [
    {
      id: "profile",
      label: "My Profile",
      icon: <FiUser className="text-[18px]" />,
      path: "/my-account"
    },
    {
      id: "mylist",
      label: "My List",
      icon: <GoHeart className="text-[18px]" />,
      path: "/my-list"
    },
    {
      id: "orders",
      label: "My Orders",
      icon: <IoBagCheckOutline className="text-[18px]" />,
      path: "/my-orders"
    },
  ];

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <section className="section py-10 pb-10">
        <div className="container flex justify-center items-center min-h-[400px]">
          <CircularProgress sx={{ color: '#ff5252' }} />
        </div>
      </section>
    );
  }

  return (  
    <section className="section py-10 pb-10">
      <div className="container w-[90%] max-w-[90%] flex gap-5">
        {/* Left Sidebar */}
        <div className="w-[280px]">
          <div className="card bg-white shadow-md rounded-md p-5 sticky top-5">
            {/* User Avatar */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-[100px] h-[100px] rounded-full bg-[#ff5252] flex items-center justify-center text-white text-[40px] font-semibold mb-3 overflow-hidden">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="User Avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                )}
              </div>
              <h3 className="text-[16px] font-semibold">{user?.name || 'User'}</h3>
              <p className="text-[13px] text-gray-500">{user?.email || ''}</p>
            </div>

            {/* Menu */}
            <nav className="border-t border-gray-100 pt-4">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center gap-3 w-full px-4 py-3 text-[14px] text-left transition rounded-md
                              ${
                                activeTab === item.id
                                  ? "text-[#ff5252] bg-red-50 border-l-3 border-[#ff5252]"
                                  : "text-gray-700 hover:bg-gray-50"
                              }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 text-[14px] text-gray-700 hover:bg-gray-50 transition rounded-md mt-2"
              >
                <IoLogOutOutline className="text-[18px]" />
                Logout
              </button>
            </nav>
          </div>
        </div>

        {/* Right Content - Orders */}
        <div className="flex-1">
          <div className="shadow-md rounded-md bg-white">
            <div className="py-4 px-5 border-b border-[rgba(0,0,0,0.1)]">
              <h2 className="text-[18px] font-semibold">My Orders</h2>
              <p className="mt-1 text-[14px] text-gray-500">
                There are <span className="font-bold text-[#ff5252]">{orders.length}</span> orders
              </p>
            </div>

            {orders.length === 0 ? (
              <div className="py-20 text-center">
                <IoBagCheckOutline className="text-[60px] text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Bạn chưa có đơn hàng nào</p>
                <Link to="/productListing" className="text-[#ff5252] font-medium hover:underline">
                  Mua sắm ngay
                </Link>
              </div>
            ) : (
              /* Orders Table */
              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="bg-[#3d464d] text-white">
                      <th className="py-3 px-3 text-left font-medium"></th>
                      <th className="py-3 px-3 text-left font-medium uppercase">Order ID</th>
                      <th className="py-3 px-3 text-left font-medium uppercase">Payment</th>
                      <th className="py-3 px-3 text-left font-medium uppercase">Products</th>
                      <th className="py-3 px-3 text-left font-medium uppercase">Total</th>
                      <th className="py-3 px-3 text-left font-medium uppercase">Status</th>
                      <th className="py-3 px-3 text-left font-medium uppercase">Hoàn tiền</th>
                      <th className="py-3 px-3 text-left font-medium uppercase">Date</th>
                      <th className="py-3 px-3 text-left font-medium uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <React.Fragment key={order.orderId}>
                        {/* Order Row */}
                        <tr className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-3">
                            <button
                              onClick={() => toggleOrderDetails(order.orderId)}
                              className="w-[30px] h-[30px] rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                            >
                              {expandedOrder === order.orderId ? (
                                <IoChevronUp className="text-[14px]" />
                              ) : (
                                <IoChevronDown className="text-[14px]" />
                              )}
                            </button>
                          </td>
                          <td className="py-3 px-3 text-[#ff5252] font-medium">{order.orderId}</td>
                          <td className="py-3 px-3">
                            <span className="text-[#ff5252]">{order.payment_status || 'COD'}</span>
                          </td>
                          <td className="py-3 px-3">{order.products?.length || 0} items</td>
                          <td className="py-3 px-3 font-medium">{formatCurrency(order.totalAmt)}</td>
                          <td className="py-3 px-3">
                            <Badge status={order.order_status || 'pending'} />
                          </td>
                          <td className="py-3 px-3">
                            {order.order_status === 'cancelled' && order.refund_status && order.refund_status !== 'none' ? (
                              <span className={`px-2 py-1 rounded-full text-[11px] font-semibold ${
                                order.refund_status === 'pending_refund' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {order.refund_status === 'pending_refund' ? 'Chưa hoàn tiền' : 'Đã hoàn tiền'}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-[11px]">-</span>
                            )}
                          </td>
                          <td className="py-3 px-3">{formatDate(order.createdAt)}</td>
                          <td className="py-3 px-3">
                            {canCancelOrder(order) && (
                              <button
                                onClick={() => openCancelModal(order)}
                                className="px-3 py-1.5 text-[12px] bg-red-500 text-white rounded hover:bg-red-600 transition"
                              >
                                Hủy đơn
                              </button>
                            )}
                          </td>
                        </tr>

                        {/* Order Details (Products) - Expandable */}
                        {expandedOrder === order.orderId && (
                          <tr>
                            <td colSpan="9" className="p-0">
                              <div className="bg-[#fff8f0] p-4 border-l-4 border-[#ff5252]">
                                <table className="w-full text-[13px]">
                                  <thead>
                                    <tr className="bg-[#2d3748] text-white">
                                      <th className="py-3 px-4 text-left font-medium uppercase">Image</th>
                                      <th className="py-3 px-4 text-left font-medium uppercase">Product</th>
                                      <th className="py-3 px-4 text-left font-medium uppercase">Quantity</th>
                                      <th className="py-3 px-4 text-left font-medium uppercase">Price</th>
                                      <th className="py-3 px-4 text-left font-medium uppercase">Sub Total</th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white">
                                    {order.products?.map((product, index) => (
                                      <tr key={index} className="border-b border-gray-100 hover:bg-[#fff5eb]">
                                        <td className="py-3 px-4">
                                          <img
                                            src={product.image || 'https://via.placeholder.com/50'}
                                            alt={product.name}
                                            className="w-[50px] h-[50px] object-cover rounded"
                                          />
                                        </td>
                                        <td className="py-3 px-4 max-w-[250px]">
                                          <Link 
                                            to={`/product/${product.productId}`}
                                            className="hover:text-[#ff5252]"
                                          >
                                            {product.name}
                                          </Link>
                                        </td>
                                        <td className="py-3 px-4 text-center">{product.quantity}</td>
                                        <td className="py-3 px-4">{formatCurrency(product.price)}</td>
                                        <td className="py-3 px-4 font-medium text-[#ff5252]">
                                          {formatCurrency(product.subTotal)}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Hủy đơn hàng</h3>
              <button
                onClick={closeCancelModal}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <IoClose className="text-xl" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4">
                Bạn có chắc muốn hủy đơn hàng <span className="font-semibold text-[#ff5252]">{selectedOrder.orderId}</span>?
              </p>

              {/* Lý do hủy */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do hủy đơn <span className="text-red-500">*</span>
                </label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5252] focus:border-transparent"
                >
                  <option value="">-- Chọn lý do --</option>
                  {CANCEL_REASONS.map((reason) => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
              </div>

              {/* Thông tin ngân hàng (chỉ hiện khi đơn đã thanh toán) */}
              {needsBankInfo(selectedOrder) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                  <p className="text-sm font-medium text-yellow-800 mb-3">
                    💳 Thông tin nhận hoàn tiền
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ngân hàng <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5252] focus:border-transparent"
                      >
                        <option value="">-- Chọn ngân hàng --</option>
                        {VIETNAM_BANKS.map((bank) => (
                          <option key={bank} value={bank}>{bank}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số tài khoản <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="Nhập số tài khoản"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5252] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên chủ tài khoản <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={accountHolder}
                        onChange={(e) => setAccountHolder(e.target.value)}
                        placeholder="VD: NGUYEN VAN A"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5252] focus:border-transparent uppercase"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-yellow-700 mt-3">
                    ⚠️ Hoàn tiền sẽ được xử lý trong 3-5 ngày làm việc
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-4 border-t">
              <button
                onClick={closeCancelModal}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
              >
                Đóng
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {cancelling ? (
                  <>
                    <CircularProgress size={16} sx={{ color: 'white' }} />
                    Đang xử lý...
                  </>
                ) : (
                  'Xác nhận hủy đơn'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Orders;
