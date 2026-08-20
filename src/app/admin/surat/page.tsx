"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { LetterRequest, LetterStatus } from "@/types";
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
} from "lucide-react";
import { maskNik, formatDate } from "@/lib/utils";

export default function AdminSuratPage() {
  const {
    letterRequests,
    approveLetterRT,
    approveLetterRW,
    rejectLetter,
    currentRole,
    rw,
    rts,
  } = useApp();

  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewLetter, setPreviewLetter] = useState<LetterRequest | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [letterToReject, setLetterToReject] = useState<LetterRequest | null>(null);
  const [rejectionNote, setRejectionNote] = useState("");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

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
    const approver = currentRole === "KETUA_RT" ? "Drs. Eko Prasetyo (Ketua RT 001)" : `Ketua RT ${letter.rtNumber}`;
    approveLetterRT(letter.id, approver, "Berkas persyaratan & domisili pemohon telah diverifikasi sah.");
    setActionNotice(`Surat ${letter.trackingCode} berhasil disetujui tingkat RT dan diteruskan ke Ketua RW.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleApproveRW = (letter: LetterRequest) => {
    const randomNum = Math.floor(10 + Math.random() * 90);
    const officialNo = `470/${String(randomNum).padStart(3, "0")}/RW.05/VIII/2026`;
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

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Pelayanan E-Surat Pengantar RW/RT
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verifikasi berjenjang RT $\rightarrow$ RW dan penerbitan dokumen surat resmi ber-QR Code legal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Peran Aktif:</span>
          <span className="px-3 py-1 bg-slate-900 text-emerald-400 rounded-lg font-bold text-xs">
            {currentRole === "KETUA_RW" ? "Ketua RW (Pengesahan Final)" : currentRole === "KETUA_RT" ? "Ketua RT (Validasi Domisili)" : "Pengurus Lingkungan"}
          </span>
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
                  RW 05: <strong>{letter.rwApprovedAt ? `✓ Diterbitkan (${letter.rwApprovedBy})` : "Menunggu TTD RW"}</strong>
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
                  <span>Cetak / Cetak ke PDF</span>
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
                  RUKUN TETANGGA {previewLetter.rtNumber} / RUKUN WARGA 05
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
                  Nomor: {previewLetter.letterOfficialNumber || `470/---/RW.05/VIII/2026`}
                </p>
              </div>

              {/* Paragraf Pembuka */}
              <p className="text-justify font-sans pt-2">
                Yang bertanda tangan di bawah ini, Pengurus RT {previewLetter.rtNumber} dan Pengurus RW 05 Kelurahan {rw.village}, Kecamatan {rw.subDistrict}, {rw.city}, dengan ini menerangkan dengan sebenarnya bahwa:
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
                  <span className="col-span-8 text-slate-800">: RT {previewLetter.rtNumber} / RW 05, {previewLetter.address}</span>
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
                  <p className="font-bold">Ketua RW 05</p>
                  <div className="h-16 flex items-center justify-center">
                    <div className="border border-emerald-300 bg-emerald-50 text-emerald-800 px-2 py-1 rounded text-[10px] font-bold">
                      [Cap & TTD Digital RW 05]
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

      {/* Modal Tolak Surat */}
      {rejectModalOpen && letterToReject && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">
              Tolak Permohonan Surat
            </h3>
            <p className="text-xs text-slate-500">
              Tuliskan alasan penolakan agar warga dapat melengkapi berkasnya:
            </p>
            <textarea
              rows={3}
              required
              placeholder="Contoh: Lampiran KTP kurang jelas / Pemohon belum melengkapi surat pengantar nikah"
              value={rejectionNote}
              onChange={(e) => setRejectionNote(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-rose-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl shadow"
              >
                Konfirmasi Tolak
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
