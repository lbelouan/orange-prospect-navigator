import { Account, Person, Edge, Company, FunctionType, IntroPath, ActionItem } from './types';

// ========== COMPANIES ==========
const axaCompany: Company = {
  id: 'axa-france',
  name: 'AXA France',
  industry: 'Services Financiers',
  size: 'Large Enterprise',
  region: 'France',
};

const carrefourCompany: Company = {
  id: 'carrefour-europe',
  name: 'Carrefour Europe',
  industry: 'Retail',
  size: 'Large Enterprise',
  region: 'Europe',
};

// ========== AXA PEOPLE ==========
const axaPeople: Person[] = [
  { id: 'axa-p1', name: 'Marc Durand', title: 'CIO', function: 'IT', seniority: 'C-level', confidence: 0.95, companyId: 'axa-france' },
  { id: 'axa-p2', name: 'Sophie Martin', title: 'CISO', function: 'Security', seniority: 'C-level', confidence: 0.9, companyId: 'axa-france' },
  { id: 'axa-p3', name: 'Pierre Lambert', title: 'Head of Infrastructure', function: 'IT', seniority: 'Head', confidence: 0.85, companyId: 'axa-france' },
  { id: 'axa-p4', name: 'Claire Dubois', title: 'Head of Network', function: 'IT', seniority: 'Head', confidence: 0.8, companyId: 'axa-france' },
  { id: 'axa-p5', name: 'Jean Moreau', title: 'Procurement Director', function: 'Procurement', seniority: 'Director', confidence: 0.92, companyId: 'axa-france' },
  { id: 'axa-p6', name: 'Isabelle Roux', title: 'CFO', function: 'Finance', seniority: 'C-level', confidence: 0.88, companyId: 'axa-france' },
  { id: 'axa-p7', name: 'Thomas Bernard', title: 'COO', function: 'Business', seniority: 'C-level', confidence: 0.93, companyId: 'axa-france' },
  { id: 'axa-p8', name: 'Marie Leroy', title: 'VP Digital Transformation', function: 'Business', seniority: 'VP', confidence: 0.75, companyId: 'axa-france' },
  { id: 'axa-p9', name: 'Julien Petit', title: 'Security Manager', function: 'Security', seniority: 'Manager', confidence: 0.7, companyId: 'axa-france' },
  { id: 'axa-p10', name: 'Nathalie Garcia', title: 'IT Procurement Manager', function: 'Procurement', seniority: 'Manager', confidence: 0.65, companyId: 'axa-france' },
  { id: 'axa-p11', name: 'François Dupont', title: 'Business Sponsor Claims', function: 'Business', seniority: 'VP', confidence: 0.6, companyId: 'axa-france' },
  { id: 'axa-p12', name: 'Camille Fournier', title: 'Head of Cloud Operations', function: 'IT', seniority: 'Head', confidence: 0.72, companyId: 'axa-france' },
];

// Orange Contacts for AXA
const axaOrangeContacts: Person[] = [
  { id: 'ora-1', name: 'Alexandre Noir', title: 'Account Director', function: 'Business', seniority: 'Director', confidence: 1, companyId: 'orange', isOrangeEmployee: true },
  { id: 'ora-2', name: 'Béatrice Soleil', title: 'Solution Architect', function: 'IT', seniority: 'Manager', confidence: 1, companyId: 'orange', isOrangeEmployee: true },
  { id: 'ora-3', name: 'David Flamme', title: 'Security Consultant', function: 'Security', seniority: 'Manager', confidence: 1, companyId: 'orange', isOrangeEmployee: true },
];

