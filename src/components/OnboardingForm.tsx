import { useState } from 'react';
import { motion } from 'framer-motion';
import { FitType, Unit, convertToMetric, recommendSize, SizeResult } from '@/lib/sizeEngine';

interface OnboardingFormProps {
  unit: Unit;
  onComplete: (profile: { height: number; weight: number; chest: number; fitType: FitType }, result: SizeResult) => void;
}

const FIT_OPTIONS: { value: FitType; label: string; desc: string }[] = [
  { value: 'slim', label: 'SLIM', desc: 'Fitted silhouette' },
  { value: 'regular', label: 'REGULAR', desc: 'Standard proportions' },
  { value: 'baggy', label: 'BAGGY', desc: 'Oversized drape' },
  { value: 'gym', label: 'GYM', desc: 'Athletic cut' },
];

const OnboardingForm = ({ unit, onComplete }: OnboardingFormProps) => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [chest, setChest] = useState('');
  const [fitType, setFitType] = useState<FitType>('regular');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const c = parseFloat(chest);

    if (!h || h <= 0) errs.height = 'Required';
    if (!w || w <= 0) errs.weight = 'Required';
    if (!c || c <= 0) errs.chest = 'Required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const profile = {
      height: convertToMetric(parseFloat(height), 'height', unit),
      weight: convertToMetric(parseFloat(weight), 'weight', unit),
      chest: convertToMetric(parseFloat(chest), 'chest', unit),
      fitType,
    };

    const result = recommendSize(profile);
    onComplete(profile, result);
  };

  const heightLabel = unit === 'imperial' ? 'Height (in)' : 'Height (cm)';
  const weightLabel = unit === 'imperial' ? 'Weight (lbs)' : 'Weight (kg)';
  const chestLabel = unit === 'imperial' ? 'Chest (in)' : 'Chest (cm)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
      className="w-full max-w-lg mx-auto"
    >
      <div className="glass-card p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tighter text-foreground mb-2">
            Body Diagnostic
          </h1>
          <p className="text-sm text-muted-foreground">
            Input your measurements. We'll calculate your optimal size.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: heightLabel, value: height, setter: setHeight, key: 'height' },
              { label: weightLabel, value: weight, setter: setWeight, key: 'weight' },
              { label: chestLabel, value: chest, setter: setChest, key: 'chest' },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-xs font-mono text-muted-foreground mb-2 uppercase">
                  {field.label}
                </label>
                <input
                  type="number"
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-sm px-3 py-2.5 font-mono text-sm tabular-nums text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-200"
                  placeholder="0"
                />
                {errors[field.key] && (
                  <span className="text-xs text-destructive mt-1 block">{errors[field.key]}</span>
                )}
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-mono text-muted-foreground mb-3 uppercase">
              Fit Preference
            </label>
            <div className="grid grid-cols-2 gap-2">
              {FIT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFitType(opt.value)}
                  className={`glass-card-inner p-3 text-left transition-all duration-200 ${
                    fitType === opt.value
                      ? 'border-primary/40 bg-primary/5'
                      : 'hover:border-foreground/10'
                  }`}
                >
                  <span className="block text-xs font-mono font-bold tracking-wide text-foreground">
                    {opt.label}
                  </span>
                  <span className="block text-xs text-muted-foreground mt-0.5">
                    {opt.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground font-bold text-sm py-3 rounded-sm hover:brightness-110 transition-all duration-200 font-mono tracking-wide"
          >
            ANALYZE FIT →
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default OnboardingForm;
