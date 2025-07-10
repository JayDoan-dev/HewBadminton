"use client";

import { useCartStore } from "@/hooks/useCartStore";
import { useWixClient } from "@/hooks/useWixClient";
import { useState } from "react";

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
  };

  return (
    <div className="flex flex-col gap-4">
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
