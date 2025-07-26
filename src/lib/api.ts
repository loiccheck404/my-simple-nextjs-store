// lib/api.ts - Centralized API client with error handling and data revalidation

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

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

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(
    baseUrl: string = process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:3001/api"
  ) {
    this.baseUrl = baseUrl;
    // Get token from localStorage on client side
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token");
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        // Handle different HTTP status codes
        switch (response.status) {
          case 401:
            // Unauthorized - clear token and redirect to login
            this.clearAuth();
            throw new Error("Session expired. Please login again.");
          case 403:
            throw new Error("Access denied.");
          case 404:
            throw new Error("Resource not found.");
          case 429:
            throw new Error("Too many requests. Please try again later.");
          case 500:
            throw new Error("Server error. Please try again later.");
          default:
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
              errorData.message ||
                `HTTP ${response.status}: ${response.statusText}`
            );
        }
      }

      // Handle empty responses (204 No Content)
      if (response.status === 204) {
        return {} as T;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error. Please check your connection.");
    }
  }

  // Authentication methods
  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  }

  clearAuth() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
    }
  }

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
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    return this.request(`/products${queryString ? `?${queryString}` : ""}`);
  }

  async getProduct(id: string): Promise<Product> {
    return this.request(`/products/${id}`);
  }

  async searchProducts(query: string): Promise<Product[]> {
    return this.request(`/products/search?q=${encodeURIComponent(query)}`);
  }

  // User Authentication API
  async login(
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    const result = await this.request<{ user: User; token: string }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    );

    this.setToken(result.token);
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(result.user));
    }

    return result;
  }

  async register(
    email: string,
    password: string,
    name: string
  ): Promise<{ user: User; token: string }> {
    const result = await this.request<{ user: User; token: string }>(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify({ email, password, name }),
      }
    );

    this.setToken(result.token);
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(result.user));
    }

    return result;
  }

  async logout(): Promise<void> {
    try {
      await this.request("/auth/logout", { method: "POST" });
    } finally {
      this.clearAuth();
    }
  }

  async getProfile(): Promise<User> {
    return this.request("/auth/profile");
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    return this.request("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Cart API (for server-side cart sync)
  async getCart(): Promise<CartItem[]> {
    return this.request("/cart");
  }

  async addToCart(
    productId: string,
    quantity: number = 1
  ): Promise<CartItem[]> {
    return this.request("/cart", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async updateCartItem(
    productId: string,
    quantity: number
  ): Promise<CartItem[]> {
    return this.request(`/cart/${productId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(productId: string): Promise<CartItem[]> {
    return this.request(`/cart/${productId}`, {
      method: "DELETE",
    });
  }

  async clearCart(): Promise<void> {
    return this.request("/cart", {
      method: "DELETE",
    });
  }

  // Orders API
  async createOrder(orderData: {
    items: CartItem[];
    shippingAddress: Order["shippingAddress"];
    paymentMethod: string;
  }): Promise<Order> {
    return this.request("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }

  async getOrders(): Promise<Order[]> {
    return this.request("/orders");
  }

  async getOrder(id: string): Promise<Order> {
    return this.request(`/orders/${id}`);
  }

  // Reviews API
  async getProductReviews(productId: string): Promise<any[]> {
    return this.request(`/products/${productId}/reviews`);
  }

  async addReview(
    productId: string,
    rating: number,
    comment: string
  ): Promise<any> {
    return this.request(`/products/${productId}/reviews`, {
      method: "POST",
      body: JSON.stringify({ rating, comment }),
    });
  }
}

// Create singleton instance
export const api = new ApiClient();

// Custom hooks for data fetching with error handling and loading states
import { useState, useEffect, useCallback } from "react";

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
      console.error("API Error:", err);
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

// Mutation hook for POST/PUT/DELETE operations
export function useApiMutation<T, P = any>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (
      apiCall: (params: P) => Promise<T>
    ): Promise<{ data: T | null; error: string | null }> => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiCall({} as P);
        return { data, error: null };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        return { data: null, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { mutate, loading, error };
}

// Specific hooks for common operations
export function useProducts(filters?: Parameters<typeof api.getProducts>[0]) {
  return useApi(() => api.getProducts(filters), [JSON.stringify(filters)]);
}

export function useProduct(id: string) {
  return useApi(() => api.getProduct(id), [id]);
}

export function useOrders() {
  return useApi(() => api.getOrders(), []);
}

export function useProfile() {
  return useApi(() => api.getProfile(), []);
}
