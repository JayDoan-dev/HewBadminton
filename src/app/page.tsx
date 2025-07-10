// "use client";

import CategoryList from "@/components/CategoryList";
import ProductList from "@/components/ProductList";
import Slider from "@/components/Slider";
import Brand from "@/components/Brand";
import { Suspense } from "react";

const HomePage = async () => {
  return (
    <div>
      {/* Hero Slider */}
      <Slider />

      {/* Brand Partners */}
      <Brand />

      {/* Categories Section */}
      <div className="mt-12">
        <h1 className="px-2 md:px-8 lg:px-16 xl:32 2xl:px-64 mb-12 text-2xl md:text-3xl font-bold text-gray-800 text-center leading-snug">
          Categories
        </h1>
        <Suspense fallback={"loading"}>
          <CategoryList />
        </Suspense>
      </div>

      {/* Featured Products */}
      <div className="mt-24 px-4 md:px-8 lg:px-16 xl:32 2xl:px-64">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center leading-snug">
          Featured Products
        </h1>
        <Suspense fallback={"loading"}>
          <ProductList
            categoryId={process.env.FEATURED_PRODUCTS_CATEGORY_ID!}
            limit={4}
          />
        </Suspense>
      </div>

      {/* New Arrivals */}
      <div className="mt-24 px-4 md:px-8 lg:px-16 xl:32 2xl:px-64">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center leading-snug">
          New Arrivals
        </h1>
        <Suspense fallback={"loading"}>
          <ProductList
            categoryId={process.env.NEW_ARRIVALS_CATEGORY_ID!}
            limit={4}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default HomePage;
