"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/contexts/CartContext";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const totalItems = itemCount;
  const pathname = usePathname();

  // Check if current path matches the link
  const isActivePage = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="bg-background border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-foreground">
            MyStore
          </Link>

          {/* Center Search Bar (Desktop) */}
          <div className="hidden lg:flex items-center flex-1 justify-center max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Desktop Navigation with Icons */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                isActivePage("/")
                  ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
                  : "text-foreground hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <svg
                className="h-5 w-5 mb-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span className="text-xs">Home</span>
              {isActivePage("/") && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
              )}
            </Link>

            <Link
              href="/products"
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                isActivePage("/products")
                  ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
                  : "text-foreground hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <svg
                className="h-5 w-5 mb-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <span className="text-xs">Products</span>
              {isActivePage("/products") && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
              )}
            </Link>

            <Link
              href="/cart"
              className={`flex flex-col items-center p-2 rounded-lg transition-colors relative ${
                isActivePage("/cart")
                  ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
                  : "text-foreground hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <div className="relative">
                <svg
                  className="h-5 w-5 mb-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13v5a2 2 0 002 2h6a2 2 0 002-2v-5m-8 0V9a2 2 0 012-2h4a2 2 0 012 2v4.01"
                  />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold min-w-4 h-4 rounded-full flex items-center justify-center px-1">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </div>
              <span className="text-xs">Cart</span>
              {isActivePage("/cart") && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
              )}
            </Link>

            <Link
              href="/checkout"
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                isActivePage("/checkout")
                  ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
                  : "text-foreground hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <svg
                className="h-5 w-5 mb-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              <span className="text-xs">Checkout</span>
              {isActivePage("/checkout") && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
              )}
            </Link>

            <Link
              href="/account"
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                isActivePage("/account")
                  ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
                  : "text-foreground hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <svg
                className="h-5 w-5 mb-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="text-xs">Account</span>
              {isActivePage("/account") && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
              )}
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 py-4">
            {/* Mobile Search */}
            <div className="px-2 mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            <nav className="flex flex-col space-y-2">
              <Link
                href="/"
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActivePage("/")
                    ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
                    : "text-foreground hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span>Home</span>
                {isActivePage("/") && (
                  <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
              </Link>

              <Link
                href="/products"
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActivePage("/products")
                    ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
                    : "text-foreground hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                <span>Products</span>
                {isActivePage("/products") && (
                  <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
              </Link>

              <Link
                href="/cart"
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActivePage("/cart")
                    ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
                    : "text-foreground hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="relative">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13v5a2 2 0 002 2h6a2 2 0 002-2v-5m-8 0V9a2 2 0 012-2h4a2 2 0 012 2v4.01"
                    />
                  </svg>
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold min-w-4 h-4 rounded-full flex items-center justify-center px-1">
                      {totalItems > 99 ? "99+" : totalItems}
                    </span>
                  )}
                </div>
                <span>Cart</span>
                {isActivePage("/cart") && (
                  <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
              </Link>

              <Link
                href="/account"
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActivePage("/account")
                    ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
                    : "text-foreground hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>Account</span>
                {isActivePage("/account") && (
                  <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
