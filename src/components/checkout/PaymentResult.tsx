"use client";

import React from "react";
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  ArrowLeft,
  Download,
  Mail,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface PaymentResultProps {
  success: boolean;
  error?: string | null;
  transactionId?: string;
  orderId?: string;
  canRetry: boolean;
  onRetry: () => void;
  onStartOver: () => void;
}

export function PaymentResult({
  success,
  error,
  transactionId,
  orderId,
  canRetry,
  onRetry,
  onStartOver,
}: PaymentResultProps) {
  const router = useRouter();

  if (success) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        {/* Success Message */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h2>
        <p className="text-gray-600 mb-6">
          Thank you for your order. We've sent a confirmation email with your
          order details.
        </p>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="space-y-2 text-sm">
            {orderId && (
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium text-gray-900">{orderId}</span>
              </div>
            )}
            {transactionId && (
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-medium text-gray-900">
                  {transactionId}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium text-green-600">Confirmed</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => router.push("/orders")}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            View Order Details
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => router.push("/")}
              className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Print Receipt
            </button>
          </div>
        </div>

        {/* What's Next */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start">
            <Mail className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
            <div className="text-left text-sm">
              <div className="font-medium text-blue-900">What's next?</div>
              <div className="text-blue-700 mt-1">
                We'll send you shipping updates via email. Your order will be
                processed within 1-2 business days.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Payment Failed
  return (
    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
      {/* Error Icon */}
      <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <XCircle className="w-10 h-10 text-red-600" />
      </div>

      {/* Error Message */}
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
      <p className="text-gray-600 mb-6">
        {error || "We were unable to process your payment. Please try again."}
      </p>

      {/* Error Details */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="text-sm text-red-800">
          <div className="font-medium mb-1">What went wrong?</div>
          <div>{error || "Payment processing failed"}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {canRetry && (
          <button
            onClick={onRetry}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center justify-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onStartOver}
            className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Start Over
          </button>

          <button
            onClick={() => router.push("/cart")}
            className="py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            Back to Cart
          </button>
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="text-sm">
          <div className="font-medium text-gray-900 mb-2">Need help?</div>
          <div className="text-gray-600">
            If you continue to experience issues, please contact our support
            team at{" "}
            <a
              href="mailto:support@example.com"
              className="text-blue-600 hover:text-blue-500"
            >
              support@example.com
            </a>{" "}
            or call (555) 123-4567.
          </div>
        </div>
      </div>
    </div>
  );
}
