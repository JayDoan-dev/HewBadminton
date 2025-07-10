"use client";

import { useCartStore } from "@/hooks/useCartStore";
import { useWixClient } from "@/hooks/useWixClient";
import { useEffect, useState } from "react";

const Add = ({
  productId,
  variantId,
  stockNumber,
  validateOptions,
}: {
  productId: string;
  variantId: string;
  stockNumber: number;
  validateOptions?: () => boolean;
}) => {
  const [quantity, setQuantity] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [addedQty, setAddedQty] = useState(0);

  const handleQuantity = (type: "i" | "d") => {
    if (type === "d" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
    if (type === "i" && quantity < stockNumber) {
      setQuantity((prev) => prev + 1);
    }
  };

  const wixClient = useWixClient();
  const { addItem, isLoading } = useCartStore();

  const isOutOfStock = stockNumber <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock || isLoading) return;
    if (validateOptions && !validateOptions()) return;
    addItem(wixClient, productId, variantId, quantity);
    setAddedQty(quantity);
    setShowPopup(true);
  };

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => setShowPopup(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  return (
    <div className="flex flex-col gap-4 relative">
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div
            className={
              `bg-gradient-to-br from-orange-400 to-orange-600 text-white px-8 py-6 rounded-2xl shadow-2xl flex flex-col items-center ` +
              (showPopup ? "animate-popup-in" : "animate-popup-out")
            }
            style={{
              animation: showPopup
                ? "popup-in 0.35s cubic-bezier(0.22, 1, 0.36, 1)"
                : "popup-out-strong 0.25s cubic-bezier(0.55, 0, 0.55, 0.2)",
              animationFillMode: "forwards"
            }}
          >
            <svg
              width="48"
              height="48"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="mb-2 animate-bounce"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <div className="text-xl font-bold mb-1">Added to Cart!</div>
            <div className="text-sm">
              {addedQty} item{addedQty > 1 ? "s" : ""} added successfully.
            </div>
          </div>
        </div>
      )}
      <h4 className="font-medium">Choose a Quantity</h4>
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 py-2 px-4 rounded-3xl flex items-center justify-between w-32">
            <button
              className="cursor-pointer text-xl disabled:cursor-not-allowed disabled:opacity-20"
              onClick={() => handleQuantity("d")}
              disabled={quantity === 1 || isOutOfStock}
            >
              -
            </button>
            {quantity}
            <button
              className="cursor-pointer text-xl disabled:cursor-not-allowed disabled:opacity-20"
              onClick={() => handleQuantity("i")}
              disabled={quantity === stockNumber || isOutOfStock}
            >
              +
            </button>
          </div>
          {isOutOfStock ? (
            <div className="text-xs text-red-500">Out of stock</div>
          ) : stockNumber < 10 ? (
            <div className="text-xs text-red-500">
              Only {stockNumber} items left!
              <br /> Don’t miss it
            </div>
          ) : (
            <div className="text-xs text-green-600">In stock</div>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isLoading}
          className="w-36 text-sm rounded-3xl ring-1 ring-hew text-hew py-2 px-4 hover:bg-hew hover:text-white disabled:cursor-not-allowed disabled:bg-orange-200 disabled:ring-0 disabled:text-white"
        >
          {isOutOfStock ? "Unavailable" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default Add;

/* Add to the bottom of the file: */
// Add popup-in and popup-out-strong keyframes for pop effect
if (typeof window !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes popup-in {
      0% { transform: scale(0.7); opacity: 0; }
      60% { transform: scale(1.15); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes popup-out-strong {
      0% { transform: scale(1); opacity: 1; }
      80% { transform: scale(1.15); opacity: 0.7; }
      100% { transform: scale(0.3); opacity: 0; }
    }
  `;
  if (!document.head.querySelector("#add-to-cart-popup-anim")) {
    style.id = "add-to-cart-popup-anim";
    document.head.appendChild(style);
  }
}
