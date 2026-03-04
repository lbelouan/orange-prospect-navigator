import { useAppState } from '@/lib/appState';
import { getTopStakeholders, getBestIntroPaths, generateActions } from '@/lib/mockData';
import { ConfidenceBadge, FunctionBadge, ScoreBar } from '@/components/ScoreWidgets';
import { ArrowRight, CheckCircle2, Circle, Calendar, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ActionItem } from '@/lib/types';

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
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <select
          value={account.company.id}
          onChange={e => setSelectedAccountId(e.target.value)}
          className="px-3 py-2 rounded-lg bg-card border border-border text-sm"
        >
          {accounts.map(a => <option key={a.company.id} value={a.company.id}>{a.company.name}</option>)}
        </select>
        <h1 className="text-2xl font-bold">Stratégie — {account.company.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority list */}
        <div className="lg:col-span-1 bg-card rounded-xl border border-border p-5">
          <h2 className="text-sm font-semibold mb-3">Priorité des stakeholders</h2>
          <p className="text-[11px] text-muted-foreground mb-3">Ordre recommandé d'engagement</p>
          <div className="space-y-2">
            {priorityList.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors">
                <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] text-primary-foreground font-bold flex-shrink-0">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">{p.title}</p>
                </div>
                <FunctionBadge fn={p.function} />
              </div>
            ))}
          </div>
        </div>

        {/* Intro paths + Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Best intro paths */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="text-sm font-semibold mb-3">Meilleurs chemins d'introduction</h2>
            <div className="space-y-3">
              {introPaths.map((path, i) => (
                <div key={i} className="p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-1 flex-wrap mb-2">
                    {path.steps.map((s, si) => (
                      <span key={s.id} className="flex items-center gap-1 text-sm">
                        <span className={s.isOrangeEmployee ? 'text-primary font-medium' : 'font-medium'}>{s.name}</span>
                        {si < path.steps.length - 1 && <ArrowRight className="w-3 h-3 text-muted-foreground" />}
                      </span>
                    ))}
                  </div>
                  <ConfidenceBadge confidence={path.confidence} />
                </div>
              ))}
            </div>
          </div>

          {/* Actions checklist */}
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold">Prochaines actions</h2>
              <button className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity">
                Créer les tâches
              </button>
            </div>
            <div className="space-y-2">
              {actions.map(a => (
                <button
                  key={a.id}
                  onClick={() => toggleAction(a.id)}
                  className="w-full flex items-start gap-3 p-2.5 rounded-lg hover:bg-secondary transition-colors text-left"
                >
                  {a.done
                    ? <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    : <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  }
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm ${a.done ? 'line-through text-muted-foreground' : ''}`}>{a.text}</p>
                    <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] ${a.priority === 'high' ? 'bg-destructive/10 text-destructive' : a.priority === 'medium' ? 'bg-warning/10 text-warning' : 'bg-secondary text-muted-foreground'}`}>
                      {a.priority === 'high' ? 'Priorité haute' : a.priority === 'medium' ? 'Priorité moyenne' : 'Priorité basse'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 7-day plan */}
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-semibold">Plan 7 jours</h2>
              </div>
              <button
                onClick={() => setShowPlan(!showPlan)}
                className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                {showPlan ? 'Masquer' : 'Générer le plan'}
              </button>
            </div>
            {showPlan && (
              <div className="space-y-2 animate-fade-in">
                {plan7Days.map((item, i) => (
                  <div key={i} className="flex gap-3 p-2.5 rounded-lg border border-border">
                    <span className="text-xs font-semibold text-primary w-14 flex-shrink-0">{item.day}</span>
                    <p className="text-sm">{item.action}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
