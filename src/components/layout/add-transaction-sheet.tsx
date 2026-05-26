"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTransactionStore } from "@/store/transaction-store";
import { TransactionType } from "@/types/transaction";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface AddTransactionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate?: Date;
}

export function AddTransactionSheet({
  open,
  onOpenChange,
  defaultDate,
}: AddTransactionSheetProps) {
  const { categories, addTransaction } = useTransactionStore();
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open) {
      setAmount("");
      setCategoryId("");
      setNote("");
    }
  }, [open]);

  const filteredCategories = categories.filter((c) => c.type === type);

  const selectedDate = defaultDate || new Date();

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || !categoryId) return;

    addTransaction({
      id: crypto.randomUUID(),
      amount: numAmount,
      type,
      categoryId,
      note: note || undefined,
      createdAt: selectedDate.toISOString(),
    });

    setAmount("");
    setCategoryId("");
    setNote("");
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl px-4 pb-8">
        <SheetHeader className="pb-2">
          <SheetTitle className="flex items-center gap-2">
            เพิ่มรายการ
            <span className="text-sm font-normal text-muted-foreground">
              — {format(selectedDate, "d MMM yyyy", { locale: th })}
            </span>
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
            <button
              onClick={() => { setType("expense"); setCategoryId(""); }}
              className={cn(
                "rounded-lg py-2 text-sm font-medium transition-colors",
                type === "expense"
                  ? "bg-background text-red-500 shadow-sm"
                  : "text-muted-foreground"
              )}
            >
              รายจ่าย
            </button>
            <button
              onClick={() => { setType("income"); setCategoryId(""); }}
              className={cn(
                "rounded-lg py-2 text-sm font-medium transition-colors",
                type === "income"
                  ? "bg-background text-green-500 shadow-sm"
                  : "text-muted-foreground"
              )}
            >
              รายรับ
            </button>
          </div>

          {/* Amount */}
          <div>
            <Input
              type="number"
              placeholder="จำนวนเงิน (บาท)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-12 text-lg"
              inputMode="decimal"
            />
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-4 gap-2 max-h-36 overflow-y-auto">
            {filteredCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryId(cat.id)}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl p-2 text-xs transition-all",
                  categoryId === cat.id
                    ? "bg-primary/10 ring-2 ring-primary"
                    : "bg-muted hover:bg-muted/80"
                )}
              >
                <span className="text-xl">{cat.icon}</span>
                <span className="truncate w-full text-center">{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Note */}
          <Input
            placeholder="บันทึก (ไม่บังคับ)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="h-11"
          />

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={!amount || !categoryId}
            className="w-full h-12 text-base font-medium"
          >
            บันทึกรายการ
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
