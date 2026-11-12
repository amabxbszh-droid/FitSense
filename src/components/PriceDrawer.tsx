import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, PriceEntry, getProductPrices } from '@/lib/products';
import { X, ExternalLink } from 'lucide-react';

interface PriceDrawerProps {
  product: Product | null;
  onClose: () => void;
}

const PriceDrawer = ({ product, onClose }: PriceDrawerProps) => {
  const [prices, setPrices] = useState<PriceEntry[]>([]);

  useEffect(() => {
    if (product) {
      setPrices(getProductPrices(product.id));
    }
  }, [product]);

  const bestPrice = prices[0];

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md glass-card border-l border-border/50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="font-mono text-xs text-accent uppercase tracking-widest">
                    ● Deal Finder
                  </div>
                  <h3 className="text-lg font-bold tracking-tighter text-foreground mt-1">
                    {product.name}
                  </h3>
                  <p className="font-mono text-xs text-muted-foreground mt-0.5">
                    {product.brand} • {product.category}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-sm hover:bg-secondary transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              <div className="aspect-[3/4] rounded-md overflow-hidden fit-matrix mb-6">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {bestPrice && (
                <div className="glass-card-inner p-4 mb-4">
                  <div className="font-mono text-xs text-primary uppercase tracking-wider mb-1">
                    Best Price
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold tabular-nums text-primary font-mono">
                      ₹{bestPrice.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      on {bestPrice.platform}
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {prices.map((entry, i) => (
                  <div
                    key={entry.platform}
                    className={`flex items-center justify-between p-3 rounded-sm transition-all duration-200 ${
                      i === 0
                        ? 'bg-primary/5 border border-primary/20'
                        : 'glass-card-inner'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-muted-foreground w-4 tabular-nums">
                        #{i + 1}
                      </span>
                      <div>
                        <span className="text-sm font-medium text-foreground">
                          {entry.platform}
                        </span>
                        {!entry.inStock && (
                          <span className="ml-2 text-xs text-destructive font-mono">
                            OUT OF STOCK
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`font-mono text-sm font-bold tabular-nums ${
                        i === 0 ? 'text-primary' : 'text-foreground'
                      }`}>
                        ₹{entry.price}
                      </span>
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center font-mono text-xs text-muted-foreground">
                Last updated 2m ago
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PriceDrawer;
