import Add from "@/components/Add";
import CustomizeProducts from "@/components/CustomizeProducts";
import ProductImages from "@/components/ProductImages";
import { wixClientServer } from "@/lib/wixClientServer";
import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";

const SinglePage = async ({ params }: { params: { slug: string } }) => {
  const wixClient = await wixClientServer();

  const products = await wixClient.products
    .queryProducts()
    .eq("slug", params.slug)
    .find();

  if (!products.items[0]) {
    return notFound();
  }

  const product = products.items[0];

  const formatter = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
  });

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:32 2xl:px-64 relative flex flex-col lg:flex-row gap-16">
      {/* IMG */}
      <div className="w-full mt-6 lg:w-1/2 lg:sticky top-20 h-max">
        <ProductImages items={product.media?.items || []} />
      </div>

      {/* TEXT */}
      <div className="w-full mt-6 lg:w-1/2 flex flex-col gap-6">
        <h1 className="text-4xl font-medium">{product.name}</h1>
        <div
          className="text-gray-500"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(product.description || ""),
          }}
        />

        <div className="h-[2px] bg-gray-100" />

        {/* Price */}
        {product.priceData?.price === product.priceData?.discountedPrice ? (
          <h2 className="font-medium font-semibold text-2xl text-[#F0794A]">
            C{formatter.format(product.priceData?.price || 0)}
          </h2>
        ) : (
          <div className="flex items-center gap-4">
            <h2 className="font-medium font-semibold text-2xl text-[#F0794A]">
              C{formatter.format(product.priceData?.discountedPrice || 0)}
            </h2>
            <h3 className="text-xl text-gray-500 line-through">
              C{formatter.format(product.priceData?.price || 0)}
            </h3>
          </div>
        )}

        <div className="h-[2px] bg-gray-100" />

        {/* Customize or Add */}
        {product.variants && product.productOptions ? (
          <CustomizeProducts
            productId={product._id!}
            variants={product.variants}
            productOptions={product.productOptions}
          />
        ) : (
          <Add
            productId={product._id!}
            variantId="00000000-0000-0000-000000000000"
            stockNumber={product.stock?.quantity || 0}
          />
        )}

        <div className="h-[2px] bg-gray-100" />

        {/* Additional Info Sections */}
        {product.additionalInfoSections?.map((section: any) => (
          <div className="text-sm" key={section.title}>
            <h4 className="font-medium mb-4">{section.title}</h4>
            {section.description && (
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(section.description),
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SinglePage;
