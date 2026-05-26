"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Pencil } from "lucide-react";
import { useTransactionStore } from "@/store/transaction-store";
import { TransactionType, Category } from "@/types/transaction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { cn } from "@/lib/utils";

const EMOJI_OPTIONS = [
  // 👥 บุคคลและครอบครัว (People & Family)
  "👶", "👧", "👦", "🧒", "👩", "👨", "🧑", "👱‍♀️",
  "👱‍♂️", "🧔", "👵", "👴", "🧓", "🤰", "🤱", "👼",
  "🚶‍♀️", "🚶‍♂️", "🏃‍♀️", "🏃‍♂️", "💃", "🕺", "👫", "👪",

  // 👮‍♀️ อาชีพและบทบาท (Professions & Roles)
  "👮‍♀️", "👮‍♂️", "👷‍♀️", "👷‍♂️", "💂‍♀️", "💂‍♂️", "🕵️‍♀️", "🕵️‍♂️",
  "👩‍⚕️", "👨‍⚕️", "👩‍🌾", "👨‍🌾", "👩‍🍳", "👨‍🍳", "👩‍🎓", "👨‍🎓",
  "👩‍🎤", "👨‍🎤", "👩‍🏫", "👨‍🏫", "👩‍💻", "👨‍💻", "👩‍💼", "👨‍💼",
  "🦸‍♀️", "🦸‍♂️", "🧙‍♀️", "🧙‍♂️", "🧚‍♀️", "🧚‍♂️", "🧛‍♀️", "🧛‍♂️",

  // 😀 ใบหน้าและอารมณ์ (Faces & Emotions)
  "😀", "😂", "🤣", "😊", "🥰", "😍", "😎", "🤩",
  "🤔", "🤨", "😐", "🙄", "😴", "😷", "🤒", "🤕",
  "🥳", "🤯", "🤠", "🥺", "😭", "😤", "😡", "🤬",

  // 👋 ท่าทางและมือ (Gestures & Hands)
  "👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "✌️",
  "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇",
  "👍", "👎", "✊", "👊", "👏", "🙌", "👐", "🙏",

  // 🍜 อาหารและเครื่องดื่ม (Food & Drink)
  "🍜", "🍕", "🍔", "☕", "🍺", "🧋", "🍰", "🥗",
  "🌮", "🍣", "🥐", "🥑", "🥩", "🍷", "🍩", "🍟",
  "🍱", "🍲", "🍿", "🍨", "🍬", "🍫", "🍹", "🍾",

  // 🚗 การเดินทางและยานพาหนะ (Transport & Vehicles)
  "🚗", "🚌", "🚕", "✈️", "⛽", "🚇", "🏍️", "🚲",
  "🚂", "🚤", "🚁", "🚀", "🛴", "🚢", "🛶", "🚛",
  "🚥", "⚓", "🛸", "🚨", "🚏", "🎫", "🧳", "🗺️",

  // 🛍️ ช้อปปิ้งและเครื่องแต่งกาย (Shopping & Fashion)
  "🛍️", "👕", "👟", "💄", "👜", "🎒", "💍", "🧴",
  "👗", "👖", "🧣", "🧤", "🧢", "👑", "💎", "🕶️",
  "🛒", "🏷️", "💳", "🧾", "🧥", "🧦", "👠", "☂️",

  // 🎬 บันเทิงและงานอดิเรก (Entertainment & Hobbies)
  "🎬", "🎮", "🎵", "📺", "🎭", "🎨", "📷", "🎤",
  "🎟️", "🎪", "🎢", "🎳", "🎸", "🎺", "🎲", "🧩",
  "🎯", "🎧", "📻", "🎷", "🎹", "📖", "🎈", "🎉",

  // 💊 สุขภาพและกีฬา (Health & Fitness)
  "💊", "🏥", "🦷", "🏋️", "🧘", "💉", "🩺", "👓",
  "🏃", "🏊", "🚴", "⚽", "🏀", "🎾", "🏈", "🥊",
  "🩹", "🩸", "🦠", "🛹", "🏸", "🏓", "⛳", "🎿",

  // 🏠 ของใช้ในบ้านและเครื่องมือ (Household & Tools)
  "📄", "💡", "📱", "🏠", "🔧", "🧹", "💧", "📶",
  "🛏️", "🛁", "🚪", "🪑", "🧽", "🪣", "🪛", "🔌",
  "🔨", "🪚", "🧲", "🪜", "🧺", "🧻", "🔑", "🔒",

  // 💻 การทำงานและการเรียน (Work & Education)
  "📚", "🎓", "📝", "💻", "🖥️", "⌨️", "🖨️", "📐",
  "⌚", "🔋", "💾", "💿", "📁", "📊", "📎", "📌",
  "✂️", "🗑️", "💼", "📅", "📈", "📉", "✉️", "📫",

  // 🐱 สัตว์และธรรมชาติ (Animals & Nature)
  "🐱", "🐕", "🌱", "✨", "🐰", "🦊", "🐼", "🦋",
  "🌴", "🌹", "🌻", "🌲", "🐠", "🦀", "🐢", "🦕",
  "☀️", "🌧️", "❄️", "⚡", "🌈", "🌙", "🌍", "🔥",

  // 💰 การเงินและอื่นๆ (Finance & Misc)
  "💰", "💸", "🎁", "🛡️", "🔔", "⏳", "⏰", "⚖️",
  "🪙", "💵", "💴", "💶", "💷", "🏆", "🏅", "💖"
];

