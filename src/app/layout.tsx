import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ICTPS — Integrated Coaching & Talent Portfolio System",
    template: "%s | ICTPS",
  },
  description:
    "Sistem terintegrasi untuk coaching, pengembangan talenta, dan portofolio karyawan Kementerian Keuangan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
