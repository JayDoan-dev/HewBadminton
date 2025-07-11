import { wixClientServer } from "@/lib/wixClientServer";
import { products } from "@wix/stores";
import Image from "next/image";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import Pagination from "./Pagination";

const PRODUCT_PER_PAGE = 16;

const stripHTML = (html: string): string => {
  return html.replace(/<[^>]+>/g, "").trim();
};

const ProductList = async ({
  categoryId,
  limit,
  searchParams,
  showOnlyDiscounted = false,
}: {
  categoryId: string;
  limit?: number;
  searchParams?: any;
  showOnlyDiscounted?: boolean;
}) => {
  const wixClient = await wixClientServer();

  const productQuery = wixClient.products
    .queryProducts()
    .startsWith("name", searchParams?.name || "")
    .hasSome(
      "productType",
      searchParams?.type ? [searchParams.type] : ["physical", "digital"]
    )
    .gt("priceData.price", searchParams?.min || 0)
    .lt("priceData.price", searchParams?.max || 99999999)
    .eq("collectionIds", categoryId)
    .limit(limit || PRODUCT_PER_PAGE)
    .skip(
      searchParams?.page
        ? parseInt(searchParams.page) * (limit || PRODUCT_PER_PAGE)
        : 0
    );

  if (searchParams?.sort) {
    const [sortType, sortBy] = searchParams.sort.split(" ");
    // Try API sort for supported fields
    const apiSortableFields = ["name", "price", "priceData.price", "createdDate"]; // Add more if needed
    if (apiSortableFields.includes(sortBy)) {
      if (sortType === "asc") {
        productQuery.ascending(sortBy);
      }
      if (sortType === "desc") {
        productQuery.descending(sortBy);
      }
    }
  }

  const res = await productQuery.find();
  let filteredItems = res.items;

  // Fallback: JS-side sort for common fields if API sort didn't work
  if (searchParams?.sort) {
    const [sortType, sortBy] = searchParams.sort.split(" ");
    if (!filteredItems.length || filteredItems.length === 1) {
      // nothing to sort
    } else if (sortBy === "price" || sortBy === "priceData.price") {
      filteredItems = filteredItems.slice().sort((a, b) => {
        const aPrice = a.priceData?.discountedPrice ?? a.priceData?.price ?? 0;
        const bPrice = b.priceData?.discountedPrice ?? b.priceData?.price ?? 0;
        return sortType === "asc" ? aPrice - bPrice : bPrice - aPrice;
      });
    } else if (sortBy === "name") {
      filteredItems = filteredItems.slice().sort((a, b) => {
        const aName = a.name?.toLowerCase() ?? "";
        const bName = b.name?.toLowerCase() ?? "";
        return sortType === "asc" ? aName.localeCompare(bName) : bName.localeCompare(aName);
      });
    } else if (sortBy === "createdDate" || sortBy === "_createdDate") {
      filteredItems = filteredItems.slice().sort((a, b) => {
        const aDate = new Date(a._createdDate ?? 0).getTime();
        const bDate = new Date(b._createdDate ?? 0).getTime();
        return sortType === "asc" ? aDate - bDate : bDate - aDate;
      });
    }
  }

  let filteredAndSortedItems = filteredItems;

  if (showOnlyDiscounted) {
    filteredAndSortedItems = filteredAndSortedItems.filter(
      (product: products.Product) =>
        typeof product.priceData?.discountedPrice === "number" &&
        typeof product.priceData?.price === "number" &&
        product.priceData.discountedPrice < product.priceData.price
    );

    filteredAndSortedItems.sort((a: products.Product, b: products.Product) => {
      const discountA =
        (((a.priceData?.price ?? 0) - (a.priceData?.discountedPrice ?? 0)) /
          (a.priceData?.price ?? 1)) *
        100;
      const discountB =
        (((b.priceData?.price ?? 0) - (b.priceData?.discountedPrice ?? 0)) /
          (b.priceData?.price ?? 1)) *
        100;
      return discountB - discountA;
    });
  }

  const formatter = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
  });

  return (
    <>
      <div className="mt-12 grid gap-x-8 gap-y-16 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {filteredAndSortedItems.map((product: products.Product) => (
          <Link href={"/" + product.slug} className="group" key={product._id}>
            <div className="flex flex-col gap-4 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative w-full h-80 rounded-t-2xl overflow-hidden bg-white p-4">
                {typeof product.priceData?.discountedPrice === "number" &&
                  typeof product.priceData?.price === "number" &&
                  product.priceData.discountedPrice < product.priceData.price && (
                    <div className="absolute top-4 right-[-40px] w-[120px] bg-gradient-to-r from-orange-500 to-red-500 text-white text-center text-[11px] font-extrabold tracking-wider uppercase py-1 transform rotate-45 z-20 shadow-lg">
                      <span className="relative left-[-6px]">
                        {`${Math.round(
                          ((product.priceData.price -
                            product.priceData.discountedPrice) /
                            product.priceData.price) *
                            100
                        )}% OFF`}
                      </span>
                    </div>
                  )}

                <Image
                  src={product.media?.mainMedia?.image?.url || "/product.png"}
                  alt=""
                  fill
                  sizes="25vw"
                  className="absolute inset-0 object-contain z-10 transition-opacity duration-500 group-hover:opacity-0"
                />
                {product.media?.items && (
                  <Image
                    src={product.media?.items[1]?.image?.url || "/product.png"}
                    alt=""
                    fill
                    sizes="25vw"
                    className="absolute inset-0 object-contain transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                  />
                )}
              </div>

              <div className="px-4">
                <div>
                  <span className="font-medium">{product.name}</span>
                  <span className="font-semibold text-lg text-[#F0794A]">
                    {product.priceData?.price ===
                    product.priceData?.discountedPrice ? (
                      <h2 className="font-medium font-semibold text-xl text-[#F0794A] mt-2">
                        C{formatter.format(product.priceData?.price || 0)}
                      </h2>
                    ) : (
                      <div className="flex items-center gap-2 mt-2">
                        <h2 className="font-medium font-semibold text-xl text-[#F0794A]">
                          C{formatter.format(
                            product.priceData?.discountedPrice || 0
                          )}
                        </h2>
                        <h3 className="text-gray-500 line-through">
                          C{formatter.format(product.priceData?.price || 0)}
                        </h3>
                      </div>
                    )}
                  </span>
                </div>
                {product.additionalInfoSections && (
                  <div
                    className="text-sm text-gray-500"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        product.additionalInfoSections?.find(
                          (section: any) =>
                            section.title?.toLowerCase().replace(/\s/g, "") ===
                            "shortdesc"
                        )?.description || ""
                      ),
                    }}
                  ></div>
                )}
              </div>

              <div className="px-4 pb-4 flex justify-center">
                <button className="w-full max-w-xs rounded-2xl ring-1 ring-hew text-hew py-2 px-4 text-xs hover:bg-hew hover:text-white transition">
                  Add to Cart
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {/* Conditionally render Pagination: hide for BestDealsPage (deals) */}
      {!(searchParams && searchParams.noPagination) && (
        <div className="mt-12 flex justify-center">
          <Pagination
            currentPage={res.currentPage || 0}
            hasPrev={res.hasPrev()}
            hasNext={res.hasNext()}
          />
        </div>
      )}
    </>
  );
};

export default ProductList;