// AXA Edges
const axaEdges: Edge[] = [
  { id: 'ae1', source: 'axa-p1', target: 'axa-p3', type: 'reports_to', weight: 0.9, recencyDays: 5, interactionCount: 20, sourceType: 'CRM', confidence: 0.95 },
  { id: 'ae2', source: 'axa-p1', target: 'axa-p4', type: 'reports_to', weight: 0.9, recencyDays: 5, interactionCount: 15, sourceType: 'CRM', confidence: 0.95 },
  { id: 'ae3', source: 'axa-p1', target: 'axa-p12', type: 'reports_to', weight: 0.85, recencyDays: 10, interactionCount: 12, sourceType: 'CRM', confidence: 0.9 },
  { id: 'ae4', source: 'axa-p2', target: 'axa-p9', type: 'reports_to', weight: 0.9, recencyDays: 3, interactionCount: 18, sourceType: 'CRM', confidence: 0.95 },
  { id: 'ae5', source: 'axa-p7', target: 'axa-p8', type: 'reports_to', weight: 0.85, recencyDays: 7, interactionCount: 10, sourceType: 'CRM', confidence: 0.9 },
  { id: 'ae6', source: 'axa-p7', target: 'axa-p11', type: 'reports_to', weight: 0.8, recencyDays: 14, interactionCount: 8, sourceType: 'CRM', confidence: 0.85 },
  { id: 'ae7', source: 'axa-p1', target: 'axa-p2', type: 'influences', weight: 0.7, recencyDays: 10, interactionCount: 5, sourceType: 'meeting', confidence: 0.8 },
  { id: 'ae8', source: 'axa-p1', target: 'axa-p7', type: 'influences', weight: 0.6, recencyDays: 20, interactionCount: 4, sourceType: 'meeting', confidence: 0.7 },
  { id: 'ae9', source: 'axa-p5', target: 'axa-p6', type: 'influences', weight: 0.5, recencyDays: 30, interactionCount: 3, sourceType: 'inferred', confidence: 0.5 },
  { id: 'ae10', source: 'axa-p8', target: 'axa-p1', type: 'influences', weight: 0.4, recencyDays: 15, interactionCount: 6, sourceType: 'email', confidence: 0.65 },
  // Orange connections
  { id: 'ae11', source: 'ora-1', target: 'axa-p7', type: 'knows', weight: 0.8, recencyDays: 7, interactionCount: 12, sourceType: 'CRM', confidence: 0.9 },
  { id: 'ae12', source: 'ora-1', target: 'axa-p5', type: 'knows', weight: 0.6, recencyDays: 30, interactionCount: 5, sourceType: 'meeting', confidence: 0.75 },
  { id: 'ae13', source: 'ora-2', target: 'axa-p3', type: 'worked_with', weight: 0.85, recencyDays: 14, interactionCount: 15, sourceType: 'CRM', confidence: 0.9 },
  { id: 'ae14', source: 'ora-2', target: 'axa-p4', type: 'knows', weight: 0.5, recencyDays: 60, interactionCount: 3, sourceType: 'email', confidence: 0.6 },
  { id: 'ae15', source: 'ora-3', target: 'axa-p9', type: 'worked_with', weight: 0.7, recencyDays: 21, interactionCount: 8, sourceType: 'meeting', confidence: 0.8 },
  { id: 'ae16', source: 'ora-3', target: 'axa-p2', type: 'knows', weight: 0.4, recencyDays: 90, interactionCount: 2, sourceType: 'inferred', confidence: 0.5 },
  { id: 'ae17', source: 'axa-p3', target: 'axa-p1', type: 'influences', weight: 0.5, recencyDays: 10, interactionCount: 8, sourceType: 'meeting', confidence: 0.7 },
];

