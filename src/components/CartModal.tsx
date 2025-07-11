"use client";

import Image from "next/image";
import { useCartStore } from "@/hooks/useCartStore";
import { media as wixMedia } from "@wix/sdk";
import { useWixClient } from "@/hooks/useWixClient";
import { currentCart } from "@wix/ecom";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { products } from "@wix/stores";

const CartModal = ({
  variants,
  onClose,
}: {
  variants?: products.Variant[];
  onClose?: () => void;
}) => {
  const wixClient = useWixClient();
  const { cart, isLoading, removeItem } = useCartStore();

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
      console.log(err);
    }
  };

  const formatter = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
  });

  // Helper to get variant options as string
  const getVariantOptionsString = (item: any) => {
    const variantId = item.catalogReference?.options?.variantId;
    if (!variantId || !variants) return null;
    const variant = variants.find(v => v._id === variantId);
    if (!variant || !variant.choices) return null;
    return Object.entries(variant.choices)
      .map(([key, value]) => `${key}: ${value}`)
      .join(" | ");
  };

  return (
    <div className="w-max absolute p-4 rounded-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white top-12 right-0 flex flex-col gap-6 z-20">
      {!cart?.lineItems?.length ? (
        <div className="text-center flex flex-col items-center gap-2 p-6 text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m4-9l2 9"
            />
          </svg>
          <p className="text-lg font-medium">Your cart is empty</p>
          <p className="text-sm text-gray-400">
            Add some products to get started!
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Your Cart</h2>
            <span className="text-sm bg-gray-100 px-2 py-1 rounded-full font-medium text-gray-600">
              {cart.lineItems.reduce(
                (acc, item) => acc + (item.quantity ?? 0),
                0
              )}{" "}
              items
            </span>
          </div>

          {/* LIST */}
          <div className="flex flex-col gap-8">
            {cart.lineItems.map((item) => (
              <div className="flex gap-4" key={item._id}>
                {item.image && (
                  <Image
                    src={wixMedia.getScaledToFillImageUrl(
                      item.image,
                      72,
                      96,
                      {}
                    )}
                    alt=""
                    width={72}
                    height={96}
                    className="object-cover rounded-md"
                  />
                )}
                <div className="flex flex-col justify-between w-full">
                  {/* TOP */}
                  <div>
                    {/* TITLE */}
                    <div className="flex items-center justify-between gap-8">
                      <h3 className="font-semibold">
                        {item.productName?.original}
                      </h3>
                      <div className="p-1 bg-gray-50 rounded-sm flex items-center gap-2">
                        {item.quantity && item.quantity > 1 && (
                          <div className="text-xs text-green-500">
                            {item.quantity} x{" "}
                          </div>
                        )}
                        {`C${formatter.format(Number(item.price?.amount) || 0)}`}
                      </div>
                    </div>
                    {/* DESC */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {item.availability?.status === "AVAILABLE" ? (
                        <span className="inline-block text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-xl">
                          In Stock
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">
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
                  {/* BOTTOM */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Qty. {item.quantity}</span>
                    <span
                      className={`text-red-600 font-medium flex items-center gap-1 hover:underline hover:text-red-700 transition-all ${
                        isLoading
                          ? "cursor-not-allowed opacity-60"
                          : "cursor-pointer"
                      }`}
                      onClick={() => removeItem(wixClient, item._id!)}
                    >
                      <Trash2 size={14} />
                      Remove
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* BOTTOM */}
          <div>
            <div className="flex items-center justify-between font-semibold">
              <span>Subtotal</span>
              <span>
                {`C${formatter.format(
                  cart.lineItems.reduce(
                    (acc, item) =>
                      acc +
                      ((Number(item.price?.amount) || 0) *
                        (item.quantity ?? 1)),
                    0
                  )
                )}`}
              </span>
            </div>

            <p className="text-gray-500 text-sm mt-2 mb-4">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="flex justify-between text-sm">
              <Link
                href="/cart"
                className="rounded-md py-3 px-4 ring-1 ring-gray-300 hover:bg-gray-100 transition-colors"
                onClick={onClose}
              >
                View Cart
              </Link>

              <button
                className="rounded-md py-3 px-4 bg-hew text-white hover:bg-orange-300 transition-colors disabled:cursor-not-allowed disabled:opacity-75"
                disabled={isLoading}
                onClick={handleCheckout}
              >
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartModal;
