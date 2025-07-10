"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/hooks/useCartStore";
import { media as wixMedia } from "@wix/sdk";
import { useWixClient } from "@/hooks/useWixClient";
import { currentCart } from "@wix/ecom";
import { Trash2 } from "lucide-react";
import { products } from "@wix/stores";
import { useEffect, useState } from "react";

const CartPage = () => {
  const wixClient = useWixClient();
  const { cart, isLoading, removeItem } = useCartStore();
  const [allVariants, setAllVariants] = useState<products.Variant[]>([]);
  const [coupon, setCoupon] = useState("");

  useEffect(() => {
    const fetchVariants = async () => {
      if (!cart?.lineItems?.length) {
        setAllVariants([]);
        return;
      }
      const variantArrays: products.Variant[][] = await Promise.all(
        cart.lineItems.map(async (item) => {
          const catalogId = item.catalogReference?.catalogItemId;
          if (!catalogId) return [];
          try {
            const product = await wixClient.products.getProduct(catalogId);
            return (product as any).variants || product.product?.variants || [];
          } catch (e) {
            return [];
          }
        })
      );
      setAllVariants(variantArrays.flat());
    };
    fetchVariants();
  }, [cart, wixClient]);

  // Helper to get variant options as string
  const getVariantOptionsString = (item: any) => {
    const variantId = item.catalogReference?.options?.variantId;
    if (!variantId || !allVariants) return null;
    const variant = allVariants.find((v) => v._id === variantId);
    if (!variant || !variant.choices) return null;
    return Object.entries(variant.choices)
      .map(([key, value]) => `${key}: ${value}`)
      .join(" | ");
  };

  const formatter = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
  });

  const handleCheckout = async () => {
    try {
      const checkout =
        await wixClient.currentCart.createCheckoutFromCurrentCart({
          channelType: currentCart.ChannelType.WEB,
        });

      const { redirectSession } =
        await wixClient.redirects.createRedirectSession({
          ecomCheckout: { checkoutId: checkout.checkoutId },
          callbacks: {
            postFlowUrl: window.location.origin,
            thankYouPageUrl: `${window.location.origin}/success`,
          },
        });

      if (redirectSession?.fullUrl) {
        window.location.href = redirectSession.fullUrl;
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!cart.lineItems || cart.lineItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-20 flex flex-col items-center justify-center text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={120}
          height={120}
          fill="none"
          viewBox="0 0 48 48"
          className="mb-6 opacity-60 drop-shadow-lg mt-16"
        >
          <rect width="48" height="48" rx="24" fill="#E3E3E3" />
          <path
            d="M16 17h-2a1 1 0 0 0-1 1v1.5a1 1 0 0 0 1 1h2m0 0h16m-16 0 2.2 13.2A2 2 0 0 0 20.2 34h7.6a2 2 0 0 0 2-1.8L32 19m-16 0V17a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v2"
            stroke="#AFAFAF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="20" cy="38" r="2" fill="#AFAFAF" />
          <circle cx="28" cy="38" r="2" fill="#AFAFAF" />
        </svg>
        <h1 className="mt-4 text-3xl font-bold mb-2 text-gray-800">
          Your Cart is Empty !
        </h1>
        <p className="text-gray-500 mb-6 text-base">
          Looks like you haven’t added anything yet.
          <br />
          Start shopping and fill your cart with awesome products!
        </p>
        <Link
          href="/"
          className="px-8 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-full shadow-lg hover:from-orange-500 hover:to-orange-600 transition-all text-lg font-semibold mt-2"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="md:col-span-2">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

        <div className="flex flex-col gap-6">
          {cart.lineItems.map((item) => (
            <div
              key={item._id}
              className="flex gap-4 p-4 border rounded-lg shadow-sm bg-white"
            >
              {item.image && (
                <Image
                  src={wixMedia.getScaledToFillImageUrl(
                    item.image,
                    100,
                    120,
                    {}
                  )}
                  alt=""
                  width={100}
                  height={120}
                  className="rounded-md object-cover"
                />
              )}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between">
                    <h3 className="text-lg font-semibold">
                      {item.productName?.original}
                    </h3>
                    <div className="text-lg font-medium text-gray-800">
                      {formatter.format(Number(item.price?.amount) || 0)}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mt-1 flex items-center gap-2 flex-wrap">
                    Status:{" "}
                    {item.availability?.status === "AVAILABLE" ? (
                      <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                        In Stock
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-700 rounded">
                        {item.availability?.status}
                      </span>
                    )}
                    {/* Product Variant Options */}
                    {getVariantOptionsString(item) && (
                      <span className="text-xs text-gray-600 bg-gray-100 rounded px-2 py-1 ml-1">
                        {getVariantOptionsString(item)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-2 flex justify-between items-center text-sm">
                  <div>
                    Qty: <span className="font-medium">{item.quantity}</span>
                    {/* Optional: Add qty controls here */}
                  </div>
                  <button
                    className="flex items-center gap-1 text-red-600 hover:underline"
                    disabled={isLoading}
                    onClick={() => removeItem(wixClient, item._id!)}
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Link
            href="/"
            className="inline-block text-sm text-hew hover:underline"
          >
            &larr; Continue Shopping
          </Link>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 h-fit">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>

        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>
            {formatter.format(
              cart.lineItems?.reduce(
                (sum, item) =>
                  sum +
                  (Number(item.price?.amount) || 0) * (item.quantity || 1),
                0
              ) || 0
            )}
          </span>
        </div>

        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span className="text-gray-500">Calculated at checkout</span>
        </div>

        <div className="flex justify-between mb-4">
          <span>Taxes</span>
          <span className="text-gray-500">Calculated at checkout</span>
        </div>

        <hr className="my-4" />

        <div className="flex justify-between text-lg font-semibold mb-4">
          <span>Total</span>
          <span>
            {formatter.format(
              cart.lineItems?.reduce(
                (sum, item) =>
                  sum +
                  (Number(item.price?.amount) || 0) * (item.quantity || 1),
                0
              ) || 0
            )}
          </span>
        </div>
        <form className="mt-6 mb-4 flex gap-2" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Coupon code"
            className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            disabled={false}
          />
          <button
            type="button"
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-60 text-sm font-semibold"
            disabled={false}
          >
            Apply
          </button>
        </form>
        <button
          className="w-full py-3 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-60"
          disabled={isLoading}
          onClick={handleCheckout}
        >
          Proceed to Checkout
        </button>
        <p className="text-xs text-gray-500 mt-2">
          By placing your order, you agree to our Terms & Conditions.
        </p>
        {/* Coupon Input (UI only, below total/checkout) */}
      </div>
    </div>
  );
};

export default CartPage;
