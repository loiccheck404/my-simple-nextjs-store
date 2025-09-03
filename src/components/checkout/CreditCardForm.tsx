"use client";

import React, { useState, useEffect } from "react";
import { CreditCard, Lock } from "lucide-react";
import { CreditCardData } from "@/types/payment";
import { MockPaymentService } from "@/lib/payment-service";

interface CreditCardFormProps {
  onValidChange: (isValid: boolean, data: CreditCardData | null) => void;
  loading?: boolean;
}

export function CreditCardForm({
  onValidChange,
  loading = false,
}: CreditCardFormProps) {
  const [formData, setFormData] = useState<CreditCardData>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cardType, setCardType] = useState<string>("");

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, "");
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Card number validation
    if (!formData.cardNumber) {
      newErrors.cardNumber = "Card number is required";
    } else if (formData.cardNumber.replace(/\s/g, "").length < 13) {
      newErrors.cardNumber = "Card number is too short";
    }

    // Expiry date validation
    if (!formData.expiryDate) {
      newErrors.expiryDate = "Expiry date is required";
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = "Invalid format (MM/YY)";
    } else {
      const [month, year] = formData.expiryDate.split("/");
      const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
      if (expiry <= new Date()) {
        newErrors.expiryDate = "Card has expired";
      }
    }

    // CVV validation
    if (!formData.cvv) {
      newErrors.cvv = "Security code is required";
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = "Invalid security code";
    }

    // Cardholder name validation
    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = "Cardholder name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Update parent component when form changes
  useEffect(() => {
    const isValid = validateForm();
    onValidChange(isValid, isValid ? formData : null);
  }, [formData, onValidChange]);

  // Update card type when card number changes
  useEffect(() => {
    setCardType(MockPaymentService.getCardType(formData.cardNumber));
  }, [formData.cardNumber]);

  const handleInputChange = (field: keyof CreditCardData, value: string) => {
    let formattedValue = value;

    if (field === "cardNumber") {
      formattedValue = formatCardNumber(value);
    } else if (field === "expiryDate") {
      formattedValue = formatExpiryDate(value);
    } else if (field === "cvv") {
      formattedValue = value.replace(/\D/g, "").substring(0, 4);
    }

    setFormData((prev) => ({ ...prev, [field]: formattedValue }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const getCardTypeDisplay = () => {
    switch (cardType) {
      case "visa":
        return "Visa";
      case "mastercard":
        return "Mastercard";
      case "amex":
        return "American Express";
      case "discover":
        return "Discover";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
        <Lock className="w-4 h-4" />
        <span>Your payment information is secure and encrypted</span>
      </div>

      {/* Card Number */}
      <div>
        <label
          htmlFor="cardNumber"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Card Number
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <CreditCard className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="cardNumber"
            type="text"
            value={formData.cardNumber}
            onChange={(e) => handleInputChange("cardNumber", e.target.value)}
            className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.cardNumber ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            disabled={loading}
          />
          {cardType && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <span className="text-xs text-gray-500">
                {getCardTypeDisplay()}
              </span>
            </div>
          )}
        </div>
        {errors.cardNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
        )}
      </div>

      {/* Expiry and CVV */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="expiryDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Expires
          </label>
          <input
            id="expiryDate"
            type="text"
            value={formData.expiryDate}
            onChange={(e) => handleInputChange("expiryDate", e.target.value)}
            className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.expiryDate ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="MM/YY"
            maxLength={5}
            disabled={loading}
          />
          {errors.expiryDate && (
            <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="cvv"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Security Code
          </label>
          <input
            id="cvv"
            type="text"
            value={formData.cvv}
            onChange={(e) => handleInputChange("cvv", e.target.value)}
            className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.cvv ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="123"
            maxLength={4}
            disabled={loading}
          />
          {errors.cvv && (
            <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
          )}
        </div>
      </div>

      {/* Cardholder Name */}
      <div>
        <label
          htmlFor="cardholderName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Cardholder Name
        </label>
        <input
          id="cardholderName"
          type="text"
          value={formData.cardholderName}
          onChange={(e) => handleInputChange("cardholderName", e.target.value)}
          className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.cardholderName ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="John Doe"
          disabled={loading}
        />
        {errors.cardholderName && (
          <p className="mt-1 text-sm text-red-600">{errors.cardholderName}</p>
        )}
      </div>

      {/* Test Cards Information */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Test Cards</h4>
        <div className="text-xs text-blue-800 space-y-1">
          <div>Success: 4242 4242 4242 4242</div>
          <div>Declined: 4000 0000 0000 0002</div>
          <div>Insufficient Funds: 4000 0000 0000 9995</div>
          <div>Use any future expiry date and any 3-digit CVV</div>
        </div>
      </div>
    </div>
  );
}
