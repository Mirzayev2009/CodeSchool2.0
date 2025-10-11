import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation as SwiperNavigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const HeroCarousel = ({ slides = [] }) => {
  if (!slides || slides.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-gray-100">
        <span className="text-gray-400 text-lg">No slides available</span>
      </div>
    );
  }
  return (
    <Swiper
      modules={[Autoplay, Pagination, SwiperNavigation]}
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      navigation
      className="w-full h-full"
    >
      {slides.map((slide, idx) => (
        <SwiperSlide key={idx}>
          <div className="flex flex-col md:flex-row items-center justify-between w-full h-[80vh] px-8 md:px-24 py-8 bg-gradient-to-br from-blue-50 to-purple-100">
            <div className="flex-1 flex flex-col items-start justify-center gap-6">
              <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 drop-shadow-lg">
                {slide.title}
              </h2>
              <p className="text-lg md:text-2xl text-gray-700 mb-6 max-w-xl">
                {slide.description}
              </p>
              {slide.buttonText && slide.buttonLink && (
                <a
                  href={slide.buttonLink}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-all duration-300"
                >
                  {slide.buttonText}
                </a>
              )}
            </div>
            <div className="flex-1 flex items-center justify-center">
              <img
                src={slide.image}
                alt={slide.title}
                className="max-h-[400px] w-auto object-contain drop-shadow-xl rounded-2xl"
                style={{ maxWidth: "100%" }}
              />
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroCarousel;