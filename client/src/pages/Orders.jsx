import React, { useState, useEffect, useContext } from "react";
import { MyContext } from "../App";
import { FiUser } from "react-icons/fi";
import { GoHeart } from "react-icons/go";
import { IoBagCheckOutline, IoLogOutOutline } from "react-icons/io5";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import Badge from "../components/Badge";
import { getMyOrders } from "../api/orderApi";
import { logoutUser } from "../api/userApi";
import CircularProgress from "@mui/material/CircularProgress";

export const Orders = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("orders");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
                      <th className="py-3 px-3 text-left font-medium uppercase">Date</th>
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
                          <td className="py-3 px-3 font-medium">${order.totalAmt?.toLocaleString()}</td>
                          <td className="py-3 px-3">
                            <Badge status={order.order_status || 'pending'} />
                          </td>
                          <td className="py-3 px-3">{formatDate(order.createdAt)}</td>
                        </tr>

                        {/* Order Details (Products) - Expandable */}
                        {expandedOrder === order.orderId && (
                          <tr>
                            <td colSpan="7" className="p-0">
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
                                        <td className="py-3 px-4">${product.price?.toLocaleString()}</td>
                                        <td className="py-3 px-4 font-medium text-[#ff5252]">
                                          ${product.subTotal?.toLocaleString()}
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
    </section>
  );
};

export default Orders;
