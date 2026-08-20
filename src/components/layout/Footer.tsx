"use client";

import React from "react";
import Link from "next/link";
import { Building2, Phone, Mail, MapPin, ShieldCheck, AlertCircle, FileText, CreditCard, CalendarDays, ShoppingBag, Wallet } from "lucide-react";
import { useApp } from "@/lib/store";

export function Footer() {
  const { rw, rts } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Col 1: Profil RW */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                {rw.name}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Sistem Informasi Pelayanan Mandiri, Administrasi Digital & Transparansi Lingkungan Warga {rw.name}, Kelurahan {rw.village}, Kecamatan {rw.subDistrict}, {rw.city}.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1.5">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{rw.address}, {rw.postalCode}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{rw.headPhone} (Ketua RW)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>sekretariat@rw14padasuka.id</span>
              </div>
            </div>
          </div>

          {/* Col 2: Layanan Mandiri Warga */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-base tracking-wide">Layanan Mandiri Warga</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/lapor" className="hover:text-emerald-400 transition-colors flex items-center gap-2 text-rose-400 font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Lapor Aduan & Aspirasi</span>
                </Link>
              </li>
              <li>
                <Link href="/surat-online" className="hover:text-emerald-400 transition-colors flex items-center gap-2 text-slate-300">
                  <FileText className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Pengajuan E-Surat Mandiri</span>
                </Link>
              </li>
              <li>
                <Link href="/iuran" className="hover:text-emerald-400 transition-colors flex items-center gap-2 text-slate-300">
                  <CreditCard className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>Cek & Bayar Iuran QRIS</span>
                </Link>
              </li>
              <li>
                <Link href="/fasilitas" className="hover:text-emerald-400 transition-colors flex items-center gap-2 text-slate-300">
                  <CalendarDays className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>Reservasi Balai & Fasilitas</span>
                </Link>
              </li>
              <li>
                <Link href="/umkm" className="hover:text-emerald-400 transition-colors flex items-center gap-2 text-slate-300">
                  <ShoppingBag className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Pasar Produk UMKM Warga</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Daftar Wilayah RT */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-base tracking-wide">Wilayah Rukun Tetangga</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {rts.map((rt) => (
                <div key={rt.id} className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/50">
                  <p className="font-bold text-emerald-400">RT {rt.rtNumber}</p>
                  <p className="text-slate-300 truncate">{rt.headName}</p>
                  <p className="text-slate-500">{rt.totalFamilies} KK</p>
                </div>
              ))}
            </div>
          </div>

          {/* Col 4: Pengurus & Akses Khusus */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-base tracking-wide">Portal Kepengurusan</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Khusus untuk jajaran Pengurus RT, Pengurus RW, Bendahara, dan Petugas Keamanan dalam tata kelola administrasi wilayah.
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-md"
            >
              <ShieldCheck className="w-4 h-4" />
              Masuk Dashboard Pengurus
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {rw.name}. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Sistem Informasi Terpadu Rukun Warga Modern</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
