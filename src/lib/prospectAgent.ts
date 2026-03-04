import { Account, Person, Edge, Company } from './types';
import { computeAccountScores } from './mockData';

const firstNames = ['Laurent', 'Céline', 'Michel', 'Valérie', 'Stéphane', 'Aurélie', 'Vincent', 'Caroline', 'Yves', 'Sandrine', 'Olivier', 'Émilie', 'Arnaud', 'Charlotte', 'Frédéric', 'Mélanie', 'Guillaume', 'Nadia'];
const lastNames = ['Mercier', 'Girard', 'André', 'Lefèvre', 'Morel', 'Simon', 'Laurent', 'Michel', 'Lévy', 'Richard', 'Robert', 'Dumont', 'Blanc', 'Guérin', 'Muller', 'Henry', 'Rousseau', 'David'];

const roleTemplates = [
  { title: 'CIO', function: 'IT' as const, seniority: 'C-level' as const },
  { title: 'CISO', function: 'Security' as const, seniority: 'C-level' as const },
  { title: 'Head of Infrastructure', function: 'IT' as const, seniority: 'Head' as const },
  { title: 'Head of Network', function: 'IT' as const, seniority: 'Head' as const },
  { title: 'Cloud Operations Manager', function: 'IT' as const, seniority: 'Manager' as const },
  { title: 'Procurement Director', function: 'Procurement' as const, seniority: 'Director' as const },
  { title: 'IT Procurement Manager', function: 'Procurement' as const, seniority: 'Manager' as const },
  { title: 'CFO', function: 'Finance' as const, seniority: 'C-level' as const },
  { title: 'COO', function: 'Business' as const, seniority: 'C-level' as const },
  { title: 'VP Digital Transformation', function: 'Business' as const, seniority: 'VP' as const },
  { title: 'Security Operations Manager', function: 'Security' as const, seniority: 'Manager' as const },
  { title: 'Business Sponsor', function: 'Business' as const, seniority: 'VP' as const },
  { title: 'Head of Data', function: 'IT' as const, seniority: 'Head' as const },
  { title: 'VP Finance', function: 'Finance' as const, seniority: 'VP' as const },
  { title: 'IoT Program Manager', function: 'IT' as const, seniority: 'Manager' as const },
  { title: 'Head of Cybersecurity', function: 'Security' as const, seniority: 'Head' as const },
];

const orangeNames = [
  { first: 'Raphaël', last: 'Feu' },
  { first: 'Léa', last: 'Aurore' },
  { first: 'Maxime', last: 'Solaire' },
  { first: 'Julie', last: 'Flamme' },
  { first: 'Hugo', last: 'Ambre' },
  { first: 'Clara', last: 'Braise' },
];

const orangeRoles = [
  { title: 'Account Director', function: 'Business' as const, seniority: 'Director' as const },
  { title: 'Solution Architect', function: 'IT' as const, seniority: 'Manager' as const },
  { title: 'Security Consultant', function: 'Security' as const, seniority: 'Manager' as const },
  { title: 'Network Specialist', function: 'IT' as const, seniority: 'Manager' as const },
  { title: 'IoT Solutions Lead', function: 'IT' as const, seniority: 'Head' as const },
  { title: 'Cloud Architect', function: 'IT' as const, seniority: 'Head' as const },
];

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateProspectAccount(
  companyName: string,
  region: string,
  industry: string,
  size: string,
): Account {
  const companyId = companyName.toLowerCase().replace(/\s+/g, '-');
  const company: Company = { id: companyId, name: companyName, industry, size, region };

  // Generate 14-16 stakeholders
  const numPeople = 14 + Math.floor(Math.random() * 3);
  const usedNames = new Set<string>();
  const people: Person[] = [];

  for (let i = 0; i < Math.min(numPeople, roleTemplates.length); i++) {
    let name: string;
    do {
      name = `${pick(firstNames)} ${pick(lastNames)}`;
    } while (usedNames.has(name));
    usedNames.add(name);

    const role = roleTemplates[i];
    people.push({
      id: `${companyId}-p${i}`,
      name,
      title: role.title,
      function: role.function,
      seniority: role.seniority,
      confidence: Math.round(rand(0.5, 0.85) * 100) / 100,
      companyId,
    });
  }

  // Generate 4-5 Orange contacts
  const numOrange = 4 + Math.floor(Math.random() * 2);
  const orangeContacts: Person[] = [];
  for (let i = 0; i < numOrange; i++) {
    const n = orangeNames[i % orangeNames.length];
    const r = orangeRoles[i % orangeRoles.length];
    orangeContacts.push({
      id: `ora-gen-${companyId}-${i}`,
      name: `${n.first} ${n.last}`,
      title: r.title,
      function: r.function,
      seniority: r.seniority,
      confidence: 1,
      companyId: 'orange',
      isOrangeEmployee: true,
    });
  }

  const allPeople = [...people, ...orangeContacts];
  const edges: Edge[] = [];
  let edgeIdx = 0;

  // reports_to: CIO/CISO/COO have reports
  const cLevel = people.filter(p => p.seniority === 'C-level');
  const nonCLevel = people.filter(p => p.seniority !== 'C-level');
  nonCLevel.forEach(p => {
    const boss = cLevel.find(c => c.function === p.function) || pick(cLevel);
    edges.push({
      id: `ge-${companyId}-${edgeIdx++}`,
      source: boss.id, target: p.id, type: 'reports_to',
      weight: Math.round(rand(0.7, 0.95) * 100) / 100,
      recencyDays: Math.floor(rand(3, 20)),
      interactionCount: Math.floor(rand(5, 20)),
      sourceType: 'CRM', confidence: Math.round(rand(0.8, 0.95) * 100) / 100,
    });
  });

  // influences edges
  for (let i = 0; i < 6; i++) {
    const a = pick(people);
    const b = pick(people);
    if (a.id !== b.id) {
      edges.push({
        id: `ge-${companyId}-${edgeIdx++}`,
        source: a.id, target: b.id, type: 'influences',
        weight: Math.round(rand(0.3, 0.8) * 100) / 100,
        recencyDays: Math.floor(rand(5, 60)),
        interactionCount: Math.floor(rand(2, 10)),
        sourceType: pick(['meeting', 'email', 'inferred']),
        confidence: Math.round(rand(0.4, 0.8) * 100) / 100,
      });
    }
  }

  // Orange connections
  orangeContacts.forEach(oc => {
    const targets = [...people].sort(() => Math.random() - 0.5).slice(0, 2 + Math.floor(Math.random() * 2));
    targets.forEach(t => {
      edges.push({
        id: `ge-${companyId}-${edgeIdx++}`,
        source: oc.id, target: t.id, type: pick(['knows', 'worked_with']),
        weight: Math.round(rand(0.4, 0.85) * 100) / 100,
        recencyDays: Math.floor(rand(7, 90)),
        interactionCount: Math.floor(rand(2, 15)),
        sourceType: pick(['CRM', 'meeting', 'inferred']),
        confidence: Math.round(rand(0.5, 0.85) * 100) / 100,
      });
    });
  });

  const account: Account = { company, people: allPeople, edges };
  computeAccountScores(account);
  return account;
}
