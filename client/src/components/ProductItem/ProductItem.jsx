import React, { useContext, useState } from 'react';
import '../ProductItem/style.css';
import { Link, useNavigate } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import { FaRegHeart } from 'react-icons/fa';
import { IoIosGitCompare } from 'react-icons/io';
import { MdZoomOutMap } from 'react-icons/md';
import { MyContext } from '../../App';
import { addToMyList } from '../../api/myListApi';
import CircularProgress from '@mui/material/CircularProgress';

const ProductItem = ({ product }) => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const [addingToWishlist, setAddingToWishlist] = useState(false);

  // Handle both prop formats - full product object or individual props
  const productData = product || {};
  const productId = productData._id || '1';
  const name = productData.name || 'Product Name';
  const brand = productData.brand || 'Brand';
  const images = productData.images || [];
  const price = productData.price || 0;
  const oldPrice = productData.oldPrice || 0;
  const discount = productData.discount || 0;
  const rating = productData.rating || 0;

  // Get first two images for hover effect
  const primaryImage = images[0] || 'https://via.placeholder.com/300x300?text=No+Image';
  const secondaryImage = images[1] || primaryImage;

  const handleAddToWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!context.isLogin) {
      context.openAlertBox('error', 'Please login to add items to wishlist');
      navigate('/login');
      return;
    }

    try {
      setAddingToWishlist(true);
      const wishlistData = {
        productId: productId,
        productTitle: name,
        image: primaryImage,
        rating: rating,
        price: price,
        oldPrice: oldPrice,
        brand: brand,
        discount: discount
      };
      const response = await addToMyList(wishlistData);
      if (response.success) {
        context.openAlertBox('success', 'Added to wishlist!');
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

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    context.setOpenProductDetailsModal(productData);
  };

  return (
    <div className="productItem shadow-lg rounded-md overflow-hidden border-1 border-[rgba(0,0,0,0.1)]">
      <div className="group imgWrapper w-[100%] overflow-hidden rounded-md relative">
        <Link to={`/product/${productId}`}>
          <div className="img h-[220px] overflow-hidden">
            <img
              src={primaryImage}
              alt={name}
              className="w-full"
            />

            <img
              src={secondaryImage}
              alt={name}
              className="w-full transition-all duration-700 absolute top-0 left-0 opacity-0 group-hover:opacity-100 group-hover:scale-105"
            />
          </div>
        </Link>
        {discount > 0 && (
          <span className="discount flex items-center absolute top-[10px] left-[10px] z-50 bg-primary text-white rounded-lg p-1 text-[12px] font-medium">
            {discount}%
          </span>
        )}

        <div className="actions absolute top-[-200px] right-[5px] z-50 flex items-center gap-2 flex-col w-[50px] transition-all duration-300 group-hover:top-[15px] opacity-0 group-hover:opacity-100">
          <Button 
            className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white text-black hover:!bg-[#ff5252] hover:text-white group" 
            onClick={handleQuickView}
          >
            <MdZoomOutMap className="text-[18px] !text-black group-hover:text-white hover:!text-white " />
          </Button>

          <Button className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white text-black hover:!bg-[#ff5252] hover:text-white group">
            <IoIosGitCompare className="text-[18px] !text-black group-hover:text-white hover:!text-white " />
          </Button>

          <Button 
            className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white text-black hover:!bg-[#ff5252] hover:text-white group"
            onClick={handleAddToWishlist}
            disabled={addingToWishlist}
          >
            {addingToWishlist ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <FaRegHeart className="text-[18px] !text-black group-hover:text-white hover:!text-white " />
            )}
          </Button>
        </div>
      </div>

      <div className="info p-3 py-5">
        <h6 className="text-[13px] !font-[400]">
          <Link to={`/product/${productId}`} className="link transition-all">
            {brand}
          </Link>
        </h6>
        <h3 className="text-[13px] title mt-1 font-medium mb-1 text-[#000]">
          <Link to={`/product/${productId}`} className="link transition-all line-clamp-2">
            {name}
          </Link>
        </h3>

        <Rating name="size-small" value={rating} size="small" readOnly />

        <div className="flex items-center gap-4">
          {oldPrice > 0 && oldPrice !== price && (
            <span className="oldPrice line-through text-gray-500 text-[15px] font-medium">
              ${oldPrice.toFixed(2)}
            </span>
          )}
          <span className="price text-[#ff5252] text-[15px] font-[600]">${price.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
