"use client";

import React, { useState } from "react";
import { X, ShoppingCart, User, Clock, Shield } from "lucide-react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { GuestCheckoutForm } from "./GuestCheckoutForm";
import { GuestCheckoutData } from "@/types/auth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "login" | "register" | "guest";
  onSwitchMode: (mode: "login" | "register" | "guest") => void;
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (email: string, password: string, name: string) => Promise<void>;
  onGuestCheckout: (guestData: GuestCheckoutData) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export function AuthModal({
  isOpen,
  onClose,
  mode,
  onSwitchMode,
  onLogin,
  onRegister,
  onGuestCheckout,
  loading = false,
  error = null,
}: AuthModalProps) {
  if (!isOpen) return null;

  const renderAuthBenefits = () => (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <h4 className="font-medium text-gray-900 mb-3">Why create an account?</h4>
      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2 text-blue-500" />
          Faster checkout for future orders
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <ShoppingCart className="w-4 h-4 mr-2 text-blue-500" />
          Track your order history
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <User className="w-4 h-4 mr-2 text-blue-500" />
          Save multiple addresses
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Shield className="w-4 h-4 mr-2 text-blue-500" />
          Secure account protection
        </div>
      </div>
    </div>
  );

  const renderModeSelector = () => {
    if (mode === "guest") {
      return (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            How would you like to checkout?
          </h3>
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => onSwitchMode("guest")}
              className={`p-4 border rounded-lg text-left transition-colors ${
                mode === "guest"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="font-medium text-gray-900">Continue as Guest</div>
              <div className="text-sm text-gray-600">
                Quick checkout, no account needed
              </div>
            </button>

            <button
              onClick={() => onSwitchMode("login")}
              className="p-4 border border-gray-200 rounded-lg text-left hover:border-gray-300 transition-colors"
            >
              <div className="font-medium text-gray-900">Login to Account</div>
              <div className="text-sm text-gray-600">
                Access saved addresses and order history
              </div>
            </button>

            <button
              onClick={() => onSwitchMode("register")}
              className="p-4 border border-gray-200 rounded-lg text-left hover:border-gray-300 transition-colors"
            >
              <div className="font-medium text-gray-900">Create Account</div>
              <div className="text-sm text-gray-600">
                Save time on future orders
              </div>
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderContent = () => {
    switch (mode) {
      case "login":
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Login to Your Account
              </h3>
              <button
                onClick={() => onSwitchMode("guest")}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                ← Back to options
              </button>
            </div>

            <LoginForm
              onSubmit={onLogin}
              loading={loading}
              error={error}
              onSwitchToRegister={() => onSwitchMode("register")}
            />

            <div className="mt-4 text-center">
              <span className="text-sm text-gray-600">
                Don't have an account?{" "}
              </span>
              <button
                onClick={() => onSwitchMode("register")}
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                Sign up
              </button>
            </div>
          </div>
        );

      case "register":
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Create Your Account
              </h3>
              <button
                onClick={() => onSwitchMode("guest")}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                ← Back to options
              </button>
            </div>

            {renderAuthBenefits()}

            <RegisterForm
              onSubmit={onRegister}
              loading={loading}
              error={error}
              onSwitchToLogin={() => onSwitchMode("login")}
            />

            <div className="mt-4 text-center">
              <span className="text-sm text-gray-600">
                Already have an account?{" "}
              </span>
              <button
                onClick={() => onSwitchMode("login")}
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                Sign in
              </button>
            </div>
          </div>
        );

      case "guest":
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Guest Checkout
            </h3>

            <GuestCheckoutForm
              onSubmit={onGuestCheckout}
              loading={loading}
              error={error}
            />

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-800">
                <strong>Want to save time next time?</strong>
                <div className="mt-1">
                  Create an account after checkout to track your order and save
                  your preferences.
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return renderModeSelector();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Checkout</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
