// GET single product (Public)
// Handles getting, updating, and deleting specific products
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const product = products.find((p) => p.id === parseInt(id));

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PUT update product (Admin only)
export async function PUT(request, { params }) {
  try {
    const authResult = await verifyAdmin(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const productIndex = products.findIndex((p) => p.id === parseInt(id));

    if (productIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Update product
    products[productIndex] = {
      ...products[productIndex],
      ...body,
      id: parseInt(id), // Keep original ID
      updatedAt: new Date(),
    };

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      data: products[productIndex],
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE product (Admin only)
export async function DELETE(request, { params }) {
  try {
    const authResult = await verifyAdmin(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      );
    }

    const { id } = params;
    const productIndex = products.findIndex((p) => p.id === parseInt(id));

    if (productIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    const deletedProduct = products.splice(productIndex, 1)[0];

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
      data: deletedProduct,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
