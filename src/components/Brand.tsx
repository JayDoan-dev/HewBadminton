import Image from "next/image";

const brands = [
  { name: "Yonex", src: "/brands/yonex.png", size: "huge" },
  { name: "Victor", src: "/brands/victor.png", size: "huge" },
  { name: "Li-Ning", src: "/brands/lining.png", size: "medium" },
  { name: "Mizuno", src: "/brands/mizuno.png", size: "small" },
];

const Brand = () => {
  return (
    <div className="bg-black py-2">
      <div className="flex flex-wrap justify-center gap-36 px-4">
        {brands.map((brand) => (
          <div
            key={brand.name}
            className={`relative flex items-center justify-center transition ${
              brand.size === "huge"
                ? "w-36 md:w-44"
                : brand.size === "medium"
                ? "w-28 md:w-36"
                : "w-24 md:w-28"
            } h-20 md:h-24`}
          >
            <Image
              src={brand.src}
              alt={brand.name}
              fill
              className={
                brand.name === "Mizuno" ? "object-contain" : "object-cover"
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Brand;
