"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";
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

interface ProductDetailClientProps {
  product: Product;
}

const ProductDetailClient: React.FC<ProductDetailClientProps> = ({
  product,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const { addToCart } = useCart();

  // Set default selections
  React.useEffect(() => {
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      setSelectedColor(product.colors[0]);
    }
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product, selectedColor, selectedSize]);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await addToCart(
        {
          id: product.id.toString(),
          name: product.name,
          price: product.price,
          image: product.image,
        },
        quantity
      );

      // Show success message
      alert(`Added ${quantity} ${product.name} to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <span
        key={i}
        className={`text-lg ${
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
          <Link
            href="/"
            className="hover:text-blue-600 dark:hover:text-blue-400"
          >
            Home
          </Link>
          <span>/</span>
          <Link
            href="/products"
            className="hover:text-blue-600 dark:hover:text-blue-400"
          >
            Products
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white capitalize">
            {product.category}
          </span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              {/* Discount Badge */}
              {product.originalPrice && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full z-10">
                  -{calculateDiscountPercentage()}% OFF
                </div>
              )}

              {/* Out of Stock Overlay */}
              {product.inStock === false && (
                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center z-20">
                  <span className="text-white font-bold text-xl">
                    OUT OF STOCK
                  </span>
                </div>
              )}

              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/placeholder.png";
                }}
              />
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Category */}
            <div className="text-sm text-blue-600 dark:text-blue-400 uppercase tracking-wide font-medium">
              {product.category}
            </div>

            {/* Product Name */}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center space-x-2">
                <div className="flex">{renderStars(product.rating)}</div>
                <span className="text-gray-600 dark:text-gray-400">
                  ({product.reviews || 0} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              {product.originalPrice && (
                <div className="text-sm text-green-600 dark:text-green-400">
                  You save ${(product.originalPrice - product.price).toFixed(2)}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Description
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {product.description ||
                  "No description available for this product."}
              </p>
            </div>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Color: <span className="font-normal">{selectedColor}</span>
                </h3>
                <div className="flex space-x-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedColor === color
                          ? "border-blue-500 ring-2 ring-blue-200"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Size: <span className="font-normal">{selectedSize}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Quantity
              </h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-md flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
                  disabled={product.inStock === false || quantity <= 1}
                >
                  -
                </button>
                <span className="w-16 text-center font-medium text-gray-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-md flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
                  disabled={product.inStock === false}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={product.inStock === false || isAddingToCart}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-colors ${
                  product.inStock !== false && !isAddingToCart
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-400 text-gray-600 cursor-not-allowed"
                }`}
              >
                {isAddingToCart
                  ? "Adding to Cart..."
                  : product.inStock !== false
                  ? `Add to Cart - ${(product.price * quantity).toFixed(2)}`
                  : "Out of Stock"}
              </button>

              {product.inStock !== false && (
                <button className="w-full py-3 px-6 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  Add to Wishlist
                </button>
              )}
            </div>

            {/* Stock Status */}
            <div className="text-sm">
              {product.inStock !== false ? (
                <span className="text-green-600 dark:text-green-400">
                  ✓ In Stock
                </span>
              ) : (
                <span className="text-red-600 dark:text-red-400">
                  ✗ Out of Stock
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Simple Reviews Section */}
        {product.rating && product.reviews && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Customer Reviews
            </h2>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex">{renderStars(product.rating)}</div>
                <span className="text-xl font-semibold text-gray-900 dark:text-white">
                  {product.rating} out of 5
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  ({product.reviews} reviews)
                </span>
              </div>

              <div className="text-gray-600 dark:text-gray-400">
                <p className="italic">
                  "Great product! Exactly as described and arrived quickly.
                  Would definitely recommend to others."
                </p>
                <p className="text-sm mt-2">- Sample Customer Review</p>
              </div>
            </div>
          </div>
        )}

        {/* Related Products Preview */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Related Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products
              .filter(
                (p) => p.category === product.category && p.id !== product.id
              )
              .slice(0, 4)
              .map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/products/${relatedProduct.id}`}
                  className="block"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg mb-2 overflow-hidden">
                      <Image
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-medium text-sm text-gray-900 dark:text-white truncate">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 font-semibold">
                      ${relatedProduct.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailClient;
