import { useAppState } from '@/lib/appState';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getTopStakeholders, getChampions, getBlockers, getGaps, functionColors, getIntroPaths } from '@/lib/mockData';
import { Person, Account } from '@/lib/types';
import { ScoreBar, ConfidenceBadge, FunctionBadge, StakeholderMiniCard, RiskBadge } from '@/components/ScoreWidgets';
import { X, ArrowRight, Sparkles, AlertTriangle, UserCheck, ShieldAlert, Layers, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function NetworkGraph({ account, onSelectNode }: { account: Account; onSelectNode: (p: Person) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const nodes = useMemo(() => account.people.filter(p => !p.isOrangeEmployee), [account]);
  const orangeNodes = useMemo(() => account.people.filter(p => p.isOrangeEmployee), [account]);
  const allNodes = useMemo(() => [...nodes, ...orangeNodes], [nodes, orangeNodes]);

  useEffect(() => {
    const w = 700, h = 500;
    const pos: Record<string, { x: number; y: number }> = {};
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
    orangeNodes.forEach((o, i) => {
      pos[o.id] = { x: w / 2 - 80 + i * 50, y: h - 50 };
    });
    setPositions(pos);
  }, [nodes, orangeNodes]);

  const nodeRadius = (p: Person) => {
    const score = p.globalScore || 0;
    return p.isOrangeEmployee ? 14 : 12 + (score / 100) * 12;
  };

  return (
    <div ref={containerRef} className="w-full h-full">
      <svg viewBox="0 0 700 500" className="w-full h-full">
        {/* Edges */}
        {account.edges.map(e => {
          const s = positions[e.source];
          const t = positions[e.target];
          if (!s || !t) return null;
          const isHighlighted = hoveredNode && (e.source === hoveredNode || e.target === hoveredNode);
          return (
            <line
              key={e.id}
              x1={s.x} y1={s.y} x2={t.x} y2={t.y}
              stroke={isHighlighted ? 'hsl(27, 100%, 50%)' : 'hsl(220, 13%, 65%)'}
              strokeWidth={isHighlighted ? e.weight * 3 + 1 : e.weight * 2}
              strokeOpacity={isHighlighted ? 0.7 : 0.2}
              strokeLinecap="round"
              style={{ transition: 'all 0.3s ease' }}
            />
          );
        })}

        {/* Nodes */}
        {allNodes.map(p => {
          const pos = positions[p.id];
          if (!pos) return null;
          const r = nodeRadius(p);
          const isHovered = hoveredNode === p.id;
          const isOrange = p.isOrangeEmployee;
          const color = isOrange ? 'hsl(27, 100%, 50%)' : (functionColors[p.function] || '#6B7280');

          return (
            <g
              key={p.id}
              onClick={() => onSelectNode(p)}
              onMouseEnter={() => setHoveredNode(p.id)}
              onMouseLeave={() => setHoveredNode(null)}
              className="cursor-pointer"
            >
              <circle
                cx={pos.x} cy={pos.y}
                r={isHovered ? r + 2 : r}
                fill={color}
                opacity={isHovered ? 1 : 0.85}
                style={{ transition: 'all 0.2s ease' }}
              />
              {r > 16 && (
                <text
                  x={pos.x} y={pos.y + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  fontSize="9"
                  fontWeight="700"
                  style={{ pointerEvents: 'none' }}
                >
                  {p.name.split(' ').map(n => n[0]).join('')}
                </text>
              )}
              <text
                x={pos.x} y={pos.y + r + 14}
                textAnchor="middle"
                className="text-[9px] font-semibold"
                style={{
                  fill: isHovered ? 'hsl(27, 100%, 50%)' : 'hsl(var(--muted-foreground))',
                  transition: 'fill 0.2s ease',
                }}
              >
                {p.name.split(' ')[1] || p.name.split(' ')[0]}
              </text>
            </g>
          );
        })}

        {/* Legend */}
        {Object.entries(functionColors).map(([fn, color], i) => (
          <g key={fn} transform={`translate(14, ${18 + i * 22})`}>
            <circle cx={6} cy={0} r={6} fill={color} />
            <text x={18} y={4} className="text-[10px] font-medium" style={{ fill: 'hsl(var(--muted-foreground))' }}>{fn}</text>
          </g>
        ))}
        <g transform={`translate(14, ${18 + Object.keys(functionColors).length * 22})`}>
          <circle cx={6} cy={0} r={6} fill="hsl(27, 100%, 50%)" />
          <text x={18} y={4} className="text-[10px] font-medium" style={{ fill: 'hsl(var(--muted-foreground))' }}>Orange</text>
        </g>
      </svg>
    </div>
  );
}

function StakeholderDrawer({ person, account, onClose }: { person: Person; account: Account; onClose: () => void }) {
  const paths = getIntroPaths(account, person.id);

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-card border-l border-border/60 shadow-elevated z-50 overflow-y-auto"
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg sm:text-xl font-bold">{person.name}</h3>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-secondary transition-colors"><X className="w-4 h-4" /></button>
        </div>

        <div className="flex items-center gap-2 mb-5 flex-wrap">
          <FunctionBadge fn={person.function} />
          <span className="text-xs text-muted-foreground font-medium">{person.title}</span>
        </div>

        {person.confidence < 1 && (
          <div className="mb-5"><ConfidenceBadge confidence={person.confidence} /></div>
        )}

        <div className="space-y-4 mb-6">
          <ScoreBar label="Influence" value={person.influenceScore || 0} explanation="Poids dans les décisions, basé sur sa position et ses connexions" />
          <ScoreBar label="Accès" value={person.accessScore || 0} explanation="Facilité à le joindre via vos contacts Orange" />
          <ScoreBar label="Relation" value={person.relationshipScore || 0} explanation="Qualité de la relation existante avec Orange" />
        </div>

        <div className="p-4 rounded-2xl gradient-orange-soft border border-primary/10 mb-6">
          <p className="text-xs font-semibold text-muted-foreground mb-1">Score global</p>
          <p className="text-3xl font-extrabold text-primary">{person.globalScore || 0}<span className="text-sm text-primary/50 font-medium ml-1">/100</span></p>
        </div>

        {paths.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-bold mb-3">Chemins d'introduction</h4>
            {paths.map((path, i) => (
              <div key={i} className="p-3 rounded-xl border border-border/60 mb-2">
                <div className="flex items-center gap-1 flex-wrap mb-2">
                  {path.steps.map((s, si) => (
                    <span key={s.id} className="flex items-center gap-1 text-sm">
                      <span className={s.isOrangeEmployee ? 'text-primary font-semibold' : 'font-medium'}>{s.name}</span>
                      {si < path.steps.length - 1 && <ArrowRight className="w-3 h-3 text-muted-foreground" />}
                    </span>
                  ))}
                </div>
                <ConfidenceBadge confidence={path.confidence} />
              </div>
            ))}
          </div>
        )}

        <div>
          <h4 className="text-sm font-bold mb-3">Actions recommandées</h4>
          <div className="space-y-2">
            {['📧 Envoyer un email d\'introduction', '📅 Planifier une réunion exploratoire', '🔍 Rechercher des intérêts communs'].map((action, i) => (
              <motion.button
                key={i}
                whileHover={{ x: 2 }}
                className="w-full text-left p-3 rounded-xl border border-border/60 text-sm hover:bg-secondary/50 hover:border-primary/20 transition-all duration-200"
              >
                {action}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function AccountMapPage() {
  const { accounts, selectedAccountId, setSelectedAccountId } = useAppState();
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const account = accounts.find(a => a.company.id === selectedAccountId) || accounts[0];

  useEffect(() => {
    if (!selectedAccountId && accounts.length > 0) setSelectedAccountId(accounts[0].company.id);
  }, [selectedAccountId, accounts, setSelectedAccountId]);

  if (!account) return <div className="text-center py-20 text-muted-foreground">Sélectionnez un compte</div>;

  const top = getTopStakeholders(account);
  const champions = getChampions(account);
  const blockers = getBlockers(account);
  const gaps = getGaps(account);

  return (
    <div>
      {/* Account selector */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6">
        <div className="relative">
          <select
            value={account.company.id}
            onChange={e => setSelectedAccountId(e.target.value)}
            className="appearance-none px-4 py-2.5 pr-9 rounded-xl bg-card border border-border/60 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-card cursor-pointer"
          >
            {accounts.map(a => (
              <option key={a.company.id} value={a.company.id}>{a.company.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold">{account.company.name}</h1>
        {account.politicalRisk && <RiskBadge risk={account.politicalRisk} />}
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Graph */}
        <div className="flex-1 bg-card rounded-2xl border border-border/60 p-2 sm:p-3 min-h-[350px] sm:min-h-[520px] shadow-card overflow-hidden">
          <NetworkGraph account={account} onSelectNode={setSelectedPerson} />
        </div>

        {/* Side panel */}
        <div className="w-full lg:w-80 space-y-4 flex-shrink-0">
          {[
            { title: 'Top Stakeholders', icon: Sparkles, iconColor: 'text-primary', items: top, desc: null },
            ...(champions.length > 0 ? [{ title: 'Champions', icon: UserCheck, iconColor: 'text-success', items: champions.slice(0, 3), desc: 'Bon accès + haute influence' }] : []),
            ...(blockers.length > 0 ? [{ title: 'Bloqueurs', icon: ShieldAlert, iconColor: 'text-destructive', items: blockers.slice(0, 3), desc: 'Haute influence + relation faible' }] : []),
          ].map((section, si) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: si * 0.08 }}
              className="bg-card rounded-2xl border border-border/60 p-4 shadow-card"
            >
              <div className="flex items-center gap-2 mb-3">
                <section.icon className={`w-4 h-4 ${section.iconColor}`} />
                <h3 className="text-sm font-bold">{section.title}</h3>
              </div>
              {section.desc && <p className="text-[11px] text-muted-foreground mb-3">{section.desc}</p>}
              <div className="space-y-2">
                {section.items.map(p => (
                  <StakeholderMiniCard key={p.id} person={p} onClick={() => setSelectedPerson(p)} />
                ))}
              </div>
            </motion.div>
          ))}

          {gaps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.3 }}
              className="bg-card rounded-2xl border border-border/60 p-4 shadow-card"
            >
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4 text-warning" />
                <h3 className="text-sm font-bold">Fonctions manquantes</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {gaps.map(g => <FunctionBadge key={g} fn={g} />)}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {selectedPerson && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
              onClick={() => setSelectedPerson(null)}
            />
            <StakeholderDrawer person={selectedPerson} account={account} onClose={() => setSelectedPerson(null)} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
