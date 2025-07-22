export default function Header() {
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Simple Store</h1>
        <nav>
          <a href="/" className="mr-4 hover:underline">
            Home
          </a>
          <a href="/products" className="mr-4 hover:underline">
            Products
          </a>
          <a href="/cart" className="hover:underline">
            Cart (0)
          </a>
        </nav>
      </div>
    </header>
  );
}
