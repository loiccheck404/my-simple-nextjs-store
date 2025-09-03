export const products = [
  // Original products (enhanced)
  {
    id: "1", // Changed to string
    name: "Premium Cotton T-Shirt",
    price: 55.99,
    originalPrice: 69.99,
    image: "/images/mssts3.png",
    description:
      "High-quality cotton t-shirt with CITZ standard. Soft, comfortable, and durable.",
    category: "apparel",
    rating: 4.5,
    reviews: 128,
    stock: 15, // Added stock property
    inStock: true,
    colors: ["Black", "White", "Navy", "Gray"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "2",
    name: "Athletic Running Sneakers",
    price: 89.99,
    originalPrice: 119.99,
    image: "/images/msssn1.png",
    description:
      "Comfortable running sneakers with superior cushioning and CITZ quality.",
    category: "footwear",
    rating: 4.8,
    reviews: 256,
    stock: 8,
    inStock: true,
    colors: ["White", "Black", "Blue"],
    sizes: ["7", "8", "9", "10", "11", "12"],
  },
  {
    id: "3",
    name: "Classic Baseball Cap",
    price: 55.99,
    image: "/images/msshs4.png",
    description: "Stylish baseball cap with adjustable strap and CITZ quality.",
    category: "accessories",
    rating: 4.3,
    reviews: 89,
    stock: 12,
    inStock: true,
    colors: ["Black", "Navy", "Red", "White"],
    sizes: ["One Size"],
  },
  {
    id: "4",
    name: "Slim Fit Denim Jeans",
    price: 75.99,
    originalPrice: 95.99,
    image: "/images/mssjn1.png",
    description: "Modern slim-fit jeans with premium denim and CITZ quality.",
    category: "apparel",
    rating: 4.6,
    reviews: 167,
    stock: 6,
    inStock: true,
    colors: ["Dark Blue", "Light Blue", "Black"],
    sizes: ["28", "30", "32", "34", "36", "38"],
  },
  {
    id: "5",
    name: "Cushioned Athletic Socks",
    price: 25.99,
    image: "/images/msssn3.png",
    description:
      "Comfortable athletic socks with moisture-wicking fabric and CITZ quality.",
    category: "accessories",
    rating: 4.4,
    reviews: 203,
    stock: 25,
    inStock: true,
    colors: ["White", "Black", "Gray"],
    sizes: ["S", "M", "L"],
  },
  {
    id: "6",
    name: "Vintage Style Hat",
    price: 46.99,
    image: "/images/msshs2.png",
    description:
      "Trendy vintage-style hat with premium materials and CITZ quality.",
    category: "accessories",
    rating: 4.2,
    reviews: 76,
    stock: 9,
    inStock: true,
    colors: ["Brown", "Black", "Tan"],
    sizes: ["S", "M", "L"],
  },
  {
    id: "7",
    name: "Luxury Polo Shirt",
    price: 68.99,
    originalPrice: 85.99,
    image: "/images/msslp1.png",
    description:
      "Premium polo shirt made from finest cotton with CITZ craftsmanship.",
    category: "apparel",
    rating: 4.7,
    reviews: 145,
    stock: 11,
    inStock: true,
    colors: ["Navy", "White", "Green", "Burgundy"],
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "8",
    name: "Casual Canvas Sneakers",
    price: 64.99,
    image: "/images/msssn4.png",
    description:
      "Comfortable canvas sneakers perfect for everyday wear with CITZ durability.",
    category: "footwear",
    rating: 4.4,
    reviews: 92,
    stock: 14,
    inStock: true,
    colors: ["White", "Black", "Red", "Blue"],
    sizes: ["6", "7", "8", "9", "10", "11"],
  },
  {
    id: "9",
    name: "Hoodie Sweatshirt",
    price: 78.99,
    originalPrice: 99.99,
    image: "/images/msshd1.png",
    description:
      "Comfortable hoodie sweatshirt with soft fleece lining and CITZ comfort.",
    category: "apparel",
    rating: 4.5,
    reviews: 201,
    stock: 7,
    inStock: true,
    colors: ["Gray", "Black", "Navy", "Maroon"],
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "10",
    name: "Flip Flops",
    price: 34.99,
    image: "/images/mssff1.png",
    description:
      "Lightweight flip-flops with moisture-wicking fabric and CITZ performance.",
    category: "apparel",
    rating: 4.4,
    reviews: 134,
    stock: 20,
    inStock: true,
    colors: ["Black", "Navy", "Gray", "Red"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "11",
    name: "Leather Boots",
    price: 145.99,
    originalPrice: 179.99,
    image: "/images/msslb1.png",
    description:
      "Premium leather boots with durable construction and CITZ quality.",
    category: "footwear",
    rating: 4.8,
    reviews: 89,
    stock: 0, // Out of stock example
    inStock: false,
    colors: ["Brown", "Black"],
    sizes: ["7", "8", "9", "10", "11", "12"],
  },
  {
    id: "12",
    name: "Smartwatch",
    price: 199.99,
    originalPrice: 249.99,
    image: "/images/msssw1.png",
    description:
      "Advanced smartwatch with fitness tracking and CITZ technology.",
    category: "electronics",
    rating: 4.7,
    reviews: 445,
    stock: 5,
    inStock: true,
    colors: ["Black", "Silver", "Gold"],
    sizes: ["38mm", "42mm"],
  },
  {
    id: "13",
    name: "Backpack",
    price: 58.99,
    image: "/images/mssbp1.png",
    description:
      "Durable backpack with multiple compartments and CITZ durability.",
    category: "accessories",
    rating: 4.5,
    reviews: 167,
    stock: 18,
    inStock: true,
    colors: ["Black", "Gray", "Navy", "Green"],
    sizes: ["15L", "20L", "25L"],
  },
  {
    id: "14",
    name: "Sunglasses",
    price: 89.99,
    originalPrice: 119.99,
    image: "/images/msssg1.png",
    description:
      "UV protection sunglasses with polarized lenses and CITZ clarity.",
    category: "accessories",
    rating: 4.6,
    reviews: 203,
    stock: 13,
    inStock: true,
    colors: ["Black", "Brown", "Silver"],
    sizes: ["One Size"],
  },
  {
    id: "15",
    name: "Casual Button-Up Shirt",
    price: 49.99,
    image: "/images/mssbt1.png",
    description:
      "Versatile button-up shirt perfect for casual and business casual wear.",
    category: "apparel",
    rating: 4.3,
    reviews: 112,
    stock: 16,
    inStock: true,
    colors: ["White", "Blue", "Gray", "Green"],
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "16",
    name: "Leather Wallet",
    price: 42.99,
    image: "/images/msslw1.png",
    description:
      "Genuine leather wallet with multiple card slots and CITZ craftsmanship.",
    category: "accessories",
    rating: 4.6,
    reviews: 158,
    stock: 22,
    inStock: true,
    colors: ["Brown", "Black", "Tan"],
    sizes: ["One Size"],
  },
];

// Helper functions for filtering and searching (updated for string IDs)
export const getProductsByCategory = (category) => {
  return products.filter((product) => product.category === category);
};

export const getProductById = (id) => {
  return products.find((product) => product.id === id.toString());
};

export const searchProducts = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery)
  );
};

export const getNewArrivals = (limit = 6) => {
  return products.slice(0, limit);
};

export const getFeaturedProducts = (limit = 8) => {
  return products.filter((product) => product.rating >= 4.5).slice(0, limit);
};

export const getProductsOnSale = () => {
  return products.filter((product) => product.originalPrice);
};