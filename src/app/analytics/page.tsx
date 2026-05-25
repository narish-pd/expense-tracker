"use client";

import { useMemo, useState } from "react";
import { format, subMonths, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { th } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import { useTransactionStore } from "@/store/transaction-store";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
  const { transactions, categories } = useTransactionStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tab, setTab] = useState<"pie" | "trend" | "category">("pie");

  const monthTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const d = new Date(t.createdAt);
      return (
        d.getMonth() === currentMonth.getMonth() &&
        d.getFullYear() === currentMonth.getFullYear()
      );
    });
  }, [transactions, currentMonth]);

  const expenseByCategory = useMemo(() => {
    const map = new Map<string, number>();
    monthTransactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        map.set(t.categoryId, (map.get(t.categoryId) || 0) + t.amount);
      });
    return Array.from(map.entries())
      .map(([catId, amount]) => {
        const cat = categories.find((c) => c.id === catId);
        return {
          name: cat?.name || "อื่นๆ",
          value: amount,
          color: cat?.color || "#6b7280",
          icon: cat?.icon || "💸",
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [monthTransactions, categories]);

  const dailyTrend = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });

    return days.map((day) => {
      const dayStr = format(day, "yyyy-MM-dd");
      const dayExpense = monthTransactions
        .filter(
          (t) =>
            t.type === "expense" &&
            format(new Date(t.createdAt), "yyyy-MM-dd") === dayStr
        )
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        date: format(day, "d"),
        amount: dayExpense,
      };
    });
  }, [monthTransactions, currentMonth]);

  const categoryUsage = useMemo(() => {
    const map = new Map<string, number>();
    monthTransactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        map.set(t.categoryId, (map.get(t.categoryId) || 0) + 1);
      });
    return Array.from(map.entries())
      .map(([catId, count]) => {
        const cat = categories.find((c) => c.id === catId);
        return {
          name: cat?.name || "อื่นๆ",
          count,
          color: cat?.color || "#6b7280",
          icon: cat?.icon || "💸",
        };
      })
      .sort((a, b) => b.count - a.count);
  }, [monthTransactions, categories]);

  const totalExpense = monthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <main className="mx-auto max-w-md p-4">
      <h1 className="mb-4 text-2xl font-bold">สถิติ</h1>

      {/* Month Selector */}
      <div className="mb-4 flex items-center justify-between rounded-xl border p-3">
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
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
          className="rounded-lg p-1 hover:bg-muted"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-4 grid grid-cols-3 gap-1 rounded-xl bg-muted p-1">
        {([
          { key: "pie", label: "สัดส่วน" },
          { key: "trend", label: "แนวโน้ม" },
          { key: "category", label: "หมวดหมู่" },
        ] as const).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded-lg py-2 text-sm font-medium transition-colors",
              tab === t.key
                ? "bg-background shadow-sm"
                : "text-muted-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Pie Chart */}
      {tab === "pie" && (
        <div className="rounded-2xl border p-4">
          <p className="mb-2 text-center text-sm text-muted-foreground">
            รายจ่ายรวม {formatCurrency(totalExpense)}
          </p>
          {expenseByCategory.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              ไม่มีข้อมูล
            </p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={expenseByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    dataKey="value"
                    stroke="none"
                  >
                    {expenseByCategory.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {expenseByCategory.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="flex-1 text-sm">{item.icon} {item.name}</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(item.value)}
                    </span>
                    <span className="text-xs text-muted-foreground w-10 text-right">
                      {totalExpense > 0
                        ? ((item.value / totalExpense) * 100).toFixed(0)
                        : 0}
                      %
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Expense Trend */}
      {tab === "trend" && (
        <div className="rounded-2xl border p-4">
          <p className="mb-4 text-sm text-muted-foreground">
            รายจ่ายรายวัน
          </p>
          {dailyTrend.every((d) => d.amount === 0) ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              ไม่มีข้อมูล
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={dailyTrend}>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  interval="preserveStartEnd"
                />
                <YAxis hide />
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
                  labelFormatter={(label) => `วันที่ ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      )}

      {/* Category Usage */}
      {tab === "category" && (
        <div className="rounded-2xl border p-4">
          <p className="mb-4 text-sm text-muted-foreground">
            จำนวนครั้งที่ใช้แต่ละหมวดหมู่
          </p>
          {categoryUsage.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              ไม่มีข้อมูล
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryUsage} layout="vertical">
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  width={80}
                />
                <Tooltip
                  formatter={(value) => `${value} ครั้ง`}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {categoryUsage.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      )}
    </main>
  );
}
