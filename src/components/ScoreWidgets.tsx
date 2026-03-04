import { Person } from '@/lib/types';
import { Shield } from 'lucide-react';
import { functionColors } from '@/lib/mockData';
import { motion } from 'framer-motion';

interface ScoreBarProps {
  label: string;
  value: number;
  explanation?: string;
}

export function ScoreBar({ label, value, explanation }: ScoreBarProps) {
  const color = value >= 70 ? 'hsl(var(--success))' : value >= 40 ? 'hsl(var(--warning))' : 'hsl(var(--destructive))';
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground font-medium">{label}</span>
        <span className="font-bold tabular-nums">{value}<span className="text-muted-foreground font-normal">/100</span></span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      {explanation && <p className="text-[10px] text-muted-foreground leading-relaxed">{explanation}</p>}
    </div>
  );
}

export function ConfidenceBadge({ confidence }: { confidence: number }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-secondary text-muted-foreground border border-border/50">
      <Shield className="w-2.5 h-2.5" />
      Confiance {Math.round(confidence * 100)}%
    </span>
  );
}

export function FunctionBadge({ fn }: { fn: string }) {
  const color = functionColors[fn] || '#6B7280';
  return (
    <span
      className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide"
      style={{ backgroundColor: `${color}12`, color, border: `1px solid ${color}20` }}
    >
      {fn}
    </span>
  );
}

export function RiskBadge({ risk }: { risk: 'low' | 'medium' | 'high' }) {
  const styles = {
    low: 'bg-success/10 text-success border-success/20',
    medium: 'bg-warning/10 text-warning border-warning/20',
    high: 'bg-destructive/10 text-destructive border-destructive/20',
  };
  const labels = { low: 'Risque faible', medium: 'Risque moyen', high: 'Risque élevé' };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${styles[risk]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${risk === 'low' ? 'bg-success' : risk === 'medium' ? 'bg-warning' : 'bg-destructive'}`} />
      {labels[risk]}
    </span>
  );
}

export function StakeholderMiniCard({ person, onClick }: { person: Person; onClick?: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="w-full text-left p-3 rounded-xl bg-card border border-border/60 hover:shadow-card-hover transition-all duration-200 flex items-center gap-3 group"
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 transition-transform group-hover:scale-105"
        style={{
          backgroundColor: `${functionColors[person.function] || '#6B7280'}15`,
          color: functionColors[person.function] || '#6B7280',
        }}
      >
        {person.name.split(' ').map(n => n[0]).join('')}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold truncate">{person.name}</p>
        <p className="text-[11px] text-muted-foreground truncate">{person.title}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold tabular-nums" style={{ color: functionColors[person.function] }}>{person.globalScore || 0}</p>
        <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium">score</p>
      </div>
    </motion.button>
  );
}
