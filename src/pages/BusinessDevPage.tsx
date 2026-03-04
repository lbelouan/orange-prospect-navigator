import { useState } from 'react';
import { useAppState } from '@/lib/appState';
import { generateProspectAccount } from '@/lib/prospectAgent';
import { getTopStakeholders, getBestIntroPaths, functionColors } from '@/lib/mockData';
import { Account } from '@/lib/types';
import { RiskBadge, ConfidenceBadge, StakeholderMiniCard, FunctionBadge } from '@/components/ScoreWidgets';
import { Rocket, ArrowRight, Plus, Loader2 } from 'lucide-react';

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
    if (result) {
      addAccount(result);
      setAdded(true);
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Business Development</h1>
        <p className="text-sm text-muted-foreground mt-1">Générez un profil prospect complet avec l'agent IA</p>
      </div>

      {/* Form */}
      <div className="bg-card rounded-xl border border-border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Nom de l'entreprise *</label>
            <input
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="Ex: Société Générale"
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Région</label>
            <input
              value={form.region}
              onChange={e => setForm(p => ({ ...p, region: e.target.value }))}
              placeholder="Ex: France"
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Industrie</label>
            <input
              value={form.industry}
              onChange={e => setForm(p => ({ ...p, industry: e.target.value }))}
              placeholder="Ex: Banque"
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Taille</label>
            <select
              value={form.size}
              onChange={e => setForm(p => ({ ...p, size: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm"
            >
              <option>Large Enterprise</option>
              <option>Mid-Market</option>
              <option>SMB</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Offre cible</label>
            <select
              value={form.offering}
              onChange={e => setForm(p => ({ ...p, offering: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm"
            >
              <option>Connectivity</option>
              <option>Cloud</option>
              <option>Cybersecurity</option>
              <option>IoT</option>
              <option>Unified Communications</option>
            </select>
          </div>
        </div>
        <button
          onClick={runAgent}
          disabled={!form.name.trim() || loading}
          className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
          {loading ? 'Analyse en cours…' : 'Lancer l\'agent prospect'}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="animate-fade-in space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <p className="text-2xl font-bold text-primary">{result.globalScore || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">Score global</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <p className="text-2xl font-bold">{result.networkCoverage}%</p>
              <p className="text-xs text-muted-foreground mt-1">Couverture</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              {result.politicalRisk && <RiskBadge risk={result.politicalRisk} />}
              <p className="text-xs text-muted-foreground mt-2">Risque politique</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <p className="text-2xl font-bold">{result.people.filter(p => !p.isOrangeEmployee).length}</p>
              <p className="text-xs text-muted-foreground mt-1">Contacts identifiés</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top stakeholders */}
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold mb-3">Top 5 Stakeholders</h3>
              <div className="space-y-2">
                {getTopStakeholders(result, 5).map(p => (
                  <StakeholderMiniCard key={p.id} person={p} />
                ))}
              </div>
            </div>

            {/* Intro paths */}
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold mb-3">Top 3 chemins d'introduction</h3>
              <div className="space-y-3">
                {getBestIntroPaths(result).map((path, i) => (
                  <div key={i} className="p-3 rounded-lg border border-border">
                    <div className="flex items-center gap-1 flex-wrap mb-1">
                      {path.steps.map((s, si) => (
                        <span key={s.id} className="flex items-center gap-1 text-sm">
                          <span className={s.isOrangeEmployee ? 'text-primary font-medium' : ''}>{s.name}</span>
                          {si < path.steps.length - 1 && <ArrowRight className="w-3 h-3 text-muted-foreground" />}
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

          {/* Functions breakdown */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold mb-3">Répartition par fonction</h3>
            <div className="flex flex-wrap gap-3">
              {Object.entries(
                result.people.filter(p => !p.isOrangeEmployee).reduce((acc, p) => {
                  acc[p.function] = (acc[p.function] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([fn, count]) => (
                <div key={fn} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: functionColors[fn] }} />
                  <span className="text-sm font-medium">{fn}</span>
                  <span className="text-xs text-muted-foreground">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Add button */}
          <button
            onClick={handleAdd}
            disabled={added}
            className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {added ? 'Ajouté aux comptes ✓' : 'Ajouter aux comptes'}
          </button>
        </div>
      )}
    </div>
  );
}
