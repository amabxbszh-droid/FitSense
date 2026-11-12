import { motion } from 'framer-motion';
import { Product } from '@/lib/products';

interface ProductCardProps {
  product: Product;
  index: number;
  recommendedSize: string;
  onClick: (product: Product) => void;
}

const ProductCard = ({ product, index, recommendedSize, onClick }: ProductCardProps) => {
  const hasSize = product.sizes.includes(recommendedSize) || product.sizes.includes('OS');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: [0.2, 0, 0, 1] }}
      onClick={() => onClick(product)}
      className="group cursor-pointer"
    >
      <div className="glass-card overflow-hidden hover:-translate-y-0.5 hover:border-foreground/10 transition-all duration-200">
        <div className="relative aspect-[3/4] overflow-hidden fit-matrix">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-200"
            loading="lazy"
          />
          <div className="absolute bottom-2 right-2 price-badge font-mono">
            ₹{product.price}
          </div>
          {!hasSize && (
            <div className="absolute top-2 left-2 bg-destructive/80 text-destructive-foreground text-xs font-mono px-2 py-1 rounded-sm">
              SIZE N/A
            </div>
          )}
        </div>

        <div className="p-3">
          <div className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
            {product.brand}
          </div>
          <div className="text-sm font-medium text-foreground mt-0.5 truncate">
            {product.name}
          </div>
          <div className="flex gap-1 mt-2 flex-wrap">
            {product.sizes.map((s) => (
              <span
                key={s}
                className={`font-mono text-[10px] px-1.5 py-0.5 rounded-sm border ${
                  s === recommendedSize
                    ? 'border-primary/40 bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground'
                }`}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
