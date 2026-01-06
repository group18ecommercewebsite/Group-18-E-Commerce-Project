import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

import { Navigation, Autoplay } from 'swiper/modules';
import { getBanners } from '../../api/bannerApi';

const HomeSlider = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await getBanners();
      if (response.success && response.data.length > 0) {
        setBanners(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch banners:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="homeSlider py-4">
        <div className="container">
          <div className="rounded-[20px] overflow-hidden bg-gray-200 animate-pulse h-[300px]" />
        </div>
      </div>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="homeSlider py-4">
      <div className="container">
        <Swiper
          spaceBetween={10}
          navigation={true}
          modules={[Navigation, Autoplay]}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          className="sliderHome"
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner._id}>
              <div className="item rounded-[20px] overflow-hidden">
                <img src={banner.image} alt={banner.title || 'Banner slide'} className="w-full max-h-[500px] object-cover" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HomeSlider;
