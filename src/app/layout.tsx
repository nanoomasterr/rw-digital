import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "RW-Digital | Sistem Informasi & Layanan Mandiri Rukun Warga",
  description:
    "Portal Layanan Mandiri Warga, E-Surat Pengantar, Pembayaran Iuran Online, Lapor Aduan, dan Transparansi Kas RW.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white overflow-x-hidden w-full max-w-full">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
