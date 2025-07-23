import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto p-4">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-12 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Welcome to My Store!
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover premium quality products with the CITZ standard. From
            stylish apparel to trendy accessories, find everything you need to
            express your unique style.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
              Shop Now
            </button>
            <button className="border border-gray-500 hover:border-gray-300 px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-gray-800">
              View Collection
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Featured Products
          </h2>
          <p className="text-gray-400">Handpicked items just for you</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* See More Section */}
      <section className="mb-12">
        <div className="bg-gray-900 rounded-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              More Amazing Products
            </h2>
            <p className="text-gray-400">Explore our complete collection</p>
          </div>

          {/* Additional Products Preview */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {products.slice(6).map((product) => (
              <div
                key={product.id}
                className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors duration-300"
              >
                <div className="aspect-square bg-gray-700 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Image</span>
                </div>
                <h3 className="text-white font-medium text-sm mb-1">
                  {product.name}
                </h3>
                <p className="text-blue-400 font-semibold">${product.price}</p>
              </div>
            ))}
          </div>

          {/* Categories Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 text-center hover:from-blue-500 hover:to-blue-700 transition-all duration-300 cursor-pointer">
              <div className="w-20 h-20 bg-blue-500/30 rounded-full mx-auto mb-4 flex items-center justify-center">
                <div className="text-4xl">👕</div>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Apparel</h3>
              <p className="text-blue-200 text-sm">T-Shirts, Jeans & More</p>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-6 text-center hover:from-purple-500 hover:to-purple-700 transition-all duration-300 cursor-pointer">
              <div className="w-20 h-20 bg-purple-500/30 rounded-full mx-auto mb-4 flex items-center justify-center">
                <div className="text-4xl">👟</div>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Footwear</h3>
              <p className="text-purple-200 text-sm">Sneakers & Accessories</p>
            </div>
            <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-6 text-center hover:from-green-500 hover:to-green-700 transition-all duration-300 cursor-pointer">
              <div className="w-20 h-20 bg-green-500/30 rounded-full mx-auto mb-4 flex items-center justify-center">
                <div className="text-4xl">🧢</div>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Accessories</h3>
              <p className="text-green-200 text-sm">Caps, Hats & Socks</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <button className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
              View All Products
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
