"use client";

import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useTransactionStore } from "@/store/transaction-store";
import { formatCurrency } from "@/lib/currency";

export default function HomePage() {
  const { transactions } = useTransactionStore();

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = income - expense;

  return (
    <main className="mx-auto max-w-md p-4 pb-24">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Expense Tracker</h1>
        <p className="text-muted-foreground">บันทึกรายรับรายจ่าย</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-black p-6 text-white"
      >
        <p className="text-sm opacity-70">ยอดคงเหลือ</p>

        <h2 className="mt-2 text-4xl font-bold">{formatCurrency(balance)}</h2>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm opacity-70">รายรับ</p>
            <p className="text-xl font-semibold text-green-400">
              {formatCurrency(income)}
            </p>
          </div>

          <div>
            <p className="text-sm opacity-70">รายจ่าย</p>
            <p className="text-xl font-semibold text-red-400">
              {formatCurrency(expense)}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="mt-8 space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between rounded-2xl border p-4"
          >
            <div>
              <p className="font-medium">{transaction.note}</p>
              <p className="text-sm text-muted-foreground">
                {transaction.type === "income" ? "รายรับ" : "รายจ่าย"}
              </p>
            </div>

            <p
              className={
                transaction.type === "income"
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              {transaction.type === "income" ? "+" : "-"}
              {formatCurrency(transaction.amount)}
            </p>
          </div>
        ))}
      </div>

      <button className="fixed bottom-6 right-6 flex h-16 w-16 items-center justify-center rounded-full bg-black text-white shadow-2xl">
        <Plus size={28} />
      </button>
    </main>
  );
}
