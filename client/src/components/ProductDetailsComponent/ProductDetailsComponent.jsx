import React, { useContext } from 'react';
import Rating from '@mui/material/Rating';
import { Button } from '@mui/material';
import QtyBox from '../QtyBox/QtyBox';
import { MdOutlineShoppingCart } from 'react-icons/md';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { IoIosGitCompare } from 'react-icons/io';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../../api/cartApi';
import { addToMyList } from '../../api/myListApi';
import { MyContext } from '../../App';
import CircularProgress from '@mui/material/CircularProgress';
import { formatCurrency } from '../../utils/formatCurrency';

const ProductDetailsComponent = ({ product, reviewStats }) => {
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(null);
  const [selectedRamIndex, setSelectedRamIndex] = useState(null);
  const [selectedWeightIndex, setSelectedWeightIndex] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  const context = useContext(MyContext);
  const navigate = useNavigate();

  if (!product) return null;

  const {
    _id,
    name = 'Product Name',
    brand = 'Brand',
    rating = 0,
    price = 0,
    oldPrice = 0,
    discount = 0,
    countInStock = 0,
    description = '',
    size = [],
    productRam = [],
    productWeight = []
  } = product;

  const handleAddToCart = async () => {
    // Kiểm tra đăng nhập
    if (!context.isLogin) {
      context.openAlertBox('error', 'Please login to add items to cart');
      navigate('/login');
      return;
    }

    try {
      setAddingToCart(true);
      const response = await addToCart(_id, quantity);
      if (response.success) {
        context.openAlertBox('success', response.message || 'Product added to cart!');
        // Cập nhật global cart state để CartPanel hiển thị ngay
        context.fetchCart();
        // Reset quantity về 1 sau khi thêm thành công
        setQuantity(1);
      } else {
        context.openAlertBox('error', response.message || 'Failed to add to cart');
      }
    } catch (error) {
      context.openAlertBox('error', error.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    // Kiểm tra đăng nhập
    if (!context.isLogin) {
      context.openAlertBox('error', 'Please login to add items to wishlist');
      navigate('/login');
      return;
    }

    try {
      setAddingToWishlist(true);
      const productData = {
        productId: _id,
        productTitle: name,
        image: product.images?.[0] || '',
        rating: rating,
        price: price,
        oldPrice: oldPrice,
        brand: brand,
        discount: discount
      };
      const response = await addToMyList(productData);
      if (response.success) {
        context.openAlertBox('success', response.message || 'Added to wishlist!');
      } else {
        context.openAlertBox('error', response.message || 'Failed to add to wishlist');
      }
    } catch (error) {
      if (error.response?.status === 400) {
        context.openAlertBox('error', 'This item is already in your wishlist');
      } else {
        context.openAlertBox('error', error.response?.data?.message || 'Failed to add to wishlist');
      }
    } finally {
      setAddingToWishlist(false);
    }
  };

  return (
    <>
      <h1 className="text-[24px] font-[600] mb-2">{name}</h1>
      <div className="flex items-center gap-3">
        <span className="text-gray-400 text-[13px]">
          Brands : <span className="font-medium text-black opacity-75">{brand}</span>
        </span>

        <Rating name="size-small" value={reviewStats?.avgRating || rating} precision={0.1} size="small" readOnly />

        <span className="text-[13px] cursor-pointer">Review ({reviewStats?.totalReviews || 0})</span>
      </div>

      <div className="flex items-center gap-4 mt-4">
        {oldPrice > 0 && oldPrice !== price && (
          <span className="oldPrice line-through text-gray-500 text-[18px] font-medium">{formatCurrency(oldPrice)}</span>
        )}
        <span className="price text-[#ff5252] text-[18px] font-[600]">{formatCurrency(price)}</span>

        {discount > 0 && (
          <span className="bg-[#ff5252] text-white px-2 py-1 rounded text-[12px] font-bold">
            {discount}% OFF
          </span>
        )}

        <span className="text-[14px]">
          {countInStock > 0 ? (
            <>Available In Stock: <span className="text-green-600 text-[14px] font-bold">{countInStock} Items</span></>
          ) : (
            <span className="text-red-600 font-bold">Out of Stock</span>
          )}
        </span>
      </div>

      {description && (
        <p className="mt-3 pr-10 mb-5 text-gray-600 line-clamp-3">
          {description}
        </p>
      )}

      {/* Size Options */}
      {size && size.length > 0 && (
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[16px]">Size:</span>
          <div className="flex items-center gap-1 actions">
            {size.map((s, index) => (
              <Button
                key={index}
                className={`${selectedSizeIndex === index ? '!bg-[#ff5252] !text-white' : ''}`}
                onClick={() => setSelectedSizeIndex(index)}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* RAM Options */}
      {productRam && productRam.length > 0 && (
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[16px]">RAM:</span>
          <div className="flex items-center gap-1 actions">
            {productRam.map((ram, index) => (
              <Button
                key={index}
                className={`${selectedRamIndex === index ? '!bg-[#ff5252] !text-white' : ''}`}
                onClick={() => setSelectedRamIndex(index)}
              >
                {ram}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Weight Options */}
      {productWeight && productWeight.length > 0 && (
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[16px]">Weight:</span>
          <div className="flex items-center gap-1 actions">
            {productWeight.map((weight, index) => (
              <Button
                key={index}
                className={`${selectedWeightIndex === index ? '!bg-[#ff5252] !text-white' : ''}`}
                onClick={() => setSelectedWeightIndex(index)}
              >
                {weight}
              </Button>
            ))}
          </div>
        </div>
      )}

      <p className="text-[14px] mt-5 mb-2 text-[#000]">
        Free Shipping (Est. Delivery Time 2-3 Days)
      </p>

      <div className="flex items-center gap-4 py-4">
        <div className="qtyBoxWrapper w-[70px]">
          <QtyBox 
            value={quantity} 
            onChange={(val) => setQuantity(val)} 
            max={countInStock}
          />
        </div>

        <Button
          variant="contained"
          color="inherit"
          disabled={countInStock === 0 || addingToCart}
          onClick={handleAddToCart}
          sx={{
            backgroundColor: countInStock > 0 ? '#ff5252' : '#ccc',
            color: '#fff',
            minWidth: 200,
            height: 48,
            px: 3.5,
            fontSize: 15,
            fontWeight: 600,
            borderRadius: 1,
            textTransform: 'uppercase',
            display: 'flex',
            gap: 2,
            '&:hover': {
              backgroundColor: countInStock > 0 ? '#000' : '#ccc',
            },
            '&:active': {
              transform: 'scale(0.97)',
            },
          }}
        >
          {addingToCart ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            <>
              <MdOutlineShoppingCart className="text-[22px]" /> Add to Cart
            </>
          )}
        </Button>
      </div>

      <div className="flex items-center gap-4 mt-4">
        <span 
          className={`flex items-center gap-2 text-[15px] link cursor-pointer font-medium ${addingToWishlist ? 'opacity-50' : ''}`}
          onClick={!addingToWishlist ? handleAddToWishlist : undefined}
        >
          {addingToWishlist ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            <FaRegHeart className="text-[18px]" />
          )}
          Add to Wishlist
        </span>
        <span className="flex items-center gap-2 text-[15px] link cursor-pointer font-medium">
          <IoIosGitCompare className="text-[18px]" />
          Add to Compare
        </span>
      </div>
    </>
  );
};

export default ProductDetailsComponent;
