"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import {
  Users,
  FileText,
  CreditCard,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  ChevronRight,
  ShieldCheck,
  Building,
  TrendingUp,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AdminOverviewPage() {
  const {
    currentRole,
    rw,
    rts,
    families,
    residents,
    letterRequests,
    invoices,
    cashTransactions,
    complaints,
  } = useApp();

  const totalKK = families.length;
  const totalWarga = residents.length;

  const pendingLetters = letterRequests.filter((l) =>
    currentRole === "KETUA_RT"
      ? l.status === "MENUNGGU_RT"
      : l.status === "MENUNGGU_RW"
  );

  const unpaidInvoices = invoices.filter((i) => i.status === "BELUM_BAYAR" || i.status === "MENUNGGU_VERIFIKASI");
  const pendingComplaints = complaints.filter((c) => c.status === "TERKIRIM" || c.status === "DIPROSES");

  const currentBalance =
    cashTransactions.length > 0
      ? cashTransactions[cashTransactions.length - 1].balanceAfter
      : 0;

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            <ShieldCheck className="w-4 h-4" />
            Panel Pengurus {rw.name}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Selamat Datang, {currentRole === "KETUA_RW" ? "Bapak Ketua RW" : currentRole === "KETUA_RT" ? "Bapak Ketua RT 01" : currentRole === "BENDAHARA" ? "Ibu Bendahara" : "Petugas Lapangan"}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Berikut adalah ringkasan kependudukan, antrean permohonan surat warga, dan laporan keuangan kas lingkungan hari ini.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/surat"
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-all"
          >
            Tinjau E-Surat ({pendingLetters.length})
          </Link>
          <Link
            href="/admin/keuangan"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 transition-all"
          >
            Buku Kas RW
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1: Kependudukan */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Warga
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{totalWarga} Jiwa</p>
          <p className="text-xs text-slate-500 mt-1">{totalKK} Kepala Keluarga ({rts.length} RT)</p>
        </div>

        {/* Card 2: E-Surat Pending */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Antrean E-Surat
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{pendingLetters.length} Surat</p>
          <p className="text-xs text-amber-600 font-semibold mt-1">Memerlukan persetujuan Anda</p>
        </div>

        {/* Card 3: Tagihan Belum Lunas */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Iuran Belum Lunas
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{unpaidInvoices.length} KK</p>
          <p className="text-xs text-slate-500 mt-1">Periode Agustus 2026</p>
        </div>

        {/* Card 4: Saldo Kas RW */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Saldo Kas RW
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xl font-black text-emerald-600">{formatCurrency(currentBalance)}</p>
          <p className="text-xs text-slate-500 mt-1">Buku Kas Terverifikasi</p>
        </div>

      </div>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Antrean Surat Pengantar (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                Antrean Permohonan E-Surat Pengantar
              </h2>
              <p className="text-xs text-slate-500">
                Permohonan warga yang perlu ditinjau dan divalidasi oleh pengurus.
              </p>
            </div>

            <Link
              href="/admin/surat"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Kelola Semua</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {letterRequests.slice(0, 4).map((letter) => (
              <div
                key={letter.id}
                className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-mono font-bold text-slate-400">
                      {letter.trackingCode}
                    </span>
                    <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      RT {letter.rtNumber}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {letter.letterTitle}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Pemohon: <strong>{letter.residentName}</strong> • Keperluan: {letter.purpose}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      letter.status === "DISETUJUI"
                        ? "bg-emerald-50 text-emerald-700"
                        : letter.status === "DITOLAK"
                        ? "bg-rose-50 text-rose-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {letter.status.replace("_", " ")}
                  </span>
                  <Link
                    href="/admin/surat"
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
                  >
                    Tinjau
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Aduan & Keluhan Warga (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900">
              Aduan Warga Aktif
            </h2>
            <Link
              href="/admin/aduan"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
            >
              Lihat
            </Link>
          </div>

          <div className="space-y-3">
            {complaints.slice(0, 3).map((cmp) => (
              <div
                key={cmp.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">{cmp.category}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{cmp.ticketNumber}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs line-clamp-1">
                  {cmp.title}
                </h4>
                <p className="text-slate-500 line-clamp-2">{cmp.description}</p>
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Lokasi: {cmp.location}</span>
                  <span className="font-bold text-emerald-700">{cmp.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
