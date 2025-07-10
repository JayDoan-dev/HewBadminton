import { wixClientServer } from "@/lib/wixClientServer";
import Image from "next/image";
import Link from "next/link";

const CategoryList = async () => {
  const wixClient = await wixClientServer();
  const cats = await wixClient.collections.queryCollections().find();

  return (
    <div className="px-4 overflow-x-auto custom-scrollbar">
      <div className="flex gap-6 md:gap-10 py-6">
        {cats.items.map((item) => (
          <Link
            href={`/list?cat=${item.slug}`}
            key={item._id}
            className="flex-shrink-0 w-48 md:w-64 lg:w-72"
          >
            <div className="relative w-full h-64 md:h-72 lg:h-80 bg-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group">
              {/* Image */}
              <Image
                src={item.media?.mainMedia?.image?.url || "/cat.png"}
                alt=""
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Dark overlay (dim by default) */}
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-0 transition-all duration-300 z-10" />

              {/* Text inside image, responsive */}
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <h2 className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-center px-2 drop-shadow-md leading-snug">
                  {item.name}
                </h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
