"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  AlertCircle,
  Store,
  Building2,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { UserRole } from "@/types";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    currentRole,
    setCurrentRole,
    rw,
    rts,
    activeRTId,
    setActiveRTId,
    complaints,
    letterRequests,
    invoices,
  } = useApp();

  // Pending counts
  const pendingLettersCount = letterRequests.filter(
    (l) => l.status === "MENUNGGU_RT" || l.status === "MENUNGGU_RW"
  ).length;

  const pendingComplaintsCount = complaints.filter(
    (c) => c.status === "TERKIRIM" || c.status === "DIPROSES"
  ).length;

  const pendingInvoicesCount = invoices.filter(
    (i) => i.status === "MENUNGGU_VERIFIKASI"
  ).length;

  const navItems = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/kependudukan", label: "Kependudukan (KK/Warga)", icon: Users },
    {
      href: "/admin/surat",
      label: "E-Surat Pengantar",
      icon: FileText,
      badge: pendingLettersCount > 0 ? pendingLettersCount : undefined,
    },
    {
      href: "/admin/keuangan",
      label: "Keuangan & E-Kas",
      icon: CreditCard,
      badge: pendingInvoicesCount > 0 ? pendingInvoicesCount : undefined,
    },
    {
      href: "/admin/aduan",
      label: "Aduan Warga",
      icon: AlertCircle,
      badge: pendingComplaintsCount > 0 ? pendingComplaintsCount : undefined,
    },
    { href: "/admin/cms", label: "CMS Berita & UMKM", icon: Store },
  ];

  const roleLabels: Record<UserRole, { title: string; badge: string; color: string }> = {
    KETUA_RW: { title: "TAUFIK A. (Ketua RW 14)", badge: "Superadmin RW", color: "bg-emerald-500" },
    KETUA_RT: { title: "DASEP H. (Ketua RT 001)", badge: "Admin RT 01", color: "bg-blue-500" },
    BENDAHARA: { title: "Hj. Ratna (Bendahara)", badge: "Keuangan RW", color: "bg-purple-500" },
    PETUGAS: { title: "Sukardi (Petugas/Satpam)", badge: "Tim Lapangan", color: "bg-amber-500" },
    WARGA: { title: "Dimas (Portal Warga)", badge: "Warga Biasa", color: "bg-slate-500" },
  };

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-slate-100 overflow-hidden">
      
      {/* Mobile Header Bar */}
      <div className="lg:hidden shrink-0 bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 z-30">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-sm tracking-tight">Admin {rw.name}</span>
        </Link>

        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-300 hover:text-white rounded-lg"
          aria-label="Toggle Sidebar"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Backdrop Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar Navigation - Fixed & Stationary */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full w-64 bg-slate-900 text-slate-300 flex flex-col justify-between p-4 z-50 lg:z-auto shrink-0 overflow-y-auto transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } border-r border-slate-800`}
      >
        <div className="space-y-6">
          {/* Brand */}
          <div className="px-2 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 shadow-md">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-base text-white block tracking-tight">
                  {rw.name}
                </span>
                <span className="text-[11px] font-semibold text-emerald-400">
                  Panel Pengurus RW/RT
                </span>
              </div>
            </Link>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-emerald-500 text-slate-950 shadow font-bold"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-slate-950" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar: Role Switcher & Public Link */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          
          {/* Active Role Selector Widget */}
          <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/60 relative">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Simulasi Peran Aktif:
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">Demo Switch</span>
            </div>

            <div className="space-y-1">
              {(["KETUA_RW", "KETUA_RT", "BENDAHARA", "PETUGAS"] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setCurrentRole(r);
                    if (r === "KETUA_RT") setActiveRTId("rt-01");
                  }}
                  className={`w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-medium flex items-center justify-between transition-all ${
                    currentRole === r
                      ? "bg-emerald-600 text-white font-bold shadow"
                      : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
                  }`}
                >
                  <span>{roleLabels[r].badge}</span>
                  {currentRole === r && <span className="text-[10px]">● Aktif</span>}
                </button>
              ))}
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Lihat Landing Page Warga</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Content Wrapper */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        
        {/* Top Header Bar - Fixed at top of content area */}
        <header className="shrink-0 bg-white/95 backdrop-blur border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-slate-900 hidden md:inline-block">
                {navItems.find((item) => item.href === pathname)?.label || "Panel Pengurus"}
              </span>
              <span className="text-slate-300 hidden md:inline-block">•</span>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline-block">Masuk Sebagai:</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                {roleLabels[currentRole].badge}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-900">{roleLabels[currentRole].title}</p>
              <p className="text-[11px] text-slate-400">{rw.name} ({rw.village})</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center font-bold text-sm shadow-sm">
              {currentRole === "KETUA_RW" ? "RW" : currentRole === "KETUA_RT" ? "RT" : currentRole === "BENDAHARA" ? "BD" : "PT"}
            </div>
          </div>
        </header>

        {/* Page Children Container - Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 w-full">
          <div className="w-full mx-auto">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}
