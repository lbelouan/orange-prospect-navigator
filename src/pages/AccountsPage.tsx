import { useAppState } from '@/lib/appState';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { RiskBadge } from '@/components/ScoreWidgets';
import { useState } from 'react';

export default function AccountsPage() {
  const { accounts, setSelectedAccountId } = useAppState();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = accounts.filter(a =>
    a.company.name.toLowerCase().includes(search.toLowerCase()) ||
    a.company.industry.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Comptes</h1>
        <p className="text-sm text-muted-foreground mt-1">Vue d'ensemble de vos comptes et leur réseau</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Rechercher un compte, une industrie…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(account => {
          const nonOrange = account.people.filter(p => !p.isOrangeEmployee);
          return (
            <button
              key={account.company.id}
              onClick={() => {
                setSelectedAccountId(account.company.id);
                navigate('/account-map');
              }}
              className="text-left p-5 rounded-xl bg-card border border-border shadow-card hover:shadow-card-hover transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold">{account.company.name}</h3>
                  <p className="text-xs text-muted-foreground">{account.company.industry} · {account.company.region}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{account.globalScore || 0}</p>
                  <p className="text-[10px] text-muted-foreground">Score global</p>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-3">
                <div className="flex-1">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-muted-foreground">Couverture réseau</span>
                    <span className="font-medium">{account.networkCoverage}%</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${account.networkCoverage}%` }} />
                  </div>
                </div>
                {account.politicalRisk && <RiskBadge risk={account.politicalRisk} />}
              </div>

              <div className="flex items-center gap-2 mt-3 text-[11px] text-muted-foreground">
                <span>{nonOrange.length} contacts</span>
                <span>·</span>
                <span>{account.company.size}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
