import React, { useState } from "react";
import { Product } from "./api";

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    price: 79.99,
    originalPrice: 99.99,
    category: "electronics",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
    description:
      "Premium wireless headphones with active noise cancellation and 30-hour battery life.",
    rating: 4.5,
    reviews: 128,
    stock: 15,
  },
  {
    id: "2",
    name: "Smart Fitness Watch",
    price: 199.99,
    category: "electronics",
    image:
      "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=300&h=300&fit=crop",
    description:
      "Track your fitness goals with this advanced smartwatch featuring heart rate monitoring.",
    rating: 4.3,
    reviews: 89,
    stock: 23,
  },
  {
    id: "3",
    name: "Organic Cotton T-Shirt",
    price: 24.99,
    category: "clothing",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
    description:
      "Comfortable and sustainable organic cotton t-shirt in various colors.",
    rating: 4.7,
    reviews: 245,
    stock: 50,
  },
  {
    id: "4",
    name: "Coffee Bean Grinder",
    price: 45.99,
    originalPrice: 59.99,
    category: "home",
    image:
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop",
    description:
      "Professional burr grinder for the perfect coffee experience at home.",
    rating: 4.4,
    reviews: 67,
    stock: 8,
  },
  {
    id: "5",
    name: "Yoga Mat Premium",
    price: 34.99,
    category: "sports",
    image:
      "https://images.unsplash.com/photo-1506629905607-50b8b868ed22?w=300&h=300&fit=crop",
    description:
      "Non-slip yoga mat with excellent cushioning for all types of yoga practice.",
    rating: 4.6,
    reviews: 156,
    stock: 32,
  },
  {
    id: "6",
    name: "JavaScript Programming Book",
    price: 39.99,
    category: "books",
    image:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=300&fit=crop",
    description:
      "Comprehensive guide to modern JavaScript programming techniques and best practices.",
    rating: 4.8,
    reviews: 193,
    stock: 0, // Out of stock example
  },
];

export class MockApiClient {
  async getProducts(params: any = {}) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredProducts = [...mockProducts];

    // Apply filters
    if (params.category) {
      filteredProducts = filteredProducts.filter(
        (p) => p.category === params.category
      );
    }

    if (params.search) {
      const search = params.search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.description?.toLowerCase().includes(search)
      );
    }

    if (params.minPrice) {
      filteredProducts = filteredProducts.filter(
        (p) => p.price >= params.minPrice
      );
    }

    if (params.maxPrice) {
      filteredProducts = filteredProducts.filter(
        (p) => p.price <= params.maxPrice
      );
    }

    // Apply sorting
    if (params.sortBy) {
      filteredProducts.sort((a, b) => {
        let aValue = a[params.sortBy as keyof Product];
        let bValue = b[params.sortBy as keyof Product];

        // Provide default values if undefined
        if (typeof aValue === "undefined") aValue = "";
        if (typeof bValue === "undefined") bValue = "";

        if (typeof aValue === "string") aValue = aValue.toLowerCase();
        if (typeof bValue === "string") bValue = bValue.toLowerCase();

        if (params.sortOrder === "desc") {
          return aValue < bValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    // Apply pagination
    const page = params.page || 1;
    const limit = params.limit || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return {
      products: paginatedProducts,
      total: filteredProducts.length,
      pages: Math.ceil(filteredProducts.length / limit),
    };
  }

  async getProduct(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const product = mockProducts.find((p) => p.id === id);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }
}
