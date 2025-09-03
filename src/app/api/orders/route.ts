// Mock orders storage
// Handles getting user orders and creating new orders
import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-middleware";

// Mock order storage (in production, use a database)
const orders = new Map();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerData, items, total, paymentData, shippingData } = body;

    // Generate order ID
    const orderId = `ord_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 6)}`;

    // Create order object
    const order = {
      id: orderId,
      customerEmail: customerData.email,
      customerName: customerData.name,
      items,
      subtotal: total,
      shippingCost: 5.99,
      tax: total * 0.08,
      total: total + 5.99 + total * 0.08,
      paymentData: {
        method: paymentData.paymentMethod.name,
        transactionId: paymentData.transactionId,
      },
      shippingAddress: shippingData.shippingAddress,
      billingAddress: shippingData.billingAddress,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(
        Date.now() + 5 * 24 * 60 * 60 * 1000
      ).toISOString(), // 5 days
    };

    // Save order
    orders.set(orderId, order);

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // For authenticated users, return their orders
    const authResult = await verifyAuth(request);

    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    // Filter orders by user email (in production, use user ID)
    const userOrders = Array.from(orders.values()).filter(
      (order) => order.customerEmail === authResult.user?.email
    );

    return NextResponse.json({
      success: true,
      data: userOrders,
    });
  } catch (error) {
    console.error("Orders fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
