import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

import { Navigation } from 'swiper/modules';
import BannerBox from '../BannerBox/BannerBox';

// Default fallback banners if no data from API
const defaultBanners = [
  { _id: '1', images: ['https://serviceapi.spicezgold.com/download/1741669037986_banner2.webp'] },
  { _id: '2', images: ['https://serviceapi.spicezgold.com/download/1741669057847_banner5.webp'] },
  { _id: '3', images: ['https://serviceapi.spicezgold.com/download/1742453755529_1741669087880_banner6.webp'] },
  { _id: '4', images: ['https://serviceapi.spicezgold.com/download/1741669037986_banner2.webp'] },
];

const AdsBannerSlider = ({ items = 4, banners = [] }) => {
  // Use banners from props, or fallback to defaults if empty
  const displayBanners = banners.length > 0 ? banners : defaultBanners;

  return (
    <div className="py-5 w-full">
      <Swiper
        slidesPerView={items}
        spaceBetween={10}
        navigation={true}
        modules={[Navigation]}
        className="smlBtn"
        breakpoints={{
          320: { slidesPerView: 1 },
          480: { slidesPerView: 2 },
          768: { slidesPerView: Math.min(3, items) },
          1024: { slidesPerView: items },
        }}
      >
        {displayBanners.map((banner, index) => (
          <SwiperSlide key={banner._id || index}>
            <BannerBox
              img={banner.images?.[0] || banner.image || ''}
              link={banner.link || '/'}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default AdsBannerSlider;
