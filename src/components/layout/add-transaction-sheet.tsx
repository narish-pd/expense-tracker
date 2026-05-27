"use client";

import { useState, useEffect, useMemo } from "react";
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
import { format, setHours, setMinutes } from "date-fns";
import { th } from "date-fns/locale";
import { Clock, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddTransactionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate?: Date;
}

function combineDateAndTime(date: Date, timeHHmm: string): Date {
  const [hours, minutes] = timeHHmm.split(":").map(Number);
  return setMinutes(setHours(new Date(date), hours), minutes);
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
  const [showTime, setShowTime] = useState(false);
  const [time, setTime] = useState("12:00");

  const selectedDate = defaultDate || new Date();
  const filteredCategories = categories.filter((c) => c.type === type);

  const createdAtPreview = useMemo(
    () => combineDateAndTime(selectedDate, time),
    [selectedDate, time]
  );

  useEffect(() => {
    if (open) {
      setTime(format(new Date(), "HH:mm"));
      setShowTime(false);
    } else {
      setAmount("");
      setCategoryId("");
      setNote("");
      setShowTime(false);
    }
  }, [open]);

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || !categoryId) return;

    addTransaction({
      id: crypto.randomUUID(),
      amount: numAmount,
      type,
      categoryId,
      note: note || undefined,
      createdAt: combineDateAndTime(selectedDate, time).toISOString(),
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
          <SheetTitle className="flex flex-col items-start gap-0.5">
            <span>เพิ่มรายการ</span>
            <span className="text-sm font-normal text-muted-foreground">
              {format(createdAtPreview, "d MMM yyyy HH:mm น.", { locale: th })}
            </span>
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
            <button
              onClick={() => {
                setType("expense");
                setCategoryId("");
              }}
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
              onClick={() => {
                setType("income");
                setCategoryId("");
              }}
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

          {/* Time picker (collapsed by default) */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setShowTime((v) => !v)}
              className="flex w-full items-center justify-between rounded-xl border bg-muted/30 px-3 py-2.5 text-sm transition-colors hover:bg-muted/50"
            >
              <span className="flex items-center gap-2">
                <Clock size={16} className="text-muted-foreground" />
                เลือกเวลา
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="tabular-nums">{time} น.</span>
                <ChevronDown
                  size={16}
                  className={cn(
                    "transition-transform",
                    showTime && "rotate-180"
                  )}
                />
              </span>
            </button>
            {showTime && (
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="h-11"
              />
            )}
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
