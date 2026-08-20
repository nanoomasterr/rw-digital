"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useApp } from "@/lib/store";
import {
  ShieldCheck,
  Building2,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  FileText,
  Home,
  QrCode,
} from "lucide-react";
import { maskNik, formatDate } from "@/lib/utils";

export default function VerifyDocumentPage() {
  const params = useParams();
  const token = params.token as string;
  const { letterRequests, rw } = useApp();

  const letter = letterRequests.find(
    (item) => item.verificationToken === token || item.trackingCode === token
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto w-full space-y-6">
        
        {/* Top App Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center mx-auto shadow-md">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="font-extrabold text-slate-900 text-lg">
            Sistem Verifikasi Digital Dokumen Resmi
          </h1>
          <p className="text-xs text-slate-500">
            {rw.name}, Kel. {rw.village}, Kec. {rw.subDistrict}, {rw.city}
          </p>
        </div>

        {letter && letter.status === "DISETUJUI" ? (
          /* Valid Document Box */
          <div className="bg-white rounded-3xl border border-emerald-200 shadow-xl overflow-hidden animate-in zoom-in-95">
            {/* Header Status */}
            <div className="bg-emerald-600 text-white p-6 text-center space-y-2">
              <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mx-auto backdrop-blur">
                <ShieldCheck className="w-8 h-8 text-emerald-200" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white text-emerald-800 shadow-sm">
                DOKUMEN SAH & TERVERIFIKASI
              </span>
              <p className="text-xs text-emerald-100">
                Surat keterangan ini diterbitkan secara resmi melalui sistem administrasi digital RW 05.
              </p>
            </div>

            {/* Document Details */}
            <div className="p-6 sm:p-8 space-y-5 text-xs text-slate-700">
              
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  Nomor Surat Resmi RW
                </span>
                <p className="text-base font-black text-slate-900 font-mono">
                  {letter.letterOfficialNumber || "470/085/RW.05/VIII/2026"}
                </p>
                <p className="text-emerald-700 font-semibold text-xs pt-1">
                  {letter.letterTitle}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    Nama Pemohon
                  </span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">
                    {letter.residentName}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    NIK Pemohon
                  </span>
                  <p className="font-semibold text-slate-800 font-mono mt-0.5">
                    {maskNik(letter.nik)}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  Wilayah / Alamat Domisili
                </span>
                <p className="font-medium text-slate-800 mt-0.5">
                  RT {letter.rtNumber} / RW 05, {letter.address}
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  Maksud / Keperluan
                </span>
                <p className="font-medium text-slate-800 mt-0.5">
                  {letter.purpose}
                </p>
              </div>

              {/* Tanda Tangan Pengurus */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
                  Riwayat Persetujuan Digital (Digital Signature)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                    <p className="font-bold text-emerald-800 text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Validasi Ketua RT {letter.rtNumber}
                    </p>
                    <p className="text-slate-700 font-semibold mt-1 truncate">
                      {letter.rtApprovedBy || "Ketua RT Setempat"}
                    </p>
                    <p className="text-[10px] text-slate-500">{letter.rtApprovedAt}</p>
                  </div>

                  <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                    <p className="font-bold text-emerald-800 text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Pengesahan Ketua RW 05
                    </p>
                    <p className="text-slate-700 font-semibold mt-1 truncate">
                      {letter.rwApprovedBy || rw.headName}
                    </p>
                    <p className="text-[10px] text-slate-500">{letter.rwApprovedAt}</p>
                  </div>
                </div>
              </div>

              {/* Hash Token Security */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Hash Token: {letter.verificationToken}</span>
                <span>UUID: {letter.id}</span>
              </div>

            </div>
          </div>
        ) : (
          /* Invalid or Pending Document */
          <div className="bg-white rounded-3xl border border-rose-200 p-8 text-center space-y-4 shadow-lg animate-in zoom-in-95">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Dokumen Tidak Ditemukan atau Belum Sah
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              Kode verifikasi QR <code>{token}</code> tidak terdaftar atau surat permohonan masih dalam proses peninjauan oleh pengurus RT/RW.
            </p>
          </div>
        )}

        {/* Back Link */}
        <div className="text-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda RW 05</span>
          </Link>
        </div>

      </div>

      <div className="text-center text-xs text-slate-400 mt-8">
        © {new Date().getFullYear()} {rw.name} • Sistem Layanan Mandiri Digital
      </div>
    </div>
  );
}
