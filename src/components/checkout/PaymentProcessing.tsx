"use client";

import React, { useEffect, useState } from "react";
import { CreditCard, Shield, CheckCircle } from "lucide-react";

export function PaymentProcessing() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { id: 1, text: "Validating payment information...", icon: CreditCard },
    { id: 2, text: "Processing payment...", icon: Shield },
    { id: 3, text: "Confirming transaction...", icon: CheckCircle },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 800);

    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <div className="text-center">
        {/* Main Loading Animation */}
        <div className="mx-auto w-16 h-16 mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Processing Your Payment
        </h2>
        <p className="text-gray-600 mb-8">
          Please don't close this window or refresh the page
        </p>

        {/* Processing Steps */}
        <div className="max-w-md mx-auto space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div
                key={step.id}
                className={`flex items-center p-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-blue-50 border border-blue-200"
                    : isCompleted
                    ? "bg-green-50 border border-green-200"
                    : "bg-gray-50 border border-gray-200"
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    isActive
                      ? "bg-blue-100"
                      : isCompleted
                      ? "bg-green-100"
                      : "bg-gray-100"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Icon
                      className={`w-5 h-5 ${
                        isActive ? "text-blue-600" : "text-gray-400"
                      }`}
                    />
                  )}
                </div>

                <div className="ml-3 text-left">
                  <p
                    className={`text-sm font-medium ${
                      isActive
                        ? "text-blue-900"
                        : isCompleted
                        ? "text-green-900"
                        : "text-gray-500"
                    }`}
                  >
                    {step.text}
                  </p>
                </div>

                {isActive && (
                  <div className="ml-auto">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-200 border-t-blue-600"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Security Message */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center text-sm text-gray-600">
            <Shield className="w-4 h-4 mr-2" />
            <span>Your transaction is secured with 256-bit SSL encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}
