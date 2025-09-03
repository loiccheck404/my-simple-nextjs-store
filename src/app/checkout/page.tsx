"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { usePayment } from "@/contexts/PaymentContext";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps";
import { PaymentSection } from "@/components/checkout/PaymentSection";
import { AuthModal } from "@/components/auth/AuthModal";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated, isGuest, loading: authLoading } = useAuth();
  const { items, total, canProceedToCheckout } = useCart();
  const { resetPayment } = usePayment();

  const [currentStep, setCurrentStep] = useState(1);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [guestData, setGuestData] = useState(null);
  const [isReady, setIsReady] = useState(false);

  // Check if user can proceed to checkout
  useEffect(() => {
    if (authLoading) return;

    if (!canProceedToCheckout()) {
      router.push("/cart");
      return;
    }

    // For guests, show auth modal first
    if (isGuest && !guestData) {
      setShowAuthModal(true);
    } else {
      setIsReady(true);
    }
  }, [authLoading, canProceedToCheckout, isGuest, guestData, router]);

  // Reset payment state when entering checkout
  useEffect(() => {
    resetPayment();
  }, [resetPayment]);

  const handleAuthSuccess = (userData: any) => {
    setShowAuthModal(false);
    setIsReady(true);
  };

  const handleGuestCheckout = (guestCheckoutData: any) => {
    setGuestData(guestCheckoutData);
    setShowAuthModal(false);
    setIsReady(true);
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isReady) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => router.push("/cart")}
          mode="guest"
          onSwitchMode={() => {}}
          onLogin={handleAuthSuccess}
          onRegister={handleAuthSuccess}
          onGuestCheckout={handleGuestCheckout}
        />
      </>
    );
  }

  const customerData = isAuthenticated
    ? {
        email: user?.email || "",
        name: user?.name || "",
        phone: user?.phone,
      }
    : guestData;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">
            {isAuthenticated
              ? `Welcome back, ${user?.name}`
              : "Complete your order"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Flow */}
          <div className="lg:col-span-2 space-y-8">
            <CheckoutSteps
              currentStep={currentStep}
              onStepChange={handleStepChange}
            />

            <PaymentSection
              customerData={customerData}
              currentStep={currentStep}
              onStepChange={handleStepChange}
            />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <CheckoutSummary
              items={items}
              total={total}
              customerData={customerData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
