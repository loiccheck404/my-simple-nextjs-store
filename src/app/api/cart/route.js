// Handles getting user's cart
// Mock cart storage (in real app, this would be in database)
let carts = {}; // { userId: { items: [...], updatedAt: Date } }

export async function GET(request) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      );
    }

    const userId = authResult.user.userId;
    const userCart = carts[userId] || { items: [], updatedAt: new Date() };

    // Calculate totals
    let totalItems = 0;
    let totalPrice = 0;

    const cartWithProductDetails = userCart.items
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (product) {
          totalItems += item.quantity;
          totalPrice += product.price * item.quantity;
          return {
            ...item,
            product: {
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
            },
            subtotal: product.price * item.quantity,
          };
        }
        return null;
      })
      .filter(Boolean);

    return NextResponse.json({
      success: true,
      data: {
        items: cartWithProductDetails,
        summary: {
          totalItems,
          totalPrice: parseFloat(totalPrice.toFixed(2)),
          updatedAt: userCart.updatedAt,
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
