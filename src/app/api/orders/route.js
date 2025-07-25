// Mock orders storage
// Handles getting user orders and creating new orders
let orders = [];

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
    const userOrders = orders.filter((order) => order.userId === userId);

    // Sort by most recent first
    userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json({
      success: true,
      data: userOrders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

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
    const { shippingAddress, paymentMethod } = body;

    if (!shippingAddress || !paymentMethod) {
      return NextResponse.json(
        {
          success: false,
          error: "Shipping address and payment method are required",
        },
        { status: 400 }
      );
    }

    const userId = authResult.user.userId;
    const userCart = carts[userId];

    if (!userCart || userCart.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Calculate order total and prepare order items
    let totalAmount = 0;
    const orderItems = userCart.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      // Check stock again
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      return {
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        quantity: item.quantity,
        subtotal,
      };
    });

    // Create order
    const newOrder = {
      id: orders.length + 1,
      userId,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      status: "pending", // pending, processing, shipped, delivered, cancelled
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    orders.push(newOrder);

    // Update product stock
    orderItems.forEach((orderItem) => {
      const productIndex = products.findIndex(
        (p) => p.id === orderItem.productId
      );
      if (productIndex !== -1) {
        products[productIndex].stock -= orderItem.quantity;
      }
    });

    // Clear user's cart
    carts[userId] = { items: [], updatedAt: new Date() };

    return NextResponse.json(
      {
        success: true,
        message: "Order created successfully",
        data: newOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
