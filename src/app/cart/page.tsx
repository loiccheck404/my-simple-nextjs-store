"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

export default function CartPage() {
  const {
    items,
    itemCount, // Changed from totalItems
    total, // Changed from totalPrice
    removeFromCart, // Changed from removeItem
    updateQuantity,
    clearCart,
  } = useCart();

  // Calculate savings if there are original prices
  const totalSavings = items.reduce((savings, item) => {
    // Note: Your CartItem type doesn't include originalPrice, so this will always be 0
    // You may need to add originalPrice to your CartItem interface if you want this feature
    return savings;
  }, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-4 min-h-screen">
        <div className="text-center py-16">
          <div className="text-6xl mb-6">🛒</div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Looks like you haven't added any items to your cart yet. Start
            shopping to fill it up!
          </p>
          <Link
            href="/products"
            className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Shopping Cart</h1>
        <p className="text-gray-400">
          {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-gray-800 rounded-lg p-6 flex flex-col sm:flex-row gap-4"
            >
              {/* Product Image */}
              <div className="w-full sm:w-32 h-32 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">No Image</span>
                )}
              </div>

              {/* Product Details */}
              <div className="flex-1 space-y-2">
                <h3 className="text-white font-semibold text-lg">
                  {item.name}
                </h3>

                {/* Product ID for reference */}
                <p className="text-gray-400 text-sm">
                  Product ID: {item.productId}
                </p>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-blue-400 font-bold text-lg">
                    ${item.price.toFixed(2)}
                  </span>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 mt-4">
                  <span className="text-gray-300 text-sm">Quantity:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white rounded-full flex items-center justify-center transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="text-white font-semibold min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="flex justify-between items-center mt-4">
                  <span className="text-gray-300">
                    Subtotal:{" "}
                    <span className="text-white font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </span>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="border border-red-500/50 bg-red-500/10 hover:bg-red-500/20 hover:border-red-400 text-red-400 hover:text-red-300 text-sm font-medium px-3 py-1.5 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Clear Cart Button */}
          <div className="pt-4 border-t border-gray-700">
            <button
              onClick={clearCart}
              className="border border-red-500/50 bg-red-500/10 hover:bg-red-500/20 hover:border-red-400 text-red-400 hover:text-red-300 text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-6 sticky top-4">
            <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>

            <div className="space-y-3">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal ({itemCount} items)</span>
                <span>${total.toFixed(2)}</span>
              </div>

              {totalSavings > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Savings</span>
                  <span>-${totalSavings.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-300">
                <span>Shipping</span>
                <span className="text-green-400">Free</span>
              </div>

              <div className="flex justify-between text-gray-300">
                <span>Tax</span>
                <span>${(total * 0.08).toFixed(2)}</span>
              </div>

              <div className="border-t border-gray-700 pt-3">
                <div className="flex justify-between text-white font-bold text-lg">
                  <span>Total</span>
                  <span>${(total + total * 0.08).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mt-6">
              <Link
                href="/checkout"
                className="block w-full text-center border bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/products"
                className="block w-full text-center border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Continue Shopping
              </Link>
            </div>

            {/* Security Badge */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 text-gray-400 text-sm">
                <span>🔒</span>
                <span>Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
