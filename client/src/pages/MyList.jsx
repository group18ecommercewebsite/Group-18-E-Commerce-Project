import React, { useState } from "react";
import MyListItems from "../components/MyListItems/MyListItems";
import { useContext } from "react";
import { MyContext } from "../App";
import { FiUser } from "react-icons/fi";
import { CiLocationOn } from "react-icons/ci";
import { GoHeart } from "react-icons/go";
import { IoBagCheckOutline, IoLogOutOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const MyList = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("mylist");
  const [formFields, setFormFields] = useState({
    fullName: "Kiệt Nguyễn Tuấn",
    email: "tuankiet24022020@gmail.com",
    phone: "",
  });

  const user = {
    name: "Kiệt Nguyễn Tuấn",
    email: "tuankiet24022020@gmail.com",
    avatar:
      "https://img.freepik.com/premium-vector/person-with-blue-shirt-that-says-name-person_1029948-7040.jpg?semt=ais_hybrid&w=740&q=80",
  };

  const handleLogout = () => {
    context.setIsLogin(false);
    navigate("/login");
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
      <div className="container w-[80%] max-w-[80%] flex gap-5">
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
        <div className="leftPart w-[70%]">
          <div className="shadow-md rounded-md bg-white">
            <div className="py-2 px-3 border-b border-[rgba(0,0,0,0.1)]">
              <h2>Your Cart</h2>
              <p className="mt-0">
                There are <span className="font-bold text-[#ff5252]">2</span>{" "}
                products in My List
              </p>
            </div>

            <MyListItems />
            <MyListItems />
            <MyListItems />
            <MyListItems />
            <MyListItems />
            <MyListItems />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyList;
