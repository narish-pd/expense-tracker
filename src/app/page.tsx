"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useTransactionStore } from "@/store/transaction-store";
import { formatCurrency } from "@/lib/currency";
import { ExpenseCalendar } from "@/components/dashboard/expense-calendar";
import { format } from "date-fns";
import { th } from "date-fns/locale";

export default function HomePage() {
  const { transactions, categories } = useTransactionStore();

  const income = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "income")
        .reduce((acc, curr) => acc + curr.amount, 0),
    [transactions]
  );

  const expense = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "expense")
        .reduce((acc, curr) => acc + curr.amount, 0),
    [transactions]
  );

  const balance = income - expense;

  const recentTransactions = useMemo(
    () => transactions.slice(0, 5),
    [transactions]
  );

  return (
    <main className="mx-auto max-w-md p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Expense Tracker</h1>
        <p className="text-sm text-muted-foreground">
          {format(new Date(), "EEEE d MMMM yyyy", { locale: th })}
        </p>
      </div>

      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-primary p-6 text-primary-foreground"
      >
        <p className="text-sm opacity-70">ยอดคงเหลือ</p>
        <h2 className="mt-1 text-3xl font-bold">{formatCurrency(balance)}</h2>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs opacity-70">รายรับ</p>
            <p className="text-lg font-semibold text-green-300">
              +{formatCurrency(income)}
            </p>
          </div>
          <div>
            <p className="text-xs opacity-70">รายจ่าย</p>
            <p className="text-lg font-semibold text-red-300">
              -{formatCurrency(expense)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-6"
      >
        <ExpenseCalendar />
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6"
      >
        <h3 className="mb-3 font-semibold">รายการล่าสุด</h3>
        {recentTransactions.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            ยังไม่มีรายการ กดปุ่ม + เพื่อเพิ่มรายการ
          </p>
        ) : (
          <div className="space-y-2">
            {recentTransactions.map((transaction) => {
              const category = categories.find(
                (c) => c.id === transaction.categoryId
              );
              return (
                <div
                  key={transaction.id}
                  className="flex items-center gap-3 rounded-xl border p-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-lg">
                    {category?.icon || "💰"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {transaction.note || category?.name || "ไม่ระบุ"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {category?.name}
                    </p>
                  </div>
                  <p
                    className={
                      transaction.type === "income"
                        ? "text-green-500 font-medium"
                        : "text-red-500 font-medium"
                    }
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </main>
  );
}