const COLOR_OPTIONS = [
  "#f97316", "#ef4444", "#ec4899", "#a855f7", "#8b5cf6",
  "#3b82f6", "#06b6d4", "#14b8a6", "#10b981", "#22c55e",
  "#84cc16", "#f59e0b", "#6b7280", "#78716c",
];

export default function CategoriesPage() {
  const { categories, addCategory, updateCategory, removeCategory } =
    useTransactionStore();

  // Add/Edit dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formName, setFormName] = useState("");
  const [formIcon, setFormIcon] = useState("🍜");
  const [formColor, setFormColor] = useState("#f97316");
  const [formType, setFormType] = useState<TransactionType>("expense");

  // Delete confirm state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const expenseCategories = categories.filter((c) => c.type === "expense");
  const incomeCategories = categories.filter((c) => c.type === "income");

  const openAddDialog = () => {
    setEditingCategory(null);
    setFormName("");
    setFormIcon("🍜");
    setFormColor("#f97316");
    setFormType("expense");
    setDialogOpen(true);
  };

  const openEditDialog = (cat: Category) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormIcon(cat.icon);
    setFormColor(cat.color);
    setFormType(cat.type);
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formName.trim()) return;

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: formName.trim(),
        icon: formIcon,
        color: formColor,
        type: formType,
      });
    } else {
      addCategory({
        id: crypto.randomUUID(),
        name: formName.trim(),
        icon: formIcon,
        color: formColor,
        type: formType,
      });
    }

    setDialogOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteRequest = (id: string) => {
    setDeletingId(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      removeCategory(deletingId);
      setDeletingId(null);
    }
  };

  const renderCategoryList = (list: Category[]) => (
    <div className="space-y-2">
      <AnimatePresence>
        {list.map((cat) => (
          <motion.div
            key={cat.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-3 rounded-xl border p-3"
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-lg shrink-0"
              style={{ backgroundColor: cat.color + "20" }}
            >
              {cat.icon}
            </div>
            <span className="flex-1 font-medium truncate">{cat.name}</span>
            <button
              onClick={() => openEditDialog(cat)}
              className="rounded-lg p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => handleDeleteRequest(cat.id)}
              className="rounded-lg p-2 text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

  return (
    <main className="mx-auto max-w-md p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">หมวดหมู่</h1>
        <Button size="sm" onClick={openAddDialog}>
          <Plus size={16} className="mr-1" />
          เพิ่ม
        </Button>
      </div>

      {/* Expense Categories */}
      <section className="mb-6">
        <h2 className="mb-2 text-sm font-medium text-muted-foreground">
          รายจ่าย ({expenseCategories.length})
        </h2>
        {renderCategoryList(expenseCategories)}
      </section>

      {/* Income Categories */}
      <section>
        <h2 className="mb-2 text-sm font-medium text-muted-foreground">
          รายรับ ({incomeCategories.length})
        </h2>
        {renderCategoryList(incomeCategories)}
      </section>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "แก้ไขหมวดหมู่" : "เพิ่มหมวดหมู่"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Type Toggle */}
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
              <button
                onClick={() => setFormType("expense")}
                className={cn(
                  "rounded-lg py-2 text-sm font-medium transition-colors",
                  formType === "expense"
                    ? "bg-background shadow-sm"
                    : "text-muted-foreground"
                )}
              >
                รายจ่าย
              </button>
              <button
                onClick={() => setFormType("income")}
                className={cn(
                  "rounded-lg py-2 text-sm font-medium transition-colors",
                  formType === "income"
                    ? "bg-background shadow-sm"
                    : "text-muted-foreground"
                )}
              >
                รายรับ
              </button>
            </div>

            {/* Name */}
            <Input
              placeholder="ชื่อหมวดหมู่"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
            />

            {/* Emoji Picker */}
            <div>
              <p className="mb-2 text-sm font-medium">ไอคอน</p>
              <div className="grid grid-cols-8 gap-1.5 max-h-48 overflow-y-auto rounded-lg border p-2">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setFormIcon(emoji)}
                    className={cn(
                      "rounded-lg p-1.5 text-xl transition-all",
                      formIcon === emoji
                        ? "bg-primary/10 ring-2 ring-primary scale-110"
                        : "hover:bg-muted"
                    )}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Picker */}
            <div>
              <p className="mb-2 text-sm font-medium">สี</p>
              <div className="grid grid-cols-7 gap-2">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setFormColor(color)}
                    className={cn(
                      "h-8 w-8 rounded-full transition-transform",
                      formColor === color &&
                        "ring-2 ring-primary ring-offset-2 scale-110"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="flex items-center gap-3 rounded-xl border bg-muted/50 p-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full text-lg"
                style={{ backgroundColor: formColor + "20" }}
              >
                {formIcon}
              </div>
              <span className="font-medium">
                {formName || "ตัวอย่าง"}
              </span>
            </div>

            {/* Submit */}
            <Button
              onClick={handleSubmit}
              className="w-full"
              disabled={!formName.trim()}
            >
              {editingCategory ? "บันทึกการแก้ไข" : "เพิ่มหมวดหมู่"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="ลบหมวดหมู่"
        description="คุณต้องการลบหมวดหมู่นี้ใช่ไหม? การดำเนินการนี้ไม่สามารถย้อนกลับได้"
        onConfirm={handleConfirmDelete}
        confirmLabel="ลบ"
        cancelLabel="ยกเลิก"
      />
    </main>
  );
}
