import { Unit } from '@/lib/sizeEngine';

interface HeaderProps {
  profileSummary?: string;
  unit: Unit;
  onUnitToggle: () => void;
}

const Header = ({ profileSummary, unit, onUnitToggle }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 glass-card border-b border-border/50 px-6 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <div className="font-mono text-sm font-bold tracking-tight text-primary">
          FITSENSE<span className="text-muted-foreground">_</span>
        </div>

        {profileSummary && (
          <div className="hidden md:flex items-center gap-2 font-mono text-xs text-muted-foreground tabular-nums">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            {profileSummary}
          </div>
        )}

        <button
          onClick={onUnitToggle}
          className="glass-card-inner px-3 py-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          {unit === 'imperial' ? 'IN / LBS' : 'CM / KG'}
        </button>
      </div>
    </header>
  );
};

export default Header;
