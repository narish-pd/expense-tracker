"use client";

import { useEffect, useState, useCallback } from "react";
import { X, Download, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  isStandaloneMode,
  isMobileDevice,
  isIOSSafari,
  wasInstallPromptDismissed,
  dismissInstallPrompt,
  isBeforeInstallPromptEvent,
  type BeforeInstallPromptEvent,
} from "@/lib/pwa-install";
import { cn } from "@/lib/utils";

type PromptMode = "android" | "ios" | null;

export function PwaInstallPrompt() {
  const [mode, setMode] = useState<PromptMode>(null);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    if (isStandaloneMode() || wasInstallPromptDismissed() || !isMobileDevice()) {
      return;
    }

    if (isIOSSafari()) {
      const timer = setTimeout(() => setMode("ios"), 1500);
      return () => clearTimeout(timer);
    }

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      if (isBeforeInstallPromptEvent(e)) {
        setDeferredPrompt(e);
        setMode("android");
      }
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () =>
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  const handleDismiss = useCallback(() => {
    dismissInstallPrompt();
    setMode(null);
    setDeferredPrompt(null);
  }, []);

  const handleAndroidInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    setInstalling(true);
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        dismissInstallPrompt();
        setMode(null);
      }
    } finally {
      setInstalling(false);
      setDeferredPrompt(null);
    }
  }, [deferredPrompt]);

  if (!mode) return null;

  return (
    <div
      className={cn(
        "fixed left-0 right-0 z-50 mx-auto max-w-md px-4",
        "bottom-[calc(5rem+env(safe-area-inset-bottom,0px))]"
      )}
      role="dialog"
      aria-label="ติดตั้งแอป"
    >
      <div className="rounded-2xl border bg-card p-4 shadow-lg">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Download size={20} />
            </div>
            <div>
              <p className="font-semibold">ติดตั้ง นับตังค์</p>
              <p className="text-xs text-muted-foreground">
                เปิดใช้แบบแอปบนหน้าจอหลัก
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
            aria-label="ปิด"
          >
            <X size={18} />
          </button>
        </div>

        {mode === "android" ? (
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleDismiss}
              disabled={installing}
            >
              ไว้ทีหลัง
            </Button>
            <Button
              className="flex-1"
              onClick={handleAndroidInstall}
              disabled={installing}
            >
              {installing ? "กำลังติดตั้ง..." : "ติดตั้ง"}
            </Button>
          </div>
        ) : (
          <>
            <ol className="mb-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                  1
                </span>
                <span className="flex items-center gap-1">
                  กดปุ่ม <Share size={14} className="inline" /> แชร์
                  ด้านล่าง Safari
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                  2
                </span>
                เลือก &quot;เพิ่มไปที่หน้าจอโฮม&quot;
              </li>
              <li className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                  3
                </span>
                กด &quot;เพิ่ม&quot; เพื่อยืนยัน
              </li>
            </ol>
            <p className="mb-3 text-xs text-muted-foreground">
              iOS ไม่รองรับปุ่มติดตั้งอัตโนมัติ — ต้องทำตามขั้นตอนด้านบนใน Safari
            </p>
            <Button variant="outline" className="w-full" onClick={handleDismiss}>
              เข้าใจแล้ว
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
