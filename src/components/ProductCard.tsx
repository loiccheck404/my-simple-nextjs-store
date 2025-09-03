"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/lib/api";
import LoadingSpinner from "./LoadingSpinner";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
  className?: string;
  showAddToCart?: boolean;
  variant?: "default" | "compact" | "detailed";
}

export default function ProductCard({
  product,
  className = "",
  showAddToCart = true,
  variant = "default",
}: ProductCardProps) {
  const router = useRouter();
  const {
    addToCart,
    getItemQuantity,
    isInCart,
    loading: cartLoading,
  } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [imageError, setImageError] = useState(false);

  const itemQuantity = getItemQuantity(product.id);
  const inCart = isInCart(product.id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking add to cart

    if (isAddingToCart || cartLoading) return;

    try {
      setIsAddingToCart(true);
      await addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });

      // Show success feedback
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      // Error is handled by the cart context
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleCardClick = () => {
    router.push(`/products/${product.id}`);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className="text-yellow-400">
        {i < Math.floor(rating) ? "⭐" : "☆"}
      </span>
    ));
  };

  const getDiscountPercentage = () => {
    if (!product.originalPrice || product.originalPrice <= product.price)
      return 0;
    return Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100
    );
  };

  const discountPercentage = getDiscountPercentage();

  // Compact variant for grids
  if (variant === "compact") {
    return (
      <div
        className={`bg-gray-800 rounded-lg p-3 hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 cursor-pointer ${className}`}
        onClick={handleCardClick}
      >
        <div className="aspect-square bg-gray-700 rounded-lg mb-2 flex items-center justify-center overflow-hidden relative">
          {!imageError && product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
              loading="lazy"
              onError={handleImageError}
            />
          ) : (
            <span className="text-gray-400 text-xs">No Image</span>
          )}

          {discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{discountPercentage}%
            </div>
          )}

          {product.stock !== undefined && product.stock < 5 && (
            <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {product.stock === 0 ? "Out of Stock" : `${product.stock} left`}
            </div>
          )}
        </div>

        <h3
          className="text-white font-medium text-sm mb-1 truncate"
          title={product.name}
        >
          {product.name}
        </h3>

        <div className="flex justify-between items-center mb-2">
          <div>
            <p className="text-blue-400 font-semibold text-sm">
              ${product.price}
            </p>
            {product.originalPrice && product.originalPrice > product.price && (
              <p className="text-gray-500 text-xs line-through">
                ${product.originalPrice}
              </p>
            )}
          </div>
        </div>

        {product.rating && (
          <div className="flex items-center justify-between text-xs">
            <div className="flex">{renderStars(product.rating)}</div>
            <span className="text-gray-400">({product.reviews || 0})</span>
          </div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div
      className={`bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer ${className}`}
      onClick={handleCardClick}
    >
      <div className="relative aspect-square bg-gray-700 flex items-center justify-center overflow-hidden">
        {!imageError && product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={handleImageError}
          />
        ) : (
          <div className="text-gray-400 text-center">
            <div className="text-4xl mb-2">📦</div>
            <span className="text-sm">No Image Available</span>
          </div>
        )}

        {/* Discount badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
            -{discountPercentage}% OFF
          </div>
        )}

        {/* Stock status */}
        {product.stock !== undefined && product.stock < 5 && (
          <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
            {product.stock === 0
              ? "Out of Stock"
              : `Only ${product.stock} left`}
          </div>
        )}

        {/* Quick add to cart button */}
        {showAddToCart && product.stock !== 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform scale-90 hover:scale-100 disabled:opacity-50"
            >
              {isAddingToCart ? (
                <LoadingSpinner size="small" color="white" />
              ) : (
                "Quick Add"
              )}
            </button>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3
            className="text-white font-semibold text-lg leading-tight flex-1 mr-2"
            title={product.name}
          >
            {product.name}
          </h3>
          {inCart && (
            <div className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
              {itemQuantity} in cart
            </div>
          )}
        </div>

        {product.description && (
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400 font-bold text-xl">
                ${product.price}
              </span>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <span className="text-gray-500 text-sm line-through">
                    ${product.originalPrice}
                  </span>
                )}
            </div>
            {product.category && (
              <span className="text-gray-500 text-xs uppercase tracking-wide">
                {product.category}
              </span>
            )}
          </div>
        </div>

        {/* Rating and reviews */}
        {product.rating && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1">
              <div className="flex text-sm">{renderStars(product.rating)}</div>
              <span className="text-gray-400 text-sm ml-1">
                {product.rating.toFixed(1)}
              </span>
            </div>
            {product.reviews && (
              <span className="text-gray-500 text-sm">
                {product.reviews} review{product.reviews !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        )}

        {/* Add to cart button */}
        {showAddToCart && (
          <div className="space-y-2">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || product.stock === 0}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                showSuccess
                  ? "bg-green-600 text-white"
                  : product.stock === 0
                  ? "bg-gray-600 text-gray-400"
                  : inCart
                  ? "bg-orange-600 hover:bg-orange-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {isAddingToCart ? (
                <div className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="small" color="white" />
                  <span>Adding...</span>
                </div>
              ) : showSuccess ? (
                <div className="flex items-center justify-center gap-2">
                  <span>✓</span>
                  <span>Added to Cart!</span>
                </div>
              ) : product.stock === 0 ? (
                "Out of Stock"
              ) : inCart ? (
                `Add More (${itemQuantity} in cart)`
              ) : (
                "Add to Cart"
              )}
            </button>

            {/* Quick action buttons */}
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Add to wishlist functionality
                }}
                className="flex-1 py-2 px-3 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg transition-colors text-sm"
              >
                ♡ Wishlist
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Quick view functionality
                }}
                className="flex-1 py-2 px-3 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg transition-colors text-sm"
              >
                👁 Quick View
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
