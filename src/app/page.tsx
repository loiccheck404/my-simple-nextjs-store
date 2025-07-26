// app/page.tsx - Updated home page with API integration

// app/page.tsx - Updated home page with API integration

"use client";

import { useProducts } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import { useState, useEffect } from "react";

export default function Home() {
  const [featuredProductsData, setFeaturedProductsData] = useState(null);
  const [newArrivalsData, setNewArrivalsData] = useState(null);

  // Fetch new arrivals (most recent products)
  const {
    data: newArrivalsResponse,
    loading: newArrivalsLoading,
    error: newArrivalsError,
    refetch: refetchNewArrivals,
  } = useProducts({
    sortBy: "name",
    sortOrder: "desc",
    limit: 4,
  });

  // Fetch featured products
  const {
    data: featuredResponse,
    loading: featuredLoading,
    error: featuredError,
    refetch: refetchFeatured,
  } = useProducts({
    limit: 6,
    // 'featured' property removed because it's not supported by the type
  });

  // Fetch additional products for "More Featured" section
  const {
    data: moreProductsResponse,
    loading: moreProductsLoading,
    error: moreProductsError,
  } = useProducts({
    limit: 8,
    page: 2,
  });

  const newArrivals = newArrivalsResponse?.products || [];
  // If you want to filter featured products, do it here (assuming product.featured exists)
  // No 'featured' property exists, so just use all products for featured section
  const featuredProducts = featuredResponse?.products || [];
  const moreProducts = moreProductsResponse?.products || [];

  // Calculate category data dynamically
  const [categoriesData, setCategoriesData] = useState([
    {
      id: 1,
      name: "Apparel",
      description: "T-Shirts, Jeans & More",
      icon: "👕",
      gradient: "from-blue-600 to-blue-800",
      hoverGradient: "hover:from-blue-500 hover:to-blue-700",
      iconBg: "bg-blue-500/30",
      textColor: "text-blue-200",
      productCount: 0,
    },
    {
      id: 2,
      name: "Footwear",
      description: "Sneakers & Accessories",
      icon: "👟",
      gradient: "from-purple-600 to-purple-800",
      hoverGradient: "hover:from-purple-500 hover:to-purple-700",
      iconBg: "bg-purple-500/30",
      textColor: "text-purple-200",
      productCount: 0,
    },
    {
      id: 3,
      name: "Accessories",
      description: "Caps, Hats & Socks",
      icon: "🧢",
      gradient: "from-green-600 to-green-800",
      hoverGradient: "hover:from-green-500 hover:to-green-700",
      iconBg: "bg-green-500/30",
      textColor: "text-green-200",
      productCount: 0,
    },
  ]);

  // Update category counts when products are loaded
  useEffect(() => {
    if (featuredProducts.length > 0) {
      setCategoriesData((prev) =>
        prev.map((category) => ({
          ...category,
          productCount: featuredProducts.filter(
            (product) =>
              product.category.toLowerCase() === category.name.toLowerCase()
          ).length,
        }))
      );
    }
  }, [featuredProducts]);

  // Global loading state
  const isLoading = newArrivalsLoading || featuredLoading;

  // Global error handling
  const hasError = newArrivalsError || featuredError;

  const handleRetry = () => {
    if (newArrivalsError) refetchNewArrivals();
    if (featuredError) refetchFeatured();
  };

  if (isLoading && newArrivals.length === 0 && featuredProducts.length === 0) {
    return (
      <main className="max-w-6xl mx-auto p-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="large" />
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-4">
      {/* Error Message */}
      {hasError && (
        <div className="mb-6">
          <ErrorMessage
            message={
              newArrivalsError || featuredError || "Failed to load products"
            }
            onRetry={handleRetry}
          />
        </div>
      )}

      {/* Hero Section */}
      <section className="mb-16">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20"></div>
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-red-500 bg-clip-text text-transparent">
              Welcome to My Stores!
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Discover premium quality products with the CITZ standard. From
              stylish apparel to trendy accessories, find everything you need to
              express your unique style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => (window.location.href = "/products")}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Shop Now
              </button>
              <button
                onClick={() => (window.location.href = "/products")}
                className="border border-gray-500 hover:border-gray-300 px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-gray-800"
              >
                View Collection
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 px-4 py-2 rounded-full mb-4">
            <span className="text-2xl">✨</span>
            <span className="text-green-400 font-semibold text-sm uppercase tracking-wide">
              New Arrivals
            </span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Just Landed</h2>
          <p className="text-gray-400">Fresh picks added to our collection</p>
        </div>

        {newArrivalsLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-800 rounded-lg aspect-square mb-4"></div>
                <div className="bg-gray-700 h-4 rounded mb-2"></div>
                <div className="bg-gray-700 h-4 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : newArrivalsError ? (
          <ErrorMessage
            message="Failed to load new arrivals"
            onRetry={refetchNewArrivals}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <div key={product.id} className="relative">
                <ProductCard product={product} />
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                  NEW
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products Section */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Featured Products
          </h2>
          <p className="text-gray-400">Handpicked items just for you</p>
        </div>

        {featuredLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-800 rounded-lg aspect-square mb-4"></div>
                <div className="bg-gray-700 h-4 rounded mb-2"></div>
                <div className="bg-gray-700 h-4 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : featuredError ? (
          <ErrorMessage
            message="Failed to load featured products"
            onRetry={refetchFeatured}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* More Featured Products Section */}
      {!moreProductsLoading && moreProducts.length > 0 && (
        <section className="mb-16">
          <div className="bg-gray-900 rounded-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                More Amazing Products
              </h2>
              <p className="text-gray-400">Explore our complete collection</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {moreProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  onClick={() =>
                    (window.location.href = `/products/${product.id}`)
                  }
                >
                  <div className="aspect-square bg-gray-700 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">No Image</span>
                    )}
                  </div>
                  <h3 className="text-white font-medium text-sm mb-1 truncate">
                    {product.name}
                  </h3>
                  <div className="flex justify-between items-center">
                    <p className="text-blue-400 font-semibold">
                      ${product.price}
                    </p>
                    {product.originalPrice && (
                      <p className="text-gray-500 text-xs line-through">
                        ${product.originalPrice}
                      </p>
                    )}
                  </div>
                  {product.rating && (
                    <div className="flex items-center mt-2">
                      <div className="flex text-yellow-400 text-xs">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>
                            {i < Math.floor(product.rating || 0) ? "⭐" : "☆"}
                          </span>
                        ))}
                      </div>
                      <span className="text-gray-400 text-xs ml-1">
                        ({product.reviews || 0})
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={() => (window.location.href = "/products")}
                className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                View All Products
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Shop by Category
          </h2>
          <p className="text-gray-400">Explore our diverse collection</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {categoriesData.map((category) => (
            <div
              key={category.id}
              className={`bg-gradient-to-br ${category.gradient} rounded-lg p-6 text-center ${category.hoverGradient} transition-all duration-300 cursor-pointer transform hover:scale-105 shadow-lg hover:shadow-xl`}
              onClick={() =>
                (window.location.href = `/products?category=${category.name.toLowerCase()}`)
              }
            >
              <div
                className={`w-20 h-20 ${category.iconBg} rounded-full mx-auto mb-4 flex items-center justify-center`}
              >
                <div className="text-4xl">{category.icon}</div>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">
                {category.name}
              </h3>
              <p className={`${category.textColor} text-sm mb-2`}>
                {category.description}
              </p>
              <p className="text-white/70 text-xs">
                {category.productCount} items
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Special Offers Section */}
      <section className="mb-16">
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-4">
              <span className="text-xl">🔥</span>
              <span className="font-semibold text-sm uppercase tracking-wide">
                Limited Time
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-4">Special Offers</h2>
            <p className="text-xl text-orange-100 mb-6 max-w-2xl mx-auto">
              Don't miss out on amazing deals! Get up to 50% off on selected
              items.
            </p>
            <button
              onClick={() => (window.location.href = "/products?sale=true")}
              className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Shop Deals
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="mb-12">
        <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Stay Updated</h2>
            <p className="text-gray-400 mb-6">
              Subscribe to get notified about new products and exclusive offers
            </p>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </main>
  );
}

// Newsletter form component with API integration
function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage("");

    try {
      // Replace with your newsletter API endpoint
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage("Thanks for subscribing!");
        setIsSuccess(true);
        setEmail("");
      } else {
        throw new Error("Failed to subscribe");
      }
    } catch (error) {
      setMessage("Failed to subscribe. Please try again.");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Subscribing..." : "Subscribe"}
        </button>
      </div>
      {message && (
        <p
          className={`text-sm ${isSuccess ? "text-green-400" : "text-red-400"}`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
