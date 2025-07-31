// Handles getting all products and creating new products
import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth-middleware";
import { prisma } from "@/lib/prisma";

// GET all products (Public - anyone can view)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Build where clause for filtering
    const where = {};

    if (category) {
      where.category = category.toLowerCase();
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    // Build orderBy clause
    let orderBy = {};
    switch (sortBy) {
      case "price":
        orderBy.price = sortOrder;
        break;
      case "name":
        orderBy.name = sortOrder;
        break;
      case "createdAt":
      default:
        orderBy.createdAt = sortOrder;
        break;
    }

    // Get total count for pagination
    const total = await prisma.product.count({ where });

    // Get products with pagination
    const products = await prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        categoryRel: {
          select: {
            name: true,
            slug: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    // Transform products to include calculated fields
    const transformedProducts = products.map((product) => {
      const avgRating =
        product.reviews.length > 0
          ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
            product.reviews.length
          : 0;

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        category: product.category,
        brand: product.brand,
        sku: product.sku,
        inventory: product.inventory,
        images: product.images,
        featured: product.featured,
        categoryName: product.categoryRel.name,
        rating: Math.round(avgRating * 10) / 10, // Round to 1 decimal place
        reviews: product._count.reviews,
        inStock: product.inventory > 0,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        products: transformedProducts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
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
    // Check if user is admin
    const authResult = await verifyAdmin(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      name,
      slug,
      description,
      price,
      originalPrice,
      category,
      brand,
      sku,
      inventory,
      images,
      featured,
      metaTitle,
      metaDescription,
    } = body;

    // Validation
    if (!name || !slug || !price || !category || !sku) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: name, slug, price, category, sku",
        },
        { status: 400 }
      );
    }

    // Check if category exists
    const categoryExists = await prisma.category.findUnique({
      where: { slug: category },
    });

    if (!categoryExists) {
      return NextResponse.json(
        { success: false, error: "Category does not exist" },
        { status: 400 }
      );
    }

    // Check if SKU is unique
    const existingSku = await prisma.product.findUnique({
      where: { sku },
    });

    if (existingSku) {
      return NextResponse.json(
        { success: false, error: "SKU already exists" },
        { status: 400 }
      );
    }

    // Create new product
    const newProduct = await prisma.product.create({
      data: {
        name,
        slug,
        description: description || null,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        category,
        brand: brand || null,
        sku,
        inventory: parseInt(inventory) || 0,
        images: images || [],
        featured: featured || false,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
      },
      include: {
        categoryRel: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

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

    // Handle Prisma unique constraint errors
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          success: false,
          error: "Product with this slug or SKU already exists",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 500 }
    );
  }
}
