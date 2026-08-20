"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  AlertCircle,
  Home,
  ShieldCheck,
  Menu,
  X,
  PhoneCall,
  FileText,
  CreditCard,
  CalendarDays,
  ShoppingBag,
  Wallet,
  ChevronDown,
} from "lucide-react";
import { useApp } from "@/lib/store";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [layananDropdownOpen, setLayananDropdownOpen] = useState(false);
  const { rw } = useApp();

  const services = [
    { href: "/lapor", label: "Lapor Aduan & Aspirasi", icon: AlertCircle, desc: "PJU, sampah, dan ketertiban", color: "text-rose-600" },
    { href: "/surat-online", label: "E-Surat Pengantar Mandiri", icon: FileText, desc: "SKCK, Domisili & Usaha", color: "text-emerald-600" },
    { href: "/iuran", label: "Cek & Bayar Iuran (QRIS)", icon: CreditCard, desc: "Tagihan IPL bulanan KK", color: "text-blue-600" },
    { href: "/fasilitas", label: "Reservasi Balai Warga", icon: CalendarDays, desc: "Peminjaman balai & aula", color: "text-indigo-600" },
    { href: "/umkm", label: "Pasar UMKM Warga", icon: ShoppingBag, desc: "Direktori usaha & kuliner", color: "text-amber-600" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* Top emergency micro-bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 inline-block animate-pulse" />
            <span className="font-medium text-slate-200 truncate">
              Sekretariat {rw.name} • Kelurahan {rw.village}, {rw.city}
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 shrink-0 text-[10px] sm:text-[11px]">
            <span className="hidden sm:inline">Pos Satpam: <strong className="text-slate-200 font-mono">0812-9900-8811</strong></span>
            <Link href="/#kontak-darurat" className="text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1">
              <PhoneCall className="w-3 h-3 shrink-0" />
              <span>Darurat 24 Jam</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18">
          
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-sm font-black text-xs sm:text-sm shrink-0">
              RW05
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-slate-900 text-sm sm:text-lg tracking-tight">
                  {rw.name}
                </span>
                <span className="hidden md:inline-block px-1.5 py-0.2 text-[9px] font-bold bg-slate-100 text-slate-700 rounded border border-slate-200">
                  Resmi
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 hidden xs:block">
                Sistem Pelayanan & Administrasi Terpadu
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="/"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                pathname === "/"
                  ? "bg-emerald-50 text-emerald-800 font-bold border border-emerald-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Beranda</span>
            </Link>

            {/* Layanan Dropdown */}
            <div className="relative group">
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              >
                <span>Layanan Warga</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform" />
              </button>

              <div className="absolute top-full left-0 w-64 pt-2 hidden group-hover:block z-50">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-2 space-y-1">
                  {services.map((srv) => {
                    const Icon = srv.icon;
                    return (
                      <Link
                        key={srv.href}
                        href={srv.href}
                        className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        <div className={`p-2 rounded-lg bg-slate-100 ${srv.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs">{srv.label}</p>
                          <p className="text-[10px] text-slate-500">{srv.desc}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            <Link
              href="/#transparansi-kas"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            >
              <Wallet className="w-3.5 h-3.5 text-slate-400" />
              <span>Kas Transparan</span>
            </Link>

            <Link
              href="/#berita"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            >
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Agenda & Berita</span>
            </Link>
          </nav>

          {/* Desktop Action CTAs */}
          <div className="hidden sm:flex items-center gap-2">
            <Link
              href="/lapor"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-rose-800 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 shadow-sm transition-colors"
            >
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>Lapor Aduan</span>
            </Link>

            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Portal Pengurus</span>
            </Link>
          </div>

          {/* Mobile Right Bar */}
          <div className="flex items-center gap-1.5 lg:hidden">
            <Link
              href="/lapor"
              className="px-2.5 py-1.5 text-xs font-bold text-rose-800 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-1"
            >
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden xs:inline">Lapor</span>
            </Link>

            <Link
              href="/admin"
              className="px-2.5 py-1.5 text-xs font-bold text-white bg-slate-900 rounded-lg flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pengurus</span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Menu navigasi"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Backdrop & Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white shadow-xl animate-in slide-in-from-top-2 duration-200 max-h-[85vh] overflow-y-auto">
          <div className="px-4 py-3 space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Home className="w-4 h-4 text-emerald-700" />
              <span>Beranda</span>
            </Link>

            <div className="pt-2 pb-1 border-t border-slate-100">
              <span className="text-[10px] font-bold uppercase text-slate-400 px-3 tracking-wider">
                Layanan Mandiri Warga
              </span>
            </div>

            {services.map((srv) => {
              const Icon = srv.icon;
              return (
                <Link
                  key={srv.href}
                  href={srv.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <Icon className={`w-4 h-4 ${srv.color}`} />
                  <span>{srv.label}</span>
                </Link>
              );
            })}

            <div className="pt-2 pb-1 border-t border-slate-100">
              <span className="text-[10px] font-bold uppercase text-slate-400 px-3 tracking-wider">
                Informasi & Transparansi
              </span>
            </div>

            <Link
              href="/#transparansi-kas"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Wallet className="w-4 h-4 text-slate-400" />
              <span>Transparansi Kas RW</span>
            </Link>

            <Link
              href="/#berita"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Pengumuman & Agenda</span>
            </Link>

            <div className="pt-3 border-t border-slate-100">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-sm"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Masuk Portal Pengurus (RT & RW)</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
