# Expense Tracker PWA

แอปบันทึกรายรับรายจ่าย Progressive Web App สำหรับใช้งานบนมือถือและเดสก์ท็อป

## Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **UI:** TailwindCSS + shadcn/ui
- **State Management:** Zustand (persist to localStorage)
- **Animation:** Framer Motion
- **Charts:** Recharts
- **PWA:** Serwist (@serwist/next)
- **Date:** date-fns

## Features

### หน้าหลัก (Home)
- แสดงยอดคงเหลือ รายรับ รายจ่าย
- ปฏิทินรายเดือน แสดงรายจ่ายแต่ละวัน (เลือกเดือนได้)
- รายการล่าสุด 5 รายการ

### รายการ (Transactions)
- แสดงรายการทั้งหมด พร้อม filter (ทั้งหมด/รายจ่าย/รายรับ)
- Swipe Delete — ปัดซ้ายเพื่อลบ พร้อม modal ยืนยัน

### เพิ่มรายการ (Fast Add)
- กดปุ่ม + ที่ Bottom Navigation
- Sheet เด้งจากล่างขึ้นมา
- เลือกประเภท (รายรับ/รายจ่าย) → ใส่จำนวนเงิน → เลือกหมวดหมู่ → บันทึก

### สถิติ (Analytics)
- **Pie Chart** — สัดส่วนรายจ่ายตามหมวดหมู่
- **Line Chart** — แนวโน้มรายจ่ายรายวัน
- **Bar Chart** — จำนวนครั้งที่ใช้แต่ละหมวดหมู่
- เลือกดูแต่ละเดือนได้

### หมวดหมู่ (Categories)
- เพิ่ม ลบ แก้ไข หมวดหมู่
- Emoji picker (176 emoji แบ่ง 10 กลุ่ม)
- เลือกสี 14 สี
- Preview ก่อนบันทึก
- Modal ยืนยันก่อนลบ

### ตั้งค่า (Settings)
- **Dark Mode** — สลับโหมดมืด/สว่าง
- **งบประมาณ** — ตั้งงบรายเดือนตามหมวดหมู่ พร้อม progress bar
- **ส่งออก CSV** — export ข้อมูลเป็นไฟล์ CSV (รองรับภาษาไทย)
- **สำรองข้อมูล** — backup เป็น JSON
- **กู้คืนข้อมูล** — restore จากไฟล์ JSON

### PWA
- ติดตั้งบนมือถือได้เหมือน native app
- Service Worker สำหรับ offline caching (production)
- Web App Manifest พร้อมไอคอน

## โครงสร้างโปรเจค

```
src/
├── app/
│   ├── page.tsx              # หน้าหลัก (Dashboard + Calendar)
│   ├── layout.tsx            # Root layout + PWA metadata
│   ├── globals.css           # Tailwind + shadcn theme
│   ├── sw.ts                 # Service Worker (Serwist)
│   ├── transactions/page.tsx # หน้ารายการ
│   ├── categories/page.tsx   # หน้าหมวดหมู่
│   ├── analytics/page.tsx    # หน้าสถิติ
│   └── settings/page.tsx     # หน้าตั้งค่า
├── components/
│   ├── ui/                   # shadcn components
│   ├── layout/
│   │   ├── app-shell.tsx     # Layout wrapper + dark mode
│   │   ├── bottom-nav.tsx    # Bottom Navigation
│   │   └── add-transaction-sheet.tsx
│   ├── dashboard/
│   │   └── expense-calendar.tsx
│   └── transactions/
│       └── transaction-item.tsx  # Swipe-to-delete item
├── store/
│   └── transaction-store.ts  # Zustand store (persist)
├── lib/
│   ├── utils.ts              # cn() helper
│   ├── currency.ts           # formatCurrency (THB)
│   └── db.ts                 # IndexedDB setup (reserved)
├── types/
│   └── transaction.ts        # TypeScript interfaces
└── hooks/                    # Custom hooks (reserved)
```

## เริ่มต้นใช้งาน

### Development

```bash
npm run dev
```

เปิดที่ http://localhost:3000

> หมายเหตุ: PWA (Service Worker) จะ disable ตอน development

### Production Build

```bash
npm run build
npm start
```

Build ใช้ `--webpack` flag เพื่อให้ Serwist สร้าง Service Worker ได้

### ทดสอบ PWA บนมือถือ

1. Build production: `npm run build && npm start`
2. เปิดบนมือถือผ่าน IP ในเครือข่ายเดียวกัน (เช่น `http://192.168.x.x:3000`)
3. Chrome → เมนู → "Add to Home screen" หรือ "Install app"

## Data Storage

ข้อมูลทั้งหมดเก็บใน **localStorage** ผ่าน Zustand persist:
- transactions — รายการรายรับรายจ่าย
- categories — หมวดหมู่ (มี default 12 หมวด)
- budgets — งบประมาณรายเดือน
- darkMode — สถานะ dark mode

สามารถ backup/restore ผ่านหน้าตั้งค่าได้

## Deploy

แนะนำ deploy ที่ **Vercel** — รองรับ Next.js + PWA ได้ง่ายที่สุด

```bash
npx vercel
```

## อัปเกรดในอนาคต

- Cloud sync (Supabase + Google Login)
- AI categorization
- OCR slip scan
- Recurring transactions
- Multi-wallet
- Notification reminder
