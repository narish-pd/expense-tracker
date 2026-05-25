"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { useTransactionStore } from "@/store/transaction-store";
import { TransactionType } from "@/types/transaction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const EMOJI_OPTIONS = [
  "🍜", "🍕", "☕", "🚗", "🚌", "✈️", "🛍️", "👕",
  "🎬", "🎮", "💊", "🏥", "📄", "💡", "📚", "💻",
  "🏠", "💰", "📈", "🎁", "💸", "🐱", "🏋️", "🎵",
];

const COLOR_OPTIONS = [
  "#f97316", "#ef4444", "#ec4899", "#a855f7", "#8b5cf6",
  "#3b82f6", "#06b6d4", "#14b8a6", "#10b981", "#22c55e",
  "#84cc16", "#f59e0b", "#6b7280", "#78716c",
];

export default function CategoriesPage() {
  const { categories, addCategory, removeCategory } = useTransactionStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("🍜");
  const [newColor, setNewColor] = useState("#f97316");
  const [newType, setNewType] = useState<TransactionType>("expense");

  const expenseCategories = categories.filter((c) => c.type === "expense");
  const incomeCategories = categories.filter((c) => c.type === "income");

  const handleAdd = () => {
    if (!newName.trim()) return;
    addCategory({
      id: crypto.randomUUID(),
      name: newName.trim(),
      icon: newIcon,
      color: newColor,
      type: newType,
    });
    setNewName("");
    setDialogOpen(false);
  };

  return (
    <main className="mx-auto max-w-md p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">หมวดหมู่</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus size={16} className="mr-1" />
              เพิ่ม
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>เพิ่มหมวดหมู่</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
                <button
                  onClick={() => setNewType("expense")}
                  className={cn(
                    "rounded-lg py-2 text-sm font-medium",
                    newType === "expense"
                      ? "bg-background shadow-sm"
                      : "text-muted-foreground"
                  )}
                >
                  รายจ่าย
                </button>
                <button
                  onClick={() => setNewType("income")}
                  className={cn(
                    "rounded-lg py-2 text-sm font-medium",
                    newType === "income"
                      ? "bg-background shadow-sm"
                      : "text-muted-foreground"
                  )}
                >
                  รายรับ
                </button>
              </div>

              <Input
                placeholder="ชื่อหมวดหมู่"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />

              <div>
                <p className="mb-2 text-sm font-medium">ไอคอน</p>
                <div className="grid grid-cols-8 gap-2">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setNewIcon(emoji)}
                      className={cn(
                        "rounded-lg p-2 text-lg",
                        newIcon === emoji
                          ? "bg-primary/10 ring-2 ring-primary"
                          : "hover:bg-muted"
                      )}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium">สี</p>
                <div className="grid grid-cols-7 gap-2">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewColor(color)}
                      className={cn(
                        "h-8 w-8 rounded-full",
                        newColor === color && "ring-2 ring-primary ring-offset-2"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <Button onClick={handleAdd} className="w-full" disabled={!newName.trim()}>
                เพิ่มหมวดหมู่
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Expense Categories */}
      <section className="mb-6">
        <h2 className="mb-2 text-sm font-medium text-muted-foreground">
          รายจ่าย
        </h2>
        <div className="space-y-2">
          <AnimatePresence>
            {expenseCategories.map((cat) => (
              <motion.div
                key={cat.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-3 rounded-xl border p-3"
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-lg"
                  style={{ backgroundColor: cat.color + "20" }}
                >
                  {cat.icon}
                </div>
                <span className="flex-1 font-medium">{cat.name}</span>
                <button
                  onClick={() => removeCategory(cat.id)}
                  className="rounded-lg p-2 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Income Categories */}
      <section>
        <h2 className="mb-2 text-sm font-medium text-muted-foreground">
          รายรับ
        </h2>
        <div className="space-y-2">
          <AnimatePresence>
            {incomeCategories.map((cat) => (
              <motion.div
                key={cat.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-3 rounded-xl border p-3"
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-lg"
                  style={{ backgroundColor: cat.color + "20" }}
                >
                  {cat.icon}
                </div>
                <span className="flex-1 font-medium">{cat.name}</span>
                <button
                  onClick={() => removeCategory(cat.id)}
                  className="rounded-lg p-2 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