// ========== CARREFOUR PEOPLE ==========
const carrefourPeople: Person[] = [
  { id: 'car-p1', name: 'Roberto Vasquez', title: 'Group CIO', function: 'IT', seniority: 'C-level', confidence: 0.92, companyId: 'carrefour-europe' },
  { id: 'car-p2', name: 'Anna Kowalski', title: 'CISO', function: 'Security', seniority: 'C-level', confidence: 0.88, companyId: 'carrefour-europe' },
  { id: 'car-p3', name: 'Luca Romano', title: 'Head of Network & Connectivity', function: 'IT', seniority: 'Head', confidence: 0.82, companyId: 'carrefour-europe' },
  { id: 'car-p4', name: 'Elena Schmidt', title: 'VP Supply Chain Tech', function: 'Business', seniority: 'VP', confidence: 0.78, companyId: 'carrefour-europe' },
  { id: 'car-p5', name: 'Hugo Fernandez', title: 'Procurement Director', function: 'Procurement', seniority: 'Director', confidence: 0.9, companyId: 'carrefour-europe' },
  { id: 'car-p6', name: 'Marie-Claire Dupont', title: 'CFO Europe', function: 'Finance', seniority: 'C-level', confidence: 0.85, companyId: 'carrefour-europe' },
  { id: 'car-p7', name: 'Patrick O\'Brien', title: 'Head of Store IT', function: 'IT', seniority: 'Head', confidence: 0.7, companyId: 'carrefour-europe' },
  { id: 'car-p8', name: 'Katarina Novak', title: 'IoT Program Manager', function: 'IT', seniority: 'Manager', confidence: 0.65, companyId: 'carrefour-europe' },
  { id: 'car-p9', name: 'Ahmed Ben Ali', title: 'Security Operations Manager', function: 'Security', seniority: 'Manager', confidence: 0.72, companyId: 'carrefour-europe' },
  { id: 'car-p10', name: 'Sophie Laurent', title: 'COO France', function: 'Business', seniority: 'C-level', confidence: 0.8, companyId: 'carrefour-europe' },
  { id: 'car-p11', name: 'Dimitri Papadopoulos', title: 'Cloud Architect Lead', function: 'IT', seniority: 'Head', confidence: 0.6, companyId: 'carrefour-europe' },
  { id: 'car-p12', name: 'Laura Bianchi', title: 'Business Sponsor eCommerce', function: 'Business', seniority: 'VP', confidence: 0.68, companyId: 'carrefour-europe' },
  { id: 'car-p13', name: 'Jan Müller', title: 'Head of Procurement IT', function: 'Procurement', seniority: 'Head', confidence: 0.75, companyId: 'carrefour-europe' },
];

const carrefourOrangeContacts: Person[] = [
  { id: 'ora-4', name: 'Philippe Orange', title: 'Global Account Manager', function: 'Business', seniority: 'Director', confidence: 1, companyId: 'orange', isOrangeEmployee: true },
  { id: 'ora-5', name: 'Laure Lumière', title: 'IoT Solutions Lead', function: 'IT', seniority: 'Head', confidence: 1, companyId: 'orange', isOrangeEmployee: true },
  { id: 'ora-6', name: 'Karim Sahara', title: 'Network Architect', function: 'IT', seniority: 'Manager', confidence: 1, companyId: 'orange', isOrangeEmployee: true },
];

