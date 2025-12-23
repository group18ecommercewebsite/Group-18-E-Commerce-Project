import React, { useRef, useState } from 'react';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/styles.min.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

const DEFAULT_IMAGE = 'https://via.placeholder.com/500x500?text=No+Image';

const ProductZoom = ({ images = [] }) => {
    const [slideIndex, setSlideIndex] = useState(0);
    const zoomSliderBig = useRef();
    const zoomSliderSml = useRef();

    // Nếu không có images thì dùng ảnh mặc định
    const productImages = images.length > 0 ? images : [DEFAULT_IMAGE];

    const goto = (index) => {
        setSlideIndex(index);
        zoomSliderSml.current?.swiper?.slideTo(index);
        zoomSliderBig.current?.swiper?.slideTo(index);
    }

  return (
    <>
      <div className="flex gap-3">
        {/* Chỉ hiển thị thumbnails nếu có nhiều hơn 1 ảnh */}
        {productImages.length > 1 && (
          <div className="slider w-[15%]">
            <Swiper
              ref={zoomSliderSml}
              direction={'vertical'}
              slidesPerView={4}
              spaceBetween={10}
              navigation={true}
              modules={[Navigation]}
              className="zoomProductSliderThumbs h-[500px] overflow-hidden"
            >
              {productImages.map((img, index) => (
                <SwiperSlide key={index}>
                  <div 
                    className={`item rounded-md overflow-hidden cursor-pointer group ${slideIndex === index ? 'opacity-100' : 'opacity-30'}`} 
                    onClick={() => goto(index)}
                  >
                    <img
                      src={img}
                      alt={`Product ${index + 1}`}
                      className="w-full transition-all group-hover:scale-105"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        <div className={`zoomContainer ${productImages.length > 1 ? 'w-[85%]' : 'w-full'} h-[500px] overflow-hidden rounded-md`}>
          <Swiper ref={zoomSliderBig} slidesPerView={1} spaceBetween={0} navigation={false}>
            {productImages.map((img, index) => (
              <SwiperSlide key={index}>
                <InnerImageZoom
                  zoomType="hover"
                  zoomScale={1}
                  src={img}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default ProductZoom;
