"use client";

import React from 'react';
import { Check, CreditCard, Package, MapPin } from 'lucide-react';

interface CheckoutStepsProps {
  currentStep: number;
  onStepChange: (step: number) => void;
}

const steps = [
  { 
    id: 1, 
    name: 'Shipping', 
    icon: MapPin,
    description: 'Delivery information' 
  },
  { 
    id: 2, 
    name: 'Payment', 
    icon: CreditCard,
    description: 'Payment details' 
  },
  { 
    id: 3, 
    name: 'Review', 
    icon: Package,
    description: 'Confirm order' 
  },
];

export function CheckoutSteps({ currentStep, onStepChange }: CheckoutStepsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <nav aria-label="Progress">
        <ol className="flex items-center">
          {steps.map((step, stepIdx) => (
            <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''} flex-1`}>
              {/* Connector Line */}
              {stepIdx !== steps.length - 1 && (
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className={`h-0.5 w-full ${
                    step.id < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                </div>
              )}

              {/* Step Button */}
              <button
                onClick={() => onStepChange(step.id)}
                className={`relative w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                  step.id < currentStep
                    ? 'bg-blue-600 border-blue-600 hover:bg-blue-700'
                    : step.id === currentStep
                    ? 'border-blue-600 bg-white'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors`}
              >
                {step.id < currentStep ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <step.icon className={`w-4 h-4 ${
                    step.id === currentStep ? 'text-blue-600' : 'text-gray-500'
                  }`} />
                )}
              </button>

              {/* Step Info */}
              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-center min-w-max">
                <div className={`text-sm font-medium ${
                  step.id <= currentStep ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.name}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {step.description}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}