// app/products/page.tsx - Products listing with "use client";

"use client";

import React, { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useProducts, Product } from "@/lib/api";

export default function ProductsPage() {
  // Filters state
  const [filters, setFilters] = useState({
    category: "",
    search: "",
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    sortBy: "name" as "price" | "name" | "rating",
    sortOrder: "asc" as "asc" | "desc",
    page: 1,
    limit: 12,
  });

  // Fetch products with current filters
  const { data: productsData, loading, error, refetch } = useProducts(filters);
  const { addToCart, getItemQuantity, isInCart } = useCart();

  // Extract products from the API response
  const products = productsData?.products || [];

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
        },
        1
      );
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 })); // Reset to page 1 when filters change
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("search") as string;
    handleFilterChange({ search });
  };

  if (loading && products.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Products</h1>
        <p className="text-gray-400">
          Discover our amazing collection ({productsData?.total || 0} products)
        </p>
      </div>

      {/* Filters and Search */}
      <div className="mb-8 bg-gray-800 p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              name="search"
              type="text"
              placeholder="Search products..."
              defaultValue={filters.search}
              className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            >
              Search
            </button>
          </form>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange({ category: e.target.value })}
            className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="home">Home & Garden</option>
            <option value="books">Books</option>
            <option value="sports">Sports</option>
          </select>

          {/* Sort By */}
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split("-") as [
                typeof filters.sortBy,
                typeof filters.sortOrder
              ];
              handleFilterChange({ sortBy, sortOrder });
            }}
            className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="price-asc">Price Low to High</option>
            <option value="price-desc">Price High to Low</option>
            <option value="rating-desc">Highest Rated</option>
          </select>

          {/* Price Range */}
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min $"
              value={filters.minPrice || ""}
              onChange={(e) =>
                handleFilterChange({
                  minPrice: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
            <input
              type="number"
              placeholder="Max $"
              value={filters.maxPrice || ""}
              onChange={(e) =>
                handleFilterChange({
                  maxPrice: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Clear Filters */}
        <button
          onClick={() =>
            setFilters({
              category: "",
              search: "",
              minPrice: undefined,
              maxPrice: undefined,
              sortBy: "name",
              sortOrder: "asc",
              page: 1,
              limit: 12,
            })
          }
          className="text-gray-400 hover:text-white text-sm"
        >
          Clear all filters
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
          >
            {/* Product Image */}
            <div className="aspect-square bg-gray-700 flex items-center justify-center relative">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400">No Image</span>
              )}

              {/* Sale Badge */}
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    SALE
                  </div>
                )}

              {/* Stock Badge */}
              {product.stock !== undefined &&
                product.stock <= 5 &&
                product.stock > 0 && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
                    {product.stock} left
                  </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
                {product.name}
              </h3>

              {product.category && (
                <p className="text-gray-400 text-sm mb-2 capitalize">
                  {product.category}
                </p>
              )}

              {product.description && (
                <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
              )}

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex text-yellow-400">
                    {"★".repeat(Math.floor(product.rating))}
                    {"☆".repeat(5 - Math.floor(product.rating))}
                  </div>
                  <span className="text-gray-400 text-sm">
                    ({product.reviews || 0})
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-blue-400 font-bold text-xl">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice &&
                    product.originalPrice > product.price && (
                      <span className="text-gray-500 text-sm line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                </div>

                {isInCart(product.id) ? (
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <span>✓ In Cart ({getItemQuantity(product.id)})</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className={`font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                      product.stock === 0
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                    }`}
                  >
                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {productsData && productsData.pages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                page: Math.max(1, prev.page - 1),
              }))
            }
            disabled={filters.page === 1}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
          >
            Previous
          </button>

          <span className="text-gray-400">
            Page {filters.page} of {productsData.pages}
          </span>

          <button
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                page: Math.min(productsData.pages, prev.page + 1),
              }))
            }
            disabled={filters.page === productsData.pages}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
          >
            Next
          </button>
        </div>
      )}

      {/* Loading overlay for filter changes */}
      {loading && products.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-white text-sm">Updating products...</p>
          </div>
        </div>
      )}

      {products.length === 0 && !loading && (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">
            No products found matching your criteria
          </p>
          <button
            onClick={() =>
              setFilters({
                category: "",
                search: "",
                minPrice: undefined,
                maxPrice: undefined,
                sortBy: "name",
                sortOrder: "asc",
                page: 1,
                limit: 12,
              })
            }
            className="mt-4 text-blue-400 hover:text-blue-300"
          >
            Clear filters to see all products
          </button>
        </div>
      )}
    </div>
  );
}
