interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="border rounded-lg p-4 shadow-md">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded mb-4"
      />
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-gray-600 mb-2">{product.description}</p>
      <p className="text-xl font-bold text-green-600">${product.price}</p>
      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded mt-4 hover:bg-blue-700">
        Add to Cart
      </button>
    </div>
  );
}
