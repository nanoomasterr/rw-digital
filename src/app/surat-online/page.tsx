"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useApp } from "@/lib/store";
import { LetterType, LetterRequest } from "@/types";
import {
  FileText,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Eye,
  ShieldCheck,
  PhoneCall,
  MessageCircle,
  Printer,
  QrCode,
  Building2,
  Lock,
  ArrowRight,
} from "lucide-react";
import { maskNik, formatDate } from "@/lib/utils";

export default function SuratOnlinePage() {
  const { letterRequests, rts, rw } = useApp();
  const [activeTab, setActiveTab] = useState<"tracking" | "prosedur">("tracking");

  // Tracking Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedLetter, setSearchedLetter] = useState<LetterRequest | null>(null);
  const [searchNotFound, setSearchNotFound] = useState(false);
  const [previewLetter, setPreviewLetter] = useState<LetterRequest | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchNotFound(false);
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    const found = letterRequests.find(
      (item) =>
        item.trackingCode.toLowerCase() === query ||
        item.nik.toLowerCase() === query ||
        item.residentName.toLowerCase().includes(query)
    );

    if (found) {
      setSearchedLetter(found);
    } else {
      setSearchedLetter(null);
      setSearchNotFound(true);
    }
  };

  const getStatusBadge = (status: LetterRequest["status"]) => {
    switch (status) {
      case "MENUNGGU_RT":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Menunggu Validasi RT
          </span>
        );
      case "MENUNGGU_RW":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3.5 h-3.5" /> Disetujui RT, Menunggu Pengesahan RW
          </span>
        );
      case "DISETUJUI":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Sah & Terbit Ber-QR Code
          </span>
        );
      case "DITOLAK":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5" /> Permohonan Ditolak
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 overflow-x-hidden w-full max-w-full">
      <Navbar />
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white py-12 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                Layanan Administrasi Resmi {rw.name}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-2 text-white">
                Pelayanan E-Surat Pengantar RT & RW
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Penerbitan surat pengantar resmi diproses dan divalidasi langsung oleh Ketua RT 01–09 dan disahkan oleh Ketua RW 14. Lacak status dan unduh dokumen legal ber-QR Code di sini.
              </p>
            </div>

            {/* Tab Buttons */}
            <div className="flex bg-slate-800 p-1.5 rounded-xl border border-slate-700 self-start md:self-auto shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab("tracking")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "tracking"
                    ? "bg-emerald-500 text-slate-950 shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Search className="w-4 h-4" />
                Lacak & Unduh Surat
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("prosedur")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "prosedur"
                    ? "bg-emerald-500 text-slate-950 shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <PhoneCall className="w-4 h-4" />
                Kontak Ketua RT 01-09
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Notice Info Box: Otoritas RT & RW */}
        <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-emerald-700/50 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <Lock className="w-4 h-4" />
              <span>Ketentuan Otoritas Penerbitan Surat</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white">
              Pembuatan Surat Pengantar Dilakukan Langsung oleh Pengurus RT & RW
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Untuk memastikan keaslian data kependudukan dan domisili tempat tinggal, pengisian dan penerbitan Surat Pengantar dilakukan oleh <strong>Ketua RT setempat</strong> dan disahkan secara digital oleh <strong>Ketua {rw.name} ({rw.headName})</strong>.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/admin/surat"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Login Pengurus RT/RW</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Tab 1: Tracking & Cek Status Dokumen */}
        {activeTab === "tracking" && (
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Search Box */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-extrabold text-slate-900 mb-1">
                Pelacakan Status & Download E-Surat Resmi
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                Masukkan Nomor Resi Surat (contoh: <code>SRT-202608-001</code>), NIK, atau Nama Pemohon.
              </p>

              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Masukkan Kode Resi (SRT-...) atau NIK / Nama Pemohon..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow transition-all"
                >
                  Cari Dokumen
                </button>
              </form>

              {searchNotFound && (
                <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Data surat dengan kata kunci tersebut tidak ditemukan. Mohon periksa kembali kode resi atau NIK Anda, atau hubungi Ketua RT Anda.</span>
                </div>
              )}
            </div>

            {/* Result Display */}
            {searchedLetter && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6 animate-in fade-in">
                
                {/* Result Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {searchedLetter.trackingCode}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        RT {searchedLetter.rtNumber}
                      </span>
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                      {searchedLetter.letterTitle}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Diajukan / Diterbitkan pada {formatDate(searchedLetter.submittedAt)}
                    </p>
                  </div>
                  <div>{getStatusBadge(searchedLetter.status)}</div>
                </div>

                {/* Progress Stepper Timeline */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                    Status Progres Pengesahan
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    {/* Step 1 */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center shrink-0">
                        ✓
                      </div>
                      <div>
                        <strong className="text-slate-900 block">1. Input Berkas</strong>
                        <span className="text-slate-500">Data telah diinput di sistem.</span>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-full font-bold flex items-center justify-center shrink-0 ${
                          searchedLetter.status === "MENUNGGU_RW" || searchedLetter.status === "DISETUJUI"
                            ? "bg-emerald-500 text-slate-950"
                            : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {searchedLetter.status === "MENUNGGU_RW" || searchedLetter.status === "DISETUJUI" ? "✓" : "2"}
                      </div>
                      <div>
                        <strong className="text-slate-900 block">2. Validasi Ketua RT</strong>
                        <span className="text-slate-500">
                          {searchedLetter.rtApprovedBy ? `Oleh: ${searchedLetter.rtApprovedBy}` : "Menunggu validasi RT"}
                        </span>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-full font-bold flex items-center justify-center shrink-0 ${
                          searchedLetter.status === "DISETUJUI"
                            ? "bg-emerald-500 text-slate-950"
                            : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {searchedLetter.status === "DISETUJUI" ? "✓" : "3"}
                      </div>
                      <div>
                        <strong className="text-slate-900 block">3. Pengesahan Final RW</strong>
                        <span className="text-slate-500">
                          {searchedLetter.rwApprovedBy ? `Oleh: ${searchedLetter.rwApprovedBy}` : "Menunggu TTD RW"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Surat Details Card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 font-bold block mb-1">BIODATA PEMOHON</span>
                    <p>Nama: <strong className="text-slate-900">{searchedLetter.residentName}</strong></p>
                    <p>NIK: <span className="font-mono text-slate-700">{maskNik(searchedLetter.nik)}</span></p>
                    <p>RT / Wilayah: <strong className="text-slate-800">RT {searchedLetter.rtNumber} / {rw.name}</strong></p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 font-bold block mb-1">KEPERLUAN & NOMOR SURAT</span>
                    <p>Keperluan: <strong className="text-slate-900">{searchedLetter.purpose}</strong></p>
                    {searchedLetter.letterOfficialNumber && (
                      <p>No. Resmi: <span className="font-mono font-bold text-emerald-700">{searchedLetter.letterOfficialNumber}</span></p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-400">
                    Token Verifikasi: <code className="font-mono">{searchedLetter.verificationToken}</code>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewLetter(searchedLetter)}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4 text-emerald-400" />
                      <span>Lihat & Cetak Dokumen PDF</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* List Surat Terbit Terakhir */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Surat Pengantar yang Baru Saja Diterbitkan Resmi
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {letterRequests
                  .filter((l) => l.status === "DISETUJUI")
                  .slice(0, 4)
                  .map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSearchedLetter(item)}
                      className="p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-emerald-700">{item.trackingCode}</span>
                          <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded">RT {item.rtNumber}</span>
                        </div>
                        <p className="font-bold text-slate-900 mt-1">{item.letterTitle}</p>
                        <p className="text-[11px] text-slate-500">{item.residentName}</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-600">Lihat →</span>
                    </div>
                  ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Prosedur Pengurusan & Kontak 9 RT */}
        {activeTab === "prosedur" && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
                Layanan Warga
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                Daftar Kontak Ketua RT 01 s/d RT 09
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Hubungi Ketua RT sesuai wilayah tempat tinggal Anda untuk pengajuan surat pengantar secara cepat melalui WhatsApp.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rts.map((rt) => (
                <div
                  key={rt.id}
                  className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-slate-900 text-emerald-400 rounded-xl font-black text-xs">
                        RT {rt.rtNumber}
                      </span>
                      <span className="text-[11px] text-slate-500 font-semibold">
                        {rt.totalFamilies} KK Terdaftar
                      </span>
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-base">
                      {rt.headName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Ketua Rukun Tetangga {rt.rtNumber} / {rw.name}
                    </p>
                  </div>

                  <a
                    href={`https://wa.me/6281234567801?text=Halo%20Pak%20Ketua%20RT%20${rt.rtNumber}%20(${encodeURIComponent(
                      rt.headName
                    )}),%20saya%20warga%20RT%20${rt.rtNumber}%20ingin%20mengajukan%20Surat%20Pengantar%20resmi.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Hubungi via WhatsApp</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Modal Preview Surat Resmi */}
      {previewLetter && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-10 shadow-2xl border border-slate-200 space-y-6 my-8">
            
            {/* Modal Controls */}
            <div className="no-print flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Dokumen Surat Pengantar Resmi
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak / PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewLetter(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Letter Paper Body */}
            <div className="letter-paper bg-white p-4 sm:p-8 text-slate-900 font-serif leading-relaxed text-xs sm:text-sm">
              
              {/* Kop Surat Resmi */}
              <div className="text-center border-b-4 border-double border-slate-900 pb-4 space-y-0.5">
                <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider font-sans">
                  RUKUN TETANGGA {previewLetter.rtNumber} / {rw.name.toUpperCase()}
                </h2>
                <h3 className="text-base sm:text-lg font-black uppercase tracking-tight font-sans">
                  KELURAHAN {rw.village.toUpperCase()} • KECAMATAN {rw.subDistrict.toUpperCase()}
                </h3>
                <h4 className="text-xs font-bold uppercase tracking-wide font-sans text-slate-700">
                  {rw.city.toUpperCase()} • PROVINSI {rw.province.toUpperCase()}
                </h4>
                <p className="text-[11px] font-sans text-slate-600 pt-1">
                  Sekretariat: {rw.address} • Kode Pos: {rw.postalCode} • Telp: {rw.headPhone}
                </p>
              </div>

              {/* Judul & Nomor Surat */}
              <div className="text-center space-y-1 pt-4 pb-2">
                <h4 className="font-bold text-sm sm:text-base uppercase tracking-wider underline">
                  {previewLetter.letterTitle}
                </h4>
                <p className="font-sans text-xs text-slate-700 font-mono">
                  Nomor: {previewLetter.letterOfficialNumber || `470/---/RW.14/VIII/2026`}
                </p>
              </div>

              {/* Paragraf Pembuka */}
              <p className="text-justify font-sans pt-2">
                Yang bertanda tangan di bawah ini, Pengurus RT {previewLetter.rtNumber} dan Pengurus {rw.name} Kelurahan {rw.village}, Kecamatan {rw.subDistrict}, {rw.city}, dengan ini menerangkan dengan sebenarnya bahwa:
              </p>

              {/* Data Warga Table */}
              <div className="font-sans pl-4 sm:pl-6 my-4 space-y-2 text-xs sm:text-sm border-l-2 border-slate-200">
                <div className="grid grid-cols-12">
                  <span className="col-span-4 text-slate-600">Nama Lengkap</span>
                  <span className="col-span-8 font-bold text-slate-900">: {previewLetter.residentName}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-4 text-slate-600">NIK (KTP)</span>
                  <span className="col-span-8 font-mono font-semibold text-slate-900">: {previewLetter.nik}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-4 text-slate-600">Nomor Kartu Keluarga</span>
                  <span className="col-span-8 font-mono text-slate-800">: {previewLetter.familyCardNumber}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-4 text-slate-600">Alamat Domisili</span>
                  <span className="col-span-8 text-slate-800">: RT {previewLetter.rtNumber} / {rw.name}, {previewLetter.address}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-4 text-slate-600">Maksud / Keperluan</span>
                  <span className="col-span-8 font-semibold text-slate-900">: {previewLetter.purpose}</span>
                </div>
              </div>

              {/* Paragraf Penutup */}
              <p className="text-justify font-sans">
                Demikian surat pengantar ini dibuat dengan sebenar-benarnya berdasarkan data yang ada pada administrasi kami untuk dapat dipergunakan sebagaimana mestinya.
              </p>

              {/* Tanda Tangan Berjenjang & QR Verification */}
              <div className="pt-8 grid grid-cols-3 items-center text-center font-sans text-xs">
                
                {/* RT Column */}
                <div className="space-y-1">
                  <p>Mengetahui,</p>
                  <p className="font-bold">Ketua RT {previewLetter.rtNumber}</p>
                  <div className="h-16 flex items-center justify-center">
                    <div className="border border-emerald-300 bg-emerald-50 text-emerald-800 px-2 py-1 rounded text-[10px] font-bold">
                      [Tanda Tangan Digital RT]
                    </div>
                  </div>
                  <p className="font-bold underline">
                    {previewLetter.rtApprovedBy || "Ketua RT Setempat"}
                  </p>
                </div>

                {/* QR Code Column */}
                <div className="flex flex-col items-center justify-center space-y-1">
                  <div className="p-2 border border-slate-300 rounded-lg bg-white shadow-sm">
                    <QrCode className="w-16 h-16 text-slate-900" />
                  </div>
                  <span className="text-[9px] font-mono text-slate-500">
                    Scan untuk Verifikasi Keaslian
                  </span>
                  <span className="text-[8px] font-mono text-slate-400">
                    Token: {previewLetter.verificationToken}
                  </span>
                </div>

                {/* RW Column */}
                <div className="space-y-1">
                  <p>{rw.city}, {formatDate(previewLetter.rwApprovedAt || previewLetter.submittedAt)}</p>
                  <p className="font-bold">Ketua {rw.name}</p>
                  <div className="h-16 flex items-center justify-center">
                    <div className="border border-emerald-300 bg-emerald-50 text-emerald-800 px-2 py-1 rounded text-[10px] font-bold">
                      [Cap & TTD Digital {rw.name}]
                    </div>
                  </div>
                  <p className="font-bold underline">
                    {previewLetter.rwApprovedBy || rw.headName}
                  </p>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
