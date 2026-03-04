import { useAppState } from '@/lib/appState';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getTopStakeholders, getChampions, getBlockers, getGaps, functionColors, getIntroPaths } from '@/lib/mockData';
import { Person, Account } from '@/lib/types';
import { ScoreBar, ConfidenceBadge, FunctionBadge, StakeholderMiniCard, RiskBadge } from '@/components/ScoreWidgets';
import { X, ArrowRight, Sparkles, AlertTriangle, UserCheck, ShieldAlert, Layers } from 'lucide-react';

// Simple force-directed graph with SVG
function NetworkGraph({ account, onSelectNode }: { account: Account; onSelectNode: (p: Person) => void }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});

  const nodes = useMemo(() => account.people.filter(p => !p.isOrangeEmployee), [account]);
  const orangeNodes = useMemo(() => account.people.filter(p => p.isOrangeEmployee), [account]);
  const allNodes = useMemo(() => [...nodes, ...orangeNodes], [nodes, orangeNodes]);

  useEffect(() => {
    const w = 700, h = 500;
    const pos: Record<string, { x: number; y: number }> = {};

    // Position by function groups
    const groups: Record<string, Person[]> = {};
    nodes.forEach(n => {
      if (!groups[n.function]) groups[n.function] = [];
      groups[n.function].push(n);
    });

    const funcs = Object.keys(groups);
    const angleStep = (2 * Math.PI) / Math.max(funcs.length, 1);

    funcs.forEach((fn, fi) => {
      const cx = w / 2 + Math.cos(angleStep * fi - Math.PI / 2) * 180;
      const cy = h / 2 + Math.sin(angleStep * fi - Math.PI / 2) * 150;
      groups[fn].forEach((p, pi) => {
        const a2 = (2 * Math.PI * pi) / groups[fn].length;
        pos[p.id] = {
          x: cx + Math.cos(a2) * (40 + groups[fn].length * 8),
          y: cy + Math.sin(a2) * (40 + groups[fn].length * 8),
        };
      });
    });

    // Orange contacts in a cluster at bottom
    orangeNodes.forEach((o, i) => {
      pos[o.id] = {
        x: w / 2 - 80 + i * 50,
        y: h - 50,
      };
    });

    setPositions(pos);
  }, [nodes, orangeNodes]);

  const nodeRadius = (p: Person) => {
    const score = p.globalScore || 0;
    return p.isOrangeEmployee ? 12 : 10 + (score / 100) * 12;
  };

  return (
    <svg ref={svgRef} viewBox="0 0 700 500" className="w-full h-full">
      {/* Edges */}
      {account.edges.map(e => {
        const s = positions[e.source];
        const t = positions[e.target];
        if (!s || !t) return null;
        return (
          <line
            key={e.id}
            x1={s.x} y1={s.y} x2={t.x} y2={t.y}
            stroke="hsl(0 0% 80%)"
            strokeWidth={e.weight * 2}
            strokeOpacity={0.4}
          />
        );
      })}

      {/* Nodes */}
      {allNodes.map(p => {
        const pos = positions[p.id];
        if (!pos) return null;
        const r = nodeRadius(p);
        const fill = p.isOrangeEmployee ? '#FF7900' : functionColors[p.function] || '#6B7280';

        return (
          <g key={p.id} onClick={() => onSelectNode(p)} className="cursor-pointer">
            <circle cx={pos.x} cy={pos.y} r={r} fill={fill} opacity={0.85} />
            <circle cx={pos.x} cy={pos.y} r={r} fill="none" stroke={fill} strokeWidth={1.5} opacity={0.3} />
            <text
              x={pos.x}
              y={pos.y + r + 12}
              textAnchor="middle"
              className="text-[9px] fill-current"
              style={{ fill: 'hsl(0 0% 40%)' }}
            >
              {p.name.split(' ')[1] || p.name.split(' ')[0]}
            </text>
          </g>
        );
      })}

      {/* Legend */}
      {Object.entries(functionColors).map(([fn, color], i) => (
        <g key={fn} transform={`translate(10, ${15 + i * 18})`}>
          <circle r={5} cx={5} cy={0} fill={color} opacity={0.8} />
          <text x={15} y={4} className="text-[10px]" style={{ fill: 'hsl(0 0% 40%)' }}>{fn}</text>
        </g>
      ))}
      <g transform="translate(10, 105)">
        <circle r={5} cx={5} cy={0} fill="#FF7900" />
        <text x={15} y={4} className="text-[10px]" style={{ fill: 'hsl(0 0% 40%)' }}>Orange</text>
      </g>
    </svg>
  );
}

