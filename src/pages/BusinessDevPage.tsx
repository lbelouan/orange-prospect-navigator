import { useState } from 'react';
import { useAppState } from '@/lib/appState';
import { generateProspectAccount } from '@/lib/prospectAgent';
import { getTopStakeholders, getBestIntroPaths, functionColors } from '@/lib/mockData';
import { Account } from '@/lib/types';
import { RiskBadge, ConfidenceBadge, StakeholderMiniCard, FunctionBadge } from '@/components/ScoreWidgets';
import { Rocket, ArrowRight, Plus, Loader2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BusinessDevPage() {
  const { addAccount } = useAppState();
  const [form, setForm] = useState({ name: '', region: '', industry: '', size: 'Large Enterprise', offering: 'Connectivity' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Account | null>(null);
  const [added, setAdded] = useState(false);

  const runAgent = () => {
    if (!form.name.trim()) return;
    setLoading(true);
    setAdded(false);
    setTimeout(() => {
      const account = generateProspectAccount(form.name, form.region, form.industry, form.size);
      setResult(account);
      setLoading(false);
    }, 1500);
  };

  const handleAdd = () => {
    if (result) { addAccount(result); setAdded(true); }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl bg-background border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all";

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Business Development</h1>
        <p className="text-sm text-muted-foreground mt-1.5">Générez un profil prospect complet avec l'agent IA</p>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl border border-border/60 p-6 mb-8 shadow-card"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
          {[
            { key: 'name', label: 'Nom de l\'entreprise *', placeholder: 'Ex: Société Générale', type: 'input' },
            { key: 'region', label: 'Région', placeholder: 'Ex: France', type: 'input' },
            { key: 'industry', label: 'Industrie', placeholder: 'Ex: Banque', type: 'input' },
          ].map(field => (
            <div key={field.key}>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">{field.label}</label>
              <input
                value={(form as any)[field.key]}
                onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                className={inputClass}
              />
            </div>
          ))}
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Taille</label>
            <select value={form.size} onChange={e => setForm(p => ({ ...p, size: e.target.value }))} className={inputClass}>
              <option>Large Enterprise</option>
              <option>Mid-Market</option>
              <option>SMB</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Offre cible</label>
            <select value={form.offering} onChange={e => setForm(p => ({ ...p, offering: e.target.value }))} className={inputClass}>
              <option>Connectivity</option>
              <option>Cloud</option>
              <option>Cybersecurity</option>
              <option>IoT</option>
              <option>Unified Communications</option>
            </select>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={runAgent}
          disabled={!form.name.trim() || loading}
          className="px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2.5 shadow-lg shadow-primary/25"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
          {loading ? 'Analyse en cours…' : 'Lancer l\'agent prospect'}
        </motion.button>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: result.globalScore || 0, label: 'Score global', highlight: true },
                { value: `${result.networkCoverage}%`, label: 'Couverture' },
                { value: null, label: 'Risque politique', risk: result.politicalRisk },
                { value: result.people.filter(p => !p.isOrangeEmployee).length, label: 'Contacts identifiés' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08 }}
                  className={`rounded-2xl border border-border/60 p-5 text-center shadow-card ${item.highlight ? 'gradient-orange-soft border-primary/10' : 'bg-card'}`}
                >
                  {item.risk ? (
                    <RiskBadge risk={item.risk} />
                  ) : (
                    <p className={`text-2xl font-extrabold ${item.highlight ? 'text-primary' : ''}`}>{item.value}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1.5 font-medium">{item.label}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card rounded-2xl border border-border/60 p-5 shadow-card">
                <h3 className="text-sm font-bold mb-4">Top 5 Stakeholders</h3>
                <div className="space-y-2">
                  {getTopStakeholders(result, 5).map(p => (
                    <StakeholderMiniCard key={p.id} person={p} />
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-2xl border border-border/60 p-5 shadow-card">
                <h3 className="text-sm font-bold mb-4">Top 3 chemins d'introduction</h3>
                <div className="space-y-3">
                  {getBestIntroPaths(result).map((path, i) => (
                    <div key={i} className="p-3.5 rounded-xl border border-border/60">
                      <div className="flex items-center gap-1.5 flex-wrap mb-2">
                        {path.steps.map((s, si) => (
                          <span key={s.id} className="flex items-center gap-1.5 text-sm">
                            <span className={s.isOrangeEmployee ? 'text-primary font-bold' : 'font-medium'}>{s.name}</span>
                            {si < path.steps.length - 1 && <ArrowRight className="w-3 h-3 text-muted-foreground/50" />}
                          </span>
                        ))}
                      </div>
                      <ConfidenceBadge confidence={path.confidence} />
                    </div>
                  ))}
                  {getBestIntroPaths(result).length === 0 && (
                    <p className="text-sm text-muted-foreground">Aucun chemin identifié</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border/60 p-5 shadow-card">
              <h3 className="text-sm font-bold mb-4">Répartition par fonction</h3>
              <div className="flex flex-wrap gap-3">
                {Object.entries(
                  result.people.filter(p => !p.isOrangeEmployee).reduce((acc, p) => {
                    acc[p.function] = (acc[p.function] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([fn, count]) => (
                  <div key={fn} className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-border/60 bg-secondary/30">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: functionColors[fn] }} />
                    <span className="text-sm font-semibold">{fn}</span>
                    <span className="text-xs text-muted-foreground font-medium bg-secondary px-1.5 py-0.5 rounded-full">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAdd}
              disabled={added}
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2.5 shadow-lg shadow-primary/25"
            >
              {added ? <Zap className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {added ? 'Ajouté aux comptes ✓' : 'Ajouter aux comptes'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
