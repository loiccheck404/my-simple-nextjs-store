// Handles getting all reviews for a specific product
export async function GET(request, { params }) {
  try {
    const { productId } = params;

    // Check if product exists
    const product = products.find((p) => p.id === parseInt(productId));
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Get all reviews for this product
    const productReviews = reviews.filter(
      (r) => r.productId === parseInt(productId)
    );

    // Calculate review statistics
    const totalReviews = productReviews.length;
    const averageRating =
      totalReviews > 0
        ? parseFloat(
            (
              productReviews.reduce((sum, r) => sum + r.rating, 0) /
              totalReviews
            ).toFixed(1)
          )
        : 0;

    // Count ratings by star
    const ratingDistribution = {
      5: productReviews.filter((r) => r.rating === 5).length,
      4: productReviews.filter((r) => r.rating === 4).length,
      3: productReviews.filter((r) => r.rating === 3).length,
      2: productReviews.filter((r) => r.rating === 2).length,
      1: productReviews.filter((r) => r.rating === 1).length,
    };

    // Sort reviews by most recent first
    productReviews.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return NextResponse.json({
      success: true,
      data: {
        reviews: productReviews,
        statistics: {
          totalReviews,
          averageRating,
          ratingDistribution,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
