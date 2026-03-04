import { useAppState } from '@/lib/appState';
import { getTopStakeholders, getBestIntroPaths, generateActions } from '@/lib/mockData';
import { ConfidenceBadge, FunctionBadge, ScoreBar } from '@/components/ScoreWidgets';
import { ArrowRight, CheckCircle2, Circle, Calendar, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ActionItem } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

export default function DealStrategyPage() {
  const { accounts, selectedAccountId, setSelectedAccountId } = useAppState();
  const account = accounts.find(a => a.company.id === selectedAccountId) || accounts[0];
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [showPlan, setShowPlan] = useState(false);

  useEffect(() => {
    if (!selectedAccountId && accounts.length > 0) setSelectedAccountId(accounts[0].company.id);
  }, [selectedAccountId, accounts, setSelectedAccountId]);

  useEffect(() => {
    if (account) setActions(generateActions(account));
  }, [account]);

  if (!account) return null;

  const priorityList = getTopStakeholders(account, 10);
  const introPaths = getBestIntroPaths(account);

  const toggleAction = (id: string) => {
    setActions(prev => prev.map(a => a.id === id ? { ...a, done: !a.done } : a));
  };

  const plan7Days = [
    { day: 'Jour 1', action: `Briefer ${introPaths[0]?.steps[0]?.name || 'le contact Orange'} sur l'objectif et préparer le pitch` },
    { day: 'Jour 2', action: `Envoyer un email d'introduction au contact cible via le chemin identifié` },
    { day: 'Jour 3', action: `Follow-up LinkedIn avec une approche personnalisée` },
    { day: 'Jour 4', action: `Préparer une proposition de valeur adaptée au secteur ${account.company.industry}` },
    { day: 'Jour 5', action: `Planifier un call exploratoire de 30 minutes` },
    { day: 'Jour 6', action: `Préparer un one-pager avec les cas d'usage pertinents` },
    { day: 'Jour 7', action: `Débriefer avec l'équipe et ajuster la stratégie` },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <select
          value={account.company.id}
          onChange={e => setSelectedAccountId(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-card border border-border/60 text-sm font-medium shadow-card"
        >
          {accounts.map(a => <option key={a.company.id} value={a.company.id}>{a.company.name}</option>)}
        </select>
        <h1 className="text-2xl font-extrabold">Stratégie — {account.company.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority list */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="lg:col-span-1 bg-card rounded-2xl border border-border/60 p-5 shadow-card"
        >
          <h2 className="text-sm font-bold mb-1">Priorité des stakeholders</h2>
          <p className="text-[11px] text-muted-foreground mb-4">Ordre recommandé d'engagement</p>
          <div className="space-y-1.5">
            {priorityList.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary/60 transition-colors"
              >
                <span className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center text-[10px] text-primary-foreground font-bold flex-shrink-0">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">{p.title}</p>
                </div>
                <FunctionBadge fn={p.function} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Intro paths + Actions */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="bg-card rounded-2xl border border-border/60 p-5 shadow-card"
          >
            <h2 className="text-sm font-bold mb-4">Meilleurs chemins d'introduction</h2>
            <div className="space-y-3">
              {introPaths.map((path, i) => (
                <div key={i} className="p-3.5 rounded-xl border border-border/60 hover:border-primary/20 transition-colors">
                  <div className="flex items-center gap-1.5 flex-wrap mb-2">
                    {path.steps.map((s, si) => (
                      <span key={s.id} className="flex items-center gap-1.5 text-sm">
                        <span className={s.isOrangeEmployee ? 'text-primary font-bold' : 'font-semibold'}>{s.name}</span>
                        {si < path.steps.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/50" />}
                      </span>
                    ))}
                  </div>
                  <ConfidenceBadge confidence={path.confidence} />
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            className="bg-card rounded-2xl border border-border/60 p-5 shadow-card"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold">Prochaines actions</h2>
              <button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity shadow-md shadow-primary/20">
                Créer les tâches
              </button>
            </div>
            <div className="space-y-1.5">
              {actions.map(a => (
                <button
                  key={a.id}
                  onClick={() => toggleAction(a.id)}
                  className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors text-left group"
                >
                  {a.done
                    ? <CheckCircle2 className="w-4.5 h-4.5 text-success flex-shrink-0 mt-0.5" />
                    : <Circle className="w-4.5 h-4.5 text-muted-foreground/40 flex-shrink-0 mt-0.5 group-hover:text-primary/60 transition-colors" />
                  }
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm ${a.done ? 'line-through text-muted-foreground' : 'font-medium'}`}>{a.text}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${a.priority === 'high' ? 'bg-destructive/10 text-destructive' : a.priority === 'medium' ? 'bg-warning/10 text-warning' : 'bg-secondary text-muted-foreground'}`}>
                      {a.priority === 'high' ? 'Haute' : a.priority === 'medium' ? 'Moyenne' : 'Basse'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.3 }}
            className="bg-card rounded-2xl border border-border/60 p-5 shadow-card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-bold">Plan 7 jours</h2>
              </div>
              <button
                onClick={() => setShowPlan(!showPlan)}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-md shadow-primary/20"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {showPlan ? 'Masquer' : 'Générer'}
              </button>
            </div>
            <AnimatePresence>
              {showPlan && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2 overflow-hidden"
                >
                  {plan7Days.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex gap-3 p-3 rounded-xl border border-border/60"
                    >
                      <span className="text-xs font-bold text-primary w-14 flex-shrink-0 pt-0.5">{item.day}</span>
                      <p className="text-sm">{item.action}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
