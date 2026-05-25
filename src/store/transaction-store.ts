"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Transaction, Category } from "@/types/transaction";

const DEFAULT_CATEGORIES: Category[] = [
  { id: "food", name: "อาหาร", icon: "🍜", color: "#f97316", type: "expense" },
  { id: "transport", name: "เดินทาง", icon: "🚗", color: "#3b82f6", type: "expense" },
  { id: "shopping", name: "ช้อปปิ้ง", icon: "🛍️", color: "#ec4899", type: "expense" },
  { id: "entertainment", name: "บันเทิง", icon: "🎬", color: "#8b5cf6", type: "expense" },
  { id: "health", name: "สุขภาพ", icon: "💊", color: "#10b981", type: "expense" },
  { id: "bills", name: "บิล/ค่าใช้จ่าย", icon: "📄", color: "#f59e0b", type: "expense" },
  { id: "education", name: "การศึกษา", icon: "📚", color: "#06b6d4", type: "expense" },
  { id: "other-expense", name: "อื่นๆ", icon: "💸", color: "#6b7280", type: "expense" },
  { id: "salary", name: "เงินเดือน", icon: "💰", color: "#22c55e", type: "income" },
  { id: "freelance", name: "ฟรีแลนซ์", icon: "💻", color: "#14b8a6", type: "income" },
  { id: "investment", name: "การลงทุน", icon: "📈", color: "#a855f7", type: "income" },
  { id: "other-income", name: "รายรับอื่นๆ", icon: "🎁", color: "#84cc16", type: "income" },
];

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  month: string; // YYYY-MM
}

type Store = {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  darkMode: boolean;

  addTransaction: (transaction: Transaction) => void;
  removeTransaction: (id: string) => void;

  addCategory: (category: Category) => void;
  removeCategory: (id: string) => void;

  setBudget: (budget: Budget) => void;
  removeBudget: (id: string) => void;

  toggleDarkMode: () => void;
};

export const useTransactionStore = create<Store>()(
  persist(
    (set) => ({
      transactions: [],
      categories: DEFAULT_CATEGORIES,
      budgets: [],
      darkMode: false,

      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [transaction, ...state.transactions],
        })),

      removeTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      addCategory: (category) =>
        set((state) => ({
          categories: [...state.categories, category],
        })),

      removeCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        })),

      setBudget: (budget) =>
        set((state) => ({
          budgets: [
            ...state.budgets.filter((b) => b.id !== budget.id),
            budget,
          ],
        })),

      removeBudget: (id) =>
        set((state) => ({
          budgets: state.budgets.filter((b) => b.id !== id),
        })),

      toggleDarkMode: () =>
        set((state) => ({ darkMode: !state.darkMode })),
    }),
    {
      name: "expense-tracker-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
