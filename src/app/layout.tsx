import type { Metadata, Viewport } from "next";
import { Sarabun, Geist_Mono } from "next/font/google";
import { AppShell } from "@/components/layout/app-shell";
import "./globals.css";

const sarabun = Sarabun({
  variable: "--font-sans",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "นับตังค์",
  description: "บันทึกรายรับรายจ่าย PWA",
  manifest: "/manifest.json",
  applicationName: "นับตังค์",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "นับตังค์",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${sarabun.variable} ${geistMono.variable} h-full font-sans antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="apple-touch-icon" href="/icon-192x.png" />
      </head>
      <body className="min-h-full bg-background text-foreground">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
