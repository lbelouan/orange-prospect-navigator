import { useAppState } from '@/lib/appState';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowUpRight, TrendingUp } from 'lucide-react';
import { RiskBadge } from '@/components/ScoreWidgets';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function AccountsPage() {
  const { accounts, setSelectedAccountId } = useAppState();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = accounts.filter(a =>
    a.company.name.toLowerCase().includes(search.toLowerCase()) ||
    a.company.industry.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Comptes</h1>
        <p className="text-sm text-muted-foreground mt-1.5">Vue d'ensemble de vos comptes et leur réseau</p>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Rechercher un compte, une industrie…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-card border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 shadow-card transition-all"
        />
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((account, i) => {
          const nonOrange = account.people.filter(p => !p.isOrangeEmployee);
          return (
            <motion.button
              key={account.company.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.08, ease: [0.4, 0, 0.2, 1] }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => {
                setSelectedAccountId(account.company.id);
                navigate('/account-map');
              }}
              className="text-left p-6 rounded-2xl bg-card border border-border/60 shadow-card hover:shadow-card-hover transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold">{account.company.name}</h3>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity -translate-y-0.5" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{account.company.industry} · {account.company.region}</p>
                </div>
                <div className="text-right">
                  <div className="w-14 h-14 rounded-2xl gradient-orange-soft flex flex-col items-center justify-center">
                    <p className="text-xl font-extrabold text-primary leading-none">{account.globalScore || 0}</p>
                    <p className="text-[8px] text-primary/60 font-semibold uppercase tracking-wider mt-0.5">Score</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex justify-between text-[11px] mb-1.5">
                    <span className="text-muted-foreground font-medium">Couverture réseau</span>
                    <span className="font-bold tabular-nums">{account.networkCoverage}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${account.networkCoverage}%` }}
                      transition={{ duration: 0.8, delay: 0.2 + i * 0.08, ease: [0.4, 0, 0.2, 1] }}
                      className="h-full rounded-full bg-primary"
                    />
                  </div>
                </div>
                {account.politicalRisk && <RiskBadge risk={account.politicalRisk} />}
              </div>

              <div className="flex items-center gap-2 mt-4 text-[11px] text-muted-foreground">
                <span className="px-2 py-0.5 rounded-full bg-secondary font-medium">{nonOrange.length} contacts</span>
                <span className="px-2 py-0.5 rounded-full bg-secondary font-medium">{account.company.size}</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
