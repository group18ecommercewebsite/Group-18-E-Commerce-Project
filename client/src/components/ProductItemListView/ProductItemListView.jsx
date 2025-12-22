import React, { useContext } from 'react';
import '../ProductItem/style.css';
import { Link } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import { FaRegHeart } from 'react-icons/fa';
import { IoIosGitCompare } from 'react-icons/io';
import { MdZoomOutMap } from 'react-icons/md';
import { MdOutlineShoppingCart } from 'react-icons/md';
import { MyContext } from '../../App';

const ProductItemListView = ({ product }) => {
  const context = useContext(MyContext);

  // Handle product data
  const productData = product || {};
  const productId = productData._id || '1';
  const name = productData.name || 'Product Name';
  const brand = productData.brand || 'Brand';
  const description = productData.description || '';
  const images = productData.images || [];
  const price = productData.price || 0;
  const oldPrice = productData.oldPrice || 0;
  const discount = productData.discount || 0;
  const rating = productData.rating || 0;

  // Get first two images for hover effect
  const primaryImage = images[0] || 'https://via.placeholder.com/300x300?text=No+Image';
  const secondaryImage = images[1] || primaryImage;

  return (
    <div className="productItem shadow-lg rounded-md overflow-hidden border-1 border-[rgba(0,0,0,0.1)] flex items-center">
      <div className="group imgWrapper w-[25%] overflow-hidden rounded-md relative">
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
          <Button className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white text-black hover:!bg-[#ff5252] hover:text-white group" onClick={()=>context.setOpenProductDetailsModal(true, productData)}>
            <MdZoomOutMap className="text-[18px] !text-black group-hover:text-white hover:!text-white " />
          </Button>

          <Button className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white text-black hover:!bg-[#ff5252] hover:text-white group">
            <IoIosGitCompare className="text-[18px] !text-black group-hover:text-white hover:!text-white " />
          </Button>

          <Button className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white text-black hover:!bg-[#ff5252] hover:text-white group">
            <FaRegHeart className="text-[18px] !text-black group-hover:text-white hover:!text-white " />
          </Button>
        </div>
      </div>

      <div className="info p-3 py-5 px-8 w-[75%]">
        <h6 className="text-[15px] !font-[400]">
          <Link to={`/product/${productId}`} className="link transition-all">
            {brand}
          </Link>
        </h6>
        <h3 className="text-[18px] title mt-3 mb-3 font-medium text-[#000]">
          <Link to={`/product/${productId}`} className="link transition-all">
            {name}
          </Link>
        </h3>

        <p className="text-[14px] mb-3 line-clamp-3">
          {description}
        </p>

        <Rating name="size-small" value={rating} size="small" readOnly />

        <div className="flex items-center gap-4">
          {oldPrice > 0 && oldPrice !== price && (
            <span className="oldPrice line-through text-gray-500 text-[15px] font-medium">
              ${oldPrice.toFixed(2)}
            </span>
          )}
          <span className="price text-[#ff5252] text-[15px] font-[600]">${price.toFixed(2)}</span>
        </div>

        <div className="mt-3">
          <Button
            variant="contained"
            color="inherit"
            sx={{
              backgroundColor: '#ff5252',
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
                backgroundColor: '#000',
              },
              '&:active': {
                transform: 'scale(0.97)',
              },
            }}
          >
            <MdOutlineShoppingCart className="text-[20px]" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductItemListView;
