import { useAppState } from '@/lib/appState';
import { getBestIntroPaths } from '@/lib/mockData';
import { ArrowRight, Mail, Linkedin, Users, Calendar, Copy } from 'lucide-react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function PlaybookPage() {
  const { accounts, selectedAccountId, setSelectedAccountId } = useAppState();
  const account = accounts.find(a => a.company.id === selectedAccountId) || accounts[0];

  useEffect(() => {
    if (!selectedAccountId && accounts.length > 0) setSelectedAccountId(accounts[0].company.id);
  }, [selectedAccountId, accounts, setSelectedAccountId]);

  if (!account) return null;

  const introPaths = getBestIntroPaths(account);
  const orangeContacts = account.people.filter(p => p.isOrangeEmployee);

  const emailTemplates = introPaths.slice(0, 2).map((path) => ({
    subject: `Introduction — ${account.company.name} / Orange Business`,
    body: `Bonjour ${path.steps[path.steps.length - 1]?.name},\n\nJe me permets de vous contacter suite à ${path.steps[0]?.name} qui m'a suggéré de prendre contact avec vous. Orange Business accompagne des entreprises comme ${account.company.name} dans leur transformation digitale.\n\nSeriez-vous disponible pour un échange de 20 minutes cette semaine ?\n\nCordialement`,
    via: path.steps[0]?.name || 'Contact Orange',
  }));

  const linkedinMessage = `Bonjour ${introPaths[0]?.steps[introPaths[0].steps.length - 1]?.name || '[Prénom]'},\n\nNous avons des contacts en commun dans le secteur ${account.company.industry}. Je travaille chez Orange Business et j'aimerais échanger sur vos enjeux de connectivité et cybersécurité.\n\nÊtes-vous ouvert à un échange rapide ?`;

  const eventSuggestions = [
    { name: `${account.company.industry} Innovation Summit 2026`, type: 'Conférence', relevance: 'Cibler les décideurs IT et Business' },
    { name: 'Orange Business Live', type: 'Événement Orange', relevance: 'Inviter les stakeholders identifiés' },
    { name: 'Cybersecurity Forum Europe', type: 'Salon', relevance: 'Engager les profils Security manquants' },
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
        <h1 className="text-2xl font-extrabold">Networking Playbook</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Warm Intros */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border/60 p-6 lg:col-span-2 shadow-card"
        >
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-xl gradient-orange flex items-center justify-center">
              <Mail className="w-4 h-4 text-primary-foreground" />
            </div>
            <h2 className="text-sm font-bold">Messages d'introduction</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {emailTemplates.map((tpl, i) => (
              <div key={i} className="p-4 rounded-xl border border-border/60 hover:border-primary/20 transition-colors group">
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-bold">Email via {tpl.via}</span>
                </div>
                <p className="text-xs font-semibold mb-2 text-muted-foreground">Objet : {tpl.subject}</p>
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-sans leading-relaxed">{tpl.body}</pre>
                <button className="mt-4 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 flex items-center gap-1.5 shadow-md shadow-primary/20 opacity-80 group-hover:opacity-100 transition-opacity">
                  <Copy className="w-3 h-3" />
                  Copier
                </button>
              </div>
            ))}

            <div className="p-4 rounded-xl border border-border/60 hover:border-info/20 transition-colors group">
              <div className="flex items-center gap-2 mb-3">
                <Linkedin className="w-3.5 h-3.5 text-info" />
                <span className="text-xs font-bold">Message LinkedIn</span>
              </div>
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-sans leading-relaxed">{linkedinMessage}</pre>
              <button className="mt-4 px-4 py-2 rounded-xl bg-info text-info-foreground text-xs font-bold hover:opacity-90 flex items-center gap-1.5 shadow-md shadow-info/20 opacity-80 group-hover:opacity-100 transition-opacity">
                <Copy className="w-3 h-3" />
                Copier
              </button>
            </div>
          </div>
        </motion.div>

        {/* Who to involve */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl border border-border/60 p-5 shadow-card"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-sm font-bold">Qui impliquer chez Orange</h2>
          </div>
          <div className="space-y-3">
            {orangeContacts.slice(0, 3).map(oc => (
              <div key={oc.id} className="p-3.5 rounded-xl border border-border/60 flex items-center gap-3 hover:border-primary/20 transition-colors">
                <div className="w-9 h-9 rounded-xl gradient-orange flex items-center justify-center text-xs font-bold text-primary-foreground shadow-md shadow-primary/20">
                  {oc.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold">{oc.name}</p>
                  <p className="text-[11px] text-muted-foreground">{oc.title}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Event targeting */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl border border-border/60 p-5 shadow-card"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-sm font-bold">Ciblage événementiel</h2>
          </div>
          <div className="space-y-3">
            {eventSuggestions.map((ev, i) => (
              <div key={i} className="p-3.5 rounded-xl border border-border/60 hover:border-primary/20 transition-colors">
                <p className="text-sm font-semibold">{ev.name}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-semibold">{ev.type}</span>
                  <span className="text-[11px] text-muted-foreground">{ev.relevance}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
