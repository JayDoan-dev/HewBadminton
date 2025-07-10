"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Optional: Replace with your own icons

const slides = [
  {
    id: 1,
    title: (
      <>
        <span className="text-red-500">Smash</span> Into Summer
      </>
    ),
    description: "Up to 50% off rackets, shoes & gear!",
    img: "/images/badminton_slide2.webp",
    url: "/list?cat=all-products",
    bg: "bg-[radial-gradient(ellipse_at_center,_#0f0f0f,_#441E24)]",
    isLight: false,
  },
  {
    id: 2,
    title: (
      <>
        Pro-Level <span className="text-blue-500">Equipment</span>
      </>
    ),
    description: "Gear up with top brands for serious players.",
    img: "/images/badminton_slide1.webp",
    url: "/list?cat=all-products",
    bg: "bg-[radial-gradient(ellipse_at_center,_#0f0f0f,_#1e293b)]",
    isLight: false,
  },
  {
    id: 3,
    title: (
      <>
        Backcourt <span className="text-hew">Essentials</span>
      </>
    ),
    description: "Everything you need for your next match.",
    img: "/images/badminton_slide3.webp",
    url: "/list?cat=all-products",
    bg: "bg-[#FAF4E1]",
    isLight: true,
  },
];

const Slider = () => {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-slide effect
//   useEffect(() => {
//     startAutoSlide();
//     return () => stopAutoSlide();
//   }, []);

  const startAutoSlide = () => {
    stopAutoSlide();
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 3000);
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    startAutoSlide();
  };

  const handleNext = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    startAutoSlide();
  };

  return (
    <div className="h-[calc(100vh-80px)] overflow-hidden relative">
      <div
        className="w-max h-full flex transition-all ease-in-out duration-1000"
        style={{ transform: `translateX(-${current * 100}vw)` }}
      >
        {slides.map((slide) => (
          <div
            className={`${slide.bg} w-screen h-full flex flex-col gap-12 xl:flex-row`}
            key={slide.id}
          >
            {/* TEXT CONTAINER */}
            <div
              className={`h-1/2 xl:w-1/2 xl:h-full flex flex-col items-center justify-center gap-6 2xl:gap-10 text-center px-4 ${
                slide.isLight ? "text-black" : "text-white"
              }`}
            >
              <h2
                className={`text-lg md:text-xl lg:text-2xl 2xl:text-3xl ${
                  slide.isLight ? "" : "drop-shadow-md"
                }`}
              >
                {slide.description}
              </h2>
              <h1
                className={`text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-semibold ${
                  slide.isLight ? "" : "drop-shadow-md"
                }`}
              >
                {slide.title}
              </h1>
              <Link href={slide.url}>
                <button
                  className={`rounded-md py-2 px-6 text-sm md:text-base font-medium transition duration-300 ${
                    slide.isLight
                      ? "bg-black text-white hover:bg-gray-900"
                      : "bg-transparent border border-white text-white hover:bg-white hover:text-black"
                  }`}
                >
                  SHOP NOW
                </button>
              </Link>
            </div>

            {/* IMAGE CONTAINER */}
            <div className="h-1/2 xl:w-1/2 xl:h-full relative">
              <Image
                src={slide.img}
                alt=""
                fill
                sizes="100%"
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </div>

      {/* DOT INDICATORS */}
      <div className="absolute m-auto left-1/2 bottom-8 -translate-x-1/2 flex gap-4 z-10">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ring-1 ring-gray-400 cursor-pointer flex items-center justify-center ${
              current === index ? "scale-150" : ""
            }`}
            onClick={() => {
              setCurrent(index);
              startAutoSlide();
            }}
          >
            {current === index && (
              <div className="w-[6px] h-[6px] bg-white rounded-full"></div>
            )}
          </div>
        ))}
      </div>

      {/* ARROW BUTTONS */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
      >
        <ChevronLeft />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default Slider;
