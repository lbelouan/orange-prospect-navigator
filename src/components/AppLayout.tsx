import { Building2, Map, Target, Rocket, BookOpen, Settings, Menu, ChevronLeft } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
      {/* Sidebar — dark theme */}
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 68 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="flex-shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col relative z-20"
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 gap-3">
          <div className="w-9 h-9 rounded-xl gradient-orange flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
            <span className="text-primary-foreground font-extrabold text-sm tracking-tight">O</span>
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden"
              >
                <p className="text-[13px] font-bold text-sidebar-accent-foreground leading-tight tracking-tight">Prospect Network</p>
                <p className="text-[10px] text-sidebar-foreground/50 font-medium">Intelligence</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2.5 space-y-0.5">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent transition-all duration-150"
              activeClassName="!bg-primary !text-primary-foreground font-semibold shadow-lg shadow-primary/25"
            >
              <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>

        {/* Collapse button */}
        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sidebar-foreground/60 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent transition-all text-xs"
          >
            <motion.div
              animate={{ rotate: sidebarOpen ? 0 : 180 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="whitespace-nowrap"
                >
                  Réduire
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header — glass effect */}
        <header className="h-16 glass border-b border-border/50 flex items-center px-6 gap-4 flex-shrink-0 sticky top-0 z-10">
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="h-8 w-px bg-border/50" />
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full gradient-orange flex items-center justify-center shadow-md shadow-primary/20">
                <span className="text-primary-foreground text-xs font-bold">JD</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-foreground leading-tight">Jean Dupont</p>
                <p className="text-[10px] text-muted-foreground">Sales Executive</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
