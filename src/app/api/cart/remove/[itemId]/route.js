// Handles removing items from cart
export async function DELETE(request, { params }) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      );
    }

    const { itemId } = params;
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

    const removedItem = carts[userId].items.splice(itemIndex, 1)[0];
    carts[userId].updatedAt = new Date();

    return NextResponse.json({
      success: true,
      message: "Item removed from cart successfully",
      data: removedItem,
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove item from cart" },
      { status: 500 }
    );
  }
}
