import React from 'react';
import Rating from '@mui/material/Rating';
import { Button } from '@mui/material';
import QtyBox from '../QtyBox/QtyBox';
import { MdOutlineShoppingCart } from 'react-icons/md';
import { FaRegHeart } from 'react-icons/fa';
import { IoIosGitCompare } from 'react-icons/io';
import { useState } from 'react';

const ProductDetailsComponent = () => {
  const [productActionIndex, setProductActionIndex] = useState(null);
  return (
    <>
      <h1 className="text-[24px] font-[600] mb-2">Women Wide Leg Killer</h1>
      <div className="flex items-center gap-3">
        <span className="text-gray-400 text-[13px]">
          Brands : <span className="font-medium text-black opacity-75">Flying Machine</span>
        </span>

        <Rating name="size-small" defaultValue={4} size="small" readOnly />

        <span className="text-[13px] cursor-pointer">Review (5)</span>
      </div>

      <div className="flex items-center gap-4 mt-4">
        <span className="oldPrice line-through text-gray-500 text-[20px] font-medium">$58.00</span>
        <span className="price text-[#ff5252] text-[20px] font-[600]">$58.00</span>

        <span className="text-[14px]">
          Available In Stock:{' '}
          <span className="text-green-600 text-[14px] font-bold">147 Items</span>
        </span>
      </div>

      <p className="mt-3 pr-10 mb-5">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
        been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
        galley of type and scrambled it to make a type specimen book.
      </p>

      <div className="flex items-center gap-3">
        <span className="text-[16px]">Size:</span>
        <div className="flex items-center gap-1 actions">
          <Button
            className={`${productActionIndex === 0 ? '!bg-[#ff5252] !text-white' : ''}`}
            onClick={() => setProductActionIndex(0)}
          >
            S
          </Button>
          <Button
            className={`${productActionIndex === 1 ? '!bg-[#ff5252] !text-white' : ''}`}
            onClick={() => setProductActionIndex(1)}
          >
            M
          </Button>
          <Button
            className={`${productActionIndex === 2 ? '!bg-[#ff5252] !text-white' : ''}`}
            onClick={() => setProductActionIndex(2)}
          >
            L
          </Button>
          <Button
            className={`${productActionIndex === 3 ? '!bg-[#ff5252] !text-white' : ''}`}
            onClick={() => setProductActionIndex(3)}
          >
            XL
          </Button>
        </div>
      </div>

      <p className="text-[14px] mt-5 mb-2 text-[#000]">
        Free Shipping (Est. Delivery Time 2-3 Days)
      </p>

      <div className="flex items-center gap-4 py-4">
        <div className="qtyBoxWrapper w-[70px]">
          <QtyBox />
        </div>

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
          <MdOutlineShoppingCart className="text-[22px]" /> Add to Cart
        </Button>
      </div>

      <div className="flex items-center gap-4 mt-4">
        <span className="flex items-center gap-2 text-[15px] link cursor-pointer font-medium">
          <FaRegHeart className="text-[18px]" />
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
