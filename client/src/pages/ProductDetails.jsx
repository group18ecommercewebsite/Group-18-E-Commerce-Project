import React, { useState } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link } from 'react-router-dom';
import ProductZoom from '../components/ProductZoom/ProductZoom';
import Rating from '@mui/material/Rating';
import { Button } from '@mui/material';
import QtyBox from '../components/QtyBox/QtyBox';
import { MdOutlineShoppingCart } from 'react-icons/md';
import { FaRegHeart } from 'react-icons/fa';
import { IoIosGitCompare } from 'react-icons/io';
import TextField from '@mui/material/TextField';
import ProductsSlider from '../components/ProductsSlider/ProductsSlider';


const ProductDetails = () => {
  const [productActionIndex, setProductActionIndex] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <div className="py-5">
        <div className="container">
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              underline="hover"
              color="inherit"
              href="/"
              className="link transition !text-[14px]"
            >
              Home
            </Link>
            <Link
              underline="hover"
              color="inherit"
              href="/"
              className="link transition !text-[14px]"
            >
              Fashion
            </Link>
            <Link underline="hover" color="inherit" className="link transition !text-[14px]">
              Cropped Satin Bomber Jacket
            </Link>
          </Breadcrumbs>
        </div>
      </div>

      <section className="bg-white py-5">
        <div className="container flex gap-8 items-center">
          <div className="productZoomContainer w-[40%]">
            <ProductZoom />
          </div>

          <div className="productContent w-[60%] pr-10 pl-10">
            <h1 className="text-[24px] font-[600] mb-2">Women Wide Leg Killer</h1>
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-[13px]">
                Brands : <span className="font-medium text-black opacity-75">Flying Machine</span>
              </span>

              <Rating name="size-small" defaultValue={4} size="small" readOnly />

              <span className="text-[13px] cursor-pointer">Review (5)</span>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <span className="oldPrice line-through text-gray-500 text-[20px] font-medium">
                $58.00
              </span>
              <span className="price text-[#ff5252] text-[20px] font-[600]">$58.00</span>

              <span className="text-[14px]">
                Available In Stock:{' '}
                <span className="text-green-600 text-[14px] font-bold">147 Items</span>
              </span>
            </div>

            <p className="mt-3 pr-10 mb-5">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
              has been the industry's standard dummy text ever since the 1500s, when an unknown
              printer took a galley of type and scrambled it to make a type specimen book.
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

            <p className="text-[14px] mt-5 mb-2 text-[#000]">Free Shipping (Est. Delivery Time 2-3 Days)</p>

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
          </div>
        </div>

        <div className="container pt-10">
          <div className="flex items-center gap-8 mb-5">
            <span
              className={`link text-[17px] cursor-pointer font-medium ${
                activeTab === 0 && 'text-[#ff5252]'
              }`}
              onClick={() => setActiveTab(0)}
            >
              Description
            </span>
            <span
              className={`link text-[17px] cursor-pointer font-medium ${
                activeTab === 1 && 'text-[#ff5252]'
              }`}
              onClick={() => setActiveTab(1)}
            >
              Product Details
            </span>
            <span
              className={`link text-[17px] cursor-pointer font-medium ${
                activeTab === 2 && 'text-[#ff5252]'
              }`}
              onClick={() => setActiveTab(2)}
            >
              Review (5)
            </span>
          </div>

          {activeTab === 0 && (
            <div className="shadow-md w-full py-5 p-8 rounded-md">
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                Ipsum has been the industry's standard dummy text ever since the 1500s, when an
                unknown printer took a galley of type and scrambled it to make a type specimen book.
              </p>

              <h4>Lightweight Design</h4>

              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                Ipsum has been the industry's standard dummy text ever since the 1500s, when an
                unknown printer took a galley of type and scrambled it to make a type specimen book.
              </p>

              <h4>Free Shipping & Return</h4>
            </div>
          )}

          {activeTab === 1 && (
            <div className="shadow-md w-full py-5 p-8 rounded-md">
              <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                <table className="w-full text-sm text-left text-gray-600">
                  <tbody>
                    {/* Dòng 1: Stand Up */}
                    <tr className="bg-white border-b border-gray-200">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 w-1/3">
                        Stand Up
                      </th>
                      <td className="px-6 py-4">35"L x 24"W x 37-45"H(front to back wheel)</td>
                    </tr>

                    {/* Dòng 2: Folded (w/o wheels) - Màu nền khác */}
                    <tr className="bg-purple-50 border-b border-gray-200">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900">
                        Folded (w/o wheels)
                      </th>
                      <td className="px-6 py-4">32.5"L x 18.5"W x 16.5"H</td>
                    </tr>

                    {/* Dòng 3: Folded (w/ wheels) */}
                    <tr className="bg-white border-b border-gray-200">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900">
                        Folded (w/ wheels)
                      </th>
                      <td className="px-6 py-4">32.5"L x 24"W x 18.5"H</td>
                    </tr>

                    {/* Dòng 4: Door Pass Through */}
                    <tr className="bg-purple-50 border-b border-gray-200">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900">
                        Door Pass Through
                      </th>
                      <td className="px-6 py-4">24</td>
                    </tr>

                    {/* Dòng 5: Frame */}
                    <tr className="bg-white border-b border-gray-200">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900">
                        Frame
                      </th>
                      <td className="px-6 py-4">Aluminum</td>
                    </tr>

                    {/* Dòng 6: Weight */}
                    <tr className="bg-purple-50 border-b border-gray-200">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900">
                        Weight (w/o wheels)
                      </th>
                      <td className="px-6 py-4">20 LBS</td>
                    </tr>

                    {/* Dòng 7: Weight Capacity */}
                    <tr className="bg-white border-b border-gray-200">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900">
                        Weight Capacity
                      </th>
                      <td className="px-6 py-4">60 LBS</td>
                    </tr>

                    {/* Dòng 8: Width */}
                    <tr className="bg-purple-50 border-b border-gray-200">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900">
                        Width
                      </th>
                      <td className="px-6 py-4">24"</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div className="shadow-md w-[80%] py-5 p-8 rounded-md">
              <div className="w-full productReviewsContainer">
                <h2 className="text-[18px]">Customer questions & answers</h2>

                <div className="reviewScroll w-full max-h-[300px] overflow-y-scroll overflow-x-hidden mt-5 pr-5">
                  <div className="review w-full pt-5 pb-5 border-b border-[rgba(0,0,0,0.1)] flex items-center justify-between">
                    <div className="info w-[60%] flex items-center gap-2">
                      <div className="img w-[80px] h-[80px] overflow-hidden rounded-full">
                        <img
                          src="https://lirp.cdn-website.com/6f140169/dms3rep/multi/opt/Parikshit+Gokhale-640w.jpg"
                          alt=""
                          className="w-full"
                        />
                      </div>

                      <div className="w-[80%]">
                        <h4 className="text-[16px]">Amzil Mhand</h4>
                        <h5 className="text-[13px] mb-0">2025-09-19</h5>
                        <p className="mt-0 mb-0">
                          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                          Lorem Ipsum has been the industry's standard dummy text ever since the
                          1500s
                        </p>
                      </div>
                    </div>
                    <Rating name="size-small" defaultValue={4} readOnly />
                  </div>

                  <div className="review w-full pt-5 pb-5 border-b border-[rgba(0,0,0,0.1)] flex items-center justify-between">
                    <div className="info w-[60%] flex items-center gap-2">
                      <div className="img w-[80px] h-[80px] overflow-hidden rounded-full">
                        <img
                          src="https://lirp.cdn-website.com/6f140169/dms3rep/multi/opt/Parikshit+Gokhale-640w.jpg"
                          alt=""
                          className="w-full"
                        />
                      </div>

                      <div className="w-[80%]">
                        <h4 className="text-[16px]">Amzil Mhand</h4>
                        <h5 className="text-[13px] mb-0">2025-09-19</h5>
                        <p className="mt-0 mb-0">
                          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                          Lorem Ipsum has been the industry's standard dummy text ever since the
                          1500s
                        </p>
                      </div>
                    </div>
                    <Rating name="size-small" defaultValue={4} readOnly />
                  </div>

                  <div className="review w-full pt-5 pb-5 border-b border-[rgba(0,0,0,0.1)] flex items-center justify-between">
                    <div className="info w-[60%] flex items-center gap-2">
                      <div className="img w-[80px] h-[80px] overflow-hidden rounded-full">
                        <img
                          src="https://lirp.cdn-website.com/6f140169/dms3rep/multi/opt/Parikshit+Gokhale-640w.jpg"
                          alt=""
                          className="w-full"
                        />
                      </div>

                      <div className="w-[80%]">
                        <h4 className="text-[16px]">Amzil Mhand</h4>
                        <h5 className="text-[13px] mb-0">2025-09-19</h5>
                        <p className="mt-0 mb-0">
                          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                          Lorem Ipsum has been the industry's standard dummy text ever since the
                          1500s
                        </p>
                      </div>
                    </div>
                    <Rating name="size-small" defaultValue={4} readOnly />
                  </div>

                  <div className="review w-full pt-5 pb-5 border-b border-[rgba(0,0,0,0.1)] flex items-center justify-between">
                    <div className="info w-[60%] flex items-center gap-2">
                      <div className="img w-[80px] h-[80px] overflow-hidden rounded-full">
                        <img
                          src="https://lirp.cdn-website.com/6f140169/dms3rep/multi/opt/Parikshit+Gokhale-640w.jpg"
                          alt=""
                          className="w-full"
                        />
                      </div>

                      <div className="w-[80%]">
                        <h4 className="text-[16px]">Amzil Mhand</h4>
                        <h5 className="text-[13px] mb-0">2025-09-19</h5>
                        <p className="mt-0 mb-0">
                          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                          Lorem Ipsum has been the industry's standard dummy text ever since the
                          1500s
                        </p>
                      </div>
                    </div>
                    <Rating name="size-small" defaultValue={4} readOnly />
                  </div>

                  <div className="review w-full pt-5 pb-5 border-b border-[rgba(0,0,0,0.1)] flex items-center justify-between">
                    <div className="info w-[60%] flex items-center gap-2">
                      <div className="img w-[80px] h-[80px] overflow-hidden rounded-full">
                        <img
                          src="https://lirp.cdn-website.com/6f140169/dms3rep/multi/opt/Parikshit+Gokhale-640w.jpg"
                          alt=""
                          className="w-full"
                        />
                      </div>

                      <div className="w-[80%]">
                        <h4 className="text-[16px]">Amzil Mhand</h4>
                        <h5 className="text-[13px] mb-0">2025-09-19</h5>
                        <p className="mt-0 mb-0">
                          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                          Lorem Ipsum has been the industry's standard dummy text ever since the
                          1500s
                        </p>
                      </div>
                    </div>
                    <Rating name="size-small" defaultValue={4} readOnly />
                  </div>
                </div>

                <br />

                <div className="reviewForm bg-[#fafafa] p-4 rounded-md">
                  <h2 className="text-[18px]">Add a review</h2>
                  <form className="w-full mt-5">
                    <TextField
                      id="outlined-multiline-flexible"
                      label="Write a review...."
                      className="w-full mb-5"
                      multiline
                      rows={5}
                    />

                    <br />
                    <br />

                    <Rating name="size-small" defaultValue={4} />

                    <div className="flex items-center mt-5">
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
                        Submit Review
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className='container pt-8'>
          <h2 className="text-[20px] font-[600] mb-1">Related Products</h2>
          <ProductsSlider items={6} />
        </div>
      </section>
    </>
  );
};

export default ProductDetails;
