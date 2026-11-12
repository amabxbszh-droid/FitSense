import { motion } from 'framer-motion';
import { SizeResult } from '@/lib/sizeEngine';

interface SizeResultCardProps {
  result: SizeResult;
  onBrowse: () => void;
}

const SizeResultCard = ({ result, onBrowse }: SizeResultCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
      className="w-full max-w-lg mx-auto"
    >
      <div className="glass-card p-8 text-center">
        <div className="font-mono text-xs text-accent uppercase tracking-widest mb-4">
          ● Size Analysis Complete
        </div>

        <div className="text-7xl font-bold tracking-tighter text-foreground mb-2">
          {result.size}
        </div>

        <div className="text-sm text-muted-foreground mb-6">
          {result.fitLabel}
        </div>

        <div className="glass-card-inner inline-flex items-center gap-2 px-4 py-2 mb-8">
          <div className="h-2 w-2 rounded-full bg-primary" />
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            Confidence: <span className="text-primary font-bold">{result.confidence}%</span>
          </span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onBrowse}
            className="flex-1 bg-primary text-primary-foreground font-bold text-sm py-3 rounded-sm hover:brightness-110 transition-all duration-200 font-mono tracking-wide"
          >
            BROWSE PRODUCTS →
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SizeResultCard;
