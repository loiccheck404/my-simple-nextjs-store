// Handles adding items to cart
import { NextResponse } from "next/server";
export async function POST(request) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = products.find((p) => p.id === parseInt(productId));
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Check stock
    if (product.stock < quantity) {
      return NextResponse.json(
        { success: false, error: "Insufficient stock" },
        { status: 400 }
      );
    }

    const userId = authResult.user.userId;

    // Initialize cart if doesn't exist
    if (!carts[userId]) {
      carts[userId] = { items: [], updatedAt: new Date() };
    }

    // Check if item already in cart
    const existingItemIndex = carts[userId].items.findIndex(
      (item) => item.productId === parseInt(productId)
    );

    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity =
        carts[userId].items[existingItemIndex].quantity + parseInt(quantity);

      if (product.stock < newQuantity) {
        return NextResponse.json(
          { success: false, error: "Insufficient stock" },
          { status: 400 }
        );
      }

      carts[userId].items[existingItemIndex].quantity = newQuantity;
      carts[userId].items[existingItemIndex].updatedAt = new Date();
    } else {
      // Add new item
      carts[userId].items.push({
        id: Date.now(), // Simple ID generation
        productId: parseInt(productId),
        quantity: parseInt(quantity),
        addedAt: new Date(),
        updatedAt: new Date(),
      });
    }

    carts[userId].updatedAt = new Date();

    return NextResponse.json({
      success: true,
      message: "Item added to cart successfully",
      data: {
        cartItems: carts[userId].items.length,
        addedProduct: product.name,
      },
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add item to cart" },
      { status: 500 }
    );
  }
}
