import { Person } from '@/lib/types';
import { Shield } from 'lucide-react';
import { functionColors } from '@/lib/mockData';

interface ScoreBarProps {
  label: string;
  value: number;
  explanation?: string;
}

export function ScoreBar({ label, value, explanation }: ScoreBarProps) {
  const color = value >= 70 ? 'hsl(var(--success))' : value >= 40 ? 'hsl(var(--warning))' : 'hsl(var(--destructive))';
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}/100</span>
      </div>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      {explanation && <p className="text-[10px] text-muted-foreground">{explanation}</p>}
    </div>
  );
}

export function ConfidenceBadge({ confidence }: { confidence: number }) {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-secondary text-muted-foreground">
      <Shield className="w-2.5 h-2.5" />
      Confiance {Math.round(confidence * 100)}%
    </span>
  );
}

export function FunctionBadge({ fn }: { fn: string }) {
  const color = functionColors[fn] || '#6B7280';
  return (
    <span
      className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium"
      style={{ backgroundColor: `${color}15`, color }}
    >
      {fn}
    </span>
  );
}

export function RiskBadge({ risk }: { risk: 'low' | 'medium' | 'high' }) {
  const styles = {
    low: 'bg-success/10 text-success',
    medium: 'bg-warning/10 text-warning',
    high: 'bg-destructive/10 text-destructive',
  };
  const labels = { low: 'Risque faible', medium: 'Risque moyen', high: 'Risque élevé' };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${styles[risk]}`}>
      {labels[risk]}
    </span>
  );
}

export function StakeholderMiniCard({ person, onClick }: { person: Person; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-3 rounded-lg bg-card border border-border hover:shadow-card-hover transition-all flex items-center gap-3"
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
        style={{
          backgroundColor: `${functionColors[person.function] || '#6B7280'}20`,
          color: functionColors[person.function] || '#6B7280',
        }}
      >
        {person.name.split(' ').map(n => n[0]).join('')}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate">{person.name}</p>
        <p className="text-[11px] text-muted-foreground truncate">{person.title}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-semibold" style={{ color: functionColors[person.function] }}>{person.globalScore || 0}</p>
        <p className="text-[10px] text-muted-foreground">score</p>
      </div>
    </button>
  );
}