const carrefourEdges: Edge[] = [
  { id: 'ce1', source: 'car-p1', target: 'car-p3', type: 'reports_to', weight: 0.9, recencyDays: 3, interactionCount: 22, sourceType: 'CRM', confidence: 0.95 },
  { id: 'ce2', source: 'car-p1', target: 'car-p7', type: 'reports_to', weight: 0.85, recencyDays: 5, interactionCount: 14, sourceType: 'CRM', confidence: 0.9 },
  { id: 'ce3', source: 'car-p1', target: 'car-p11', type: 'reports_to', weight: 0.8, recencyDays: 10, interactionCount: 10, sourceType: 'CRM', confidence: 0.85 },
  { id: 'ce4', source: 'car-p2', target: 'car-p9', type: 'reports_to', weight: 0.9, recencyDays: 5, interactionCount: 16, sourceType: 'CRM', confidence: 0.95 },
  { id: 'ce5', source: 'car-p5', target: 'car-p13', type: 'reports_to', weight: 0.85, recencyDays: 7, interactionCount: 11, sourceType: 'CRM', confidence: 0.9 },
  { id: 'ce6', source: 'car-p10', target: 'car-p4', type: 'reports_to', weight: 0.8, recencyDays: 14, interactionCount: 8, sourceType: 'CRM', confidence: 0.85 },
  { id: 'ce7', source: 'car-p10', target: 'car-p12', type: 'reports_to', weight: 0.75, recencyDays: 20, interactionCount: 6, sourceType: 'CRM', confidence: 0.8 },
  { id: 'ce8', source: 'car-p1', target: 'car-p2', type: 'influences', weight: 0.65, recencyDays: 15, interactionCount: 4, sourceType: 'meeting', confidence: 0.7 },
  { id: 'ce9', source: 'car-p4', target: 'car-p1', type: 'influences', weight: 0.5, recencyDays: 25, interactionCount: 5, sourceType: 'email', confidence: 0.6 },
  { id: 'ce10', source: 'car-p1', target: 'car-p8', type: 'reports_to', weight: 0.7, recencyDays: 12, interactionCount: 7, sourceType: 'CRM', confidence: 0.8 },
  // Orange connections
  { id: 'ce11', source: 'ora-4', target: 'car-p5', type: 'knows', weight: 0.75, recencyDays: 10, interactionCount: 10, sourceType: 'CRM', confidence: 0.85 },
  { id: 'ce12', source: 'ora-4', target: 'car-p10', type: 'knows', weight: 0.6, recencyDays: 45, interactionCount: 4, sourceType: 'meeting', confidence: 0.7 },
  { id: 'ce13', source: 'ora-5', target: 'car-p8', type: 'worked_with', weight: 0.8, recencyDays: 14, interactionCount: 12, sourceType: 'CRM', confidence: 0.85 },
  { id: 'ce14', source: 'ora-5', target: 'car-p3', type: 'knows', weight: 0.5, recencyDays: 60, interactionCount: 3, sourceType: 'email', confidence: 0.55 },
  { id: 'ce15', source: 'ora-6', target: 'car-p3', type: 'worked_with', weight: 0.7, recencyDays: 21, interactionCount: 8, sourceType: 'meeting', confidence: 0.8 },
  { id: 'ce16', source: 'ora-6', target: 'car-p11', type: 'knows', weight: 0.4, recencyDays: 90, interactionCount: 2, sourceType: 'inferred', confidence: 0.45 },
];

// ========== ACCOUNTS ==========
export const mockAccounts: Account[] = [
  {
    company: axaCompany,
    people: [...axaPeople, ...axaOrangeContacts],
    edges: axaEdges,
  },
  {
    company: carrefourCompany,
    people: [...carrefourPeople, ...carrefourOrangeContacts],
    edges: carrefourEdges,
  },
];

// Compute scores on load
mockAccounts.forEach(computeAccountScores);

