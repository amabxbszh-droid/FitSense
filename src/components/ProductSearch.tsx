import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { SizeResult } from '@/lib/sizeEngine';
import VirtualTryOn from './VirtualTryOn';

export interface SearchProduct {
  title: string;
  price: string;
  link: string;
  source: string;
  thumbnail: string;
  snippet?: string;
}

interface ProductSearchProps {
  recommendedSize: string;
  sizeResult: SizeResult;
}

const ProductSearch = ({ recommendedSize, sizeResult }: ProductSearchProps) => {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [tryOnProduct, setTryOnProduct] = useState<SearchProduct | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const { data, error } = await supabase.functions.invoke('search-products', {
        body: { query: `${query.trim()} size ${recommendedSize}`, size: recommendedSize },
      });

      if (error) throw error;
      setProducts(data?.products || []);
    } catch (err) {
      console.error('Search failed:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-lg font-bold tracking-tighter text-foreground">
          Search Products
        </h2>
        <p className="text-xs text-muted-foreground font-mono mt-1">
          Your size: <span className="text-primary font-bold">{recommendedSize}</span> • {sizeResult.fitLabel} • {sizeResult.confidence}% confidence
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Black hoodie, cargo pants, sneakers..."
            className="w-full bg-secondary/50 border border-border rounded-sm pl-10 pr-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-200"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="bg-primary text-primary-foreground font-bold text-sm px-6 py-3 rounded-sm hover:brightness-110 transition-all duration-200 font-mono tracking-wide disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'SEARCH'}
        </button>
      </form>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-3 font-mono text-sm text-muted-foreground">Searching Google Shopping...</span>
        </div>
      )}

      {!loading && searched && products.length === 0 && (
        <div className="text-center py-16">
          <p className="font-mono text-sm text-muted-foreground">No products found. Try a different search.</p>
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group glass-card overflow-hidden hover:-translate-y-0.5 hover:border-foreground/10 transition-all duration-200"
            >
              <div className="relative aspect-[3/4] overflow-hidden fit-matrix">
                {product.thumbnail ? (
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-200"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-secondary flex items-center justify-center">
                    <span className="font-mono text-xs text-muted-foreground">No Image</span>
                  </div>
                )}
                {product.price && (
                  <div className="absolute bottom-2 right-2 price-badge font-mono">
                    {product.price}
                  </div>
                )}
              </div>

              <div className="p-3">
                <div className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                  {product.source}
                </div>
                <div className="text-sm font-medium text-foreground mt-0.5 line-clamp-2">
                  {product.title}
                </div>
                <div className="flex gap-2 mt-3">
                  <a
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center bg-primary/10 text-primary font-mono text-xs py-1.5 rounded-sm hover:bg-primary/20 transition-colors"
                  >
                    BUY →
                  </a>
                  <button
                    onClick={() => setTryOnProduct(product)}
                    className="flex-1 text-center bg-accent/10 text-accent font-mono text-xs py-1.5 rounded-sm hover:bg-accent/20 transition-colors"
                  >
                    TRY ON
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {tryOnProduct && (
        <VirtualTryOn
          product={tryOnProduct}
          onClose={() => setTryOnProduct(null)}
        />
      )}
    </div>
  );
};

export default ProductSearch;
