import React, { useState, useEffect } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link, useParams } from 'react-router-dom';
import ProductZoom from '../components/ProductZoom/ProductZoom';
import Rating from '@mui/material/Rating';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import ProductsSlider from '../components/ProductsSlider/ProductsSlider';
import ProductDetailsComponent from '../components/ProductDetailsComponent/ProductDetailsComponent';
import { getProductById, getProductsByCategoryId } from '../api/productApi';
import CircularProgress from '@mui/material/CircularProgress';


const ProductDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getProductById(id);
        if (response.success) {
          setProduct(response.product);
          
          // Fetch related products cùng category
          if (response.product.catId) {
            try {
              const relatedResponse = await getProductsByCategoryId(response.product.catId);
              if (relatedResponse.success) {
                // Lọc bỏ sản phẩm hiện tại và giới hạn 8 sản phẩm
                const filtered = relatedResponse.products
                  .filter(p => p._id !== id)
                  .slice(0, 8);
                setRelatedProducts(filtered);
              }
            } catch (err) {
              console.log('Failed to load related products');
            }
          }
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <CircularProgress color="error" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500 text-lg">{error || 'Product not found'}</p>
      </div>
    );
  }

  return (
    <>
      <div className="py-5">
        <div className="container">
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              to="/"
              className="link transition !text-[14px]"
            >
              Home
            </Link>
            {product.catName && (
              <Link
                to={`/productListing/${product.catId}`}
                className="link transition !text-[14px]"
              >
                {product.catName}
              </Link>
            )}
            <span className="text-[14px] text-gray-500">
              {product.name}
            </span>
          </Breadcrumbs>
        </div>
      </div>

      <section className="bg-white py-5">
        <div className="container flex gap-8 items-center">
          <div className="productZoomContainer w-[40%]">
            <ProductZoom images={product.images} />
          </div>

          <div className="productContent w-[60%] pr-10 pl-10">
            <ProductDetailsComponent product={product} />
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
                {product.description || 'No description available.'}
              </p>
            </div>
          )}

          {activeTab === 1 && (
            <div className="shadow-md w-full py-5 p-8 rounded-md">
              <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                <table className="w-full text-sm text-left text-gray-600">
                  <tbody>
                    <tr className="bg-white border-b border-gray-200">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 w-1/3">
                        Brand
                      </th>
                      <td className="px-6 py-4">{product.brand || 'N/A'}</td>
                    </tr>

                    <tr className="bg-purple-50 border-b border-gray-200">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900">
                        Category
                      </th>
                      <td className="px-6 py-4">{product.catName || 'N/A'}</td>
                    </tr>

                    {product.subCat && (
                      <tr className="bg-white border-b border-gray-200">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900">
                          Sub Category
                        </th>
                        <td className="px-6 py-4">{product.subCat}</td>
                      </tr>
                    )}

                    {product.size && product.size.length > 0 && (
                      <tr className="bg-purple-50 border-b border-gray-200">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900">
                          Available Sizes
                        </th>
                        <td className="px-6 py-4">{product.size.join(', ')}</td>
                      </tr>
                    )}

                    {product.productRam && product.productRam.length > 0 && (
                      <tr className="bg-white border-b border-gray-200">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900">
                          RAM Options
                        </th>
                        <td className="px-6 py-4">{product.productRam.join(', ')}</td>
                      </tr>
                    )}

                    {product.productWeight && product.productWeight.length > 0 && (
                      <tr className="bg-purple-50 border-b border-gray-200">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900">
                          Weight Options
                        </th>
                        <td className="px-6 py-4">{product.productWeight.join(', ')}</td>
                      </tr>
                    )}

                    <tr className="bg-white border-b border-gray-200">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900">
                        Stock Status
                      </th>
                      <td className="px-6 py-4">
                        {product.countInStock > 0 
                          ? <span className="text-green-600">{product.countInStock} items in stock</span>
                          : <span className="text-red-600">Out of stock</span>
                        }
                      </td>
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

        {relatedProducts.length > 0 && (
          <div className='container pt-8'>
            <h2 className="text-[20px] font-[600] mb-1">Related Products</h2>
            <ProductsSlider items={5} products={relatedProducts} />
          </div>
        )}
      </section>
    </>
  );
};

export default ProductDetails;
