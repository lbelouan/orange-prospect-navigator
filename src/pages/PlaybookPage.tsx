import { useAppState } from '@/lib/appState';
import { getBestIntroPaths } from '@/lib/mockData';
import { ArrowRight, Mail, Linkedin, Users, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function PlaybookPage() {
  const { accounts, selectedAccountId, setSelectedAccountId } = useAppState();
  const account = accounts.find(a => a.company.id === selectedAccountId) || accounts[0];

  useEffect(() => {
    if (!selectedAccountId && accounts.length > 0) setSelectedAccountId(accounts[0].company.id);
  }, [selectedAccountId, accounts, setSelectedAccountId]);

  if (!account) return null;

  const introPaths = getBestIntroPaths(account);
  const orangeContacts = account.people.filter(p => p.isOrangeEmployee);

  const emailTemplates = introPaths.slice(0, 2).map((path, i) => ({
    subject: `Introduction — ${account.company.name} / Orange Business`,
    body: `Bonjour ${path.steps[path.steps.length - 1]?.name},\n\nJe me permets de vous contacter suite à ${path.steps[0]?.name} qui m'a suggéré de prendre contact avec vous. Orange Business accompagne des entreprises comme ${account.company.name} dans leur transformation digitale.\n\nSeriez-vous disponible pour un échange de 20 minutes cette semaine ?\n\nCordialement`,
    via: path.steps[0]?.name || 'Contact Orange',
  }));

  const linkedinMessage = `Bonjour ${introPaths[0]?.steps[introPaths[0].steps.length - 1]?.name || '[Prénom]'},\n\nNous avons des contacts en commun dans le secteur ${account.company.industry}. Je travaille chez Orange Business et j'aimerais échanger sur vos enjeux de connectivité et cybersécurité.\n\nÊtes-vous ouvert à un échange rapide ?`;

  const eventSuggestions = [
    { name: `${account.company.industry} Innovation Summit 2026`, type: 'Conférence', relevance: 'Cibler les décideurs IT et Business' },
    { name: 'Orange Business Live', type: 'Événement Orange', relevance: 'Inviter les stakeholders identifiés' },
    { name: `Cybersecurity Forum Europe`, type: 'Salon', relevance: 'Engager les profils Security manquants' },
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
        <h1 className="text-2xl font-bold">Networking Playbook</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Warm Intros */}
        <div className="bg-card rounded-xl border border-border p-5 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold">Messages d'introduction</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emailTemplates.map((tpl, i) => (
              <div key={i} className="p-4 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium">Email via {tpl.via}</span>
                </div>
                <p className="text-xs font-medium mb-1">Objet : {tpl.subject}</p>
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-sans">{tpl.body}</pre>
                <button className="mt-3 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90">
                  Copier
                </button>
              </div>
            ))}

            <div className="p-4 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Linkedin className="w-3.5 h-3.5 text-info" />
                <span className="text-xs font-medium">Message LinkedIn</span>
              </div>
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-sans">{linkedinMessage}</pre>
              <button className="mt-3 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90">
                Copier
              </button>
            </div>
          </div>
        </div>

        {/* Who to involve */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold">Qui impliquer chez Orange</h2>
          </div>
          <div className="space-y-3">
            {orangeContacts.slice(0, 3).map(oc => (
              <div key={oc.id} className="p-3 rounded-lg border border-border flex items-center gap-3">
                <div className="w-8 h-8 rounded-full gradient-orange flex items-center justify-center text-xs font-medium text-primary-foreground">
                  {oc.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-medium">{oc.name}</p>
                  <p className="text-[11px] text-muted-foreground">{oc.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Event targeting */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold">Ciblage événementiel</h2>
          </div>
          <div className="space-y-3">
            {eventSuggestions.map((ev, i) => (
              <div key={i} className="p-3 rounded-lg border border-border">
                <p className="text-sm font-medium">{ev.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{ev.type}</span>
                  <span className="text-[11px] text-muted-foreground">{ev.relevance}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
