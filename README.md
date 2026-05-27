# นับตังค์ (Expense Tracker PWA)

แอปบันทึกรายรับรายจ่าย Progressive Web App สำหรับมือถือและเดสก์ท็อป — ข้อมูลเก็บในเครื่อง (localStorage)

## Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **UI:** Tailwind CSS 4 + shadcn/ui
- **Font:** Google Font ผ่าน `next/font/google` (Sarabun, subsets `thai` + `latin`)
- **State:** Zustand + persist (`localStorage`)
- **Animation:** Framer Motion
- **Charts:** Recharts
- **PWA:** Serwist (`@serwist/next`)
- **Date:** date-fns (locale ไทย)

## Features

### หน้าหลัก (`/`)
- การ์ดยอดคงเหลือ / รายรับ / รายจ่าย (รวมทุกรายการ)
- ปฏิทินรายเดือน — แสดงรายจ่ายแต่ละวัน, เลื่อนเปลี่ยนเดือนได้
- กดวันในปฏิทิน → แสดงรายการของวันนั้น (default = วันนี้), แสดงเวลา `HH:mm น.`
- ปุ่ม **+ เพิ่มรายการ** สำหรับวันที่เลือกในปฏิทิน

### รายการ (`/transactions`)
- Filter ประเภท: ทั้งหมด / รายจ่าย / รายรับ
- โหมด **รายเดือน** (มี month selector) หรือ **ทั้งหมด**
- สรุปจำนวนรายการ + ยอดรวม
- **Swipe Delete** — ปัดซ้ายลบ + modal ยืนยัน

### เพิ่มรายการ (Fast Add Sheet)
- ปุ่ม **+** ที่ Bottom Nav → วันที่ = วันนี้
- จากหน้าหลัก → วันที่ = วันที่เลือกในปฏิทิน
- เลือกรายรับ/รายจ่าย → จำนวนเงิน → หมวดหมู่ → บันทึก (ไม่บังคับ)
- **เลือกเวลา** — ซ่อนไว้โดยค่าเริ่มต้น (เวลาปัจจุบัน), กดปุ่มเพื่อแสดง `input type="time"` (HH:mm)
- หัว sheet แสดงวันที่+เวลาที่จะบันทึก

### สถิติ (`/analytics`)
- **Pie Chart** — สัดส่วนรายจ่ายตามหมวดหมู่
- **Line Chart** — แนวโน้มรายจ่ายรายวัน
- **Bar Chart** — จำนวนครั้งที่ใช้แต่ละหมวดหมู่
- เลือกเดือนได้

### หมวดหมู่ (`/categories`)
- เข้าจาก **ตั้งค่า** → จัดการหมวดหมู่
- เพิ่ม / แก้ไข / ลบ (modal ยืนยันก่อนลบ)
- Emoji picker ~176 ตัว แบ่ง 10 กลุ่ม + เลือกสี 14 สี + preview

### ตั้งค่า (`/settings`)
- ลิงก์ไปจัดการหมวดหมู่
- **Dark Mode**
- **งบประมาณ** รายเดือนตามหมวดหมู่ (progress bar)
- **ส่งออก CSV** (BOM UTF-8, ภาษาไทย)
- **สำรอง / กู้คืน JSON**

### PWA
- ติดตั้งบนมือถือ (Add to Home Screen / Install app)
- **แบนเนอร์ติดตั้ง** (`PwaInstallPrompt`) เมื่อเข้าจากมือถือในเบราว์เซอร์
  - **Android (Chrome):** ปุ่ม「ติดตั้ง」เรียก native install prompt (`beforeinstallprompt`)
  - **iOS (Safari):** แสดง 4 ขั้นตอน (แชร์ → เพิ่มเติม → เพิ่มไปที่หน้าจอโฮม → เพิ่ม)
  - ไม่แสดงถ้าติดตั้งแล้ว / กด「ไว้ทีหลัง」 (ซ่อน 7 วัน)
- `manifest.json` + ไอคอน `public/icon-192x.png`, `public/icon-512x.png`
- Service Worker (`src/app/sw.ts` → build เป็น `public/sw.js`) — ทำงานใน **production** เท่านั้น

