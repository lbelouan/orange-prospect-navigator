import React, { createContext, useContext, useState } from 'react';
import { Account } from './types';
import { mockAccounts } from './mockData';

interface AppState {
  accounts: Account[];
  selectedAccountId: string | null;
  setSelectedAccountId: (id: string | null) => void;
  addAccount: (account: Account) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>([...mockAccounts]);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  const addAccount = (account: Account) => {
    setAccounts(prev => [...prev, account]);
  };

  return (
    <AppContext.Provider value={{ accounts, selectedAccountId, setSelectedAccountId, addAccount }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be inside AppProvider');
  return ctx;
}
