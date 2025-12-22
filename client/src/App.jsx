import React, { useEffect } from 'react';
import './App.css';
import { Header } from './components/Header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductListing from './pages/ProductListing';
import ProductDetails from './pages/ProductDetails';
import { createContext } from 'react';
import { useState } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import ProductZoom from './components/ProductZoom/ProductZoom';
import ProductDetailsComponent from './components/ProductDetailsComponent/ProductDetailsComponent';
import { IoCloseSharp } from 'react-icons/io5';
import Drawer from '@mui/material/Drawer';
import CartPanel from './components/CartPanel/CartPanel';
import Footer from './components/Footer';
import CartPage from './pages/Cart';
import { Verify } from './pages/Verify';
import ResetPassword from './pages/ResetPassword';
import { Checkout } from './pages/Checkout';
import { Account } from './pages/Account';
import MyList from './pages/MyList';
import { Orders } from './pages/Orders';

import toast, { Toaster } from 'react-hot-toast';
import { duration } from '@mui/material';

const MyContext = createContext();

function App() {
  const [openProductDetailsModal, setOpenProductDetailsModal] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState('lg');
  
  // Kiểm tra login state từ localStorage khi khởi tạo
  const [isLogin, setIsLogin] = useState(() => {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  });

  const [openCartPanel, setOpenCartPanel] = useState(false);

  const handleCloseProductDetailsModal = () => {
    setOpenProductDetailsModal(false);
  };

  const toggleCartPanel = (newOpen) => () => {
    setOpenCartPanel(newOpen);
  };

  const openAlertBox=(status, msg)=>{
    if(status === "success"){
      toast.success(msg || "Success");
    }
    if(status === "error"){
      toast.error(msg || "Error");
    }
  }

  const values = {
    setOpenProductDetailsModal,
    setOpenCartPanel,
    openCartPanel,
    toggleCartPanel,
    openAlertBox,
    isLogin,
    setIsLogin
  };

  return (
    <>
      <BrowserRouter>
        <MyContext.Provider value={values}>
          <Header />
          <Routes>
            <Route path="/" exact={true} element={<Home />} />
            <Route path="/login" exact={true} element={<Login />} />
            <Route path="/register" exact={true} element={<Register />} />
            <Route path="/productListing" exact={true} element={<ProductListing />} />
            <Route path="/product/:id" exact={true} element={<ProductDetails />} />
            <Route path="/cart" exact={true} element={<CartPage />} />
            <Route path="/verify" exact={true} element={<Verify />} />
            <Route path="/reset-password" exact={true} element={<ResetPassword />} />
            <Route path="/checkout" exact={true} element={<Checkout />} />
            <Route path="/my-account" exact={true} element={<Account />} />
            <Route path="/my-list" exact={true} element={<MyList />} />
            <Route path="/my-orders" exact={true} element={<Orders />} />
          </Routes>
          <Footer/>
        </MyContext.Provider>
      </BrowserRouter>
      <Toaster
        toastOptions={{
          duration: 3000
        }}
      />
      <Dialog
        open={openProductDetailsModal}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        onClose={handleCloseProductDetailsModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="productDetailsModal"
      >
        <DialogContent>
          <div className="flex items-center w-full productDetailsModalContainer relative">
            <Button
              className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#000] !absolute top-[15px] right-[15px] !bg-[#f1f1f1]"
              onClick={handleCloseProductDetailsModal}
            >
              <IoCloseSharp className="text-[20px]" />
            </Button>
            <div className="col1 w-[40%] px-3">
              <ProductZoom />
            </div>

            <div className="col2 w-[60%] py-8 px-8 pr-16 productContent">
              <ProductDetailsComponent />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      
    </>
  );
}

export default App;

export { MyContext };
