import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { IoCloseSharp } from 'react-icons/io5';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { GoTriangleDown } from 'react-icons/go';
import Rating from '@mui/material/Rating';
import CircularProgress from '@mui/material/CircularProgress';
import { updateCartQuantity, removeFromCart } from '../../api/cartApi';
import { MyContext } from '../../App';
import { formatCurrency } from '../../utils/formatCurrency';

const CartItems = ({ cartItem, onUpdate }) => {
  const context = useContext(MyContext);
  const [qtyanchorEl, setQtyAnchorEl] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [removing, setRemoving] = useState(false);
  
  const openQty = Boolean(qtyanchorEl);

  // Extract product data
  const product = cartItem?.productId || {};
  const {
    _id: productId,
    name = 'Product Name',
    brand = 'Brand',
    images = [],
    price = 0,
    oldPrice = 0,
    discount = 0,
    rating = 0,
    countInStock = 10
  } = product;

  const quantity = cartItem?.quantity || 1;
  const cartItemId = cartItem?._id;
  const productImage = images[0] || 'https://via.placeholder.com/150?text=No+Image';

  const handleClickQty = (event) => {
    setQtyAnchorEl(event.currentTarget);
  };

  const handleCloseQty = async (newQty) => {
    setQtyAnchorEl(null);
    if (newQty !== null && newQty !== quantity) {
      try {
        setUpdating(true);
        const response = await updateCartQuantity(cartItemId, newQty);
        if (response.success) {
          context.openAlertBox('success', 'Cart updated');
          onUpdate && onUpdate();
        } else {
          context.openAlertBox('error', response.message || 'Failed to update');
        }
      } catch (error) {
        context.openAlertBox('error', error.response?.data?.message || 'Failed to update cart');
      } finally {
        setUpdating(false);
      }
    }
  };

  const handleRemove = async () => {
    try {
      setRemoving(true);
      const response = await removeFromCart(cartItemId, productId);
      if (response.success) {
        context.openAlertBox('success', 'Item removed from cart');
        onUpdate && onUpdate();
      } else {
        context.openAlertBox('error', response.message || 'Failed to remove');
      }
    } catch (error) {
      context.openAlertBox('error', error.response?.data?.message || 'Failed to remove item');
    } finally {
      setRemoving(false);
    }
  };

  // Generate quantity options (1 to max stock, max 10)
  const maxQty = Math.min(countInStock, 10);
  const qtyOptions = Array.from({ length: maxQty }, (_, i) => i + 1);

  return (
    <div className="cartItem w-full p-3 flex items-center gap-4 pb-5 border-b border-[rgba(0,0,0,0.1)]">
      <div className="img w-[15%] rounded-md overflow-hidden">
        <Link to={`/product/${productId}`} className="group">
          <img
            src={productImage}
            alt={name}
            className="w-full group-hover:scale-105 transition-all"
          />
        </Link>
      </div>

      <div className="info w-[85%] relative">
        {removing ? (
          <CircularProgress size={20} className="absolute top-0 right-0" />
        ) : (
          <IoCloseSharp 
            className="absolute cursor-pointer top-[0px] right-[0px] text-[22px] link transition-all hover:text-red-500" 
            onClick={handleRemove}
          />
        )}
        <span className="text-[13px]">{brand}</span>
        <h3 className="text-[15px]">
          <Link className="link" to={`/product/${productId}`}>
            {name}
          </Link>
        </h3>

        <Rating name="size-small" value={rating} size="small" readOnly />

        <div className="flex items-center gap-4 mt-2">
          <div className="relative">
            <span 
              className="flex items-center justify-center bg-[#f1f1f1] text-[11px] font-[600] py-1 px-2 rounded-md cursor-pointer"
              onClick={handleClickQty}
            >
              {updating ? (
                <CircularProgress size={12} />
              ) : (
                <>Qty: {quantity} <GoTriangleDown /></>
              )}
            </span>
            <Menu
              id="qty-menu"
              anchorEl={qtyanchorEl}
              open={openQty}
              onClose={() => handleCloseQty(null)}
              slotProps={{
                list: {
                  'aria-labelledby': 'basic-button',
                },
              }}
            >
              {qtyOptions.map((num) => (
                <MenuItem 
                  key={num} 
                  onClick={() => handleCloseQty(num)}
                  selected={num === quantity}
                >
                  {num}
                </MenuItem>
              ))}
            </Menu>
          </div>

          <span className="text-[12px] text-gray-500">
            {formatCurrency(price)} × {quantity} = <span className="font-bold text-black">{formatCurrency(price * quantity)}</span>
          </span>
        </div>

        <div className="flex items-center gap-4 mt-2">
          <span className="price text-[14px] font-[600]">{formatCurrency(price)}</span>
          {oldPrice > 0 && oldPrice !== price && (
            <span className="oldPrice line-through text-gray-500 text-[14px] font-medium">
              {formatCurrency(oldPrice)}
            </span>
          )}
          {discount > 0 && (
            <span className="price text-[#ff5252] text-[14px] font-[600]">{discount}% OFF</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartItems;
