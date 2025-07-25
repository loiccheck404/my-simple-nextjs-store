const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function testSeed() {
  try {
    console.log("🔗 Testing database connection...");

    // Test connection
    await prisma.$connect();
    console.log("✅ Connected to database");

    // Try to create a simple product
    const product = await prisma.product.create({
      data: {
        name: "Test Product",
        slug: "test-product-" + Date.now(),
        description: "This is a test product",
        price: 29.99,
        category: "test",
        brand: "Test Brand",
        sku: "TEST-" + Date.now(),
        inventory: 10,
        images: ["test-image.jpg"],
      },
    });

    console.log("✅ Created test product:", product.name);

    // Try to fetch products
    const products = await prisma.product.findMany({
      take: 5,
    });

    console.log(`✅ Found ${products.length} products in database`);

    if (products.length > 0) {
      console.log("Sample product:", {
        name: products[0].name,
        price: products[0].price,
        category: products[0].category,
      });
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("Full error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testSeed();
