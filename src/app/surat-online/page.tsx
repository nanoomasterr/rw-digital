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
  Send,
  ArrowRight,
  QrCode,
} from "lucide-react";
import { maskNik, formatDate } from "@/lib/utils";

export default function SuratOnlinePage() {
  const { letterRequests, addLetterRequest, rts } = useApp();
  const [activeTab, setActiveTab] = useState<"ajukan" | "tracking">("ajukan");

  // Form State
  const [letterType, setLetterType] = useState<LetterType>("PENGANTAR_SKCK");
  const [residentName, setResidentName] = useState("");
  const [nik, setNik] = useState("");
  const [familyCardNumber, setFamilyCardNumber] = useState("");
  const [rtNumber, setRtNumber] = useState("001");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [purpose, setPurpose] = useState("");
  const [submittedSuccess, setSubmittedSuccess] = useState<LetterRequest | null>(null);

  // Tracking Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedLetter, setSearchedLetter] = useState<LetterRequest | null>(null);
  const [searchNotFound, setSearchNotFound] = useState(false);

  const letterTypeTitles: Record<LetterType, string> = {
    PENGANTAR_SKCK: "Surat Pengantar Pembuatan SKCK",
    DOMISILI: "Surat Keterangan Domisili Tinggal",
    KETERANGAN_USAHA: "Surat Keterangan Domisili Usaha (SKDU)",
    KETERANGAN_TIDAK_MAMPU: "Surat Keterangan Tidak Mampu (SKTM)",
    KETERANGAN_KEMATIAN: "Surat Keterangan Kematian",
    KETERANGAN_BELUM_MENIKAH: "Surat Keterangan Belum Menikah",
    PENGANTAR_NIKAH: "Surat Pengantar Nikah (N1-N4)",
    IZIN_KERAMAIAN: "Surat Pengantar Izin Keramaian Acara",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!residentName || !nik || !purpose || !phone) {
      alert("Mohon lengkapi data permohonan!");
      return;
    }

    const created = addLetterRequest({
      letterType,
      letterTitle: letterTypeTitles[letterType],
      residentName,
      nik,
      familyCardNumber: familyCardNumber || "3201011205100001",
      rtNumber,
      address: address || `Jl. Mawar No. 12, RT ${rtNumber}/RW 05`,
      phone,
      purpose,
    });

    setSubmittedSuccess(created);
    setSearchedLetter(created);
  };

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
            <Clock className="w-3.5 h-3.5" /> Disetujui RT, Menunggu Approval RW
          </span>
        );
      case "DISETUJUI":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Selesai & Terbit Ber-QR Code
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
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white py-12 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800">
                Layanan Mandiri Warga
              </span>
              <h1 className="text-3xl font-black tracking-tight mt-2 text-white">
                Pelayanan E-Surat Pengantar Online
              </h1>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                Ajukan surat keterangan dan pengantar resmi RT & RW tanpa antre fisik. Dokumen dilengkapi QR Code verifikasi digital yang sah.
              </p>
            </div>

            {/* Tab Buttons */}
            <div className="flex bg-slate-800 p-1.5 rounded-xl border border-slate-700 self-start md:self-auto">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("ajukan");
                  setSubmittedSuccess(null);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "ajukan"
                    ? "bg-emerald-500 text-slate-950 shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <FileText className="w-4 h-4" />
                Buat Permohonan Baru
              </button>
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
                Cek Status & Unduh Surat
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {activeTab === "ajukan" && !submittedSuccess && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Form Permohonan */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="border-b border-slate-100 pb-4 mb-6">
                <h2 className="text-xl font-extrabold text-slate-900">
                  Formulir Pengajuan Surat Pengantar
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Isi data dengan lengkap sesuai Kartu Tanda Penduduk (KTP) dan Kartu Keluarga (KK).
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Pilih Jenis Surat */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    1. Jenis Surat Pengantar <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={letterType}
                    onChange={(e) => setLetterType(e.target.value as LetterType)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  >
                    {Object.entries(letterTypeTitles).map(([key, title]) => (
                      <option key={key} value={key}>
                        {title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Data Pemohon */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Nama Lengkap Pemohon <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Dimas Aditya Hartono"
                      value={residentName}
                      onChange={(e) => setResidentName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      NIK Pemohon (16 Digit) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={16}
                      placeholder="Contoh: 3201012010040003"
                      value={nik}
                      onChange={(e) => setNik(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Wilayah Rukun Tetangga (RT) <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={rtNumber}
                      onChange={(e) => setRtNumber(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    >
                      {rts.map((rt) => (
                        <option key={rt.id} value={rt.rtNumber}>
                          RT {rt.rtNumber} (Ketua: {rt.headName})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Contoh: 081234567890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                    <span className="text-[11px] text-slate-500">Notifikasi link surat akan dikirim ke nomor ini</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Alamat Lengkap Rumah / Blok <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Jl. Melati 1 No. 12, Blok A1/12"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>

                {/* Keperluan Surat */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Maksud & Keperluan Permohonan <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tuliskan secara jelas keperluan surat, contoh: Persyaratan melamar pekerjaan BUMN / Pembuatan paspor / Pendaftaran sekolah anak"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Kirim Permohonan Surat</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Sidebar Panduan Alur */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-lg space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  Alur Persetujuan Resmi
                </div>
                <h3 className="font-extrabold text-lg text-white">
                  3 Langkah Mudah E-Surat
                </h3>
                
                <ol className="space-y-4 text-xs text-slate-300">
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center shrink-0">
                      1
                    </span>
                    <div>
                      <strong className="text-white block">Warga Mengisi Form</strong>
                      Isi biodata pemohon dan keperluan surat secara online.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-700 text-emerald-400 font-black flex items-center justify-center shrink-0">
                      2
                    </span>
                    <div>
                      <strong className="text-white block">Verifikasi Ketua RT</strong>
                      Ketua RT memeriksa kebenaran domisili dan memberikan approval.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-700 text-emerald-400 font-black flex items-center justify-center shrink-0">
                      3
                    </span>
                    <div>
                      <strong className="text-white block">Penerbitan Surat RW & QR</strong>
                      Ketua RW menandatangani secara digital. Surat langsung bisa diunduh PDF!
                    </div>
                  </li>
                </ol>
              </div>

              {/* Contoh Permohonan Terakhir */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">
                  Permohonan Warga Terkini
                </h4>
                <div className="space-y-2.5 text-xs">
                  {letterRequests.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-semibold text-slate-800 truncate max-w-[160px]">
                          {item.residentName}
                        </p>
                        <p className="text-[10px] text-slate-500">{item.trackingCode}</p>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {item.status.replace("_", " ")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Sukses Submit Notifikasi */}
        {submittedSuccess && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-emerald-200 shadow-xl text-center space-y-6 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
                Permohonan Berhasil Terkirim
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">
                Surat Sedang Diteruskan ke Ketua RT {submittedSuccess.rtNumber}
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Simpan nomor resi pelacakan Anda di bawah ini untuk memeriksa status persetujuan atau mengunduh surat.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 inline-block">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Nomor Resi / Kode Pelacakan
              </p>
              <p className="text-2xl font-black text-emerald-600 tracking-wider mt-1">
                {submittedSuccess.trackingCode}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSearchedLetter(submittedSuccess);
                  setActiveTab("tracking");
                }}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow transition-all"
              >
                Lihat Status Permohonan
              </button>
              <button
                type="button"
                onClick={() => setSubmittedSuccess(null)}
                className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-all"
              >
                Ajukan Surat Lainnya
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Tracking & Cek Status */}
        {activeTab === "tracking" && (
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Search Box */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-extrabold text-slate-900 mb-2">
                Pelacakan Status & Download E-Surat
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                Masukkan Kode Pelacakan (contoh: <code>SRT-202608-001</code>) atau NIK Pemohon.
              </p>

              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Masukkan Kode Resi (misal: SRT-202608-001) atau NIK..."
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
                <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Data surat dengan kata kunci tersebut tidak ditemukan. Mohon periksa kembali kode resi atau NIK Anda.</span>
                </div>
              )}
            </div>

            {/* Result Display */}
            {searchedLetter && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6 animate-in fade-in">
                
                {/* Result Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {searchedLetter.trackingCode}
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                      {searchedLetter.letterTitle}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Diajukan pada {formatDate(searchedLetter.submittedAt)}
                    </p>
                  </div>
                  <div>{getStatusBadge(searchedLetter.status)}</div>
                </div>

                {/* Progress Stepper Timeline */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                    Status Progres Berjenjang
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    {/* Step 1 */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center shrink-0">
                        ✓
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">1. Pengajuan Warga</p>
                        <p className="text-slate-500 text-[11px]">{searchedLetter.submittedAt}</p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-full font-bold flex items-center justify-center shrink-0 ${
                          searchedLetter.rtApprovedAt
                            ? "bg-emerald-500 text-slate-950"
                            : searchedLetter.status === "DITOLAK"
                            ? "bg-rose-500 text-white"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {searchedLetter.rtApprovedAt ? "✓" : "2"}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">2. Validasi RT {searchedLetter.rtNumber}</p>
                        <p className="text-slate-500 text-[11px]">
                          {searchedLetter.rtApprovedAt ? searchedLetter.rtApprovedBy : "Menunggu validasi"}
                        </p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-full font-bold flex items-center justify-center shrink-0 ${
                          searchedLetter.rwApprovedAt
                            ? "bg-emerald-500 text-slate-950"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {searchedLetter.rwApprovedAt ? "✓" : "3"}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">3. Approval & QR RW 05</p>
                        <p className="text-slate-500 text-[11px]">
                          {searchedLetter.rwApprovedAt ? "Selesai diterbitkan" : "Menunggu tanda tangan RW"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Surat Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <p className="text-slate-400 font-semibold">Nama Pemohon</p>
                    <p className="font-bold text-slate-900 text-sm">{searchedLetter.residentName}</p>
                    <p className="text-slate-400 font-semibold mt-2">NIK</p>
                    <p className="font-medium text-slate-800">{maskNik(searchedLetter.nik)}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <p className="text-slate-400 font-semibold">Keperluan</p>
                    <p className="font-bold text-slate-900">{searchedLetter.purpose}</p>
                    {searchedLetter.letterOfficialNumber && (
                      <>
                        <p className="text-slate-400 font-semibold mt-2">Nomor Surat Resmi</p>
                        <p className="font-mono font-bold text-emerald-700">
                          {searchedLetter.letterOfficialNumber}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions / Download */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  {searchedLetter.status === "DISETUJUI" ? (
                    <>
                      <div className="flex items-center gap-2 text-xs text-emerald-700">
                        <QrCode className="w-4 h-4" />
                        <span>Dokumen telah ber-QR Code & sah digunakan.</span>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Link
                          href={`/verify/${searchedLetter.verificationToken}`}
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Lihat Verifikasi QR</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => window.print()}
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow transition-all"
                        >
                          <Download className="w-4 h-4" />
                          <span>Cetak / Simpan PDF</span>
                        </button>
                      </div>
                    </>
                  ) : searchedLetter.status === "DITOLAK" ? (
                    <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200 w-full">
                      <strong>Alasan Penolakan:</strong> {searchedLetter.rejectionReason || "Berkas persyaratan tidak lengkap."}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">
                      Surat sedang dalam proses verifikasi oleh pengurus. Silakan cek berkala halaman ini.
                    </p>
                  )}
                </div>

              </div>
            )}

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
