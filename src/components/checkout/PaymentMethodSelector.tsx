"use client";

import React from "react";
import { PaymentMethod } from "@/types/payment";
import { CreditCard, Smartphone, Globe } from "lucide-react";

interface PaymentMethodSelectorProps {
  methods: PaymentMethod[];
  selectedMethod: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
  loading?: boolean;
}

export function PaymentMethodSelector({
  methods,
  selectedMethod,
  onSelect,
  loading = false,
}: PaymentMethodSelectorProps) {
  const getMethodIcon = (type: PaymentMethod["type"]) => {
    switch (type) {
      case "credit_card":
      case "debit_card":
        return <CreditCard className="w-5 h-5" />;
      case "apple_pay":
      case "google_pay":
        return <Smartphone className="w-5 h-5" />;
      case "paypal":
        return <Globe className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium text-gray-900">Payment Method</h3>

      <div className="grid gap-3">
        {methods
          .filter((method) => method.enabled)
          .map((method) => (
            <button
              key={method.id}
              onClick={() => onSelect(method)}
              disabled={loading}
              className={`p-4 border rounded-lg text-left transition-all hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                selectedMethod?.id === method.id
                  ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                  : "border-gray-200 hover:bg-gray-50"
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 text-gray-400">
                  {getMethodIcon(method.type)}
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">
                    {method.name}
                  </div>
                  {method.type === "credit_card" && (
                    <div className="text-xs text-gray-500">
                      Visa, Mastercard, American Express
                    </div>
                  )}
                </div>
                {selectedMethod?.id === method.id && (
                  <div className="ml-auto">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                )}
              </div>
            </button>
          ))}
      </div>
    </div>
  );
}
