"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/hooks/useCartStore";
import { media as wixMedia } from "@wix/sdk";
import { useWixClient } from "@/hooks/useWixClient";
import { currentCart } from "@wix/ecom";
import { Trash2 } from "lucide-react";

const CartPage = () => {
  const wixClient = useWixClient();
  const { cart, isLoading, removeItem } = useCartStore();

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
      <div className="max-w-4xl mx-auto py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-6">
          Looks like you haven’t added anything yet.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-orange-500 text-white rounded hover:bg-orange-600"
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
                  src={wixMedia.getScaledToFillImageUrl(item.image, 100, 120, {})}
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
                  <div className="text-sm text-gray-500 mt-1">
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
                  </div>
                </div>

                <div className="mt-2 flex justify-between items-center text-sm">
                  <div>
                    Qty:{" "}
                    <span className="font-medium">{item.quantity}</span>
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
            className="inline-block text-sm text-blue-600 hover:underline"
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
      </div>
    </div>
  );
};

export default CartPage;
