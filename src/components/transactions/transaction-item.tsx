"use client";

import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Trash2 } from "lucide-react";
import { Transaction, Category } from "@/types/transaction";
import { formatCurrency } from "@/lib/currency";
import { format } from "date-fns";
import { th } from "date-fns/locale";

interface TransactionItemProps {
  transaction: Transaction;
  category?: Category;
  onDelete: (id: string) => void;
}

export function TransactionItem({
  transaction,
  category,
  onDelete,
}: TransactionItemProps) {
  const x = useMotionValue(0);
  const background = useTransform(x, [-100, 0], ["#ef4444", "#00000000"]);
  const deleteOpacity = useTransform(x, [-100, -50, 0], [1, 0.5, 0]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -100) {
      onDelete(transaction.id);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Delete background */}
      <motion.div
        style={{ backgroundColor: background }}
        className="absolute inset-0 flex items-center justify-end px-6 rounded-xl"
      >
        <motion.div style={{ opacity: deleteOpacity }}>
          <Trash2 className="text-white" size={20} />
        </motion.div>
      </motion.div>

      {/* Swipeable item */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -150, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className="relative flex items-center gap-3 rounded-xl border bg-card p-3 cursor-grab active:cursor-grabbing"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-lg shrink-0">
          {category?.icon || "💰"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">
            {transaction.note || category?.name || "ไม่ระบุ"}
          </p>
          <p className="text-xs text-muted-foreground">
            {category?.name} •{" "}
            {format(new Date(transaction.createdAt), "d MMM HH:mm", {
              locale: th,
            })}
          </p>
        </div>
        <p
          className={
            transaction.type === "income"
              ? "text-green-500 font-semibold shrink-0"
              : "text-red-500 font-semibold shrink-0"
          }
        >
          {transaction.type === "income" ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </p>
      </motion.div>
    </div>
  );
}
