"use client";

import React, { useState } from "react";
import { ShoppingBag, Tag, Gift } from "lucide-react";
import { CartItem } from "@/lib/api";

interface CheckoutSummaryProps {
  items: CartItem[];
  total: number;
  customerData: any;
}

export function CheckoutSummary({
  items,
  total,
  customerData,
}: CheckoutSummaryProps) {
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);

  const handleApplyPromo = () => {
    // Mock promo code logic
    const validCodes = {
      SAVE10: 0.1,
      WELCOME5: 0.05,
      STUDENT: 0.15,
    };

    const discount =
      validCodes[promoCode.toUpperCase() as keyof typeof validCodes];
    if (discount) {
      setPromoDiscount(discount);
      setPromoApplied(true);
    } else {
      // Show error state
      setPromoApplied(false);
      setPromoDiscount(0);
    }
  };

  const itemsSubtotal = total;
  const discountAmount = itemsSubtotal * promoDiscount;
  const shippingEstimate = 5.99; // Default shipping
  const taxEstimate = (itemsSubtotal - discountAmount) * 0.08;
  const estimatedTotal =
    itemsSubtotal - discountAmount + shippingEstimate + taxEstimate;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
      <div className="flex items-center mb-6">
        <ShoppingBag className="w-5 h-5 text-gray-400 mr-2" />
        <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
      </div>

      {/* Items List */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-3">
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 object-cover rounded-lg"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {item.name}
              </p>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <p className="text-sm font-medium text-gray-900">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Promo Code */}
      <div className="border-t border-gray-200 pt-6 mb-6">
        <div className="flex items-center mb-3">
          <Tag className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-sm font-medium text-gray-700">Promo Code</span>
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Enter code"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={handleApplyPromo}
            disabled={!promoCode.trim()}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Apply
          </button>
        </div>

        {promoApplied && (
          <div className="mt-2 flex items-center text-sm text-green-600">
            <Gift className="w-4 h-4 mr-1" />
            <span>Promo code applied!</span>
          </div>
        )}
      </div>

      {/* Order Totals */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900">${itemsSubtotal.toFixed(2)}</span>
        </div>

        {promoApplied && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600">Discount ({promoCode})</span>
            <span className="text-green-600">
              -${discountAmount.toFixed(2)}
            </span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping (estimated)</span>
          <span className="text-gray-900">${shippingEstimate.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax (estimated)</span>
          <span className="text-gray-900">${taxEstimate.toFixed(2)}</span>
        </div>

        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between text-base font-semibold">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">${estimatedTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Customer Info */}
      {customerData && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Contact</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <div>{customerData.email}</div>
            {customerData.name && <div>{customerData.name}</div>}
            {customerData.phone && <div>{customerData.phone}</div>}
          </div>
        </div>
      )}

      {/* Security Badge */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center text-xs text-gray-500">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>Secure 256-bit SSL encryption</span>
        </div>
      </div>
    </div>
  );
}
