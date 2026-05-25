"use client";

import { useState, useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  getDay,
  isToday,
} from "date-fns";
import { th } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTransactionStore } from "@/store/transaction-store";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

export function ExpenseCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { transactions } = useTransactionStore();

  const days = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const startDayOfWeek = getDay(startOfMonth(currentMonth));

  const dailyExpenses = useMemo(() => {
    const map = new Map<string, number>();
    transactions.forEach((t) => {
      if (t.type === "expense") {
        const key = format(new Date(t.createdAt), "yyyy-MM-dd");
        map.set(key, (map.get(key) || 0) + t.amount);
      }
    });
    return map;
  }, [transactions]);

  const monthTotal = useMemo(() => {
    return transactions
      .filter((t) => {
        const d = new Date(t.createdAt);
        return (
          t.type === "expense" &&
          d.getMonth() === currentMonth.getMonth() &&
          d.getFullYear() === currentMonth.getFullYear()
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions, currentMonth]);

  const maxDailyExpense = useMemo(() => {
    let max = 0;
    days.forEach((day) => {
      const key = format(day, "yyyy-MM-dd");
      const val = dailyExpenses.get(key) || 0;
      if (val > max) max = val;
    });
    return max;
  }, [days, dailyExpenses]);

  return (
    <div className="rounded-2xl border bg-card p-4">
      {/* Month Selector */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="rounded-lg p-2 hover:bg-muted"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <h3 className="font-semibold">
            {format(currentMonth, "MMMM yyyy", { locale: th })}
          </h3>
          <p className="text-sm text-muted-foreground">
            รวมรายจ่าย {formatCurrency(monthTotal)}
          </p>
        </div>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="rounded-lg p-2 hover:bg-muted"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Day Headers */}
      <div className="mb-1 grid grid-cols-7 text-center text-xs text-muted-foreground">
        {["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const expense = dailyExpenses.get(key) || 0;
          const intensity =
            maxDailyExpense > 0 ? expense / maxDailyExpense : 0;

          return (
            <div
              key={key}
              className={cn(
                "relative flex flex-col items-center rounded-lg p-1 text-xs",
                isToday(day) && "ring-2 ring-primary"
              )}
            >
              <span
                className={cn(
                  "text-[11px]",
                  isToday(day) ? "font-bold" : "text-foreground"
                )}
              >
                {format(day, "d")}
              </span>
              {expense > 0 && (
                <div
                  className="mt-0.5 h-1.5 w-1.5 rounded-full"
                  style={{
                    backgroundColor: `hsl(0, ${50 + intensity * 50}%, ${60 - intensity * 20}%)`,
                  }}
                />
              )}
              {expense > 0 && (
                <span className="mt-0.5 text-[8px] text-muted-foreground truncate w-full text-center">
                  {expense >= 1000
                    ? `${(expense / 1000).toFixed(0)}k`
                    : expense.toFixed(0)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
