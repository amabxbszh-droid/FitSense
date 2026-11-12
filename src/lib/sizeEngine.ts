export type FitType = 'slim' | 'regular' | 'baggy' | 'gym';
export type Unit = 'imperial' | 'metric';

export interface BodyProfile {
  height: number; // cm
  weight: number; // kg
  chest: number; // cm
  fitType: FitType;
}

export interface SizeResult {
  size: string;
  confidence: number;
  fitLabel: string;
}

const SIZE_CHART: { max: number; size: string }[] = [
  { max: 86, size: 'XS' },
  { max: 91, size: 'S' },
  { max: 97, size: 'M' },
  { max: 104, size: 'L' },
  { max: 112, size: 'XL' },
  { max: 120, size: 'XXL' },
];

const FIT_LABELS: Record<FitType, string> = {
  slim: 'Slim Fit',
  regular: 'Regular Fit',
  baggy: 'Baggy Fit',
  gym: 'Gym Fit',
};

const FIT_OFFSET: Record<FitType, number> = {
  slim: -1,
  regular: 0,
  baggy: 1,
  gym: 0,
};

export function convertToMetric(value: number, type: 'height' | 'weight' | 'chest', unit: Unit): number {
  if (unit === 'metric') return value;
  if (type === 'weight') return value * 0.453592; // lbs to kg
  return value * 2.54; // inches to cm
}

export function recommendSize(profile: BodyProfile): SizeResult {
  const chestCm = profile.chest;
  let sizeIndex = SIZE_CHART.findIndex((s) => chestCm <= s.max);
  if (sizeIndex === -1) sizeIndex = SIZE_CHART.length - 1;

  const offset = FIT_OFFSET[profile.fitType];
  sizeIndex = Math.max(0, Math.min(SIZE_CHART.length - 1, sizeIndex + offset));

  const confidence = Math.min(98, Math.max(72, 95 - Math.abs(chestCm - (SIZE_CHART[sizeIndex].max - 4)) * 0.8));

  return {
    size: SIZE_CHART[sizeIndex].size,
    confidence: Math.round(confidence),
    fitLabel: FIT_LABELS[profile.fitType],
  };
}

export function formatHeight(cm: number, unit: Unit): string {
  if (unit === 'metric') return `${cm}cm`;
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}'${inches}"`;
}

export function formatWeight(kg: number, unit: Unit): string {
  if (unit === 'metric') return `${kg}kg`;
  return `${Math.round(kg / 0.453592)}lbs`;
}
