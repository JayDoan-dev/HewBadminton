import ProductList from "@/components/ProductList";
import { wixClientServer } from "@/lib/wixClientServer";
import SaleBanner from "@/components/SaleBanner";

export default async function BestDealsPage({
  searchParams,
}: {
  searchParams?: any;
}) {
  const wixClient = await wixClientServer();

  const currentCategory =
    (await wixClient.collections.getCollectionBySlug(
      searchParams?.cat || "all-products"
    )) || null;

  const categoryId =
    currentCategory?.collection?._id || "00000000-000000-000000-000000000001";

  return (
    <div>
      <SaleBanner />
      <div className="min-h-[90vh] flex flex-col items-center px-4 py-16 bg-gradient-to-br from-white to-gray-50">
        <div className="max-w-5xl text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
            🔥 Current Best Deals 🔥
          </h1>
          <p className="text-lg text-gray-600">
            Explore our biggest discounts — rackets, shoes, bags, and more at unbeatable prices!
          </p>
        </div>

        <ProductList
          categoryId={categoryId}
          searchParams={searchParams}
          showOnlyDiscounted
          limit={12}
        />
      </div>
    </div>
  );
}
