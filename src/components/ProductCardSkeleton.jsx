export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="aspect-square bg-gray-700"></div>
        <div className="p-4">
          <div className="h-4 bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-2/3 mb-2"></div>
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-700 rounded w-1/3"></div>
            <div className="h-8 bg-gray-700 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
