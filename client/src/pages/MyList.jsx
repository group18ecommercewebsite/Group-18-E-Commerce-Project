import React, { useState, useEffect, useContext } from "react";
import MyListItems from "../components/MyListItems/MyListItems";
import { MyContext } from "../App";
import { FiUser } from "react-icons/fi";
import { CiLocationOn } from "react-icons/ci";
import { GoHeart } from "react-icons/go";
import { IoBagCheckOutline, IoLogOutOutline } from "react-icons/io5";
import { useNavigate, Link } from "react-router-dom";
import { getMyList, removeFromMyList } from "../api/myListApi";
import CircularProgress from '@mui/material/CircularProgress';

const MyList = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("mylist");
  const [myListItems, setMyListItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy user từ localStorage
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : {
    name: "Guest",
    email: "",
    avatar: "https://img.freepik.com/premium-vector/person-with-blue-shirt-that-says-name-person_1029948-7040.jpg"
  };

  // Fetch wishlist từ API
  const fetchMyList = async () => {
    try {
      setLoading(true);
      const response = await getMyList();
      if (response.success) {
        setMyListItems(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch my list:', error);
      context.openAlertBox('error', 'Không thể tải danh sách yêu thích');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (context.isLogin) {
      fetchMyList();
    } else {
      setLoading(false);
    }
  }, [context.isLogin]);

  // Xóa item khỏi wishlist
  const handleRemoveItem = async (itemId) => {
    try {
      const response = await removeFromMyList(itemId);
      if (response.success) {
        setMyListItems(prev => prev.filter(item => item._id !== itemId));
        context.openAlertBox('success', 'Đã xóa khỏi danh sách yêu thích');
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
      context.openAlertBox('error', 'Không thể xóa sản phẩm');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    context.setIsLogin(false);
    navigate("/login");
  };

  const menuItems = [
    {
      id: "profile",
      label: "Hồ sơ của tôi",
      icon: <FiUser className="text-[18px]" />,
      path: "/my-account"
    },
    {
      id: "mylist",
      label: "Danh sách yêu thích",
      icon: <GoHeart className="text-[18px]" />,
      path: "/my-list"
    },
    {
      id: "orders",
      label: "Đơn hàng của tôi",
      icon: <IoBagCheckOutline className="text-[18px]" />,
      path: "/my-orders"
    },
  ];

  return (
    <section className="section py-10 pb-10">
      <div className="container w-full lg:w-[80%] max-w-full lg:max-w-[80%] flex flex-col lg:flex-row gap-5 px-4 lg:px-0">
        {/* Left Sidebar - Hidden below lg (1024px) */}
        <div className="hidden lg:block lg:w-[280px] flex-shrink-0">
          <div className="card bg-white shadow-md rounded-md p-5 sticky top-5">
            {/* User Avatar */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-[100px] h-[100px] rounded-full bg-[#ff5252] flex items-center justify-center text-white text-[40px] font-semibold mb-3">
                <img
                  src={user.avatar || "https://img.freepik.com/premium-vector/person-with-blue-shirt-that-says-name-person_1029948-7040.jpg"}
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
                Đăng xuất
              </button>
            </nav>
          </div>
        </div>
        
        {/* Right Content */}
        <div className="leftPart w-full lg:flex-1">
          <div className="shadow-md rounded-md bg-white">
            <div className="py-2 px-3 border-b border-[rgba(0,0,0,0.1)]">
              <h2>Danh sách yêu thích</h2>
              <p className="mt-0">
                Có <span className="font-bold text-[#ff5252]">{myListItems.length}</span>{" "}
                sản phẩm trong danh sách
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <CircularProgress sx={{ color: '#ff5252' }} />
              </div>
            ) : !context.isLogin ? (
              <div className="py-20 text-center">
                <p className="text-gray-500 mb-4">Vui lòng đăng nhập để xem danh sách yêu thích</p>
                <Link to="/login" className="text-[#ff5252] font-medium hover:underline">
                  Đăng nhập ngay
                </Link>
              </div>
            ) : myListItems.length === 0 ? (
              <div className="py-20 text-center">
                <GoHeart className="text-[60px] text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Danh sách yêu thích của bạn đang trống</p>
                <Link to="/productListing" className="text-[#ff5252] font-medium hover:underline">
                  Khám phá sản phẩm
                </Link>
              </div>
            ) : (
              myListItems.map((item) => (
                <MyListItems 
                  key={item._id} 
                  item={item}
                  onRemove={() => handleRemoveItem(item._id)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyList;
