import { useState } from 'react';
import { Download, Upload, Save, History, SlidersHorizontal } from 'lucide-react';
import { useAppState } from '@/lib/appState';

export default function AdminPage() {
  const { accounts } = useAppState();
  const [weights, setWeights] = useState({ influence: 50, access: 30, relationship: 20 });
  const [logs] = useState([
    { time: '2026-03-04 10:32', action: 'Agent prospect lancé', user: 'Jean Dupont', target: 'Société Générale' },
    { time: '2026-03-04 09:15', action: 'Stakeholder modifié', user: 'Jean Dupont', target: 'Marc Durand (AXA)' },
    { time: '2026-03-03 16:45', action: 'Compte ajouté', user: 'Jean Dupont', target: 'Carrefour Europe' },
    { time: '2026-03-03 14:20', action: 'Score recalculé', user: 'Système', target: 'AXA France' },
    { time: '2026-03-02 11:00', action: 'Import CRM', user: 'Jean Dupont', target: '24 contacts' },
  ]);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Administration</h1>
        <p className="text-sm text-muted-foreground mt-1">Gestion des données et paramètres du scoring</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Import/Export */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="text-sm font-semibold mb-4">Import / Export</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary transition-colors text-left">
              <Download className="w-4 h-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Exporter les données</p>
                <p className="text-[11px] text-muted-foreground">Format JSON — {accounts.length} comptes</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary transition-colors text-left">
              <Upload className="w-4 h-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Importer des données</p>
                <p className="text-[11px] text-muted-foreground">JSON compatible avec le format PNI</p>
              </div>
            </button>
          </div>
        </div>

        {/* Scoring weights */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold">Pondération du scoring</h2>
          </div>
          <div className="space-y-4">
            {[
              { key: 'influence' as const, label: 'Influence', desc: 'Poids dans les décisions' },
              { key: 'access' as const, label: 'Accès', desc: 'Facilité à joindre le contact' },
              { key: 'relationship' as const, label: 'Relation', desc: 'Qualité de la relation existante' },
            ].map(item => (
              <div key={item.key}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{item.label}</span>
                  <span className="font-medium">{weights[item.key]}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={weights[item.key]}
                  onChange={e => setWeights(p => ({ ...p, [item.key]: Number(e.target.value) }))}
                  className="w-full h-1.5 rounded-full appearance-none bg-secondary accent-primary"
                />
                <p className="text-[10px] text-muted-foreground">{item.desc}</p>
              </div>
            ))}
            <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 flex items-center gap-2">
              <Save className="w-3 h-3" />
              Appliquer
            </button>
          </div>
        </div>

        {/* Audit log */}
        <div className="bg-card rounded-xl border border-border p-5 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold">Journal d'activité</h2>
          </div>
          <div className="space-y-1">
            {logs.map((log, i) => (
              <div key={i} className="flex items-center gap-4 p-2.5 rounded-lg hover:bg-secondary text-sm">
                <span className="text-xs text-muted-foreground w-36 flex-shrink-0">{log.time}</span>
                <span className="flex-1">{log.action}</span>
                <span className="text-xs text-muted-foreground">{log.target}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{log.user}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
