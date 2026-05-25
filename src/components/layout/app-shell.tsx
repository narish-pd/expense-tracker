"use client";

import { useState, useEffect } from "react";
import { BottomNav } from "./bottom-nav";
import { AddTransactionSheet } from "./add-transaction-sheet";
import { useTransactionStore } from "@/store/transaction-store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [addOpen, setAddOpen] = useState(false);
  const { darkMode } = useTransactionStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <>
      <div className="pb-20">{children}</div>
      <BottomNav onAddClick={() => setAddOpen(true)} />
      <AddTransactionSheet open={addOpen} onOpenChange={setAddOpen} />
    </>
  );
}
