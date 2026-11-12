import { Product, PRODUCTS } from '@/lib/products';
import ProductCard from './ProductCard';

interface ProductGridProps {
  recommendedSize: string;
  onProductClick: (product: Product) => void;
}

const ProductGrid = ({ recommendedSize, onProductClick }: ProductGridProps) => {
  const sorted = [...PRODUCTS].sort((a, b) => {
    const aHas = a.sizes.includes(recommendedSize) || a.sizes.includes('OS');
    const bHas = b.sizes.includes(recommendedSize) || b.sizes.includes('OS');
    if (aHas && !bHas) return -1;
    if (!aHas && bHas) return 1;
    return 0;
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold tracking-tighter text-foreground">
            Recommended for You
          </h2>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            Filtered for size {recommendedSize} • {PRODUCTS.length} items
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {sorted.map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            index={i}
            recommendedSize={recommendedSize}
            onClick={onProductClick}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
