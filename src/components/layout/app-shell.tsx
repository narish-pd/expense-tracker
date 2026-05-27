"use client";

import { useState, useEffect } from "react";
import { BottomNav } from "./bottom-nav";
import { AddTransactionSheet } from "./add-transaction-sheet";
import { PwaInstallPrompt } from "./pwa-install-prompt";
import { useTransactionStore } from "@/store/transaction-store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [addOpen, setAddOpen] = useState(false);
  const [addDate, setAddDate] = useState<Date | undefined>(undefined);
  const { darkMode } = useTransactionStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleAddClick = () => {
    setAddDate(undefined);
    setAddOpen(true);
  };

  const handleAddForDate = (date: Date) => {
    setAddDate(date);
    setAddOpen(true);
  };

  return (
    <AppShellContext.Provider value={{ onAddForDate: handleAddForDate }}>
      <div className="pb-20">{children}</div>
      <BottomNav onAddClick={handleAddClick} />
      <AddTransactionSheet
        open={addOpen}
        onOpenChange={setAddOpen}
        defaultDate={addDate}
      />
      <PwaInstallPrompt />
    </AppShellContext.Provider>
  );
}

import { createContext, useContext } from "react";

interface AppShellContextType {
  onAddForDate: (date: Date) => void;
}

const AppShellContext = createContext<AppShellContextType>({
  onAddForDate: () => {},
});

export function useAppShell() {
  return useContext(AppShellContext);
}