// ========== SCORING ==========
export function computeAccountScores(account: Account) {
  const { people, edges } = account;
  const nonOrange = people.filter(p => !p.isOrangeEmployee);
  const orangeContacts = people.filter(p => p.isOrangeEmployee);

  // Influence: simplified PageRank proxy
  nonOrange.forEach(p => {
    const incomingInfluence = edges.filter(e => e.target === p.id && e.type === 'influences');
    const reportsTo = edges.filter(e => e.target === p.id && e.type === 'reports_to');
    const seniorityBonus = p.seniority === 'C-level' ? 30 : p.seniority === 'VP' ? 20 : p.seniority === 'Director' ? 15 : p.seniority === 'Head' ? 10 : 0;
    const influenceFromEdges = incomingInfluence.reduce((sum, e) => sum + e.weight * 25, 0);
    const reportsBonus = reportsTo.length * 10;
    p.influenceScore = Math.min(100, Math.round(seniorityBonus + influenceFromEdges + reportsBonus));
  });

  // Relationship: based on interactions with Orange
  nonOrange.forEach(p => {
    const orangeEdges = edges.filter(e =>
      (orangeContacts.some(o => o.id === e.source) && e.target === p.id) ||
      (orangeContacts.some(o => o.id === e.target) && e.source === p.id)
    );
    if (orangeEdges.length === 0) {
      p.relationshipScore = 0;
      return;
    }
    const best = orangeEdges.reduce((max, e) => {
      const decay = Math.max(0, 1 - e.recencyDays / 180);
      const score = (e.interactionCount * 3 + e.weight * 20 + e.confidence * 20) * decay;
      return Math.max(max, score);
    }, 0);
    p.relationshipScore = Math.min(100, Math.round(best));
  });

  // Access: shortest weighted path from any OrangeContact
  nonOrange.forEach(p => {
    const directEdge = edges.find(e =>
      (orangeContacts.some(o => o.id === e.source) && e.target === p.id) ||
      (orangeContacts.some(o => o.id === e.target) && e.source === p.id)
    );
    if (directEdge) {
      p.accessScore = Math.min(100, Math.round(directEdge.confidence * 80 + directEdge.weight * 20));
      return;
    }
    // Check 2-hop
    let bestTwoHop = 0;
    orangeContacts.forEach(oc => {
      const firstHops = edges.filter(e => e.source === oc.id || e.target === oc.id);
      firstHops.forEach(fh => {
        const mid = fh.source === oc.id ? fh.target : fh.source;
        const secondHops = edges.filter(e =>
          (e.source === mid && e.target === p.id) || (e.target === mid && e.source === p.id)
        );
        secondHops.forEach(sh => {
          const score = (fh.confidence * sh.confidence) * 60 + (fh.weight * sh.weight) * 20;
          bestTwoHop = Math.max(bestTwoHop, score);
        });
      });
    });
    p.accessScore = Math.min(100, Math.round(bestTwoHop));
  });

  // Global score
  nonOrange.forEach(p => {
    p.globalScore = Math.round(
      (p.influenceScore || 0) * 0.5 +
      (p.accessScore || 0) * 0.3 +
      (p.relationshipScore || 0) * 0.2
    );
  });

  // Account KPIs
  const allFunctions = ['IT', 'Security', 'Procurement', 'Finance', 'Business'] as const;
  const presentFunctions = new Set(nonOrange.map(p => p.function));
  account.networkCoverage = Math.round((presentFunctions.size / allFunctions.length) * 100);

  const keyDeciders = nonOrange.filter(p => p.seniority === 'C-level' || p.seniority === 'VP');
  const avgAccess = keyDeciders.length > 0
    ? keyDeciders.reduce((s, p) => s + (p.accessScore || 0), 0) / keyDeciders.length
    : 0;
  const missingFunctions = allFunctions.filter(f => !presentFunctions.has(f));
  account.politicalRisk = missingFunctions.length >= 2 || avgAccess < 30 ? 'high' : missingFunctions.length >= 1 || avgAccess < 50 ? 'medium' : 'low';

  account.globalScore = nonOrange.length > 0
    ? Math.round(nonOrange.reduce((s, p) => s + (p.globalScore || 0), 0) / nonOrange.length)
    : 0;
}

export function getTopStakeholders(account: Account, limit = 5): Person[] {
  return account.people
    .filter(p => !p.isOrangeEmployee)
    .sort((a, b) => (b.globalScore || 0) - (a.globalScore || 0))
    .slice(0, limit);
}

export function getChampions(account: Account): Person[] {
  return account.people.filter(p =>
    !p.isOrangeEmployee &&
    (p.accessScore || 0) >= 50 &&
    (p.influenceScore || 0) >= 40
  ).sort((a, b) => (b.globalScore || 0) - (a.globalScore || 0));
}

export function getBlockers(account: Account): Person[] {
  return account.people.filter(p =>
    !p.isOrangeEmployee &&
    (p.influenceScore || 0) >= 40 &&
    (p.relationshipScore || 0) < 30
  ).sort((a, b) => (b.influenceScore || 0) - (a.influenceScore || 0));
}

