import Breadcrumb from "@/components/Breadcrumb";
import Filter from "@/components/Filter";
import ProductList from "@/components/ProductList";
import SaleBanner from "@/components/SaleBanner";
import { wixClientServer } from "@/lib/wixClientServer";
import Image from "next/image";
import { Suspense } from "react";

const ListPage = async ({ searchParams }: { searchParams: any }) => {
  const wixClient = await wixClientServer();

  const allCategories = await wixClient.collections.queryCollections().find();

  const currentCategory =
    (await wixClient.collections.getCollectionBySlug(
      searchParams.cat || "all-products"
    )) || null;

  const categoryName = currentCategory?.collection?.name || "All Products";
  const categorySlug = searchParams.cat || "all-products";

  return (
    <div className="relative">
      {/* SALE BANNER — FULL WIDTH, TOP */}
      <SaleBanner />

      <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        {/* ORIGINAL CAMPAIGN BANNER — still here */}
        <div className="hidden sm:flex mt-4 md:mt-6 rounded-lg bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 animate-gradient-x px-4 py-3 md:px-6 md:py-4 lg:px-8 lg:py-4 justify-between items-center shadow-lg relative overflow-hidden">
          {/* Text content */}
          <div className="flex-1 flex flex-col justify-center items-center gap-2 text-indigo-900 z-10 text-center">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-snug">
              Save up to <span className="text-red-500">50% Off</span>
              <br />
              on Selected Products
            </h1>
            <p className="text-sm md:text-base max-w-md">
              Our hottest sale of the year is here. Limited time only!!! Grab
              your favorites now!
            </p>
          </div>

          {/* Image */}
          <div className="relative flex-1 h-36 md:h-48 lg:h-52 z-10">
            <Image
              src="/images/racket_hero.png"
              alt="Sale Racket"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { name: "Home", href: "/" },
            { name: "Categories", href: "/#categories" },
            { name: categoryName },
          ]}
          linkClassName="text-hew hover:underline"
        />

        {/* FILTER */}
        <Filter
        />

        {/* PRODUCTS */}
        <h1 className="mt-12 text-xl font-semibold text-gray-800">
          {categoryName} For You!
        </h1>

        <Suspense fallback="loading...">
          <ProductList
            categoryId={
              currentCategory?.collection?._id ||
              "00000000-000000-000000-000000000001"
            }
            searchParams={searchParams}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default ListPage;
