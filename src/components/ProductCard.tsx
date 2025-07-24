"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

interface Product {
  id: string | number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  description?: string;
  category?: string;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  colors?: string[];
  sizes?: string[];
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  showBadge?: boolean;
  badgeText?: string;
  badgeColor?: string;
  compact?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  showBadge = false,
  badgeText = "NEW",
  badgeColor = "bg-green-500",
  compact = false,
}) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (!product.inStock && product.inStock !== undefined) return;

    // Add to cart context
    addItem({
      id: typeof product.id === "string" ? parseInt(product.id) : product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category || "uncategorized",
    });

    // Call custom handler if provided
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <span
        key={i}
        className={`text-sm ${
          i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  const calculateDiscountPercentage = () => {
    if (!product.originalPrice) return 0;
    return Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100
    );
  };

  if (compact) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 relative">
        {/* Badge */}
        {showBadge && (
          <div
            className={`absolute -top-2 -right-2 ${badgeColor} text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10`}
          >
            {badgeText}
          </div>
        )}

        {/* Discount Badge */}
        {product.originalPrice && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
            -{calculateDiscountPercentage()}%
          </div>
        )}

        {/* Out of Stock Overlay */}
        {product.inStock === false && (
          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center z-20">
            <span className="text-white font-bold text-sm">OUT OF STOCK</span>
          </div>
        )}

        <Link href={`/products/${product.id}`}>
          <div className="aspect-square bg-gray-700 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              width={200}
              height={200}
              className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-200"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                target.nextElementSibling!.textContent = "Image";
              }}
            />
            <span className="text-gray-400 text-sm hidden">Image</span>
          </div>
        </Link>

        <Link href={`/products/${product.id}`}>
          <h3 className="text-white font-medium text-sm mb-1 truncate hover:text-blue-400 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <p className="text-blue-400 font-semibold">
              ${product.price.toFixed(2)}
            </p>
            {product.originalPrice && (
              <p className="text-gray-500 text-xs line-through">
                ${product.originalPrice.toFixed(2)}
              </p>
            )}
          </div>
        </div>

        {product.rating && (
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="flex">{renderStars(product.rating)}</div>
              <span className="text-gray-400 text-xs ml-1">
                ({product.reviews || 0})
              </span>
            </div>
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.inStock === false}
          className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${
            product.inStock === false
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          }`}
        >
          {product.inStock === false ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105 relative">
      {/* Badge */}
      {showBadge && (
        <div
          className={`absolute -top-2 -right-2 ${badgeColor} text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10`}
        >
          {badgeText}
        </div>
      )}

      {/* Discount Badge */}
      {product.originalPrice && (
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          -{calculateDiscountPercentage()}%
        </div>
      )}

      {/* Out of Stock Overlay */}
      {product.inStock === false && (
        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center z-20">
          <span className="text-white font-bold">OUT OF STOCK</span>
        </div>
      )}

      {/* Product Image */}
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/images/placeholder.png"; // You should add a placeholder image
            }}
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Category */}
        {product.category && (
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            {product.category}
          </p>
        )}

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center mb-2">
            <div className="flex">{renderStars(product.rating)}</div>
            <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
              ({product.reviews || 0} reviews)
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            ${product.price.toFixed(2)}
          </p>
          {product.originalPrice && (
            <p className="text-sm text-gray-500 line-through">
              ${product.originalPrice.toFixed(2)}
            </p>
          )}
        </div>

        {/* Colors (if available) */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1 mb-3">
            <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
              Colors:
            </span>
            {product.colors.slice(0, 4).map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600"
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.inStock === false}
          className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
            product.inStock === false
              ? "bg-gray-400 text-gray-600 cursor-not-allowed"
              : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
          }`}
        >
          {product.inStock === false ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
