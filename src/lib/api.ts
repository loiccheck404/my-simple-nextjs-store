// lib/api.ts - Centralized API client with error handling and data revalidation
// lib/api.ts - Static API client using mock data
import { products } from "@/data/products";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image?: string;
  description?: string;
  rating?: number;
  reviews?: number;
  stock?: number;
}

// Static implementation using mock data
class StaticApiClient {
  // Products API
  async getProducts(params?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: "price" | "name" | "rating";
    sortOrder?: "asc" | "desc";
    page?: number;
    limit?: number;
  }): Promise<{ products: Product[]; total: number; pages: number }> {
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredProducts = [...products];

    // Apply filters
    if (params?.category) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category.toLowerCase() === params.category?.toLowerCase()
      );
    }

    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower)
      );
    }

    if (params?.minPrice || params?.maxPrice) {
      filteredProducts = filteredProducts.filter((product) => {
        const price = product.price;
        const min = params?.minPrice || 0;
        const max = params?.maxPrice || Infinity;
        return price >= min && price <= max;
      });
    }

    // Apply sorting
    if (params?.sortBy) {
      filteredProducts.sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (params.sortBy) {
          case "price":
            aValue = a.price;
            bValue = b.price;
            break;
          case "name":
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case "rating":
            aValue = a.rating || 0;
            bValue = b.rating || 0;
            break;
          default:
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
        }

        if (params?.sortOrder === "desc") {
          return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        } else {
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        }
      });
    }

    // Apply pagination
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const total = filteredProducts.length;
    const pages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return {
      products: paginatedProducts,
      total,
      pages,
    };
  }

  async getProduct(id: string): Promise<Product> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const product = products.find(p => p.id === id);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }

  async searchProducts(query: string): Promise<Product[]> {
    const result = await this.getProducts({ search: query });
    return result.products;
  }
}

// Create singleton instance
export const api = new StaticApiClient();

// Custom hooks for data fetching (updated for static data)
import { useState, useEffect, useCallback } from "react";

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
): ApiResponse<T> & { refetch: () => Promise<void> } {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    error,
    loading,
    refetch: fetchData,
  };
}

// Specific hooks for common operations
export function useProducts(filters?: Parameters<typeof api.getProducts>[0]) {
  return useApi(() => api.getProducts(filters), [JSON.stringify(filters)]);
}

export function useProduct(id: string) {
  return useApi(() => api.getProduct(id), [id]);
}