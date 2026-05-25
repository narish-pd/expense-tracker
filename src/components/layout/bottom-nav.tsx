"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Receipt, PieChart, Settings, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: Home, label: "หน้าหลัก" },
  { href: "/transactions", icon: Receipt, label: "รายการ" },
  { href: "#add", icon: Plus, label: "เพิ่ม", isAdd: true },
  { href: "/analytics", icon: PieChart, label: "สถิติ" },
  { href: "/settings", icon: Settings, label: "ตั้งค่า" },
];

interface BottomNavProps {
  onAddClick: () => void;
}

export function BottomNav({ onAddClick }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/80 backdrop-blur-lg safe-area-pb">
      <div className="mx-auto flex max-w-md items-center justify-around py-2">
        {navItems.map((item) => {
          if (item.isAdd) {
            return (
              <button
                key={item.href}
                onClick={onAddClick}
                className="flex -mt-6 h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg active:scale-95 transition-transform"
              >
                <Plus size={28} />
              </button>
            );
          }

          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
