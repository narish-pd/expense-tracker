import { create } from "zustand";
import { Transaction } from "@/types/transaction";

type Store = {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  removeTransaction: (id: string) => void;
};

export const useTransactionStore = create<Store>((set) => ({
  transactions: [],

  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    })),

  removeTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),
}));
