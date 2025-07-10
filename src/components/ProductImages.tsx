"use client";

import { useRef, useState } from "react";
import Image from "next/image";

const ProductImages = ({ items }: { items: any[] }) => {
  const [index, setIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    const image = imageRef.current;
    if (!container || !image) return;

    const { left, top, width, height } = container.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    image.style.transformOrigin = `${x}% ${y}%`;
  };

  const getThumbnailWidthClass = () => {
    if (items.length === 1) return "w-full";
    if (items.length === 2) return "w-1/2";
    if (items.length === 3) return "w-1/3";
    return "w-1/4"; // 4 or more
  };

  return (
    <div>
      {/* Zoomable Main Image */}
      <div
        ref={containerRef}
        className="relative h-[500px] overflow-hidden border bg-white rounded-md cursor-zoom-in"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => {
          setIsHovering(true);
          if (imageRef.current) {
            imageRef.current.style.transform = "scale(2)";
          }
        }}
        onMouseLeave={() => {
          setIsHovering(false);
          if (imageRef.current) {
            imageRef.current.style.transform = "scale(1)";
            imageRef.current.style.transformOrigin = "center";
          }
        }}
      >
        <Image
          ref={imageRef}
          src={items[index].image?.url}
          alt=""
          fill
          className="w-full h-full object-contain transition-transform duration-100 ease-out"
        />
      </div>

      {/* Thumbnails */}
      <div className="flex justify-between gap-4 mt-8 cursor-pointer">
        {items.map((item, i) => (
          <div
            key={item._id || i}
            onClick={() => setIndex(i)}
            className={`relative ${getThumbnailWidthClass()} h-32 rounded-md overflow-hidden border ${
              index === i ? "ring-2 ring-orange-500" : ""
            }`}
          >
            <div className="w-full h-full flex items-center justify-center">
              <Image
                src={item.image?.url}
                alt=""
                fill
                className="max-w-[95%] max-h-[95%] object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
