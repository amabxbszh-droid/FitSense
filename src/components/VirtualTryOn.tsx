import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Camera, Loader2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { SearchProduct } from './ProductSearch';

interface VirtualTryOnProps {
  product: SearchProduct;
  onClose: () => void;
}

const VirtualTryOn = ({ product, onClose }: VirtualTryOnProps) => {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setUserImage(reader.result as string);
      setResultImage(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleTryOn = async () => {
    if (!userImage) return;

    setLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('virtual-tryon', {
        body: {
          userImage,
          clothingImage: product.thumbnail,
          clothingDescription: product.title,
        },
      });

      if (fnError) throw fnError;
      if (data?.resultImage) {
        setResultImage(data.resultImage);
      } else if (data?.error) {
        setError(data.error);
      }
    } catch (err: any) {
      console.error('Try-on failed:', err);
      setError('Virtual try-on failed. Please check that the Replicate API key is configured.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="glass-card p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="font-mono text-xs text-accent uppercase tracking-widest">
                ● Virtual Try-On
              </div>
              <h3 className="text-lg font-bold tracking-tighter text-foreground mt-1">
                {product.title}
              </h3>
            </div>
            <button onClick={onClose} className="p-2 rounded-sm hover:bg-secondary transition-colors">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* User photo */}
            <div
              className="glass-card-inner aspect-[3/4] flex flex-col items-center justify-center cursor-pointer hover:border-primary/30 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {userImage ? (
                <img src={userImage} alt="Your photo" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <div className="text-center p-4">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="font-mono text-xs text-muted-foreground">Upload your photo</p>
                  <p className="font-mono text-[10px] text-muted-foreground/60 mt-1">Full body photo works best</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            {/* Result or clothing image */}
            <div className="glass-card-inner aspect-[3/4] flex flex-col items-center justify-center overflow-hidden rounded-xl">
              {loading ? (
                <div className="text-center">
                  <Loader2 className="h-8 w-8 mx-auto text-primary animate-spin mb-2" />
                  <p className="font-mono text-xs text-muted-foreground">AI processing...</p>
                  <p className="font-mono text-[10px] text-muted-foreground/60 mt-1">This may take 30-60s</p>
                </div>
              ) : resultImage ? (
                <img src={resultImage} alt="Try-on result" className="w-full h-full object-cover" />
              ) : product.thumbnail ? (
                <img src={product.thumbnail} alt={product.title} className="w-full h-full object-contain p-4 opacity-60" />
              ) : (
                <div className="text-center p-4">
                  <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="font-mono text-xs text-muted-foreground">Result will appear here</p>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="glass-card-inner p-3 mb-4 border-destructive/30">
              <p className="font-mono text-xs text-destructive">{error}</p>
            </div>
          )}

          <button
            onClick={handleTryOn}
            disabled={!userImage || loading}
            className="w-full bg-primary text-primary-foreground font-bold text-sm py-3 rounded-sm hover:brightness-110 transition-all duration-200 font-mono tracking-wide disabled:opacity-50"
          >
            {loading ? 'PROCESSING...' : 'GENERATE TRY-ON →'}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VirtualTryOn;
