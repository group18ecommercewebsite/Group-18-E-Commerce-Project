import React, { useContext, useEffect } from 'react';
import { Button } from '@mui/material';
import { BsFillBagCheckFill } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import CartItems from '../components/CartItems/CartItems';
import { MyContext } from '../App';
import CircularProgress from '@mui/material/CircularProgress';
import { formatCurrency } from '../utils/formatCurrency';

const CartPage = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();

  // Sử dụng global cart state từ context
  const { cartItems, cartLoading: loading, fetchCart } = context;

  // Refresh cart khi component mount (đảm bảo dữ liệu mới nhất)
  useEffect(() => {
    if (context.isLogin) {
      fetchCart();
    }
  }, []);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.productId?.price || 0;
    return sum + (price * item.quantity);
  }, 0);

  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  // Callback when item is removed or updated - cập nhật global cart state
  const handleCartUpdate = () => {
    fetchCart();
  };

  if (!context.isLogin) {
    return (
      <section className="section py-10 pb-10">
        <div className="container w-[80%] max-w-[80%] flex flex-col items-center justify-center min-h-[300px]">
          <h2 className="text-xl mb-4">Vui lòng đăng nhập để xem giỏ hàng</h2>
          <Button 
            className="btn-org"
            onClick={() => navigate('/login')}
          >
            Đăng nhập
          </Button>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="section py-10 pb-10">
        <div className="container flex items-center justify-center min-h-[300px]">
          <CircularProgress color="error" />
        </div>
      </section>
    );
  }

  return (
    <section className="section py-10 pb-10">
      <div className="container w-full lg:w-[80%] max-w-full lg:max-w-[80%] flex flex-col lg:flex-row gap-5 px-4 lg:px-0">
        <div className="leftPart w-full lg:w-[70%]">
          <div className="shadow-md rounded-md bg-white">
            <div className="py-2 px-3 border-b border-[rgba(0,0,0,0.1)]">
              <h2>Giỏ hàng của bạn</h2>
              <p className="mt-0">
                Có <span className="font-bold text-[#ff5252]">{cartItems.length}</span> sản phẩm trong giỏ hàng
              </p>
            </div>

            {cartItems.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 mb-4">Giỏ hàng trống</p>
                <Link to="/productListing">
                  <Button className="btn-org">Tiếp tục mua sắm</Button>
                </Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <CartItems 
                  key={item._id}
                  cartItem={item}
                  onUpdate={handleCartUpdate}
                />
              ))
            )}
            
          </div>
        </div>

        <div className="rightPart w-full lg:w-[30%]">
          <div className="shadow-md rounded-md bg-white p-5">
            <h3 className="pb-3">Tổng giỏ hàng</h3>
            <hr />

            <p className="flex items-center justify-between py-2">
              <span className="text-[14px] font-medium">Tạm tính</span>
              <span className="text-[#ff5252] font-bold">{formatCurrency(subtotal)}</span>
            </p>

            <p className="flex items-center justify-between py-2">
              <span className="text-[14px] font-medium">Vận chuyển</span>
              <span className="font-bold">{shipping === 0 ? 'Miễn phí' : formatCurrency(shipping)}</span>
            </p>

            <p className="flex items-center justify-between py-2">
              <span className="text-[14px] font-medium">Tổng cộng</span>
              <span className="text-[#ff5252] font-bold text-lg">{formatCurrency(total)}</span>
            </p>

            {subtotal > 0 && subtotal < 500000 && (
              <p className="text-[12px] text-gray-500 mt-2">
                Mua thêm {formatCurrency(500000 - subtotal)} để được miễn phí vận chuyển!
              </p>
            )}

            <br />

            <Link to="/checkout">
              <Button 
                className="btn-org btn-lg w-full flex gap-2"
                disabled={cartItems.length === 0}
              >
                <BsFillBagCheckFill className="text-[20px]" />
                Thanh toán
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartPage;
