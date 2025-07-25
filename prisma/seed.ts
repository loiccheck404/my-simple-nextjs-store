import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@mystore.com" },
    update: {},
    create: {
      email: "admin@mystore.com",
      name: "Admin User",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  // Create sample categories
  const categories = [
    {
      name: "Apparel",
      slug: "apparel",
      description: "T-Shirts, Jeans & More",
    },
    {
      name: "Footwear",
      slug: "footwear",
      description: "Sneakers & Accessories",
    },
    {
      name: "Accessories",
      slug: "accessories",
      description: "Caps, Hats & Socks",
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  // Create sample products
  const products = [
    {
      name: "Classic White T-Shirt",
      slug: "classic-white-t-shirt",
      description:
        "A comfortable and versatile white t-shirt made from 100% cotton.",
      price: 29.99,
      originalPrice: 39.99,
      category: "apparel",
      brand: "CITZ",
      sku: "CWT001",
      inventory: 50,
      images: ["/images/products/white-tshirt.jpg"],
      featured: true,
      metaTitle: "Classic White T-Shirt | CITZ Store",
      metaDescription:
        "Comfortable 100% cotton white t-shirt perfect for everyday wear.",
    },
    {
      name: "Blue Denim Jeans",
      slug: "blue-denim-jeans",
      description: "Premium blue denim jeans with a modern fit.",
      price: 79.99,
      originalPrice: 99.99,
      category: "apparel",
      brand: "CITZ",
      sku: "BDJ001",
      inventory: 30,
      images: ["/images/products/denim-jeans.jpg"],
      featured: true,
    },
    {
      name: "Running Sneakers",
      slug: "running-sneakers",
      description: "Lightweight and comfortable running sneakers.",
      price: 149.99,
      category: "footwear",
      brand: "CITZ",
      sku: "RS001",
      inventory: 25,
      images: ["/images/products/running-sneakers.jpg"],
      featured: true,
    },
    {
      name: "Baseball Cap",
      slug: "baseball-cap",
      description: "Classic baseball cap with adjustable strap.",
      price: 24.99,
      category: "accessories",
      brand: "CITZ",
      sku: "BC001",
      inventory: 40,
      images: ["/images/products/baseball-cap.jpg"],
    },
    {
      name: "Cotton Socks Pack",
      slug: "cotton-socks-pack",
      description: "Pack of 3 comfortable cotton socks.",
      price: 19.99,
      category: "accessories",
      brand: "CITZ",
      sku: "CSP001",
      inventory: 60,
      images: ["/images/products/cotton-socks.jpg"],
    },
    {
      name: "Black Hoodie",
      slug: "black-hoodie",
      description: "Warm and cozy black hoodie perfect for cold weather.",
      price: 69.99,
      originalPrice: 89.99,
      category: "apparel",
      brand: "CITZ",
      sku: "BH001",
      inventory: 35,
      images: ["/images/products/black-hoodie.jpg"],
      featured: true,
    },
    {
      name: "Casual Sneakers",
      slug: "casual-sneakers",
      description: "Stylish casual sneakers for everyday wear.",
      price: 89.99,
      category: "footwear",
      brand: "CITZ",
      sku: "CS001",
      inventory: 20,
      images: ["/images/products/casual-sneakers.jpg"],
    },
    {
      name: "Leather Wallet",
      slug: "leather-wallet",
      description: "Premium leather wallet with multiple card slots.",
      price: 49.99,
      category: "accessories",
      brand: "CITZ",
      sku: "LW001",
      inventory: 45,
      images: ["/images/products/leather-wallet.jpg"],
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  // Create sample reviews
  const testUser = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Test User",
      password: await bcrypt.hash("test123", 12),
    },
  });

  const sampleProduct = await prisma.product.findFirst({
    where: { slug: "classic-white-t-shirt" },
  });

  if (sampleProduct) {
    await prisma.review.upsert({
      where: {
        userId_productId: {
          userId: testUser.id,
          productId: sampleProduct.id,
        },
      },
      update: {},
      create: {
        userId: testUser.id,
        productId: sampleProduct.id,
        rating: 5,
        title: "Great quality shirt!",
        comment: "Very comfortable and good quality. Fits perfectly!",
        verified: true,
      },
    });
  }

  console.log("✅ Database seeded successfully!");
  console.log(`👤 Admin user created: admin@mystore.com (password: admin123)`);
  console.log(`👤 Test user created: test@example.com (password: test123)`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
