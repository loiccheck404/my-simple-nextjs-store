// Mock reviews storage
// Handles creating new reviews
let reviews = [];

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
    const { productId, rating, comment } = body;

    // Validation
    if (!productId || !rating) {
      return NextResponse.json(
        { success: false, error: "Product ID and rating are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: "Rating must be between 1 and 5" },
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

    const userId = authResult.user.userId;
    const user = users.find((u) => u.id === userId);

    // Check if user already reviewed this product
    const existingReview = reviews.find(
      (r) => r.productId === parseInt(productId) && r.userId === userId
    );

    if (existingReview) {
      return NextResponse.json(
        { success: false, error: "You have already reviewed this product" },
        { status: 400 }
      );
    }

    // Create new review
    const newReview = {
      id: reviews.length + 1,
      productId: parseInt(productId),
      userId,
      userName: user.name,
      rating: parseInt(rating),
      comment: comment || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    reviews.push(newReview);

    return NextResponse.json(
      {
        success: true,
        message: "Review added successfully",
        data: newReview,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create review" },
      { status: 500 }
    );
  }
}
