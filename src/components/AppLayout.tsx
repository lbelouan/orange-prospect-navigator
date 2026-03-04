import { Building2, Map, Target, Rocket, BookOpen, Settings, Menu } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useState } from 'react';

const navItems = [
  { to: '/', icon: Building2, label: 'Accounts' },
  { to: '/account-map', icon: Map, label: 'Account Map' },
  { to: '/strategy', icon: Target, label: 'Deal Strategy' },
  { to: '/business-dev', icon: Rocket, label: 'Business Dev' },
  { to: '/playbook', icon: BookOpen, label: 'Playbook' },
  { to: '/admin', icon: Settings, label: 'Admin' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-56' : 'w-16'} flex-shrink-0 bg-card border-r border-border transition-all duration-200 flex flex-col`}>
        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b border-border gap-3">
          <div className="w-8 h-8 rounded-lg gradient-orange flex items-center justify-center flex-shrink-0">
            <span className="text-primary-foreground font-bold text-sm">O</span>
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-foreground leading-tight">Prospect Network</p>
              <p className="text-[10px] text-muted-foreground">Intelligence</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-secondary transition-colors"
              activeClassName="bg-orange-light text-orange-dark font-medium"
            >
              <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        {sidebarOpen && (
          <div className="p-4 border-t border-border">
            <p className="text-[10px] text-muted-foreground">Orange Business — POC v1</p>
          </div>
        )}
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 bg-card border-b border-border flex items-center px-4 gap-4 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-md hover:bg-secondary transition-colors"
          >
            <Menu className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full gradient-orange flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-medium">JD</span>
            </div>
            {sidebarOpen && <span className="text-sm text-foreground">Jean Dupont</span>}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