export function getGaps(account: Account): string[] {
  const allFunctions = ['IT', 'Security', 'Procurement', 'Finance', 'Business'];
  const present = new Set(account.people.filter(p => !p.isOrangeEmployee).map(p => p.function));
  return allFunctions.filter(f => !present.has(f));
}

export function getIntroPaths(account: Account, targetId: string): IntroPath[] {
  const orangeContacts = account.people.filter(p => p.isOrangeEmployee);
  const target = account.people.find(p => p.id === targetId);
  if (!target) return [];

  const paths: IntroPath[] = [];

  // Direct paths
  orangeContacts.forEach(oc => {
    const direct = account.edges.find(e =>
      (e.source === oc.id && e.target === targetId) ||
      (e.target === oc.id && e.source === targetId)
    );
    if (direct) {
      paths.push({
        steps: [oc, target],
        confidence: direct.confidence,
        description: `${oc.name} connaît directement ${target.name}`,
      });
    }
  });

  // 2-hop paths
  orangeContacts.forEach(oc => {
    const firstHops = account.edges.filter(e => e.source === oc.id || e.target === oc.id);
    firstHops.forEach(fh => {
      const midId = fh.source === oc.id ? fh.target : fh.source;
      if (midId === targetId) return;
      const mid = account.people.find(p => p.id === midId);
      if (!mid) return;
      const secondHop = account.edges.find(e =>
        (e.source === midId && e.target === targetId) ||
        (e.target === midId && e.source === targetId)
      );
      if (secondHop) {
        paths.push({
          steps: [oc, mid, target],
          confidence: Math.round(fh.confidence * secondHop.confidence * 100) / 100,
          description: `${oc.name} → ${mid.name} → ${target.name}`,
        });
      }
    });
  });

  return paths.sort((a, b) => b.confidence - a.confidence).slice(0, 3);
}

export function getBestIntroPaths(account: Account): IntroPath[] {
  const topStakeholders = getTopStakeholders(account, 3);
  const allPaths: IntroPath[] = [];
  topStakeholders.forEach(s => {
    allPaths.push(...getIntroPaths(account, s.id));
  });
  return allPaths.sort((a, b) => b.confidence - a.confidence).slice(0, 3);
}

export function generateActions(account: Account): ActionItem[] {
  const champions = getChampions(account);
  const blockers = getBlockers(account);
  const gaps = getGaps(account);
  const topStakeholders = getTopStakeholders(account, 3);
  const actions: ActionItem[] = [];
  let idx = 0;

  if (champions.length > 0) {
    actions.push({ id: `a${idx++}`, text: `Renforcer la relation avec ${champions[0].name} (${champions[0].title}) — champion identifié`, priority: 'high', done: false, category: 'Relation' });
  }
  blockers.slice(0, 2).forEach(b => {
    actions.push({ id: `a${idx++}`, text: `Trouver un chemin d'accès vers ${b.name} (${b.title}) — bloqueur potentiel`, priority: 'high', done: false, category: 'Accès' });
  });
  gaps.forEach(g => {
    actions.push({ id: `a${idx++}`, text: `Identifier des contacts dans la fonction ${g}`, priority: 'medium', done: false, category: 'Couverture' });
  });
  topStakeholders.forEach(s => {
    if ((s.relationshipScore || 0) < 40) {
      actions.push({ id: `a${idx++}`, text: `Planifier une rencontre avec ${s.name} (${s.title})`, priority: 'medium', done: false, category: 'Engagement' });
    }
  });
  actions.push({ id: `a${idx++}`, text: `Mettre à jour les données CRM pour ce compte`, priority: 'low', done: false, category: 'Data' });
  actions.push({ id: `a${idx++}`, text: `Préparer un pitch personnalisé basé sur les besoins identifiés`, priority: 'medium', done: false, category: 'Stratégie' });

  return actions;
}

// Function colors for graph
export const functionColors: Record<string, string> = {
  IT: '#3B82F6',
  Security: '#EF4444',
  Procurement: '#8B5CF6',
  Finance: '#10B981',
  Business: '#F59E0B',
};
