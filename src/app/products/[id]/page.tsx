import React from "react";
import { products } from "@/data/products";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

// For static generation (Server Component)
export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id.toString(),
  }));
}

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ params }) => {
  // Find the product (Server-side)
  const product = products.find((p) => p.id.toString() === params.id);

  if (!product) {
    notFound();
  }

  //Pass product data to client component
  return <ProductDetailClient product={product} />;
};

export default ProductDetailPage;
