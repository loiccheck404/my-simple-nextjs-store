// Handles updating cart item quantities
export async function PUT(request) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { itemId, quantity } = body;

    if (!itemId || quantity === undefined) {
      return NextResponse.json(
        { success: false, error: "Item ID and quantity are required" },
        { status: 400 }
      );
    }

    if (quantity < 0) {
      return NextResponse.json(
        { success: false, error: "Quantity cannot be negative" },
        { status: 400 }
      );
    }

    const userId = authResult.user.userId;

    if (!carts[userId]) {
      return NextResponse.json(
        { success: false, error: "Cart not found" },
        { status: 404 }
      );
    }

    const itemIndex = carts[userId].items.findIndex(
      (item) => item.id === parseInt(itemId)
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Cart item not found" },
        { status: 404 }
      );
    }

    // If quantity is 0, remove item
    if (quantity === 0) {
      carts[userId].items.splice(itemIndex, 1);
      carts[userId].updatedAt = new Date();

      return NextResponse.json({
        success: true,
        message: "Item removed from cart",
      });
    }

    // Check stock
    const item = carts[userId].items[itemIndex];
    const product = products.find((p) => p.id === item.productId);

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { success: false, error: "Insufficient stock" },
        { status: 400 }
      );
    }

    // Update quantity
    carts[userId].items[itemIndex].quantity = parseInt(quantity);
    carts[userId].items[itemIndex].updatedAt = new Date();
    carts[userId].updatedAt = new Date();

    return NextResponse.json({
      success: true,
      message: "Cart updated successfully",
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update cart" },
      { status: 500 }
    );
  }
}
