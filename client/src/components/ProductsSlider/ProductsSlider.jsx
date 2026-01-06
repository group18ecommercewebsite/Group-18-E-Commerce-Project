import React from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

import { Navigation } from 'swiper/modules';
import ProductItem from '../ProductItem/ProductItem';

const ProductsSlider = ({ items = 5, products = [] }) => {
  // Nếu không có products, không render gì
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="productsSlider py-3">
      <Swiper
        slidesPerView={items}
        spaceBetween={10}
        navigation={true}
        modules={[Navigation]}
        className="mySwiper"
        breakpoints={{
          320: { slidesPerView: 1.5, spaceBetween: 8 },
          480: { slidesPerView: 2, spaceBetween: 10 },
          640: { slidesPerView: 3, spaceBetween: 10 },
          768: { slidesPerView: 4, spaceBetween: 10 },
          1024: { slidesPerView: Math.min(5, items), spaceBetween: 10 },
          1280: { slidesPerView: items, spaceBetween: 10 },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product._id}>
            <ProductItem product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductsSlider;
