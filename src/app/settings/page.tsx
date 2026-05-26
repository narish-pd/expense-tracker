"use client";

import { useState } from "react";
import { Moon, Sun, Download, Upload, Wallet, FileText, Tags, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useTransactionStore, Budget } from "@/store/transaction-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/currency";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const {
    darkMode,
    toggleDarkMode,
    transactions,
    categories,
    budgets,
    setBudget,
    removeBudget,
  } = useTransactionStore();

  const [budgetDialogOpen, setBudgetDialogOpen] = useState(false);
  const [budgetCategoryId, setBudgetCategoryId] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");

  const currentMonth = format(new Date(), "yyyy-MM");
  const expenseCategories = categories.filter((c) => c.type === "expense");

  const handleExportCSV = () => {
    const headers = ["วันที่", "ประเภท", "หมวดหมู่", "จำนวนเงิน", "บันทึก"];
    const rows = transactions.map((t) => {
      const cat = categories.find((c) => c.id === t.categoryId);
      return [
        format(new Date(t.createdAt), "yyyy-MM-dd HH:mm"),
        t.type === "income" ? "รายรับ" : "รายจ่าย",
        cat?.name || "-",
        t.amount.toString(),
        t.note || "-",
      ];
    });

    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const bom = "\uFEFF";
    const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expense-tracker-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleBackupJSON = () => {
    const data = {
      transactions,
      categories,
      budgets,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expense-tracker-backup-${format(new Date(), "yyyy-MM-dd")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRestoreJSON = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          if (data.transactions && data.categories) {
            const store = useTransactionStore.getState();
            useTransactionStore.setState({
              transactions: data.transactions,
              categories: data.categories,
              budgets: data.budgets || store.budgets,
            });
            alert("กู้คืนข้อมูลสำเร็จ!");
          }
        } catch {
          alert("ไฟล์ไม่ถูกต้อง");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleAddBudget = () => {
    if (!budgetCategoryId || !budgetAmount) return;
    setBudget({
      id: `${budgetCategoryId}-${currentMonth}`,
      categoryId: budgetCategoryId,
      amount: parseFloat(budgetAmount),
      month: currentMonth,
    });
    setBudgetCategoryId("");
    setBudgetAmount("");
    setBudgetDialogOpen(false);
  };

  const currentBudgets = budgets.filter((b) => b.month === currentMonth);

  return (
    <main className="mx-auto max-w-md p-4">
      <h1 className="mb-6 text-2xl font-bold">ตั้งค่า</h1>

      <div className="space-y-4">
        {/* Categories */}
        <Link
          href="/categories"
          className="flex w-full items-center gap-3 rounded-xl border p-4 hover:bg-muted/50 transition-colors"
        >
          <Tags size={20} />
          <div className="flex-1">
            <p className="font-medium">จัดการหมวดหมู่</p>
            <p className="text-xs text-muted-foreground">
              เพิ่ม ลบ แก้ไข หมวดหมู่รายรับรายจ่าย
            </p>
          </div>
          <ChevronRight size={18} className="text-muted-foreground" />
        </Link>

        {/* Dark Mode */}
        <div className="flex items-center justify-between rounded-xl border p-4">
          <div className="flex items-center gap-3">
            {darkMode ? <Moon size={20} /> : <Sun size={20} />}
            <span className="font-medium">โหมดมืด</span>
          </div>
          <button
            onClick={toggleDarkMode}
            className={cn(
              "relative h-7 w-12 rounded-full transition-colors",
              darkMode ? "bg-primary" : "bg-muted"
            )}
          >
            <div
              className={cn(
                "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform",
                darkMode ? "translate-x-5" : "translate-x-0.5"
              )}
            />
          </button>
        </div>

        {/* Budget */}
        <div className="rounded-xl border p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wallet size={20} />
              <span className="font-medium">งบประมาณรายเดือน</span>
            </div>
            <Dialog open={budgetDialogOpen} onOpenChange={setBudgetDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  ตั้งงบ
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>ตั้งงบประมาณ ({currentMonth})</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {expenseCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setBudgetCategoryId(cat.id)}
                        className={cn(
                          "flex items-center gap-2 rounded-lg p-2 text-sm",
                          budgetCategoryId === cat.id
                            ? "bg-primary/10 ring-2 ring-primary"
                            : "bg-muted"
                        )}
                      >
                        <span>{cat.icon}</span>
                        <span className="truncate">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                  <Input
                    type="number"
                    placeholder="จำนวนเงิน (บาท)"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    inputMode="decimal"
                  />
                  <Button
                    onClick={handleAddBudget}
                    className="w-full"
                    disabled={!budgetCategoryId || !budgetAmount}
                  >
                    บันทึก
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {currentBudgets.length === 0 ? (
            <p className="text-sm text-muted-foreground">ยังไม่ได้ตั้งงบ</p>
          ) : (
            <div className="space-y-2">
              {currentBudgets.map((budget) => {
                const cat = categories.find(
                  (c) => c.id === budget.categoryId
                );
                const spent = transactions
                  .filter(
                    (t) =>
                      t.categoryId === budget.categoryId &&
                      t.type === "expense" &&
                      t.createdAt.startsWith(currentMonth)
                  )
                  .reduce((sum, t) => sum + t.amount, 0);
                const percentage = Math.min(
                  (spent / budget.amount) * 100,
                  100
                );

                return (
                  <div key={budget.id} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>
                        {cat?.icon} {cat?.name}
                      </span>
                      <span className="text-muted-foreground">
                        {formatCurrency(spent)} / {formatCurrency(budget.amount)}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          percentage >= 90
                            ? "bg-red-500"
                            : percentage >= 70
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        )}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Export CSV */}
        <button
          onClick={handleExportCSV}
          className="flex w-full items-center gap-3 rounded-xl border p-4 text-left hover:bg-muted/50 transition-colors"
        >
          <FileText size={20} />
          <div>
            <p className="font-medium">ส่งออก CSV</p>
            <p className="text-xs text-muted-foreground">
              ส่งออกข้อมูลเป็นไฟล์ CSV
            </p>
          </div>
        </button>

        {/* Backup JSON */}
        <button
          onClick={handleBackupJSON}
          className="flex w-full items-center gap-3 rounded-xl border p-4 text-left hover:bg-muted/50 transition-colors"
        >
          <Download size={20} />
          <div>
            <p className="font-medium">สำรองข้อมูล</p>
            <p className="text-xs text-muted-foreground">
              Backup เป็นไฟล์ JSON
            </p>
          </div>
        </button>

        {/* Restore JSON */}
        <button
          onClick={handleRestoreJSON}
          className="flex w-full items-center gap-3 rounded-xl border p-4 text-left hover:bg-muted/50 transition-colors"
        >
          <Upload size={20} />
          <div>
            <p className="font-medium">กู้คืนข้อมูล</p>
            <p className="text-xs text-muted-foreground">
              นำเข้าจากไฟล์ JSON ที่ Backup ไว้
            </p>
          </div>
        </button>
      </div>
    </main>
  );
}
