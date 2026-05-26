"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, subMonths, addMonths } from "date-fns";
import { th } from "date-fns/locale";
import { useTransactionStore } from "@/store/transaction-store";
import { TransactionItem } from "@/components/transactions/transaction-item";
import { TransactionType } from "@/types/transaction";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

export default function TransactionsPage() {
  const { transactions, categories, removeTransaction } =
    useTransactionStore();
  const [filter, setFilter] = useState<"all" | TransactionType>("all");
  const [monthMode, setMonthMode] = useState<"month" | "all">("month");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const filtered = useMemo(() => {
    let result = transactions;

    // Filter by month
    if (monthMode === "month") {
      result = result.filter((t) => {
        const d = new Date(t.createdAt);
        return (
          d.getMonth() === currentMonth.getMonth() &&
          d.getFullYear() === currentMonth.getFullYear()
        );
      });
    }

    // Filter by type
    if (filter !== "all") {
      result = result.filter((t) => t.type === filter);
    }

    return result;
  }, [transactions, filter, monthMode, currentMonth]);

  const totalIncome = filtered
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filtered
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <main className="mx-auto max-w-md p-4">
      <h1 className="mb-4 text-2xl font-bold">รายการ</h1>

      {/* Month / All Toggle */}
      <div className="mb-3 grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
        <button
          onClick={() => setMonthMode("month")}
          className={cn(
            "rounded-lg py-2 text-sm font-medium transition-colors",
            monthMode === "month"
              ? "bg-background shadow-sm"
              : "text-muted-foreground"
          )}
        >
          รายเดือน
        </button>
        <button
          onClick={() => setMonthMode("all")}
          className={cn(
            "rounded-lg py-2 text-sm font-medium transition-colors",
            monthMode === "all"
              ? "bg-background shadow-sm"
              : "text-muted-foreground"
          )}
        >
          ทั้งหมด
        </button>
      </div>

      {/* Month Selector */}
      {monthMode === "month" && (
        <div className="mb-3 flex items-center justify-between rounded-xl border p-3">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="rounded-lg p-1 hover:bg-muted"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-medium">
            {format(currentMonth, "MMMM yyyy", { locale: th })}
          </span>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="rounded-lg p-1 hover:bg-muted"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Type Filter */}
      <div className="mb-3 grid grid-cols-3 gap-1 rounded-xl bg-muted p-1">
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

      {/* Summary */}
      <div className="mb-4 flex items-center justify-between rounded-xl border p-3 text-sm">
        <span className="text-muted-foreground">
          {filtered.length} รายการ
        </span>
        <div className="flex gap-3">
          {(filter === "all" || filter === "income") && totalIncome > 0 && (
            <span className="text-green-500">+{formatCurrency(totalIncome)}</span>
          )}
          {(filter === "all" || filter === "expense") && totalExpense > 0 && (
            <span className="text-red-500">-{formatCurrency(totalExpense)}</span>
          )}
        </div>
      </div>

      {/* Transaction List */}
      {filtered.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-12">
          ไม่มีรายการ{monthMode === "month" ? "ในเดือนนี้" : ""}
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
