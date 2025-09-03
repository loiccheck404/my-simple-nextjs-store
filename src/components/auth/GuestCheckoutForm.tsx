'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Building } from 'lucide-react';
import { GuestCheckoutData } from '@/types/auth';

interface GuestCheckoutFormProps {
  onSubmit: (guestData: GuestCheckoutData) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export function GuestCheckoutForm({ 
  onSubmit, 
  loading = false, 
  error = null 
}: GuestCheckoutFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    phoneNumber: '',
    shippingAddress: {
      street: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
    },
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [createAccount, setCreateAccount] = useState(false);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone validation (optional but if provided, should be valid)
    if (formData.phoneNumber && !/^\+?[\d\s\-\(\)]+$/.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }

    // Shipping address validation
    if (!formData.shippingAddress.street.trim()) {
      errors.street = 'Street address is required';
    }

    if (!formData.shippingAddress.city.trim()) {
      errors.city = 'City is required';
    }

    if (!formData.shippingAddress.state.trim()) {
      errors.state = 'State/Province is required';
    }

    if (!formData.shippingAddress.zipCode.trim()) {
      errors.zipCode = 'ZIP/Postal code is required';
    }

    if (!formData.shippingAddress.country) {
      errors.country = 'Country is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const guestData: GuestCheckoutData = {
        email: formData.email,
        phoneNumber: formData.phoneNumber || undefined,
        shippingAddress: {
          street: formData.shippingAddress.street.trim(),
          apartment: formData.shippingAddress.apartment.trim() || undefined,
          city: formData.shippingAddress.city.trim(),
          state: formData.shippingAddress.state.trim(),
          zipCode: formData.shippingAddress.zipCode.trim(),
          country: formData.shippingAddress.country,
        },
      };

      await onSubmit(guestData);
    } catch (error) {
      console.error('Guest checkout error:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('shippingAddress.')) {
      const addressField = field.replace('shippingAddress.', '');
      setFormData(prev => ({
        ...prev,
        shippingAddress: {
          ...prev.shippingAddress,
          [addressField]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear field error when user starts typing
    if (formErrors[field.replace('shippingAddress.', '')]) {
      const errorKey = field.replace('shippingAddress.', '');
      setFormErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IT', name: 'Italy' },
    { code: 'ES', name: 'Spain' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'SE', name: 'Sweden' },
  ];

  const usStates = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact Information */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h4>
        
        <div className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                }`}
                placeholder="your@email.com"
                disabled={loading}
                autoComplete="email"
              />
            </div>
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              We'll send your order confirmation here
            </p>
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="phone"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.phoneNumber ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                }`}
                placeholder="+1 (555) 123-4567"
                disabled={loading}
                autoComplete="tel"
              />
            </div>
            {formErrors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">{formErrors.phoneNumber}</p>
            )}
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h4>
        
        <div className="space-y-4">
          {/* Street Address */}
          <div>
            <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
              Street Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="street"
                type="text"
                value={formData.shippingAddress.street}
                onChange={(e) => handleInputChange('shippingAddress.street', e.target.value)}
                className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.street ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                }`}
                placeholder="123 Main Street"
                disabled={loading}
                autoComplete="street-address"
              />
            </div>
            {formErrors.street && (
              <p className="mt-1 text-sm text-red-600">{formErrors.street}</p>
            )}
          </div>

          {/* Apartment/Unit */}
          <div>
            <label htmlFor="apartment" className="block text-sm font-medium text-gray-700 mb-1">
              Apartment, Suite, Unit (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="apartment"
                type="text"
                value={formData.shippingAddress.apartment}
                onChange={(e) => handleInputChange('shippingAddress.apartment', e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Apt 4B, Suite 200, etc."
                disabled={loading}
                autoComplete="address-line2"
              />
            </div>
          </div>

          {/* City and State/Province */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                id="city"
                type="text"
                value={formData.shippingAddress.city}
                onChange={(e) => handleInputChange('shippingAddress.city', e.target.value)}
                className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.city ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                }`}
                placeholder="New York"
                disabled={loading}
                autoComplete="address-level2"
              />
              {formErrors.city && (
                <p className="mt-1 text-sm text-red-600">{formErrors.city}</p>
              )}
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                {formData.shippingAddress.country === 'US' ? 'State *' : 'State/Province *'}
              </label>
              {formData.shippingAddress.country === 'US' ? (
                <select
                  id="state"
                  value={formData.shippingAddress.state}
                  onChange={(e) => handleInputChange('shippingAddress.state', e.target.value)}
                  className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.state ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                  }`}
                  disabled={loading}
                  autoComplete="address-level1"
                >
                  <option value="">Select State</option>
                  {usStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              ) : (
                <input
                  id="state"
                  type="text"
                  value={formData.shippingAddress.state}
                  onChange={(e) => handleInputChange('shippingAddress.state', e.target.value)}
                  className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.state ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="State/Province"
                  disabled={loading}
                  autoComplete="address-level1"
                />
              )}
              {formErrors.state && (
                <p className="mt-1 text-sm text-red-600">{formErrors.state}</p>
              )}
            </div>
          </div>

          {/* ZIP Code and Country */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                {formData.shippingAddress.country === 'US' ? 'ZIP Code *' : 'Postal Code *'}
              </label>
              <input
                id="zipCode"
                type="text"
                value={formData.shippingAddress.zipCode}
                onChange={(e) => handleInputChange('shippingAddress.zipCode', e.target.value)}
                className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.zipCode ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                }`}
                placeholder={formData.shippingAddress.country === 'US' ? '10001' : 'Postal Code'}
                disabled={loading}
                autoComplete="postal-code"
              />
              {formErrors.zipCode && (
                <p className="mt-1 text-sm text-red-600">{formErrors.zipCode}</p>
              )}
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Country *
              </label>
              <select
                id="country"
                value={formData.shippingAddress.country}
                onChange={(e) => handleInputChange('shippingAddress.country', e.target.value)}
                className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.country ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
                autoComplete="country"
              >
                {countries.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
              {formErrors.country && (
                <p className="mt-1 text-sm text-red-600">{formErrors.country}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Account Option */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="createAccount"
              type="checkbox"
              checked={createAccount}
              onChange={(e) => setCreateAccount(e.target.checked)}
              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              disabled={loading}
            />
          </div>
          <div className="ml-3">
            <label htmlFor="createAccount" className="text-sm font-medium text-gray-700">
              Create an account for faster checkout next time
            </label>
            <p className="text-sm text-gray-500">
              Save your information and track your orders
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-colors ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        }`}
      >
        {loading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Processing...
          </div>
        ) : (
          'Continue to Payment'
        )}
      </button>

      {/* Security Notice */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          Your information is secure and encrypted. We never store payment details.
        </p>
      </div>
    </form>
  );
}