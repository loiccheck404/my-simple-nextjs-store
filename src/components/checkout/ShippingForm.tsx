"use client";

import React, { useState } from "react";
import { MapPin, Package } from "lucide-react";

// Define proper interfaces
interface Address {
  street: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface ShippingFormData {
  shippingAddress: Address;
  billingAddress: Address;
  sameBillingAddress: boolean;
  shippingMethod: string;
}

interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface ShippingFormProps {
  initialData?: Partial<ShippingFormData>;
  onSubmit: (data: ShippingFormData) => void;
}

export function ShippingForm({ initialData, onSubmit }: ShippingFormProps) {
  const [formData, setFormData] = useState<ShippingFormData>({
    shippingAddress: {
      street: initialData?.shippingAddress?.street || "",
      apartment: initialData?.shippingAddress?.apartment || "",
      city: initialData?.shippingAddress?.city || "",
      state: initialData?.shippingAddress?.state || "",
      zipCode: initialData?.shippingAddress?.zipCode || "",
      country: initialData?.shippingAddress?.country || "US",
    },
    billingAddress: {
      street: initialData?.billingAddress?.street || "",
      apartment: initialData?.billingAddress?.apartment || "",
      city: initialData?.billingAddress?.city || "",
      state: initialData?.billingAddress?.state || "",
      zipCode: initialData?.billingAddress?.zipCode || "",
      country: initialData?.billingAddress?.country || "US",
    },
    sameBillingAddress: initialData?.sameBillingAddress ?? true,
    shippingMethod: initialData?.shippingMethod || "standard",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const shippingMethods: ShippingMethod[] = [
    {
      id: "standard",
      name: "Standard Shipping",
      description: "5-7 business days",
      price: 5.99,
    },
    {
      id: "express",
      name: "Express Shipping",
      description: "2-3 business days",
      price: 12.99,
    },
    {
      id: "overnight",
      name: "Overnight Shipping",
      description: "Next business day",
      price: 24.99,
    },
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate shipping address
    if (!formData.shippingAddress.street.trim()) {
      newErrors.shippingStreet = "Street address is required";
    }
    if (!formData.shippingAddress.city.trim()) {
      newErrors.shippingCity = "City is required";
    }
    if (!formData.shippingAddress.state.trim()) {
      newErrors.shippingState = "State is required";
    }
    if (!formData.shippingAddress.zipCode.trim()) {
      newErrors.shippingZipCode = "ZIP code is required";
    }

    // Validate billing address if different
    if (!formData.sameBillingAddress) {
      if (!formData.billingAddress.street.trim()) {
        newErrors.billingStreet = "Street address is required";
      }
      if (!formData.billingAddress.city.trim()) {
        newErrors.billingCity = "City is required";
      }
      if (!formData.billingAddress.state.trim()) {
        newErrors.billingState = "State is required";
      }
      if (!formData.billingAddress.zipCode.trim()) {
        newErrors.billingZipCode = "ZIP code is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    const submitData: ShippingFormData = {
      ...formData,
      billingAddress: formData.sameBillingAddress
        ? formData.shippingAddress
        : formData.billingAddress,
    };

    onSubmit(submitData);
  };

  const handleAddressChange = (
    type: "shipping" | "billing",
    field: keyof Address,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [`${type}Address`]: {
        ...prev[`${type}Address`],
        [field]: value,
      },
    }));

    // Clear errors
    const errorKey = `${type}${field.charAt(0).toUpperCase() + field.slice(1)}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Shipping Address */}
      <div>
        <div className="flex items-center mb-4">
          <MapPin className="w-5 h-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">
            Shipping Address
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address *
            </label>
            <input
              type="text"
              value={formData.shippingAddress.street}
              onChange={(e) =>
                handleAddressChange("shipping", "street", e.target.value)
              }
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.shippingStreet ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="123 Main Street"
            />
            {errors.shippingStreet && (
              <p className="mt-1 text-sm text-red-600">
                {errors.shippingStreet}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Apartment, Suite, etc. (Optional)
            </label>
            <input
              type="text"
              value={formData.shippingAddress.apartment}
              onChange={(e) =>
                handleAddressChange("shipping", "apartment", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Apt 4B"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                value={formData.shippingAddress.city}
                onChange={(e) =>
                  handleAddressChange("shipping", "city", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.shippingCity ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="New York"
              />
              {errors.shippingCity && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.shippingCity}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State *
              </label>
              <input
                type="text"
                value={formData.shippingAddress.state}
                onChange={(e) =>
                  handleAddressChange("shipping", "state", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.shippingState ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="NY"
              />
              {errors.shippingState && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.shippingState}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ZIP Code *
              </label>
              <input
                type="text"
                value={formData.shippingAddress.zipCode}
                onChange={(e) =>
                  handleAddressChange("shipping", "zipCode", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.shippingZipCode ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="10001"
              />
              {errors.shippingZipCode && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.shippingZipCode}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country *
              </label>
              <select
                value={formData.shippingAddress.country}
                onChange={(e) =>
                  handleAddressChange("shipping", "country", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Method */}
      <div>
        <div className="flex items-center mb-4">
          <Package className="w-5 h-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Shipping Method</h3>
        </div>

        <div className="space-y-3">
          {shippingMethods.map((method) => (
            <label
              key={method.id}
              className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                formData.shippingMethod === method.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
            >
              <input
                type="radio"
                name="shippingMethod"
                value={method.id}
                checked={formData.shippingMethod === method.id}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    shippingMethod: e.target.value,
                  }))
                }
                className="sr-only"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-900">
                      {method.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {method.description}
                    </div>
                  </div>
                  <div className="text-lg font-medium text-gray-900">
                    ${method.price.toFixed(2)}
                  </div>
                </div>
              </div>
              {formData.shippingMethod === method.id && (
                <div className="ml-4 w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Billing Address Toggle */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center">
          <input
            id="sameBillingAddress"
            type="checkbox"
            checked={formData.sameBillingAddress}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                sameBillingAddress: e.target.checked,
              }))
            }
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="sameBillingAddress"
            className="ml-2 text-sm text-gray-700"
          >
            Billing address is the same as shipping address
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-6">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Continue to Payment
        </button>
      </div>
    </form>
  );
}
