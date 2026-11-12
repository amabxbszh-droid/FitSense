import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import OnboardingForm from '@/components/OnboardingForm';
import SizeResultCard from '@/components/SizeResultCard';
import ProductSearch from '@/components/ProductSearch';
import PriceDrawer from '@/components/PriceDrawer';
import { Unit, SizeResult, FitType, formatHeight, formatWeight } from '@/lib/sizeEngine';
import { Product } from '@/lib/products';

type Step = 'onboarding' | 'result' | 'browse';

const Index = () => {
  const [unit, setUnit] = useState<Unit>('imperial');
  const [step, setStep] = useState<Step>('onboarding');
  const [sizeResult, setSizeResult] = useState<SizeResult | null>(null);
  const [profile, setProfile] = useState<{ height: number; weight: number; chest: number; fitType: FitType } | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const profileSummary = useMemo(() => {
    if (!profile || !sizeResult) return undefined;
    return `${formatHeight(profile.height, unit)} • ${formatWeight(profile.weight, unit)} • ${sizeResult.size}`;
  }, [profile, sizeResult, unit]);

  const handleFormComplete = (p: typeof profile, result: SizeResult) => {
    setProfile(p);
    setSizeResult(result);
    setStep('result');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        profileSummary={profileSummary}
        unit={unit}
        onUnitToggle={() => setUnit((u) => (u === 'imperial' ? 'metric' : 'imperial'))}
      />

      <main className="container mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {step === 'onboarding' && (
            <motion.div
              key="onboarding"
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <OnboardingForm unit={unit} onComplete={handleFormComplete} />
            </motion.div>
          )}

          {step === 'result' && sizeResult && (
            <motion.div
              key="result"
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SizeResultCard result={sizeResult} onBrowse={() => setStep('browse')} />
            </motion.div>
          )}

          {step === 'browse' && sizeResult && (
            <motion.div
              key="browse"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <ProductSearch
                recommendedSize={sizeResult.size}
                sizeResult={sizeResult}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <PriceDrawer
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default Index;
