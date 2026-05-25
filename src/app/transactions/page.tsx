"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTransactionStore } from "@/store/transaction-store";
import { TransactionItem } from "@/components/transactions/transaction-item";
import { TransactionType } from "@/types/transaction";
import { cn } from "@/lib/utils";

export default function TransactionsPage() {
  const { transactions, categories, removeTransaction } =
    useTransactionStore();
  const [filter, setFilter] = useState<"all" | TransactionType>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return transactions;
    return transactions.filter((t) => t.type === filter);
  }, [transactions, filter]);

  return (
    <main className="mx-auto max-w-md p-4">
      <h1 className="mb-4 text-2xl font-bold">รายการทั้งหมด</h1>

      {/* Filter Tabs */}
      <div className="mb-4 grid grid-cols-3 gap-1 rounded-xl bg-muted p-1">
        {(["all", "expense", "income"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-lg py-2 text-sm font-medium transition-colors",
              filter === f
                ? "bg-background shadow-sm"
                : "text-muted-foreground"
            )}
          >
            {f === "all" ? "ทั้งหมด" : f === "expense" ? "รายจ่าย" : "รายรับ"}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      {filtered.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-12">
          ยังไม่มีรายการ
        </p>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map((transaction) => (
              <motion.div
                key={transaction.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <TransactionItem
                  transaction={transaction}
                  category={categories.find(
                    (c) => c.id === transaction.categoryId
                  )}
                  onDelete={removeTransaction}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <p className="mt-4 text-center text-xs text-muted-foreground">
        ← ปัดซ้ายเพื่อลบรายการ
      </p>
    </main>
  );
}
