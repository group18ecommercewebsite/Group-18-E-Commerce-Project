import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { Button } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { removeFromCart } from '../../api/cartApi';
import { MyContext } from '../../App';
import { formatCurrency } from '../../utils/formatCurrency';

const CartPanel = () => {
  const [removingId, setRemovingId] = useState(null);
  const context = useContext(MyContext);
  const navigate = useNavigate();

  // Sử dụng global cart state từ context
  const { cartItems, cartLoading: loading, fetchCart } = context;

  // Handle remove item
  const handleRemove = async (cartItemId, productId) => {
    try {
      setRemovingId(cartItemId);
      const response = await removeFromCart(cartItemId, productId);
      if (response.success) {
        context.openAlertBox('success', 'Item removed');
        fetchCart(); // Cập nhật global cart state
      }
    } catch (error) {
      context.openAlertBox('error', 'Failed to remove item');
    } finally {
      setRemovingId(null);
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.productId?.price || 0;
    return sum + (price * item.quantity);
  }, 0);
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Handle checkout/cart click - close panel
  const handleNavigate = (path) => {
    context.setOpenCartPanel(false);
    navigate(path);
  };

  if (!context.isLogin) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] px-4">
        <p className="text-gray-500 mb-4">Please login to view cart</p>
        <Button 
          className="btn-org"
          onClick={() => handleNavigate('/login')}
        >
          Login
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <CircularProgress color="error" />
      </div>
    );
  }

  return (
    <>
      <div className="scroll w-full max-h-[300px] overflow-y-scroll overflow-x-hidden py-3 px-4">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <Button 
              className="btn-org"
              onClick={() => handleNavigate('/productListing')}
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          cartItems.map((item) => {
            const product = item.productId || {};
            const productImage = product.images?.[0] || 'https://via.placeholder.com/80?text=No+Image';
            
            return (
              <div 
                key={item._id} 
                className="cartItem w-full flex items-center gap-4 border-b border-[rgba(0,0,0,0.1)] pb-4 mb-4"
              >
                <div className="img w-[25%] overflow-hidden h-[80px] rounded-md">
                  <Link 
                    to={`/product/${product._id}`} 
                    className='block group'
                    onClick={() => context.setOpenCartPanel(false)}
                  >
                    <img
                      src={productImage}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all"
                    />
                  </Link>
                </div>

                <div className="info w-[75%] pr-5 relative">
                  <h4 className="text-[14px] font-medium line-clamp-1">
                    <Link 
                      to={`/product/${product._id}`} 
                      className='link transition-all'
                      onClick={() => context.setOpenCartPanel(false)}
                    >
                      {product.name || 'Product'}
                    </Link>
                  </h4>
                  <p className="flex items-center gap-5 mt-2 mb-2">
                    <span className="text-[12px]">
                      Qty: <span className="font-bold">{item.quantity}</span>
                    </span>
                    <span className="text-[#ff5252] font-bold text-[13px]">
                      {formatCurrency((product.price || 0) * item.quantity)}
                    </span>
                  </p>

                  {removingId === item._id ? (
                    <CircularProgress 
                      size={18} 
                      className="absolute right-[10px] top-[10px]" 
                    />
                  ) : (
                    <MdOutlineDeleteOutline 
                      className="absolute right-[10px] top-[10px] cursor-pointer text-[20px] link transition-all hover:text-red-500" 
                      onClick={() => handleRemove(item._id, product._id)}
                    />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {cartItems.length > 0 && (
        <>
          <br />
          <div className="bottomSec absolute bottom-[10px] left-[10px] w-full overflow-hidden pr-5">
            <div className="bottomInfo py-3 px-4 w-full border-t border-[rgba(0,0,0,0.1)] flex items-center justify-between flex-col">
              <div className="flex items-center justify-between w-full">
                <span className="text-[14px] font-[600]">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
                <span className="text-[#ff5252] font-bold">{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex items-center justify-between w-full">
                <span className="text-[14px] font-[600]">Shipping</span>
                <span className="font-bold">{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
              </div>
            </div>

            <div className="bottomInfo py-3 px-4 w-full border-t border-[rgba(0,0,0,0.1)] flex items-center justify-between flex-col">
              <div className="flex items-center justify-between w-full">
                <span className="text-[14px] font-[600]">Total</span>
                <span className="text-[#ff5252] font-bold">{formatCurrency(total)}</span>
              </div>

              <br />
              <div className="flex items-center justify-between w-full gap-5">
                <Button 
                  className="btn-org btn-lg w-[50%]"
                  onClick={() => handleNavigate('/cart')}
                >
                  View Cart
                </Button>
                <Button 
                  className="btn-org btn-lg w-[50%]"
                  onClick={() => handleNavigate('/checkout')}
                >
                  Checkout
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CartPanel;
