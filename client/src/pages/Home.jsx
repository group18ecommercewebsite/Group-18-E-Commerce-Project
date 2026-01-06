import React, { useState, useEffect } from 'react';
import HomeSlider from '../components/HomeSLider/HomeSlider';
import HomeCatSlider from '../components/HomeCatSlider/HomeCatSlider';
import { LiaShippingFastSolid } from 'react-icons/lia';
import AdsBannerSlider from '../components/AdsBannerSlider/AdsBannerSlider';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ProductsSlider from '../components/ProductsSlider/ProductsSlider';
import { getProducts, getFeaturedProducts } from '../api/productApi';
import { getCategories } from '../api/categoryApi';
import { getBanners } from '../api/bannerApi';

export const Home = () => {
  const [tabValue, setTabValue] = useState(0);
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, featuredRes, categoriesRes, bannersRes] = await Promise.all([
          getProducts(),
          getFeaturedProducts(),
          getCategories(),
          getBanners()
        ]);

        // Handle different API response structures
        const productsData = productsRes?.products || productsRes?.data || productsRes;
        const featuredData = featuredRes?.products || featuredRes?.data || featuredRes;
        const categoriesData = categoriesRes?.data || categoriesRes?.categoryList || categoriesRes;
        const bannersData = bannersRes?.data || bannersRes?.banners || bannersRes;

        setProducts(Array.isArray(productsData) ? productsData : []);
        setFeaturedProducts(Array.isArray(featuredData) ? featuredData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setBanners(Array.isArray(bannersData) ? bannersData : []);
      } catch (error) {
        console.error('Error fetching homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Filter products by category based on selected tab
  const getFilteredProducts = () => {
    if (tabValue === 0 || categories.length === 0) {
      return products.slice(0, 12);
    }
    
    const selectedCategory = categories[tabValue - 1];
    if (!selectedCategory) return products.slice(0, 12);
    
    const filtered = products.filter(
      (p) => p.catId === selectedCategory._id || p.catName === selectedCategory.name
    );
    return filtered.length > 0 ? filtered.slice(0, 12) : products.slice(0, 12);
  };

  // Get latest products (sorted by date)
  const getLatestProducts = () => {
    const sorted = [...products].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    return sorted.slice(0, 12);
  };

  return (
    <div>
      <HomeSlider />

      <HomeCatSlider categories={categories} />

      <section className="bg-white py-4 md:py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4 mb-4">
            <div className="leftSec">
              <h2 className="text-[18px] md:text-[20px] font-[600]">Sản phẩm phổ biến</h2>
              <p className="text-[13px] md:text-[14px] font-[400] !m-0">
                Đừng bỏ lỡ các ưu đãi hiện tại!
              </p>
            </div>

            <div className="rightSec w-full md:w-auto md:max-w-[60%]">
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="product category tabs"
              >
                <Tab label="Tất cả" />
                {categories.slice(0, 7).map((cat) => (
                  <Tab key={cat._id} label={cat.name} />
                ))}
              </Tabs>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <ProductsSlider items={6} products={getFilteredProducts()} />
          )}
        </div>
      </section>

      <section className="py-4 pt-2 bg-white">
        <div className="container">
          {/* Free shipping banner - responsive */}
          <div className="freeShipping w-full md:w-[90%] lg:w-[80%] m-auto py-3 md:py-4 px-3 md:px-4 border-2 border-[#ff5252] flex flex-col md:flex-row items-center justify-center md:justify-between gap-3 md:gap-4 rounded-md mb-5 md:mb-7 text-center md:text-left">
            <div className="col1 flex items-center gap-2 md:gap-4">
              <LiaShippingFastSolid className="text-[36px] md:text-[50px]" />
              <span className="text-[16px] md:text-[20px] font-[600] uppercase">Miễn phí vận chuyển</span>
            </div>

            <div className="col2 hidden md:block">
              <p className="mb-0 font-medium text-[13px] md:text-[14px]">
                Miễn phí giao hàng cho đơn hàng đầu tiên và đơn trên 500.000đ
              </p>
            </div>

            <p className="font-bold text-lg md:text-2xl !m-0">- Chỉ từ 500.000đ*</p>
          </div>

          <AdsBannerSlider items={4} banners={banners} />
        </div>
      </section>

      <section className="py-4 md:py-5 pt-0 bg-white">
        <div className="container">
          <h2 className="text-[18px] md:text-[20px] font-[600]">Sản phẩm mới nhất</h2>
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <ProductsSlider items={6} products={getLatestProducts()} />
          )}

          <AdsBannerSlider items={3} banners={banners} />
        </div>
      </section>

      <section className="py-4 md:py-5 pt-0 bg-white">
        <div className="container">
          <h2 className="text-[18px] md:text-[20px] font-[600]">Sản phẩm nổi bật</h2>
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <ProductsSlider items={6} products={featuredProducts.slice(0, 12)} />
          )}

          <AdsBannerSlider items={3} banners={banners} />
        </div>
      </section>
    </div>
  );
};
