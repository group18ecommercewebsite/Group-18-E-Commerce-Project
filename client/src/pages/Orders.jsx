import React, { useState } from "react";
import { useContext } from "react";
import { MyContext } from "../App";
import { FiUser } from "react-icons/fi";
import { CiLocationOn } from "react-icons/ci";
import { GoHeart } from "react-icons/go";
import { IoBagCheckOutline, IoLogOutOutline } from "react-icons/io5";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Badge from "../components/Badge";

export const Orders = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("orders");
  const [expandedOrder, setExpandedOrder] = useState(null);

  const user = {
    name: "Kiệt Nguyễn Tuấn",
    email: "tuankiet24022020@gmail.com",
    avatar:
      "https://img.freepik.com/premium-vector/person-with-blue-shirt-that-says-name-person_1029948-7040.jpg?semt=ais_hybrid&w=740&q=80",
  };

  // Dữ liệu đơn hàng mẫu
  const orders = [
    {
      id: "694917b9228db479bbe3aa64",
      paymentId: "CASH ON DELIVERY",
      name: "Kiệt Nguyễn Tuấn",
      phone: "918787567676",
      address: "Tran Hung Dao Ha Noivvv gfgd None Vietnam",
      addressType: "Home",
      pincode: "1231456",
      totalAmount: 3948,
      email: "tuankiet24022020@gmail.com",
      userId: "68e7f440228db479bb361db7",
      status: "confirm",
      date: "2025-12-22",
      products: [
        {
          productId: "68e7f470228db479bb361e58",
          title: "Morden Smart Watch for Kids Men Women Boys Girls D116 Water Proof Touchscreen Smart Watch Bluetooth",
          image: "https://api.spicezgold.com/download/file_1734525498857_e8ce1e18-be0f-4d9f-9930-fc9aabc94050ElectronicsWatches4.webp",
          quantity: 2,
          price: 1599,
          subTotal: 3198,
        },
        {
          productId: "694917b0228db479bbe3aa61",
          title: "Paragon PUK7014L Women Sandals | Casual Everyday Sandals | Stylish, Comfortable & Durable | For Daily & Occasion Wear",
          image: "https://api.spicezgold.com/download/file_1734525498857_e8ce1e18-be0f-4d9f-9930-fc9aabc94050ElectronicsWatches4.webp",
          quantity: 1,
          price: 750,
          subTotal: 750,
        },
      ],
    },
  ];

  const handleLogout = () => {
    context.setIsLogin(false);
    navigate("/login");
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const menuItems = [
    {
      id: "profile",
      label: "My Profile",
      icon: <FiUser className="text-[18px]" />,
    },
    {
      id: "address",
      label: "Address",
      icon: <CiLocationOn className="text-[18px]" />,
    },
    {
      id: "mylist",
      label: "My List",
      icon: <GoHeart className="text-[18px]" />,
    },
    {
      id: "orders",
      label: "My Orders",
      icon: <IoBagCheckOutline className="text-[18px]" />,
    },
  ];

  return (  
    <section className="section py-10 pb-10">
      <div className="container w-[90%] max-w-[90%] flex gap-5">
        {/* Left Sidebar */}
        <div className="w-[280px]">
          <div className="card bg-white shadow-md rounded-md p-5 sticky top-5">
            {/* User Avatar */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-[100px] h-[100px] rounded-full bg-[#ff5252] flex items-center justify-center text-white text-[40px] font-semibold mb-3">
                <img
                  src={user.avatar}
                  alt="User Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <h3 className="text-[16px] font-semibold">{user.name}</h3>
              <p className="text-[13px] text-gray-500">{user.email}</p>
            </div>

            {/* Menu */}
            <nav className="border-t border-gray-100 pt-4">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3 text-[14px] text-left transition rounded-md
                              ${
                                activeTab === item.id
                                  ? "text-[#ff5252] bg-red-50 border-l-3 border-[#ff5252]"
                                  : "text-gray-700 hover:bg-gray-50"
                              }`}
                >
                  {item.icon}
                  {item.label}
                </button>
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

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="bg-[#3d464d] text-white">
                    <th className="py-3 px-3 text-left font-medium"></th>
                    <th className="py-3 px-3 text-left font-medium uppercase">Order ID</th>
                    <th className="py-3 px-3 text-left font-medium uppercase">Payment ID</th>
                    <th className="py-3 px-3 text-left font-medium uppercase">Name</th>
                    <th className="py-3 px-3 text-left font-medium uppercase">Phone Number</th>
                    <th className="py-3 px-3 text-left font-medium uppercase">Address</th>
                    <th className="py-3 px-3 text-left font-medium uppercase">Pincode</th>
                    <th className="py-3 px-3 text-left font-medium uppercase">Total Amount</th>
                    <th className="py-3 px-3 text-left font-medium uppercase">Email</th>
                    <th className="py-3 px-3 text-left font-medium uppercase">User ID</th>
                    <th className="py-3 px-3 text-left font-medium uppercase">Order Status</th>
                    <th className="py-3 px-3 text-left font-medium uppercase">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <React.Fragment key={order.id}>
                      {/* Order Row */}
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-3">
                          <button
                            onClick={() => toggleOrderDetails(order.id)}
                            className="w-[30px] h-[30px] rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                          >
                            {expandedOrder === order.id ? (
                              <IoChevronUp className="text-[14px]" />
                            ) : (
                              <IoChevronDown className="text-[14px]" />
                            )}
                          </button>
                        </td>
                        <td className="py-3 px-3 text-[#ff5252] font-medium">{order.id}</td>
                        <td className="py-3 px-3 text-[#ff5252]">{order.paymentId}</td>
                        <td className="py-3 px-3">{order.name}</td>
                        <td className="py-3 px-3">{order.phone}</td>
                        <td className="py-3 px-3">
                          <span className="inline-block border border-gray-300 rounded px-2 py-0.5 text-[11px] mr-1">
                            {order.addressType}
                          </span>
                          <span className="text-[12px]">{order.address}</span>
                        </td>
                        <td className="py-3 px-3">{order.pincode}</td>
                        <td className="py-3 px-3 font-medium">{order.totalAmount}</td>
                        <td className="py-3 px-3">{order.email}</td>
                        <td className="py-3 px-3 text-[#ff5252]">{order.userId}</td>
                        <td className="py-3 px-3">
                          <Badge status={order.status} />
                        </td>
                        <td className="py-3 px-3">{order.date}</td>
                      </tr>

                      {/* Order Details (Products) - Expandable */}
                      {expandedOrder === order.id && (
                        <tr>
                          <td colSpan="12" className="p-0">
                            <div className="bg-[#fff8f0] p-4 border-l-4 border-[#ff5252]">
                              <table className="w-full text-[13px]">
                                <thead>
                                  <tr className="bg-[#2d3748] text-white">
                                    <th className="py-3 px-4 text-left font-medium uppercase">Product ID</th>
                                    <th className="py-3 px-4 text-left font-medium uppercase">Product Title</th>
                                    <th className="py-3 px-4 text-left font-medium uppercase">Image</th>
                                    <th className="py-3 px-4 text-left font-medium uppercase">Quantity</th>
                                    <th className="py-3 px-4 text-left font-medium uppercase">Price</th>
                                    <th className="py-3 px-4 text-left font-medium uppercase">Sub Total</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white">
                                  {order.products.map((product, index) => (
                                    <tr key={index} className="border-b border-gray-100 hover:bg-[#fff5eb]">
                                      <td className="py-3 px-4 text-[#ff5252]">{product.productId}</td>
                                      <td className="py-3 px-4 max-w-[250px]">{product.title}</td>
                                      <td className="py-3 px-4">
                                        <img
                                          src={product.image}
                                          alt={product.title}
                                          className="w-[50px] h-[50px] object-cover rounded"
                                        />
                                      </td>
                                      <td className="py-3 px-4 text-center">{product.quantity}</td>
                                      <td className="py-3 px-4">₹{product.price.toLocaleString()}</td>
                                      <td className="py-3 px-4 font-medium text-[#ff5252]">₹{product.subTotal.toLocaleString()}</td>
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
          </div>
        </div>
      </div>
    </section>
  );
};

