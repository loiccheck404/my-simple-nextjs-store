// Handles getting user's cart
// Mock cart storage (in real app, this would be in database)
import { NextResponse } from "next/server";
// GET user's cart
export async function GET(request) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      );
    }

    const userId = authResult.user && authResult.user.userId;

    // Get user's cart items with product details
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
            inventory: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate totals and transform data
    let totalItems = 0;
    let totalPrice = 0;

    const cartWithProductDetails = cartItems.map((item) => {
      const subtotal = item.product.price * item.quantity;
      totalItems += item.quantity;
      totalPrice += subtotal;

      return {
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.images[0] || null,
          slug: item.product.slug,
          inStock: item.product.inventory > 0,
          availableQuantity: item.product.inventory,
        },
        subtotal: parseFloat(subtotal.toFixed(2)),
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        items: cartWithProductDetails,
        summary: {
          totalItems,
          totalPrice: parseFloat(totalPrice.toFixed(2)),
          itemCount: cartItems.length,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

// POST - Add item to cart
export async function POST(request) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      );
    }

    const userId = authResult.user && authResult.user.userId;
    const body = await request.json();
    const { productId, quantity } = body;

    // Validation
    if (!productId || !quantity || quantity < 1) {
      return NextResponse.json(
        { success: false, error: "Invalid product ID or quantity" },
        { status: 400 }
      );
    }

    // Check if product exists and has enough inventory
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        price: true,
        inventory: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    if (product.inventory < quantity) {
      return NextResponse.json(
        { success: false, error: "Insufficient inventory" },
        { status: 400 }
      );
    }

    // Check if item already exists in cart
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    let cartItem;

    if (existingCartItem) {
      // Update existing cart item quantity
      const newQuantity = existingCartItem.quantity + quantity;
      
      if (product.inventory < newQuantity) {
        return NextResponse.json(
          { success: false, error: "Insufficient inventory for requested quantity" },
          { status: 400 }
        );
      }

      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQuantity },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              images: true,
              slug: true,
            },
          },
        },
      });
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              images: true,
              slug: true,
            },
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Item added to cart successfully",
      data: {
        id: cartItem.id,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        product: {
          id: cartItem.product.id,
          name: cartItem.product.name,
          price: cartItem.product.price,
          image: cartItem.product.images[0] || null,
          slug: cartItem.product.slug,
        },
        subtotal: cartItem.product.price * cartItem.quantity,
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

// DELETE - Clear entire cart
export async function DELETE(request) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      );
    }

    const userId = authResult.user && authResult.user.userId;

    // Delete all cart items for the user
    await prisma.cartItem.deleteMany({
      where: { userId },
    });

    return NextResponse.json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return NextResponse.json(
      { success: false, error: "Failed to clear cart" },
      { status: 500 }
    );
  }
}