import { Building2, Map, Target, Rocket, BookOpen, Settings, Menu, X, ChevronLeft } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import logoOrange from '@/assets/logo_orange.webp';
import ThemeToggle from '@/components/ThemeToggle';

const navItems = [
  { to: '/', icon: Building2, label: 'Accounts' },
  { to: '/account-map', icon: Map, label: 'Account Map' },
  { to: '/strategy', icon: Target, label: 'Deal Strategy' },
  { to: '/business-dev', icon: Rocket, label: 'Business Dev' },
  { to: '/playbook', icon: BookOpen, label: 'Playbook' },
  { to: '/admin', icon: Settings, label: 'Admin' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [isMobile]);

  const closeMobileSidebar = () => {
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{ 
          width: isMobile ? 260 : (sidebarOpen ? 240 : 68),
          x: isMobile && !sidebarOpen ? -260 : 0,
        }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className={`${isMobile ? 'fixed inset-y-0 left-0 z-40' : 'flex-shrink-0 relative z-20'} bg-sidebar border-r border-sidebar-border flex flex-col`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-3 gap-3">
          <img 
            src={logoOrange} 
            alt="Orange" 
            className="w-10 h-10 rounded-xl object-contain flex-shrink-0 shadow-lg shadow-primary/20"
          />
          <AnimatePresence>
            {(isMobile || sidebarOpen) && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden flex-1"
              >
                <p className="text-[13px] font-bold text-sidebar-accent-foreground leading-tight tracking-tight">Prospect Network</p>
                <p className="text-[10px] text-sidebar-foreground/50 font-medium">Intelligence</p>
              </motion.div>
            )}
          </AnimatePresence>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} className="ml-auto text-sidebar-foreground/60 hover:text-sidebar-accent-foreground p-1">
              <X className="w-5 h-5" />
            </button>
          )}
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
              onClick={closeMobileSidebar}
            >
              <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
              <AnimatePresence>
                {(isMobile || sidebarOpen) && (
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

        {/* Collapse button — desktop only */}
        {!isMobile && (
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
        )}
      </motion.aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 sm:h-16 glass border-b border-border/50 flex items-center px-4 sm:px-6 gap-3 flex-shrink-0 sticky top-0 z-10">
          {isMobile && (
            <button onClick={() => setSidebarOpen(true)} className="p-1.5 -ml-1 text-foreground hover:text-primary transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div className="flex-1" />
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-8 w-px bg-border/50 hidden sm:block" />
            <div className="flex items-center gap-2">
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
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
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
