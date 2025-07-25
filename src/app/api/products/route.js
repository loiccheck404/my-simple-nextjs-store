// Handles getting all products and creating new products
import { NextResponse } from "next/server";
import { verifyAuth, verifyAdmin } from "@/lib/auth"; // You'll create these helper functions

// Mock database - Replace with your actual database
let products = [
  {
    id: 1,
    name: "iPhone 15",
    price: 999,
    description: "Latest iPhone with amazing features",
    image: "/images/iphone15.jpg",
    category: "Electronics",
    stock: 50,
    createdAt: new Date(),
  },
  {
    id: 2,
    name: "Nike Air Max",
    price: 120,
    description: "Comfortable running shoes",
    image: "/images/airmax.jpg",
    category: "Footwear",
    stock: 30,
    createdAt: new Date(),
  },
];

// GET all products (Public - anyone can view)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const sort = searchParams.get("sort");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    let filteredProducts = [...products];

    // Filter by category if provided
    if (category) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Sort products
    if (sort === "price-asc") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sort === "name") {
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: {
        products: paginatedProducts,
        pagination: {
          page,
          limit,
          total: filteredProducts.length,
          pages: Math.ceil(filteredProducts.length / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST new product (Admin only)
export async function POST(request) {
  try {
    //Check if user is admin
    const authResult = await verifyAdmin(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, price, description, image, category, stock } = body;

    // Validation
    if (!name || !price || !description || !category) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new product
    const newProduct = {
      id: products.length + 1,
      name,
      price: parseFloat(price),
      description,
      image: image || "/images/default-product.jpg",
      category,
      stock: parseInt(stock) || 0,
      createdAt: new Date(),
    };

    products.push(newProduct);

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        data: newProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 500 }
    );
  }
}
