"use client";

import React from "react";
import { useCheckoutAuth } from "@/hooks/useCheckoutAuth";
import { useCart } from "@/contexts";
import { AuthModal } from "@/components/auth/AuthModal";

// Example of how to use the authentication system in a checkout page
export default function CheckoutPage() {
  const { items, total, canProceedToCheckout } = useCart();
  const {
    // State
    showAuthModal,
    authMode,
    loading,
    error,
    canProceedToPayment,
    guestData,

    // Modal controls
    openAuthModal,
    closeAuthModal,
    switchAuthMode,

    // Authentication actions
    handleLogin,
    handleRegister,
    handleGuestCheckout,

    // Checkout flow
    proceedToCheckout,
    getCheckoutUser,
    shouldShowAuthBenefits,
  } = useCheckoutAuth();

  const handleCheckoutClick = async () => {
    const canProceed = await proceedToCheckout();
    if (canProceed) {
      // User is ready for payment
      console.log("Proceeding to payment with user:", getCheckoutUser());
    }
    // If canProceed is false, the modal will automatically show
  };

  const handlePayment = () => {
    const checkoutUser = getCheckoutUser();

    if (checkoutUser) {
      // Process payment with user data (authenticated user or guest data)
      console.log("Processing payment for:", checkoutUser);
      console.log("Cart items:", items);
      console.log("Total:", total);

      // Here you would integrate with your payment processor
      // Example: Stripe, PayPal, etc.
    }
  };

  if (!canProceedToCheckout) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h1>
          <p className="text-gray-600 mb-8">
            Add some items to your cart to continue with checkout.
          </p>
          <a
            href="/products"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="order-2 lg:order-1">
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Order Summary
            </h2>

            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 mt-6 pt-6">
              <div className="flex justify-between items-center text-lg font-semibold text-gray-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Actions */}
        <div className="order-1 lg:order-2">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Complete Your Order
            </h2>

            {/* Show authentication benefits if user is guest */}
            {shouldShowAuthBenefits() && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">
                  Save time on future orders
                </h3>
                <p className="text-sm text-blue-700 mb-3">
                  Create an account to track orders, save addresses, and
                  checkout faster next time.
                </p>
                <button
                  onClick={() => openAuthModal("register")}
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                >
                  Create Account →
                </button>
              </div>
            )}

            {/* Show checkout button or payment form */}
            {!canProceedToPayment ? (
              <button
                onClick={handleCheckoutClick}
                disabled={loading}
                className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-colors ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                }`}
              >
                {loading ? "Processing..." : "Proceed to Checkout"}
              </button>
            ) : (
              <div>
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">
                    ✓ Ready to complete your order
                  </p>
                </div>

                <button
                  onClick={handlePayment}
                  className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  Complete Payment
                </button>

                <p className="mt-2 text-xs text-gray-500 text-center">
                  Secure payment powered by Stripe
                </p>
              </div>
            )}

            {/* Error display */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={closeAuthModal}
        mode={authMode}
        onSwitchMode={switchAuthMode}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onGuestCheckout={handleGuestCheckout}
        loading={loading}
        error={error}
      />
    </div>
  );
}
