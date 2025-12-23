import React, { useContext, useEffect } from 'react';
import { Button } from '@mui/material';
import { BsFillBagCheckFill } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import CartItems from '../components/CartItems/CartItems';
import { MyContext } from '../App';
import CircularProgress from '@mui/material/CircularProgress';

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

  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + shipping;

  // Callback when item is removed or updated - cập nhật global cart state
  const handleCartUpdate = () => {
    fetchCart();
  };

  if (!context.isLogin) {
    return (
      <section className="section py-10 pb-10">
        <div className="container w-[80%] max-w-[80%] flex flex-col items-center justify-center min-h-[300px]">
          <h2 className="text-xl mb-4">Please login to view your cart</h2>
          <Button 
            className="btn-org"
            onClick={() => navigate('/login')}
          >
            Login
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
      <div className="container w-[80%] max-w-[80%] flex gap-5">
        <div className="leftPart w-[70%]">
          <div className="shadow-md rounded-md bg-white">
            <div className="py-2 px-3 border-b border-[rgba(0,0,0,0.1)]">
              <h2>Your Cart</h2>
              <p className="mt-0">
                There are <span className="font-bold text-[#ff5252]">{cartItems.length}</span> products in your cart
              </p>
            </div>

            {cartItems.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 mb-4">Your cart is empty</p>
                <Link to="/productListing">
                  <Button className="btn-org">Continue Shopping</Button>
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

        <div className="rightPart w-[30%]">
          <div className="shadow-md rounded-md bg-white p-5">
            <h3 className="pb-3">Cart Totals</h3>
            <hr />

            <p className="flex items-center justify-between py-2">
              <span className="text-[14px] font-medium">Subtotal</span>
              <span className="text-[#ff5252] font-bold">${subtotal.toFixed(2)}</span>
            </p>

            <p className="flex items-center justify-between py-2">
              <span className="text-[14px] font-medium">Shipping</span>
              <span className="font-bold">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </p>

            <p className="flex items-center justify-between py-2">
              <span className="text-[14px] font-medium">Total</span>
              <span className="text-[#ff5252] font-bold text-lg">${total.toFixed(2)}</span>
            </p>

            {subtotal > 0 && subtotal < 100 && (
              <p className="text-[12px] text-gray-500 mt-2">
                Add ${(100 - subtotal).toFixed(2)} more for free shipping!
              </p>
            )}

            <br />

            <Link to="/checkout">
              <Button 
                className="btn-org btn-lg w-full flex gap-2"
                disabled={cartItems.length === 0}
              >
                <BsFillBagCheckFill className="text-[20px]" />
                Checkout
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartPage;
