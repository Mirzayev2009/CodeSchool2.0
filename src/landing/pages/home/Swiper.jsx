import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getCourseIcon, getCourseGradient } from "@/lib/courseIcons"; 
import { Link } from "react-router-dom";


export default function HeroCarousel({ slides }) {
  console.log("HeroCarousel slides:", slides);

  const [api, setApi] = useState();
  const [current, setCurrent] = useState(1);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // Auto-play functionality
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0); // Go back to first slide
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [api]);

  if (!slides || slides.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center text-white bg-gray-800">
        <div className="text-center">
          <p className="text-xl mb-4">No slides available.</p>
          <p className="text-sm text-gray-300">
            Check your heroSlides.json file
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="relative h-screen overflow-hidden">
      <Carousel
        setApi={setApi}
        className="w-full h-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="h-full ml-0">
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="pl-0 h-full w-full">
              {/* Each slide has its own gradient */}
              <div
                className="relative h-full w-full min-h-screen p-10 md:p-20 flex items-center justify-center"
                style={{
                  background: getCourseGradient(slide.title),
                  transition: "background 0.7s cubic-bezier(.4,0,.2,1)",
                }}
              >
                <div className="w-full max-w-6xl mx-auto px-8 flex items-center justify-between relative z-20">
                  {/* Left: Text */}
                  <div className="max-w-2xl text-white w-full flex flex-col items-center md:items-start">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight text-center md:text-left">
                      {slide.title}
                    </h2>
                    {/* Icon below title on mobile, larger and more responsive */}
                    <div className="flex md:hidden justify-center mb-8">
                      {(() => {
                        const Icon = getCourseIcon(slide.title);
                        return (
                          <span
                            className="rounded-full p-6 shadow-2xl flex items-center justify-center"
                            style={{
                              background: getCourseGradient(slide.title),
                              border: `6px solid #fff`,
                              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                              position: "relative",
                            }}
                          >
                            <Icon
                              className="text-7xl sm:text-8xl"
                              style={{
                                filter:
                                  "drop-shadow(0 0 16px rgba(0,0,0,0.25))",
                                color: "#fff",
                                width: "100%",
                                height: "100%",
                              }}
                            />
                          </span>
                        );
                      })()}
                    </div>
                    {/* Hide description on mobile */}
                    <p className="hidden md:block text-lg md:text-xl mb-6 md:mb-8 leading-relaxed opacity-90 max-w-xl">
                      {slide.description}
                    </p>
                    <Link to="/enroll">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 md:px-10 py-4 md:py-5 text-lg md:text-xl rounded-lg transition-all transform hover:scale-105 mt-2">
                        Kursga yozilish
                      </Button>
                    </Link>
                  </div>

                  {/* Right: Icon on desktop */}
                  <div className="hidden md:flex items-center justify-center w-1/3">
                    {(() => {
                      const Icon = getCourseIcon(slide.title);
                      return (
                        <span
                          className="rounded-full p-4 shadow-2xl flex items-center justify-center"
                          style={{
                            background: getCourseGradient(slide.title),
                            border: `6px solid #fff`,
                            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                            position: "relative",
                          }}
                        >
                          <Icon
                            className="text-[120px]"
                            style={{
                              filter: "drop-shadow(0 0 16px rgba(0,0,0,0.25))",
                              color: "#fff",
                              width: "100%",
                              height: "100%",
                            }}
                          />
                        </span>
                      );
                    })()}
                  </div>
                </div>

                {/* Optional: dark overlay if image exists */}
                {slide.image && (
                  <div className="absolute inset-0 bg-black/50 z-0" />
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Custom navigation buttons */}
        <CarouselPrevious className="left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/20 border-white/30 hover:bg-white/30 text-white size-10 md:size-12" />
        <CarouselNext className="right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/20 border-white/30 hover:bg-white/30 text-white size-10 md:size-12" />
      </Carousel>

      {/* Slide indicators */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
              index === current - 1
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute top-4 right-4 bg-black/30 text-white px-3 py-1 rounded-full text-sm">
        {current} / {count}
      </div>
    </section>
  );
}
