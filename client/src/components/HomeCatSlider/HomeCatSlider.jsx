import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

import { Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';

// Default category images mapping (fallback when no image from API)
const defaultCategoryImages = {
  'Fashion': 'https://api.spicezgold.com/download/file_1734525204708_fash.png',
  'Electronics': 'https://api.spicezgold.com/download/file_1734525218436_ele.png',
  'Bags': 'https://api.spicezgold.com/download/file_1734525231018_bag.png',
  'Footwear': 'https://api.spicezgold.com/download/file_1734525239704_foot.png',
  'Groceries': 'https://api.spicezgold.com/download/file_1734525248057_gro.png',
  'Beauty': 'https://api.spicezgold.com/download/file_1734525255799_beauty.png',
  'Wellness': 'https://api.spicezgold.com/download/file_1734525275367_well.png',
  'Jewellery': 'https://api.spicezgold.com/download/file_1734525286186_jw.png',
};

const HomeCatSlider = ({ categories = [] }) => {
  // If no categories from API, don't render anything
  if (!categories || categories.length === 0) {
    return null;
  }

  const getCategoryImage = (category) => {
    // Use image from API if available
    if (category.images && category.images.length > 0) {
      return category.images[0];
    }
    // Fallback to default images based on category name
    return defaultCategoryImages[category.name] || 
      'https://via.placeholder.com/60x60?text=' + encodeURIComponent(category.name?.charAt(0) || 'C');
  };

  return (
    <div className="homeCatSlider pt-4 py-8">
      <div className="container">
        <Swiper
          slidesPerView={8}
          spaceBetween={10}
          navigation={true}
          modules={[Navigation]}
          className="mySwiper"
          breakpoints={{
            320: { slidesPerView: 3 },
            480: { slidesPerView: 4 },
            640: { slidesPerView: 5 },
            768: { slidesPerView: 6 },
            1024: { slidesPerView: 8 },
          }}
        >
          {categories.map((category) => (
            <SwiperSlide key={category._id}>
              <Link to={`/productListing/${category._id}`}>
                <div className="item py-7 px-3 bg-white rounded-sm text-center flex items-center justify-center flex-col hover:shadow-md transition-shadow">
                  <img
                    src={getCategoryImage(category)}
                    alt={category.name}
                    className="w-[60px] h-[60px] object-contain transition-all hover:scale-110"
                  />
                  <h3 className="text-[15px] font-medium mt-3">{category.name}</h3>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HomeCatSlider;