// Stakeholder Drawer
function StakeholderDrawer({ person, account, onClose }: { person: Person; account: Account; onClose: () => void }) {
  const paths = getIntroPaths(account, person.id);

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-card border-l border-border shadow-xl z-50 overflow-y-auto animate-slide-in">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{person.name}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-secondary"><X className="w-4 h-4" /></button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <FunctionBadge fn={person.function} />
          <span className="text-xs text-muted-foreground">{person.title}</span>
        </div>

        {person.confidence < 1 && (
          <div className="mb-4">
            <ConfidenceBadge confidence={person.confidence} />
          </div>
        )}

        <div className="space-y-3 mb-6">
          <ScoreBar label="Influence" value={person.influenceScore || 0} explanation="Poids dans les décisions, basé sur sa position et ses connexions" />
          <ScoreBar label="Accès" value={person.accessScore || 0} explanation="Facilité à le joindre via vos contacts Orange" />
          <ScoreBar label="Relation" value={person.relationshipScore || 0} explanation="Qualité de la relation existante avec Orange" />
        </div>

        <div className="p-3 rounded-lg bg-secondary/50 mb-4">
          <p className="text-xs font-medium mb-1">Score global</p>
          <p className="text-2xl font-bold text-primary">{person.globalScore || 0}<span className="text-sm text-muted-foreground font-normal">/100</span></p>
        </div>

        {/* Intro paths */}
        {paths.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-2">Chemins d'introduction</h4>
            {paths.map((path, i) => (
              <div key={i} className="p-2.5 rounded-lg border border-border mb-2 text-xs">
                <div className="flex items-center gap-1 flex-wrap">
                  {path.steps.map((s, si) => (
                    <span key={s.id} className="flex items-center gap-1">
                      <span className={s.isOrangeEmployee ? 'text-primary font-medium' : ''}>{s.name}</span>
                      {si < path.steps.length - 1 && <ArrowRight className="w-3 h-3 text-muted-foreground" />}
                    </span>
                  ))}
                </div>
                <ConfidenceBadge confidence={path.confidence} />
              </div>
            ))}
          </div>
        )}

        {/* Quick actions */}
        <div>
          <h4 className="text-sm font-medium mb-2">Actions recommandées</h4>
          <div className="space-y-2">
            <button className="w-full text-left p-2.5 rounded-lg border border-border text-xs hover:bg-secondary transition-colors">
              📧 Envoyer un email d'introduction via {paths[0]?.steps[0]?.name || 'un contact Orange'}
            </button>
            <button className="w-full text-left p-2.5 rounded-lg border border-border text-xs hover:bg-secondary transition-colors">
              📅 Planifier une réunion exploratoire
            </button>
            <button className="w-full text-left p-2.5 rounded-lg border border-border text-xs hover:bg-secondary transition-colors">
              🔍 Rechercher des intérêts communs pour le pitch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AccountMapPage() {
  const { accounts, selectedAccountId, setSelectedAccountId } = useAppState();
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const account = accounts.find(a => a.company.id === selectedAccountId) || accounts[0];

  useEffect(() => {
    if (!selectedAccountId && accounts.length > 0) {
      setSelectedAccountId(accounts[0].company.id);
    }
  }, [selectedAccountId, accounts, setSelectedAccountId]);

  if (!account) return <div className="text-center py-20 text-muted-foreground">Sélectionnez un compte</div>;

  const top = getTopStakeholders(account);
  const champions = getChampions(account);
  const blockers = getBlockers(account);
  const gaps = getGaps(account);

  return (
    <div className="animate-fade-in">
      {/* Account selector */}
      <div className="flex items-center gap-4 mb-4">
        <select
          value={account.company.id}
          onChange={e => setSelectedAccountId(e.target.value)}
          className="px-3 py-2 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {accounts.map(a => (
            <option key={a.company.id} value={a.company.id}>{a.company.name}</option>
          ))}
        </select>
        <h1 className="text-xl font-bold">{account.company.name}</h1>
        {account.politicalRisk && <RiskBadge risk={account.politicalRisk} />}
      </div>

      <div className="flex gap-6">
        {/* Graph */}
        <div className="flex-1 bg-card rounded-xl border border-border p-4 min-h-[500px]">
          <NetworkGraph account={account} onSelectNode={setSelectedPerson} />
        </div>

        {/* Side panel */}
        <div className="w-72 space-y-4 flex-shrink-0">
          {/* Top Stakeholders */}
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold">Top Stakeholders</h3>
            </div>
            <div className="space-y-2">
              {top.map(p => (
                <StakeholderMiniCard key={p.id} person={p} onClick={() => setSelectedPerson(p)} />
              ))}
            </div>
          </div>

          {/* Champions */}
          {champions.length > 0 && (
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <UserCheck className="w-4 h-4 text-success" />
                <h3 className="text-sm font-semibold">Champions</h3>
              </div>
              <p className="text-[11px] text-muted-foreground mb-2">Bon accès + haute influence</p>
              {champions.slice(0, 3).map(p => (
                <StakeholderMiniCard key={p.id} person={p} onClick={() => setSelectedPerson(p)} />
              ))}
            </div>
          )}

          {/* Blockers */}
          {blockers.length > 0 && (
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert className="w-4 h-4 text-destructive" />
                <h3 className="text-sm font-semibold">Bloqueurs</h3>
              </div>
              <p className="text-[11px] text-muted-foreground mb-2">Haute influence + relation faible</p>
              {blockers.slice(0, 3).map(p => (
                <StakeholderMiniCard key={p.id} person={p} onClick={() => setSelectedPerson(p)} />
              ))}
            </div>
          )}

          {/* Gaps */}
          {gaps.length > 0 && (
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4 text-warning" />
                <h3 className="text-sm font-semibold">Fonctions manquantes</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {gaps.map(g => (
                  <FunctionBadge key={g} fn={g} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Drawer */}
      {selectedPerson && (
        <>
          <div className="fixed inset-0 bg-foreground/20 z-40" onClick={() => setSelectedPerson(null)} />
          <StakeholderDrawer person={selectedPerson} account={account} onClose={() => setSelectedPerson(null)} />
        </>
      )}
    </div>
  );
}
