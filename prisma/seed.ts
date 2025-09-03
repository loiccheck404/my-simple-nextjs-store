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
      description: "T-Shirts, Jeans, Hoodies & More",
    },
    {
      name: "Footwear",
      slug: "footwear",
      description: "Sneakers, Boots & Footwear",
    },
    {
      name: "Accessories",
      slug: "accessories",
      description: "Caps, Hats, Bags & Accessories",
    },
    {
      name: "Electronics",
      slug: "electronics",
      description: "Smart Devices & Electronics",
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  // Create your products
  const products = [
    {
      name: "Premium Cotton T-Shirt",
      slug: "premium-cotton-t-shirt",
      description: "High-quality cotton t-shirt with CITZ standard. Soft, comfortable, and durable.",
      price: 55.99,
      originalPrice: 69.99,
      category: "apparel",
      brand: "CITZ",
      sku: "CITZ-TS-001",
      inventory: 50,
      images: ["/images/mssts3.png"],
      featured: true,
      metaTitle: "Premium Cotton T-Shirt - CITZ Quality",
      metaDescription: "High-quality cotton t-shirt with CITZ standard. Soft, comfortable, and durable."
    },
    {
      name: "Athletic Running Sneakers",
      slug: "athletic-running-sneakers",
      description: "Comfortable running sneakers with superior cushioning and CITZ quality.",
      price: 89.99,
      originalPrice: 119.99,
      category: "footwear",
      brand: "CITZ",
      sku: "CITZ-SN-001",
      inventory: 30,
      images: ["/images/msssn1.png"],
      featured: true,
      metaTitle: "Athletic Running Sneakers - CITZ Quality",
      metaDescription: "Comfortable running sneakers with superior cushioning and CITZ quality."
    },
    {
      name: "Classic Baseball Cap",
      slug: "classic-baseball-cap",
      description: "Stylish baseball cap with adjustable strap and CITZ quality.",
      price: 55.99,
      category: "accessories",
      brand: "CITZ",
      sku: "CITZ-CAP-001",
      inventory: 25,
      images: ["/images/msshs4.png"],
      featured: false,
      metaTitle: "Classic Baseball Cap - CITZ Quality",
      metaDescription: "Stylish baseball cap with adjustable strap and CITZ quality."
    },
    {
      name: "Slim Fit Denim Jeans",
      slug: "slim-fit-denim-jeans",
      description: "Modern slim-fit jeans with premium denim and CITZ quality.",
      price: 75.99,
      originalPrice: 95.99,
      category: "apparel",
      brand: "CITZ",
      sku: "CITZ-JN-001",
      inventory: 40,
      images: ["/images/mssjn1.png"],
      featured: true,
      metaTitle: "Slim Fit Denim Jeans - CITZ Quality",
      metaDescription: "Modern slim-fit jeans with premium denim and CITZ quality."
    },
    {
      name: "Cushioned Athletic Socks",
      slug: "cushioned-athletic-socks",
      description: "Comfortable athletic socks with moisture-wicking fabric and CITZ quality.",
      price: 25.99,
      category: "accessories",
      brand: "CITZ",
      sku: "CITZ-SOCK-001",
      inventory: 100,
      images: ["/images/msssn3.png"],
      featured: false,
      metaTitle: "Cushioned Athletic Socks - CITZ Quality",
      metaDescription: "Comfortable athletic socks with moisture-wicking fabric and CITZ quality."
    },
    {
      name: "Vintage Style Hat",
      slug: "vintage-style-hat",
      description: "Trendy vintage-style hat with premium materials and CITZ quality.",
      price: 46.99,
      category: "accessories",
      brand: "CITZ",
      sku: "CITZ-HAT-001",
      inventory: 20,
      images: ["/images/msshs2.png"],
      featured: false,
      metaTitle: "Vintage Style Hat - CITZ Quality",
      metaDescription: "Trendy vintage-style hat with premium materials and CITZ quality."
    },
    {
      name: "Luxury Polo Shirt",
      slug: "luxury-polo-shirt",
      description: "Premium polo shirt made from finest cotton with CITZ craftsmanship.",
      price: 68.99,
      originalPrice: 85.99,
      category: "apparel",
      brand: "CITZ",
      sku: "CITZ-POLO-001",
      inventory: 35,
      images: ["/images/msslp1.png"],
      featured: true,
      metaTitle: "Luxury Polo Shirt - CITZ Quality",
      metaDescription: "Premium polo shirt made from finest cotton with CITZ craftsmanship."
    },
    {
      name: "Casual Canvas Sneakers",
      slug: "casual-canvas-sneakers",
      description: "Comfortable canvas sneakers perfect for everyday wear with CITZ durability.",
      price: 64.99,
      category: "footwear",
      brand: "CITZ",
      sku: "CITZ-CNV-001",
      inventory: 45,
      images: ["/images/msssn4.png"],
      featured: false,
      metaTitle: "Casual Canvas Sneakers - CITZ Quality",
      metaDescription: "Comfortable canvas sneakers perfect for everyday wear with CITZ durability."
    },
    {
      name: "Hoodie Sweatshirt",
      slug: "hoodie-sweatshirt",
      description: "Comfortable hoodie sweatshirt with soft fleece lining and CITZ comfort.",
      price: 78.99,
      originalPrice: 99.99,
      category: "apparel",
      brand: "CITZ",
      sku: "CITZ-HOOD-001",
      inventory: 30,
      images: ["/images/msshd1.png"],
      featured: true,
      metaTitle: "Hoodie Sweatshirt - CITZ Quality",
      metaDescription: "Comfortable hoodie sweatshirt with soft fleece lining and CITZ comfort."
    },
    {
      name: "Flip Flops",
      slug: "flip-flops",
      description: "Lightweight flip-flops with moisture-wicking fabric and CITZ performance.",
      price: 34.99,
      category: "footwear",
      brand: "CITZ",
      sku: "CITZ-FF-001",
      inventory: 60,
      images: ["/images/mssff1.png"],
      featured: false,
      metaTitle: "Flip Flops - CITZ Quality",
      metaDescription: "Lightweight flip-flops with moisture-wicking fabric and CITZ performance."
    },
    {
      name: "Leather Boots",
      slug: "leather-boots",
      description: "Premium leather boots with durable construction and CITZ quality.",
      price: 145.99,
      originalPrice: 179.99,
      category: "footwear",
      brand: "CITZ",
      sku: "CITZ-BOOT-001",
      inventory: 15,
      images: ["/images/msslb1.png"],
      featured: true,
      metaTitle: "Leather Boots - CITZ Quality",
      metaDescription: "Premium leather boots with durable construction and CITZ quality."
    },
    {
      name: "Smartwatch",
      slug: "smartwatch",
      description: "Advanced smartwatch with fitness tracking and CITZ technology.",
      price: 199.99,
      originalPrice: 249.99,
      category: "electronics",
      brand: "CITZ",
      sku: "CITZ-SW-001",
      inventory: 25,
      images: ["/images/msssw1.png"],
      featured: true,
      metaTitle: "Smartwatch - CITZ Technology",
      metaDescription: "Advanced smartwatch with fitness tracking and CITZ technology."
    },
    {
      name: "Backpack",
      slug: "backpack",
      description: "Durable backpack with multiple compartments and CITZ durability.",
      price: 58.99,
      category: "accessories",
      brand: "CITZ",
      sku: "CITZ-BP-001",
      inventory: 40,
      images: ["/images/mssbp1.png"],
      featured: false,
      metaTitle: "Backpack - CITZ Quality",
      metaDescription: "Durable backpack with multiple compartments and CITZ durability."
    },
    {
      name: "Sunglasses",
      slug: "sunglasses",
      description: "UV protection sunglasses with polarized lenses and CITZ clarity.",
      price: 89.99,
      originalPrice: 119.99,
      category: "accessories",
      brand: "CITZ",
      sku: "CITZ-SG-001",
      inventory: 30,
      images: ["/images/msssg1.png"],
      featured: true,
      metaTitle: "Sunglasses - CITZ Quality",
      metaDescription: "UV protection sunglasses with polarized lenses and CITZ clarity."
    },
    {
      name: "Casual Button-Up Shirt",
      slug: "casual-button-up-shirt",
      description: "Versatile button-up shirt perfect for casual and business casual wear.",
      price: 49.99,
      category: "apparel",
      brand: "CITZ",
      sku: "CITZ-BTN-001",
      inventory: 45,
      images: ["/images/mssbt1.png"],
      featured: false,
      metaTitle: "Casual Button-Up Shirt - CITZ Quality",
      metaDescription: "Versatile button-up shirt perfect for casual and business casual wear."
    },
    {
      name: "Leather Wallet",
      slug: "leather-wallet",
      description: "Genuine leather wallet with multiple card slots and CITZ craftsmanship.",
      price: 42.99,
      category: "accessories",
      brand: "CITZ",
      sku: "CITZ-WALLET-001",
      inventory: 50,
      images: ["/images/msslw1.png"],
      featured: false,
      metaTitle: "Leather Wallet - CITZ Quality",
      metaDescription: "Genuine leather wallet with multiple card slots and CITZ craftsmanship."
    }
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
    where: { slug: "premium-cotton-t-shirt" },
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
        title: "Amazing quality!",
        comment: "This t-shirt is incredibly comfortable and well-made. Highly recommended!",
        verified: true,
      },
    });
  }

  console.log("✅ Database seeded successfully!");
  console.log(`👤 Admin user created: admin@mystore.com (password: admin123)`);
  console.log(`👤 Test user created: test@example.com (password: test123)`);
  console.log(`📦 ${products.length} products created`);
  console.log(`📂 ${categories.length} categories created`);
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