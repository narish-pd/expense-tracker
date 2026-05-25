# Expense Tracker PWA Starter Template

## Stack

- Next.js 15
- TypeScript
- TailwindCSS
- shadcn/ui
- Zustand
- IndexedDB (idb)
- next-pwa
- Framer Motion

---

# Create Project

```bash
npx create-next-app@latest expense-tracker-pwa
```

เลือก:

```txt
TypeScript → Yes
ESLint → Yes
Tailwind → Yes
src directory → Yes
App Router → Yes
```

---

# Install Packages

```bash
npm install next-pwa
npm install zustand
npm install idb
npm install react-hook-form
npm install zod
npm install @hookform/resolvers
npm install framer-motion
npm install date-fns
npm install recharts
npm install lucide-react
npm install clsx tailwind-merge
```

---

# Install shadcn/ui

```bash
npx shadcn@latest init
```

เพิ่ม components:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add dialog
npx shadcn@latest add form
npx shadcn@latest add select
npx shadcn@latest add sheet
```

---

# Folder Structure

```txt
src/
 ├── app/
 │    ├── page.tsx
 │    ├── globals.css
 │    ├── layout.tsx
 │    ├── transactions/
 │    ├── categories/
 │    ├── analytics/
 │    └── settings/
 │
 ├── components/
 │    ├── dashboard/
 │    ├── transactions/
 │    ├── layout/
 │    └── ui/
 │
 ├── lib/
 │    ├── db.ts
 │    ├── utils.ts
 │    └── currency.ts
 │
 ├── store/
 │    └── transaction-store.ts
 │
 ├── types/
 │    └── transaction.ts
 │
 └── hooks/
```

---

# next.config.ts

```ts
import withPWA from 'next-pwa'

const nextConfig = {
  reactStrictMode: true,
}

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
})(nextConfig)
```

---

# public/manifest.json

```json
{
  "name": "Expense Tracker",
  "short_name": "Expense",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "start_url": "/",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

# src/types/transaction.ts

```ts
export type TransactionType = 'income' | 'expense'

export interface Category {
  id: string
  name: string
  icon: string
  color: string
  type: TransactionType
}

export interface Transaction {
  id: string
  amount: number
  type: TransactionType
  categoryId: string
  note?: string
  createdAt: string
}
```

---

# src/lib/db.ts

```ts
import { openDB } from 'idb'

export const dbPromise = openDB('expense-tracker', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('transactions')) {
      db.createObjectStore('transactions', {
        keyPath: 'id',
      })
    }

    if (!db.objectStoreNames.contains('categories')) {
      db.createObjectStore('categories', {
        keyPath: 'id',
      })
    }
  },
})
```

---

# src/store/transaction-store.ts

```ts
import { create } from 'zustand'
import { Transaction } from '@/types/transaction'

type Store = {
  transactions: Transaction[]
  addTransaction: (transaction: Transaction) => void
  removeTransaction: (id: string) => void
}

export const useTransactionStore = create<Store>((set) => ({
  transactions: [],

  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    })),

  removeTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),
}))
```

---

# src/lib/utils.ts

```ts
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs))
}
```

---

# src/lib/currency.ts

```ts
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
  }).format(value)
}
```

---

# src/app/layout.tsx

```tsx
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  )
}
```

---

# src/app/page.tsx

```tsx
'use client'

import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTransactionStore } from '@/store/transaction-store'
import { formatCurrency } from '@/lib/currency'

export default function HomePage() {
  const { transactions } = useTransactionStore()

  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0)

  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0)

  const balance = income - expense

  return (
    <main className="mx-auto max-w-md p-4 pb-24">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Expense Tracker</h1>
        <p className="text-muted-foreground">
          บันทึกรายรับรายจ่าย
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-black p-6 text-white"
      >
        <p className="text-sm opacity-70">ยอดคงเหลือ</p>

        <h2 className="mt-2 text-4xl font-bold">
          {formatCurrency(balance)}
        </h2>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm opacity-70">รายรับ</p>
            <p className="text-xl font-semibold text-green-400">
              {formatCurrency(income)}
            </p>
          </div>

          <div>
            <p className="text-sm opacity-70">รายจ่าย</p>
            <p className="text-xl font-semibold text-red-400">
              {formatCurrency(expense)}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="mt-8 space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between rounded-2xl border p-4"
          >
            <div>
              <p className="font-medium">{transaction.note}</p>
              <p className="text-sm text-muted-foreground">
                {transaction.type}
              </p>
            </div>

            <p
              className={
                transaction.type === 'income'
                  ? 'text-green-500'
                  : 'text-red-500'
              }
            >
              {formatCurrency(transaction.amount)}
            </p>
          </div>
        ))}
      </div>

      <button className="fixed bottom-6 right-6 flex h-16 w-16 items-center justify-center rounded-full bg-black text-white shadow-2xl">
        <Plus size={28} />
      </button>
    </main>
  )
}
```

---

# src/app/globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  min-height: 100vh;
}
```

---

# Example Add Transaction

```ts
const transaction = {
  id: crypto.randomUUID(),
  amount: 250,
  type: 'expense',
  categoryId: 'food',
  note: 'ข้าวกลางวัน',
  createdAt: new Date().toISOString(),
}
```

---

# Mobile UX Suggestions

## Bottom Navigation

- Home
- Transactions
- Add
- Analytics
- Settings

---

## Floating Add Button

ควร:
- ใหญ่
- กดง่าย
- อยู่ด้านล่างขวา

---

# Features Next Step

## V2

- Categories page
- Analytics chart
- Budget system
- Dark mode
- Export CSV
- Backup JSON

---

# If Want Cloud Sync Later

เปลี่ยนจาก IndexedDB ไปใช้:

- Supabase
- PostgreSQL
- Google Login

โดย logic frontend ใช้ต่อได้เกือบทั้งหมด

---

# Run Project

```bash
npm run dev
```

---

# Build Production

```bash
npm run build
```

---

# Deploy

แนะนำ deploy ที่:

- Vercel

รองรับ PWA ได้ง่ายสุด

---

# Recommended Next Features

## Fast Add Sheet

กด + แล้วเด้ง modal จากล่างขึ้นมา

---

## Swipe Delete

ปัดเพื่อลบ transaction

---

## Monthly Analytics

ใช้ recharts:

- Pie chart
- Expense trend
- Category usage

---

# Future Upgrade Ideas

- AI categorization
- OCR slip scan
- recurring transactions
- multi-wallet
- cloud sync
- notification reminder

