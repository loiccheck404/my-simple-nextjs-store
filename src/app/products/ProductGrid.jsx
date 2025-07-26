// app/products/ProductGrid.jsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiService } from "../../lib/api";
import ProductCard from "../../components/ProductCard";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function ProductGrid({ initialProducts, total }) {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const searchParams = useSearchParams();
  const router = useRouter();

  // Load more products (pagination)
  const loadMore = async () => {
    setLoading(true);
    try {
      const nextPage = page + 1;
      const params = Object.fromEntries(searchParams.entries());
      params.page = nextPage;

      const response = await apiService.getProducts(params);
      setProducts((prev) => [...prev, ...response.products]);
      setPage(nextPage);
    } catch (err) {
      setError("Failed to load more products");
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = Object.fromEntries(searchParams.entries());
        const response = await apiService.getProducts(params);
        setProducts(response.products);
        setPage(1);
      } catch (err) {
        setError("Failed to filter products");
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if searchParams changed (not on initial render)
    if (searchParams.toString()) {
      fetchFilteredProducts();
    }
  }, [searchParams]);

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length < total && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? <LoadingSpinner /> : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
