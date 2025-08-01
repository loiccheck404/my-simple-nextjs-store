"use client";

import React, { useState } from "react";
import { usePayment } from "@/contexts/PaymentContext";
import { useCart } from "@/contexts/CartContext";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { CreditCardForm } from "./CreditCardForm";
import { OrderReview } from "./OrderReview";
import { PaymentProcessing } from "./PaymentProcessing";
import { PaymentResult } from "./PaymentResult";
import { ShippingForm } from "./ShippingForm";
import { CreditCardData, PaymentRequest } from "@/types/payment";

interface PaymentSectionProps {
  customerData: any;
  currentStep: number;
  onStepChange: (step: number) => void;
}

export function PaymentSection({
  customerData,
  currentStep,
  onStepChange,
}: PaymentSectionProps) {
  const {
    selectedMethod,
    selectPaymentMethod,
    processPayment,
    status,
    processing,
    error,
    availablePaymentMethods,
    lastResponse,
    canRetry,
    retryPayment,
    clearError,
  } = usePayment();

  const { items, total, getCartForCheckout } = useCart();

  const [shippingData, setShippingData] = useState(null);
  const [cardData, setCardData] = useState<CreditCardData | null>(null);
  const [isCardValid, setIsCardValid] = useState(false);

  const handleShippingSubmit = (data: any) => {
    setShippingData(data);
    onStepChange(2);
  };

  const handlePaymentMethodSelect = (method: any) => {
    selectPaymentMethod(method);
    clearError();
  };

  const handleCardValidation = (
    isValid: boolean,
    data: CreditCardData | null
  ) => {
    setIsCardValid(isValid);
    setCardData(data);
  };

  const handlePaymentSubmit = async () => {
    if (!selectedMethod || !shippingData) return;

    const cartData = getCartForCheckout();

    const paymentRequest: PaymentRequest = {
      amount: total * 100, // Convert to cents
      currency: "USD",
      paymentMethod: selectedMethod,
      cardData: cardData || undefined,
      billingAddress:
        shippingData.billingAddress || shippingData.shippingAddress,
      orderData: {
        items: cartData.items,
        shippingAddress: shippingData.shippingAddress,
        customerInfo: {
          email: customerData.email,
          name: customerData.name,
          phone: customerData.phone,
        },
      },
    };

    try {
      const result = await processPayment(paymentRequest);
      if (result.success) {
        onStepChange(4); // Go to success step
      }
    } catch (error) {
      console.error("Payment processing error:", error);
    }
  };

  const handleRetryPayment = async () => {
    if (!selectedMethod || !shippingData || !cardData) return;

    const cartData = getCartForCheckout();

    const paymentRequest: PaymentRequest = {
      amount: total * 100,
      currency: "USD",
      paymentMethod: selectedMethod,
      cardData: cardData,
      billingAddress:
        shippingData.billingAddress || shippingData.shippingAddress,
      orderData: {
        items: cartData.items,
        shippingAddress: shippingData.shippingAddress,
        customerInfo: {
          email: customerData.email,
          name: customerData.name,
          phone: customerData.phone,
        },
      },
    };

    try {
      await retryPayment(paymentRequest);
    } catch (error) {
      console.error("Payment retry error:", error);
    }
  };

  // Show processing overlay
  if (processing) {
    return <PaymentProcessing />;
  }

  // Show result (success or failure)
  if (status === "success" || status === "failed") {
    return (
      <PaymentResult
        success={status === "success"}
        error={error}
        transactionId={lastResponse?.transactionId}
        orderId={lastResponse?.orderId}
        canRetry={canRetry()}
        onRetry={handleRetryPayment}
        onStartOver={() => {
          onStepChange(1);
          clearError();
        }}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {currentStep === 1 && (
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Shipping Information
          </h2>
          <ShippingForm
            initialData={customerData}
            onSubmit={handleShippingSubmit}
          />
        </div>
      )}

      {currentStep === 2 && (
        <div className="p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Payment Details
          </h2>

          <PaymentMethodSelector
            methods={availablePaymentMethods}
            selectedMethod={selectedMethod}
            onSelect={handlePaymentMethodSelect}
            loading={processing}
          />

          {selectedMethod &&
            (selectedMethod.type === "credit_card" ||
              selectedMethod.type === "debit_card") && (
              <CreditCardForm
                onValidChange={handleCardValidation}
                loading={processing}
              />
            )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex justify-between pt-6">
            <button
              onClick={() => onStepChange(1)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Back to Shipping
            </button>

            <button
              onClick={() => onStepChange(3)}
              disabled={
                !selectedMethod ||
                (selectedMethod.type === "credit_card" && !isCardValid)
              }
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Review Order
            </button>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Review Your Order
          </h2>

          <OrderReview
            items={items}
            total={total}
            shippingData={shippingData}
            paymentMethod={selectedMethod}
            customerData={customerData}
            onEdit={(section) => {
              if (section === "shipping") onStepChange(1);
              if (section === "payment") onStepChange(2);
            }}
            onConfirm={handlePaymentSubmit}
            loading={processing}
          />
        </div>
      )}
    </div>
  );
}
