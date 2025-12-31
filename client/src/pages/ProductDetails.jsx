import React, { useState, useEffect, useContext } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link, useParams } from 'react-router-dom';
import ProductZoom from '../components/ProductZoom/ProductZoom';
import Rating from '@mui/material/Rating';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import ProductsSlider from '../components/ProductsSlider/ProductsSlider';
import ProductDetailsComponent from '../components/ProductDetailsComponent/ProductDetailsComponent';
import { getProductById, getProductsByCategoryId } from '../api/productApi';
import { getProductReviews, addReview, uploadReviewImages } from '../api/reviewApi';
import CircularProgress from '@mui/material/CircularProgress';
import { MyContext } from '../App';
import { IoImages, IoClose } from 'react-icons/io5';

const ProductDetails = () => {
  const { id } = useParams();
  const context = useContext(MyContext);
  const [activeTab, setActiveTab] = useState(0);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review states
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ totalReviews: 0, avgRating: 0 });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [reviewImages, setReviewImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

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

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewLoading(true);
        const response = await getProductReviews(id);
        if (response.success) {
          setReviews(response.data.reviews || []);
          setReviewStats(response.data.stats || { totalReviews: 0, avgRating: 0 });
        }
      } catch (err) {
        console.log('Failed to load reviews');
      } finally {
        setReviewLoading(false);
      }
    };

    if (id) {
      fetchReviews();
    }
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!context.isLogin) {
      context.openAlertBox('error', 'Vui lòng đăng nhập để viết đánh giá');
      return;
    }

    if (!reviewText.trim()) {
      context.openAlertBox('error', 'Vui lòng nhập nội dung đánh giá');
      return;
    }

    try {
      setSubmitting(true);
      const response = await addReview({
        productId: id,
        rating: reviewRating,
        review: reviewText,
        userName: context.user?.name || 'Anonymous',
        userAvatar: context.user?.avatar || '',
        images: reviewImages
      });

      if (response.success) {
        context.openAlertBox('success', 'Đánh giá đã được gửi thành công!');
        setReviewText('');
        setReviewRating(5);
        setReviewImages([]);
        
        // Refresh reviews
        const reviewsResponse = await getProductReviews(id);
        if (reviewsResponse.success) {
          setReviews(reviewsResponse.data.reviews || []);
          setReviewStats(reviewsResponse.data.stats || { totalReviews: 0, avgRating: 0 });
        }
      } else {
        context.openAlertBox('error', response.message || 'Không thể gửi đánh giá');
      }
    } catch (err) {
      context.openAlertBox('error', err.response?.data?.message || 'Không thể gửi đánh giá');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (reviewImages.length + files.length > 5) {
      context.openAlertBox('error', 'Tối đa 5 hình ảnh cho mỗi đánh giá');
      return;
    }

    try {
      setUploadingImages(true);
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));

      const response = await uploadReviewImages(formData);
      if (response.success) {
        setReviewImages(prev => [...prev, ...response.images]);
      }
    } catch (error) {
      context.openAlertBox('error', 'Không thể tải ảnh lên');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index) => {
    setReviewImages(prev => prev.filter((_, i) => i !== index));
  };

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
            <ProductDetailsComponent product={product} reviewStats={reviewStats} />
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
              Review ({reviewStats.totalReviews})
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
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[18px]">Customer Reviews</h2>
                  {reviewStats.totalReviews > 0 && (
                    <div className="flex items-center gap-2">
                      <Rating value={reviewStats.avgRating} precision={0.1} readOnly size="small" />
                      <span className="text-[14px] text-gray-600">
                        {reviewStats.avgRating} out of 5 ({reviewStats.totalReviews} reviews)
                      </span>
                    </div>
                  )}
                </div>

                {reviewLoading ? (
                  <div className="flex justify-center py-10">
                    <CircularProgress size={30} />
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="py-10 text-center text-gray-500">
                    <p>Chưa có đánh giá nào cho sản phẩm này</p>
                    <p className="text-sm mt-1">Hãy là người đầu tiên đánh giá!</p>
                  </div>
                ) : (
                  <div className="reviewScroll w-full max-h-[400px] overflow-y-auto mt-5 pr-2">
                    {reviews.map((review) => (
                      <div key={review._id} className="review w-full pt-5 pb-5 border-b border-[rgba(0,0,0,0.1)] flex items-start justify-between">
                        <div className="info w-[75%] flex items-start gap-4">
                          <div className="img w-[60px] h-[60px] flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                            {review.userAvatar ? (
                              <img
                                src={review.userAvatar}
                                alt={review.userName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[24px] font-semibold text-[#ff5252] bg-red-50">
                                {review.userName?.charAt(0)?.toUpperCase() || 'A'}
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <h4 className="text-[16px] font-medium">{review.userName}</h4>
                            <h5 className="text-[13px] text-gray-500 mb-2">{formatDate(review.createdAt)}</h5>
                            <p className="mt-0 mb-0 text-[14px] text-gray-700">
                              {review.review}
                            </p>
                            {/* Review Images */}
                            {review.images && review.images.length > 0 && (
                              <div className="flex gap-2 mt-3 flex-wrap">
                                {review.images.map((img, idx) => (
                                  <img
                                    key={idx}
                                    src={img}
                                    alt={`Review ${idx + 1}`}
                                    className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:opacity-80 border border-gray-200"
                                    onClick={() => window.open(img, '_blank')}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <Rating value={review.rating} readOnly size="small" />
                      </div>
                    ))}
                  </div>
                )}

                <br />

                <div className="reviewForm bg-[#fafafa] p-4 rounded-md">
                  <h2 className="text-[18px]">Add a review</h2>
                  {!context.isLogin ? (
                    <p className="text-gray-500 mt-3">
                      Vui lòng <Link to="/login" className="text-[#ff5252] font-medium">đăng nhập</Link> để viết đánh giá
                    </p>
                  ) : (
                    <form className="w-full mt-5" onSubmit={handleSubmitReview}>
                      <TextField
                        label="Write a review...."
                        className="w-full mb-5"
                        multiline
                        rows={4}
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        disabled={submitting}
                      />

                      <div className="flex items-center gap-2 mt-3 mb-4">
                        <span className="text-[14px]">Your Rating:</span>
                        <Rating 
                          value={reviewRating} 
                          onChange={(e, newValue) => setReviewRating(newValue || 5)}
                          disabled={submitting}
                        />
                      </div>

                      {/* Image Upload */}
                      <div className="mb-4">
                        <label className="text-[14px] block mb-2">Thêm hình ảnh (tối đa 5):</label>
                        <div className="flex items-center gap-3 flex-wrap">
                          {reviewImages.map((img, idx) => (
                            <div key={idx} className="relative">
                              <img src={img} alt="" className="w-16 h-16 object-cover rounded-lg border" />
                              <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                              >
                                <IoClose size={14} />
                              </button>
                            </div>
                          ))}
                          {reviewImages.length < 5 && (
                            <label className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#ff5252] transition">
                              {uploadingImages ? (
                                <CircularProgress size={20} />
                              ) : (
                                <IoImages className="text-2xl text-gray-400" />
                              )}
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                                disabled={uploadingImages || submitting}
                              />
                            </label>
                          )}
                        </div>
                      </div>

                      <Button
                        type="submit"
                        variant="contained"
                        disabled={submitting}
                        sx={{
                          backgroundColor: '#ff5252',
                          color: '#fff',
                          minWidth: 180,
                          height: 45,
                          px: 3,
                          fontSize: 14,
                          fontWeight: 600,
                          borderRadius: 1,
                          textTransform: 'uppercase',
                          '&:hover': {
                            backgroundColor: '#000',
                          },
                          '&:disabled': {
                            backgroundColor: '#ccc',
                            color: '#fff',
                          },
                        }}
                      >
                        {submitting ? (
                          <CircularProgress size={22} color="inherit" />
                        ) : (
                          'Submit Review'
                        )}
                      </Button>
                    </form>
                  )}
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
