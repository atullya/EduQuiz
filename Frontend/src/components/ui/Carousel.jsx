"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const carouselImages = [
  {
    id: 1,
    src: "https://picsum.photos/id/1018/1200/600",
    alt: "Nature 1",
  },
  {
    id: 2,
    src: "https://picsum.photos/id/1015/1200/600",
    alt: "Nature 2",
  },
  {
    id: 3,
    src: "https://picsum.photos/id/1019/1200/600",
    alt: "Nature 3",
  },
];

export default function CarouselDemo() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 500); // transition duration in ms
    return () => clearTimeout(timer);
  }, [currentIndex]);

  return (
    <div className="relative w-full max-w-4xl mx-auto mt-10">
      {/* Carousel Container */}
      <div className="relative overflow-hidden rounded-xl">
        {/* Image Slide */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {carouselImages.map((image) => (
            <div key={image.id} className="min-w-full">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-auto object-cover rounded-xl"
              />
            </div>
          ))}
        </div>

        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          disabled={isTransitioning}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed z-20"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          disabled={isTransitioning}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed z-20"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
