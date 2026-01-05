import React from 'react';
import { Link } from 'react-router-dom';
import { IoCloseSharp } from 'react-icons/io5';
import Rating from '@mui/material/Rating';
import { formatCurrency } from '../../utils/formatCurrency';

const MyListItems = ({ item, onRemove }) => {
  // Tính phần trăm giảm giá
  const discountPercent = item.discount || 
    (item.oldPrice && item.price ? Math.round((1 - item.price / item.oldPrice) * 100) : 0);

  return (
    <div className="cartItem w-full p-3 flex items-center gap-4 pb-5 border-b border-[rgba(0,0,0,0.1)]">
      <div className="img w-[15%] rounded-md overflow-hidden">
        <Link to={`/product/${item.productId}`} className="group">
          <img
            src={item.image || 'https://via.placeholder.com/150'}
            alt={item.productTitle}
            className="w-full group-hover:scale-105 transition-all"
          />
        </Link>
      </div>

      <div className="info w-[85%] relative">
        <button 
          onClick={onRemove}
          className="absolute cursor-pointer top-[0px] right-[0px] text-[22px] link transition-all hover:text-[#ff5252]"
        >
          <IoCloseSharp />
        </button>
        
        {item.brand && (
          <span className="text-[13px] text-gray-500">{item.brand}</span>
        )}
        
        <h3 className="text-[15px] pr-8">
          <Link className="link hover:text-[#ff5252]" to={`/product/${item.productId}`}>
            {item.productTitle}
          </Link>
        </h3>

        <Rating 
          name="read-only" 
          value={item.rating || 0} 
          size="small" 
          readOnly 
          precision={0.5}
        />

        <div className="flex items-center gap-4 mt-2">
          <span className="price text-[14px] font-[600]">
            {formatCurrency(item.price || 0)}
          </span>
          {item.oldPrice && item.oldPrice > item.price && (
            <span className="oldPrice line-through text-gray-500 text-[14px] font-medium">
              {formatCurrency(item.oldPrice)}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="price text-[#ff5252] text-[14px] font-[600]">
              {discountPercent}% OFF
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyListItems;