## Navigation

Bottom Navigation: หน้าหลัก | รายการ | **+** (เพิ่ม) | สถิติ | ตั้งค่า

## โครงสร้างโปรเจค

```
public/
├── manifest.json          # ชื่อแอป, ไอคอน, theme (PWA)
├── icon-192x.png
├── icon-512x.png
└── sw.js                  # สร้างตอน build (อย่า commit ถ้า ignore แล้ว)

src/
├── app/
│   ├── layout.tsx         # metadata, PWA, font, AppShell
│   ├── page.tsx           # หน้าหลัก
│   ├── globals.css
│   ├── sw.ts              # Serwist service worker source
│   ├── transactions/
│   ├── categories/
│   ├── analytics/
│   └── settings/
├── components/
│   ├── ui/                # shadcn + confirm-dialog
│   ├── layout/
│   │   ├── app-shell.tsx
│   │   ├── bottom-nav.tsx
│   │   ├── add-transaction-sheet.tsx
│   │   └── pwa-install-prompt.tsx
│   ├── dashboard/
│   │   └── expense-calendar.tsx
│   └── transactions/
│       └── transaction-item.tsx
├── store/
│   └── transaction-store.ts
├── lib/
│   ├── utils.ts
│   ├── currency.ts        # THB (th-TH)
│   ├── pwa-install.ts     # ตรวจจับ mobile / iOS / standalone
│   └── db.ts              # IndexedDB (เตรียมไว้, ยังไม่ใช้หลัก)
└── types/
    └── transaction.ts
```

## เริ่มต้นใช้งาน

### ติดตั้ง

```bash
npm install
```

### Development

```bash
npm run dev
```

เปิด http://localhost:3000

> Service Worker **ปิด** ในโหมด dev — ทดสอบ PWA ต้อง build production

### Production

```bash
npm run build   # ใช้ --webpack เพื่อให้ Serwist bundle sw.js
npm start
```

## PWA บนมือถือ

1. `npm run build && npm start`
2. เปิดจาก IP ใน Wi‑Fi เดียวกัน (เช่น `http://192.168.x.x:3000`)
3. ติดตั้ง: Chrome → Add to Home screen / Install app

### เปลี่ยนชื่อ / ไอคอนตอนติดตั้ง

| สิ่งที่เปลี่ยน | ไฟล์ |
|----------------|------|
| ชื่อใต้ไอคอน, ชื่อติดตั้ง (Android) | `public/manifest.json` → `name`, `short_name` |
| ชื่อ iOS, แท็บเบราว์เซอร์ | `src/app/layout.tsx` → `title`, `applicationName`, `appleWebApp.title` |
| ไอคอน | แทนที่ `public/icon-192x.png`, `icon-512x.png` + `apple-touch-icon` ใน `layout.tsx` |

หลังแก้ชื่อ/ไอคอน: build ใหม่ และติดตั้ง PWA ใหม่บนเครื่อง

## Data Storage

เก็บใน **localStorage** (Zustand persist):

| Key | เนื้อหา |
|-----|---------|
| `transactions` | รายการ (id, amount, type, categoryId, note?, createdAt ISO) |
| `categories` | หมวดหมู่ default 12 รายการ + ที่ผู้ใช้เพิ่ม |
| `budgets` | งบรายเดือนต่อหมวด |
| `darkMode` | boolean |

Backup/restore ผ่านหน้าตั้งค่า (JSON)

## ฟอนต์

ใช้ `next/font/google` ใน [`src/app/layout.tsx`](src/app/layout.tsx):

```ts
import { Sarabun } from "next/font/google";

const sarabun = Sarabun({
  variable: "--font-sans",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});
```

เปลี่ยนเป็น Mitr หรือฟอนต์อื่น: แก้ import + ชื่อฟอนต์ในไฟล์เดียวกัน

## Deploy

แนะนำ **Vercel**:

```bash
npx vercel
```

## แผนพัฒนาต่อ

- Cloud sync (Supabase)
- แก้ไขรายการหลังบันทึก
- Recurring transactions
- Push notifications
- ใช้ IndexedDB แทน/ร่วมกับ localStorage
