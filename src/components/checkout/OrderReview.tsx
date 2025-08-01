"use client";

import React from "react";
import { Edit, CreditCard, MapPin, Package, Shield } from "lucide-react";
import { CartItem } from "@/lib/api";

interface OrderReviewProps {
  items: CartItem[];
  total: number;
  shippingData: any;
  paymentMethod: any;
  customerData: any;
  onEdit: (section: "shipping" | "payment") => void;
  onConfirm: () => void;
  loading: boolean;
}

export function OrderReview({
  items,
  total,
  shippingData,
  paymentMethod,
  customerData,
  onEdit,
  onConfirm,
  loading,
}: OrderReviewProps) {
  const getShippingMethodName = (id: string) => {
    const methods = {
      standard: "Standard Shipping (5-7 days) - $5.99",
      express: "Express Shipping (2-3 days) - $12.99",
      overnight: "Overnight Shipping (Next day) - $24.99",
    };
    return methods[id as keyof typeof methods] || id;
  };

  const getShippingCost = (id: string) => {
    const costs = { standard: 5.99, express: 12.99, overnight: 24.99 };
    return costs[id as keyof typeof costs] || 0;
  };

  const shippingCost = getShippingCost(
    shippingData?.shippingMethod || "standard"
  );
  const tax = total * 0.08; // 8% tax
  const finalTotal = total + shippingCost + tax;

  return (
    <div className="space-y-6">
      {/* Order Items */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
        <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
          {items.map((item) => (
            <div key={item.id} className="p-4 flex items-center space-x-4">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">
                  {item.name}
                </h4>
                <p className="text-sm text-gray-500">
                  Quantity: {item.quantity}
                </p>
              </div>
              <div className="text-sm font-medium text-gray-900">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Information */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <MapPin className="w-5 h-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Shipping</h3>
          </div>
          <button
            onClick={() => onEdit("shipping")}
            className="text-blue-600 hover:text-blue-500 text-sm font-medium flex items-center"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </button>
        </div>

        <div className="space-y-2 text-sm">
          <div>
            <div className="font-medium text-gray-900">Delivery Address</div>
            <div className="text-gray-600">
              {shippingData?.shippingAddress?.street}
              {shippingData?.shippingAddress?.apartment &&
                `, ${shippingData.shippingAddress.apartment}`}
              <br />
              {shippingData?.shippingAddress?.city},{" "}
              {shippingData?.shippingAddress?.state}{" "}
              {shippingData?.shippingAddress?.zipCode}
            </div>
          </div>

          <div>
            <div className="font-medium text-gray-900">Shipping Method</div>
            <div className="text-gray-600">
              {getShippingMethodName(
                shippingData?.shippingMethod || "standard"
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <CreditCard className="w-5 h-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Payment</h3>
          </div>
          <button
            onClick={() => onEdit("payment")}
            className="text-blue-600 hover:text-blue-500 text-sm font-medium flex items-center"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </button>
        </div>

        <div className="text-sm">
          <div className="font-medium text-gray-900">Payment Method</div>
          <div className="text-gray-600">{paymentMethod?.name}</div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          Contact Information
        </h3>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium text-gray-900">Email: </span>
            <span className="text-gray-600">{customerData?.email}</span>
          </div>
          {customerData?.name && (
            <div>
              <span className="font-medium text-gray-900">Name: </span>
              <span className="text-gray-600">{customerData.name}</span>
            </div>
          )}
          {customerData?.phone && (
            <div>
              <span className="font-medium text-gray-900">Phone: </span>
              <span className="text-gray-600">{customerData.phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Order Summary */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Order Summary
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900">${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className="text-gray-900">${shippingCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax</span>
            <span className="text-gray-900">${tax.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-200 pt-2">
            <div className="flex justify-between text-base font-medium">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">${finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
          <div className="text-sm">
            <div className="font-medium text-blue-900">Secure Checkout</div>
            <div className="text-blue-700 mt-1">
              Your payment information is encrypted and secure. We never store
              your payment details.
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Button */}
      <button
        onClick={onConfirm}
        disabled={loading}
        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white transition-colors ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        }`}
      >
        {loading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing Payment...
          </div>
        ) : (
          `Confirm Order - ${finalTotal.toFixed(2)}`
        )}
      </button>
    </div>
  );
}
