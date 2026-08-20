"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  CreditCard,
  AlertCircle,
  CalendarDays,
  ArrowRight,
  ShieldCheck,
  Check,
  Building,
  QrCode,
} from "lucide-react";
import { useApp } from "@/lib/store";

export function HeroSection() {
  const { rw } = useApp();

  return (
    <section className="bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-18">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Main Info */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-800 border border-slate-700 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
              <span>Portal Administrasi Terpadu Warga</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Pelayanan Mandiri & Transparansi Lingkungan <br className="hidden sm:block" />
              <span className="text-emerald-400">{rw.name}</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              Mempermudah warga dalam pengajuan surat pengantar resmi ber-QR Code, pembayaran iuran lingkungan (IPL) via QRIS, pengaduan fasilitas, dan peminjaman balai warga secara mandiri.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs text-slate-300">
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>E-Surat Sah Ber-QR Code</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Kas Terbuka & Realtime</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Respon Aduan Cepat</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Link
                href="/surat-online"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wide shadow-md transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>Ajukan Surat Pengantar</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/lapor"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs tracking-wide shadow-md transition-all"
              >
                <AlertCircle className="w-4 h-4" />
                <span>Lapor Pengaduan Warga</span>
              </Link>
            </div>
          </div>

          {/* Quick Actions 4 Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
            <Link
              href="/surat-online"
              className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700 hover:border-emerald-500 hover:bg-slate-800 transition-all group flex flex-col justify-between h-44 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                  E-Surat Pengantar
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  SKCK, Domisili, Keterangan Usaha dengan QR Code sah.
                </p>
              </div>
            </Link>

            <Link
              href="/iuran"
              className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700 hover:border-teal-500 hover:bg-slate-800 transition-all group flex flex-col justify-between h-44 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-950/80 text-teal-400 border border-teal-800 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white group-hover:text-teal-400 transition-colors">
                  Iuran Warga (IPL)
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  Cek status tagihan KK & bayar via QRIS otomatis.
                </p>
              </div>
            </Link>

            <Link
              href="/lapor"
              className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700 hover:border-rose-500 hover:bg-slate-800 transition-all group flex flex-col justify-between h-44 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-950/80 text-rose-400 border border-rose-800 flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white group-hover:text-rose-400 transition-colors">
                  Lapor Pengaduan
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  Lampu jalan mati, tumpukan sampah, atau gangguan keamanan.
                </p>
              </div>
            </Link>

            <Link
              href="/fasilitas"
              className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700 hover:border-blue-500 hover:bg-slate-800 transition-all group flex flex-col justify-between h-44 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-950/80 text-blue-400 border border-blue-800 flex items-center justify-center">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors">
                  Balai & Lapangan
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  Jadwal & pengajuan booking Balai RW serbaguna.
                </p>
              </div>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
