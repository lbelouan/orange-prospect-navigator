import { useState } from 'react';
import { Download, Upload, Save, History, SlidersHorizontal } from 'lucide-react';
import { useAppState } from '@/lib/appState';
import { motion } from 'framer-motion';

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
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Administration</h1>
        <p className="text-sm text-muted-foreground mt-1.5">Gestion des données et paramètres du scoring</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Import/Export */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border/60 p-5 shadow-card"
        >
          <h2 className="text-sm font-bold mb-4">Import / Export</h2>
          <div className="space-y-3">
            {[
              { icon: Download, label: 'Exporter les données', desc: `Format JSON — ${accounts.length} comptes` },
              { icon: Upload, label: 'Importer des données', desc: 'JSON compatible avec le format PNI' },
            ].map((item, i) => (
              <motion.button
                key={i}
                whileHover={{ x: 2 }}
                className="w-full flex items-center gap-3.5 p-4 rounded-xl border border-border/60 hover:border-primary/20 hover:bg-secondary/30 transition-all text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Scoring weights */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl border border-border/60 p-5 shadow-card"
        >
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-sm font-bold">Pondération du scoring</h2>
          </div>
          <div className="space-y-5">
            {[
              { key: 'influence' as const, label: 'Influence', desc: 'Poids dans les décisions' },
              { key: 'access' as const, label: 'Accès', desc: 'Facilité à joindre le contact' },
              { key: 'relationship' as const, label: 'Relation', desc: 'Qualité de la relation existante' },
            ].map(item => (
              <div key={item.key}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold">{item.label}</span>
                  <span className="font-bold text-primary tabular-nums">{weights[item.key]}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={weights[item.key]}
                  onChange={e => setWeights(p => ({ ...p, [item.key]: Number(e.target.value) }))}
                  className="w-full h-2 rounded-full appearance-none bg-secondary accent-primary cursor-pointer"
                />
                <p className="text-[10px] text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 flex items-center gap-2 shadow-md shadow-primary/20"
            >
              <Save className="w-3.5 h-3.5" />
              Appliquer
            </motion.button>
          </div>
        </motion.div>

        {/* Audit log */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl border border-border/60 p-5 lg:col-span-2 shadow-card"
        >
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <History className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-sm font-bold">Journal d'activité</h2>
          </div>
          <div className="space-y-1">
            {logs.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/40 transition-colors text-sm"
              >
                <span className="text-xs text-muted-foreground w-36 flex-shrink-0 tabular-nums font-medium">{log.time}</span>
                <span className="flex-1 font-medium">{log.action}</span>
                <span className="text-xs text-muted-foreground">{log.target}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-semibold">{log.user}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
