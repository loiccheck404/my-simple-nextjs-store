"use client";

import React, { useState } from "react";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [registerForm, setRegisterForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const validateLoginForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!loginForm.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(loginForm.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!loginForm.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegisterForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!registerForm.firstName) {
      newErrors.firstName = "First name is required";
    }

    if (!registerForm.lastName) {
      newErrors.lastName = "Last name is required";
    }

    if (!registerForm.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(registerForm.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!registerForm.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(registerForm.password)) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    if (!registerForm.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (registerForm.password !== registerForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!registerForm.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = async () => {
    if (!validateLoginForm()) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Login form submitted:", loginForm);
      setIsLoading(false);
      // Here you would typically call your authentication API
      alert("Login functionality would be implemented here!");
    }, 1000);
  };

  const handleRegisterSubmit = async () => {
    if (!validateRegisterForm()) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Register form submitted:", registerForm);
      setIsLoading(false);
      // Here you would typically call your registration API
      alert("Registration functionality would be implemented here!");
    }, 1000);
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setRegisterForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome to My Store
          </h1>
          <p className="text-gray-400">
            {activeTab === "login"
              ? "Sign in to your account"
              : "Create your account"}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-gray-800 rounded-lg p-1 mb-6">
          <button
            onClick={() => {
              setActiveTab("login");
              setErrors({});
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === "login"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setActiveTab("register");
              setErrors({});
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === "register"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Forms Container */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-700">
          {activeTab === "login" ? (
            // Login Form
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  className={`w-full px-4 py-3 rounded-lg bg-gray-700 border text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  className={`w-full px-4 py-3 rounded-lg bg-gray-700 border text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={loginForm.rememberMe}
                    onChange={handleLoginChange}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-gray-300">
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <button
                onClick={handleLoginSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>

              {/* Social Login Options */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-800 text-gray-400">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-600 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm font-medium text-gray-300 hover:text-white transition-all duration-200"
                  >
                    <span className="mr-2">📧</span>
                    Google
                  </button>
                  <button
                    type="button"
                    className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-600 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm font-medium text-gray-300 hover:text-white transition-all duration-200"
                  >
                    <span className="mr-2">📘</span>
                    Facebook
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Register Form
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={registerForm.firstName}
                    onChange={handleRegisterChange}
                    className={`w-full px-4 py-3 rounded-lg bg-gray-700 border text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.firstName
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    placeholder="First name"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={registerForm.lastName}
                    onChange={handleRegisterChange}
                    className={`w-full px-4 py-3 rounded-lg bg-gray-700 border text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.lastName
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    placeholder="Last name"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="registerEmail"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="registerEmail"
                  name="email"
                  value={registerForm.email}
                  onChange={handleRegisterChange}
                  className={`w-full px-4 py-3 rounded-lg bg-gray-700 border text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="registerPassword"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="registerPassword"
                  name="password"
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                  className={`w-full px-4 py-3 rounded-lg bg-gray-700 border text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  placeholder="Create a password (min. 8 characters)"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={registerForm.confirmPassword}
                  onChange={handleRegisterChange}
                  className={`w-full px-4 py-3 rounded-lg bg-gray-700 border text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.confirmPassword
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-400 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={registerForm.agreeToTerms}
                    onChange={handleRegisterChange}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2 mt-1"
                  />
                  <span className="ml-2 text-sm text-gray-300">
                    I agree to the{" "}
                    <button
                      type="button"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      Privacy Policy
                    </button>
                  </span>
                </label>
                {errors.agreeToTerms && (
                  <p className="mt-1 text-sm text-red-400 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.agreeToTerms}
                  </p>
                )}
              </div>

              <button
                onClick={handleRegisterSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            {activeTab === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
            <button
              onClick={() =>
                setActiveTab(activeTab === "login" ? "register" : "login")
              }
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              {activeTab === "login" ? "Create one here" : "Sign in instead"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
