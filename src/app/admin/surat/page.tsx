"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { LetterRequest, LetterStatus, LetterType } from "@/types";
import {
  FileText,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Printer,
  ShieldCheck,
  Building,
  QrCode,
  Check,
  X,
  FileCheck,
  ArrowLeft,
} from "lucide-react";
import { maskNik, formatDate } from "@/lib/utils";

export default function AdminSuratPage() {
  const {
    letterRequests,
    addLetterRequest,
    approveLetterRT,
    approveLetterRW,
    rejectLetter,
    currentRole,
    rw,
    rts,
    residents,
    families,
  } = useApp();

  const roleLabels: Record<string, { badge: string }> = {
    KETUA_RW: { badge: "Superadmin RW" },
    KETUA_RT: { badge: "Admin RT 01" },
    BENDAHARA: { badge: "Keuangan RW" },
    PETUGAS: { badge: "Tim Lapangan" },
    WARGA: { badge: "Warga Biasa" },
  };

  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewLetter, setPreviewLetter] = useState<LetterRequest | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [letterToReject, setLetterToReject] = useState<LetterRequest | null>(null);
  const [rejectionNote, setRejectionNote] = useState("");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Keyboard shortcut Esc to close preview
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPreviewLetter(null);
        setCreateModalOpen(false);
        setRejectModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredLetters = letterRequests.filter((l) => {
    const matchStatus = selectedStatus === "ALL" || l.status === selectedStatus;
    const matchQuery =
      l.residentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.trackingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.nik.includes(searchQuery) ||
      l.letterTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchQuery;
  });

  const handleApproveRT = (letter: LetterRequest) => {
    const approver = currentRole === "KETUA_RT" ? "DASEP HERIANSYAH (Ketua RT 001)" : `Ketua RT ${letter.rtNumber}`;
    approveLetterRT(letter.id, approver, "Berkas persyaratan & domisili pemohon telah diverifikasi sah.");
    setActionNotice(`Surat ${letter.trackingCode} berhasil disetujui tingkat RT dan diteruskan ke Ketua RW.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleApproveRW = (letter: LetterRequest) => {
    const randomNum = Math.floor(10 + Math.random() * 90);
    const officialNo = `470/${String(randomNum).padStart(3, "0")}/RW.14/VIII/2026`;
    approveLetterRW(letter.id, rw.headName, officialNo);
    setActionNotice(`Surat ${letter.trackingCode} telah disahkan dan diterbitkan dengan nomor ${officialNo}.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleOpenReject = (letter: LetterRequest) => {
    setLetterToReject(letter);
    setRejectionNote("");
    setRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (!letterToReject || !rejectionNote) return;
    rejectLetter(letterToReject.id, rejectionNote);
    setRejectModalOpen(false);
    setActionNotice(`Surat ${letterToReject.trackingCode} telah ditolak dengan catatan.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Create Letter Modal State (Khusus RT & RW)
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [letterType, setLetterType] = useState<LetterType>("PENGANTAR_SKCK");
  const [residentName, setResidentName] = useState("");
  const [nik, setNik] = useState("");
  const [familyCardNumber, setFamilyCardNumber] = useState("");
  const [rtNumber, setRtNumber] = useState("001");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [purpose, setPurpose] = useState("");
  const [directApprove, setDirectApprove] = useState(true);

  const isOfficer = currentRole === "KETUA_RW" || currentRole === "KETUA_RT";

  const letterTypeTitles: Record<LetterType, string> = {
    PENGANTAR_SKCK: "Surat Pengantar Pembuatan SKCK",
    DOMISILI: "Surat Keterangan Domisili Tinggal",
    KETERANGAN_USAHA: "Surat Keterangan Domisili Usaha (SKDU)",
    KETERANGAN_TIDAK_MAMPU: "Surat Keterangan Tidak Mampu (SKTM)",
    KETERANGAN_KEMATIAN: "Surat Keterangan Kematian",
    KETERANGAN_BELUM_MENIKAH: "Surat Keterangan Belum Menikah",
    PENGANTAR_NIKAH: "Surat Pengantar Nikah (N1-N4)",
    IZIN_KERAMAIAN: "Surat Pengantar Izin Keramaian Acara",
    SURAT_PENGANTAR_SKCK: "Surat Pengantar Pembuatan SKCK",
    SURAT_KETERANGAN_USAHA: "Surat Keterangan Domisili Usaha (SKDU)",
    SURAT_KETERANGAN_DOMISILI: "Surat Keterangan Domisili Tinggal",
  };

  const handleCreateLetter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!residentName || !nik || !purpose || !phone) {
      alert("Mohon lengkapi seluruh data pemohon!");
      return;
    }

    const created = addLetterRequest({
      letterType,
      letterTitle: letterTypeTitles[letterType],
      residentName,
      nik,
      familyCardNumber: familyCardNumber || "3277011205100001",
      rtNumber,
      address: address || `Jl. Kebon Rumput No. 12, RT ${rtNumber}/RW 14`,
      phone,
      purpose,
    });

    if (currentRole === "KETUA_RT") {
      // RT langsung memvalidasi
      approveLetterRT(
        created.id,
        "DASEP HERIANSYAH (Ketua RT 001)",
        "Dibuat dan divalidasi langsung oleh Ketua RT 001."
      );
      setActionNotice(
        `Surat ${created.trackingCode} (${residentName}) berhasil dibuat dan diteruskan ke Ketua RW.`
      );
    } else if (currentRole === "KETUA_RW" && directApprove) {
      // RW langsung mengesahkan & menerbitkan
      const randomNum = Math.floor(10 + Math.random() * 90);
      const officialNo = `470/${String(randomNum).padStart(3, "0")}/RW.14/VIII/2026`;
      approveLetterRT(created.id, `Ketua RT ${rtNumber}`, "Divalidasi di Sekretariat RW.");
      approveLetterRW(created.id, rw.headName, officialNo);
      setActionNotice(
        `Surat ${created.trackingCode} (${residentName}) berhasil diterbitkan resmi dengan No: ${officialNo}.`
      );
    } else {
      setActionNotice(`Surat ${created.trackingCode} (${residentName}) berhasil dicatat.`);
    }

    setCreateModalOpen(false);
    setResidentName("");
    setNik("");
    setFamilyCardNumber("");
    setPhone("");
    setAddress("");
    setPurpose("");
    setTimeout(() => setActionNotice(null), 5000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Pelayanan E-Surat Pengantar RW/RT
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Penerbitan resmi hanya oleh Pengurus RT & RW dengan verifikasi QR Code legal.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isOfficer ? (
            <button
              type="button"
              onClick={() => {
                setRtNumber(currentRole === "KETUA_RT" ? "001" : "001");
                setCreateModalOpen(true);
              }}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-2 transition-transform active:scale-95"
            >
              <FileCheck className="w-4 h-4" />
              <span>+ Buat / Terbitkan Surat Warga</span>
            </button>
          ) : (
            <div className="px-3 py-2 bg-slate-100 rounded-xl text-slate-500 text-xs font-semibold flex items-center gap-1.5 border border-slate-200">
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <span>Akses Pembuatan: Khusus RT & RW</span>
            </div>
          )}

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-slate-500">Peran:</span>
            <span className="px-3 py-1 bg-slate-900 text-emerald-400 rounded-lg font-bold text-xs">
              {currentRole === "KETUA_RW"
                ? "Ketua RW"
                : currentRole === "KETUA_RT"
                ? "Ketua RT 01"
                : roleLabels[currentRole]?.badge || "Pengurus"}
            </span>
          </div>
        </div>
      </div>

      {/* Action Toast Notice */}
      {actionNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-emerald-700 font-bold">✕</button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "ALL", label: "Semua Permohonan" },
            { id: "MENUNGGU_RT", label: "1. Menunggu Validasi RT" },
            { id: "MENUNGGU_RW", label: "2. Menunggu Pengesahan RW" },
            { id: "DISETUJUI", label: "3. Terbit & Sah (Selesai)" },
            { id: "DITOLAK", label: "Ditolak" },
          ].map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setSelectedStatus(st.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedStatus === st.id
                  ? "bg-slate-900 text-white shadow"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari Kode Resi (SRT-...), Nama Pemohon, NIK, atau Jenis Surat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>

      {/* Letters List */}
      <div className="space-y-4">
        {filteredLetters.map((letter) => (
          <div
            key={letter.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4 hover:shadow-md transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-slate-400">
                      {letter.trackingCode}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      RT {letter.rtNumber}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    {letter.letterTitle}
                  </h3>
                </div>
              </div>

              <div>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                    letter.status === "DISETUJUI"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : letter.status === "DITOLAK"
                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                      : letter.status === "MENUNGGU_RW"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {letter.status === "DISETUJUI" && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {letter.status === "MENUNGGU_RT" && <Clock className="w-3.5 h-3.5" />}
                  {letter.status === "MENUNGGU_RW" && <Clock className="w-3.5 h-3.5" />}
                  {letter.status.replace("_", " ")}
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-bold block mb-1">BIODATA PEMOHON</span>
                <p className="font-bold text-slate-900">{letter.residentName}</p>
                <p className="font-mono text-slate-500">NIK: {maskNik(letter.nik)}</p>
                <p className="text-slate-500">{letter.phone}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-bold block mb-1">ALAMAT & KEPERLUAN</span>
                <p className="font-medium text-slate-800">{letter.address}</p>
                <p className="text-slate-600 mt-1"><strong>Keperluan:</strong> {letter.purpose}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-bold block mb-1">STATUS LEGALITAS</span>
                <p className="text-[11px]">
                  RT {letter.rtNumber}: <strong>{letter.rtApprovedAt ? `✓ Disetujui (${letter.rtApprovedBy})` : "Menunggu Validasi"}</strong>
                </p>
                <p className="text-[11px] mt-0.5">
                  RW 14: <strong>{letter.rwApprovedAt ? `✓ Diterbitkan (${letter.rwApprovedBy})` : "Menunggu TTD RW"}</strong>
                </p>
                {letter.letterOfficialNumber && (
                  <p className="font-mono font-bold text-emerald-700 text-[11px] mt-1">
                    No: {letter.letterOfficialNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="text-[11px] text-slate-400">
                Diajukan pada: {formatDate(letter.submittedAt)}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Preview Button */}
                <button
                  type="button"
                  onClick={() => setPreviewLetter(letter)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Lihat Format Cetak</span>
                </button>

                {/* RT Approval */}
                {letter.status === "MENUNGGU_RT" && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleOpenReject(letter)}
                      className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-semibold"
                    >
                      Tolak
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApproveRT(letter)}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Validasi & Setujui RT</span>
                    </button>
                  </>
                )}

                {/* RW Approval */}
                {letter.status === "MENUNGGU_RW" && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleOpenReject(letter)}
                      className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-semibold"
                    >
                      Tolak
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApproveRW(letter)}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Sahkan & Terbitkan Surat RW</span>
                    </button>
                  </>
                )}

                {letter.status === "DISETUJUI" && (
                  <button
                    type="button"
                    onClick={() => setPreviewLetter(letter)}
                    className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Cetak PDF Resmi</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Preview Surat Resmi (Format Standar Administrasi Indonesia) */}
      {previewLetter && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm overflow-y-auto p-2 sm:p-6 flex justify-center items-start">
          {/* Backdrop Click Area */}
          <div
            className="fixed inset-0 cursor-pointer"
            onClick={() => setPreviewLetter(null)}
            aria-label="Tutup Modal"
          />

          <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-2 sm:my-6 z-10 animate-in zoom-in-95">
            
            {/* Sticky Top Navigation Bar (Always Visible) */}
            <div className="no-print sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between z-30 shadow-sm">
              <button
                type="button"
                onClick={() => setPreviewLetter(null)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>← Tutup & Kembali</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow flex items-center gap-1.5 transition-transform active:scale-95"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak / Cetak PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewLetter(null)}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-slate-600 font-bold flex items-center justify-center transition-colors text-sm"
                  aria-label="Tutup"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Letter Paper Body */}
            <div className="letter-paper bg-white p-6 sm:p-10 text-slate-900 font-serif leading-relaxed text-xs sm:text-sm">
              
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

      {/* Modal Buat / Terbitkan Surat Pengantar (Khusus RT & RW) */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 my-8 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Otoritas: {currentRole === "KETUA_RW" ? "Pengurus RW 14" : "Pengurus RT 01"}
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                  Penerbitan Surat Pengantar Warga
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLetter} className="space-y-4 text-xs">
              {/* Quick Pick from registered residents */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                <label className="block font-bold text-slate-700 mb-1">
                  Pilih Cepat dari Data Warga Terdaftar (Opsional):
                </label>
                <select
                  onChange={(e) => {
                    const res = residents.find((r) => r.id === e.target.value);
                    if (res) {
                      setResidentName(res.fullName);
                      setNik(res.nik);
                      const fam = families.find((f) => f.id === res.familyId);
                      if (fam) {
                        setFamilyCardNumber(fam.familyCardNumber);
                        setAddress(fam.address);
                      }
                      const rtObj = rts.find((rt) => rt.id === res.rtId);
                      if (rtObj) {
                        setRtNumber(rtObj.rtNumber);
                      }
                      setPhone(res.phone || "081234567890");
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium"
                >
                  <option value="">-- Ketik manual atau pilih warga --</option>
                  {residents.map((res) => {
                    const rtObj = rts.find((rt) => rt.id === res.rtId);
                    return (
                      <option key={res.id} value={res.id}>
                        {res.fullName} (NIK: {res.nik}) - RT {rtObj ? rtObj.rtNumber : "01"}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Jenis Surat */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Jenis Surat Pengantar <span className="text-rose-500">*</span>
                </label>
                <select
                  value={letterType}
                  onChange={(e) => setLetterType(e.target.value as LetterType)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold"
                >
                  {Object.entries(letterTypeTitles).map(([key, title]) => (
                    <option key={key} value={key}>
                      {title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Data Pemohon */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Lengkap Pemohon <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Dimas Aditya Hartono"
                    value={residentName}
                    onChange={(e) => setResidentName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    NIK (16 Digit KTP) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    placeholder="Contoh: 3277012005950001"
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nomor Kartu Keluarga (KK)
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    placeholder="Contoh: 3277011205100001"
                    value={familyCardNumber}
                    onChange={(e) => setFamilyCardNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Wilayah RT <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={rtNumber}
                    onChange={(e) => setRtNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    {rts.map((rt) => (
                      <option key={rt.id} value={rt.rtNumber}>
                        RT {rt.rtNumber} - Ketua: {rt.headName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    No. WhatsApp Pemohon <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 081234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Alamat Domisili <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Jl. Kebon Rumput No. 12"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Maksud / Keperluan Pengantar <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Contoh: Persyaratan Melamar Pekerjaan BUMN / CPNS di Kementerian"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              {/* Opsi Pengesahan Langsung untuk RW */}
              {currentRole === "KETUA_RW" && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="directApprove"
                    checked={directApprove}
                    onChange={(e) => setDirectApprove(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <label htmlFor="directApprove" className="font-semibold text-emerald-900 text-xs">
                    Langsung Sahkan & Terbitkan Nomor Surat Resmi (QR Code Aktif)
                  </label>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {currentRole === "KETUA_RW"
                      ? "Terbitkan Surat Resmi"
                      : "Validasi & Ajukan ke Ketua RW"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
