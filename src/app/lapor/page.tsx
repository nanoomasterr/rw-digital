"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useApp } from "@/lib/store";
import { ComplaintCategory, Complaint } from "@/types";
import {
  AlertCircle,
  Send,
  CheckCircle2,
  Clock,
  MapPin,
  Shield,
  Trash2,
  Lightbulb,
  Lock,
  MessageSquare,
  Wrench,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function LaporPage() {
  const { complaints, addComplaint, rts, rw } = useApp();
  const [activeTab, setActiveTab] = useState<"buat" | "daftar">("buat");

  // Form State
  const [reporterName, setReporterName] = useState("");
  const [phone, setPhone] = useState("");
  const [rtNumber, setRtNumber] = useState("001");
  const [category, setCategory] = useState<ComplaintCategory>("INFRASTRUKTUR");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState<Complaint | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !location) {
      alert("Mohon lengkapi judul, lokasi, dan deskripsi pengaduan!");
      return;
    }

    const created = addComplaint({
      reporterName: isAnonymous ? `Warga ${rw.name} (Anonim)` : (reporterName || `Warga ${rw.name}`),
      phone: phone || "081234567890",
      rtNumber,
      category,
      title,
      description,
      location,
      isAnonymous,
    });

    setSubmittedComplaint(created);
  };

  const getCategoryIcon = (cat: ComplaintCategory) => {
    switch (cat) {
      case "KEBERSIHAN":
        return <Trash2 className="w-4 h-4 text-emerald-600" />;
      case "KEAMANAN":
        return <Shield className="w-4 h-4 text-rose-600" />;
      case "INFRASTRUKTUR":
        return <Wrench className="w-4 h-4 text-blue-600" />;
      default:
        return <Lightbulb className="w-4 h-4 text-amber-600" />;
    }
  };

  const getStatusBadge = (status: Complaint["status"]) => {
    switch (status) {
      case "TERKIRIM":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
            <Clock className="w-3 h-3 text-slate-500" /> Terkirim
          </span>
        );
      case "DIPROSES":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-500" /> Sedang Ditangani
          </span>
        );
      case "SELESAI":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Selesai Ditangani
          </span>
        );
      case "DITOLAK":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-500" /> Ditolak
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Header Banner */}
      <div className="bg-slate-900 text-white py-10 sm:py-14 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 uppercase tracking-widest bg-rose-950/70 px-3 py-1 rounded-full border border-rose-800">
                <AlertCircle className="w-3.5 h-3.5" />
                Layanan Aspirasi & Lapor RW
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                Pengaduan & Aspirasi Lingkungan Warga
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Sampaikan laporan kerusakan lampu penerangan jalan (PJU), tumpukan sampah, saluran tersumbat, atau gangguan ketertiban secara transparan dan terpantau.
              </p>
            </div>

            {/* Responsive Tab Toggle */}
            <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("buat");
                  setSubmittedComplaint(null);
                }}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "buat"
                    ? "bg-emerald-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Form Lapor Baru</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("daftar")}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "daftar"
                    ? "bg-emerald-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span>Papan Aduan ({complaints.length})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {activeTab === "buat" && !submittedComplaint && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Form Lapor */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-sm">
              <div className="border-b border-slate-100 pb-4 mb-6">
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  Formulir Laporan / Aspirasi Warga
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Laporan Anda akan ditinjau oleh Pengurus RW dan ditindaklanjuti oleh Seksi Lingkungan atau Petugas Keamanan.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 text-xs sm:text-sm">
                
                {/* Kategori Aduan */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    1. Kategori Masalah <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                    {[
                      { id: "INFRASTRUKTUR", label: "Infrastruktur & PJU", icon: Wrench },
                      { id: "KEBERSIHAN", label: "Sampah & Drainase", icon: Trash2 },
                      { id: "KEAMANAN", label: "Keamanan & Ronda", icon: Shield },
                      { id: "KETERTIBAN", label: "Ketertiban & Parkir", icon: Lightbulb },
                    ].map((item) => {
                      const Icon = item.icon;
                      const isSelected = category === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setCategory(item.id as ComplaintCategory)}
                          className={`p-3 sm:p-4 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all text-center ${
                            isSelected
                              ? "border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-600/20"
                              : "border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <Icon className="w-5 h-5 shrink-0" />
                          <span className="leading-tight">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Judul & Lokasi */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Judul Laporan Singkat <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Lampu PJU Mati di Depan Blok A1"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Lokasi Kejadian <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Depan Blok A1/10 dekat gardu"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                {/* Deskripsi */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Keterangan Rinci Permasalahan <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Jelaskan kendala secara detail, sejak kapan terjadi, dan dampak bagi warga..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                {/* Pelapor & Opsi Mode Anonim */}
                <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-slate-800">Mode Privasi (Lapor Anonim)</p>
                        <p className="text-[11px] text-slate-500">Nama Anda akan dirahasiakan dari publik</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  {!isAnonymous && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Nama Anda
                        </label>
                        <input
                          type="text"
                          placeholder="Nama Lengkap"
                          value={reporterName}
                          onChange={(e) => setReporterName(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          No. WhatsApp
                        </label>
                        <input
                          type="tel"
                          placeholder="0812xxxx"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Asal Wilayah RT
                        </label>
                        <select
                          value={rtNumber}
                          onChange={(e) => setRtNumber(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                        >
                          {rts.map((rt) => (
                            <option key={rt.id} value={rt.rtNumber}>
                              RT {rt.rtNumber}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Kirim Laporan Pengaduan</span>
                  </button>
                </div>

              </form>
            </div>

            {/* Panduan & Komitmen Tindak Lanjut */}
            <div className="lg:col-span-4 space-y-5">
              <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-lg space-y-4">
                <h3 className="font-extrabold text-base sm:text-lg text-white">
                  Standar Pelayanan Pengaduan RW
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Setiap aduan yang masuk otomatis tercatat di dashboard petugas dan pengurus lingkungan.
                </p>
                <div className="space-y-2.5 pt-1 text-xs">
                  <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                    <p className="font-bold text-emerald-400">Penerangan Jalan (PJU)</p>
                    <p className="text-slate-400 text-[11px]">Maksimal 1x24 jam perbaikan bohlam/kabel</p>
                  </div>
                  <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                    <p className="font-bold text-emerald-400">Kebersihan & Sampah Liar</p>
                    <p className="text-slate-400 text-[11px]">Diangkut pada jadwal truk kebersihan berikutnya</p>
                  </div>
                  <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                    <p className="font-bold text-emerald-400">Keamanan & Ketertiban</p>
                    <p className="text-slate-400 text-[11px]">Respon langsung regu Satpam & Siskamling</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Notifikasi Lapor Sukses */}
        {submittedComplaint && (
          <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-xl text-center space-y-5 animate-in zoom-in-95">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
                Laporan Berhasil Diterima
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 font-mono">
                {submittedComplaint.ticketNumber}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Laporan &ldquo;{submittedComplaint.title}&rdquo; telah diteruskan ke Seksi terkait untuk ditinjau dan ditindaklanjuti.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab("daftar")}
                className="w-full sm:w-auto px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow"
              >
                Lihat Papan Aduan
              </button>
              <button
                type="button"
                onClick={() => setSubmittedComplaint(null)}
                className="w-full sm:w-auto px-5 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold text-xs"
              >
                Buat Laporan Lainnya
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Daftar Laporan & Tracking */}
        {activeTab === "daftar" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Papan Transparansi Penanganan Aduan Warga
              </h2>
              <span className="text-xs text-slate-500 font-semibold">
                Total {complaints.length} Laporan Tercatat
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {complaints.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono font-bold text-slate-400">
                        {item.ticketNumber}
                      </span>
                      {getStatusBadge(item.status)}
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      {getCategoryIcon(item.category)}
                      <span>{item.category}</span>
                      <span>•</span>
                      <span>RT {item.rtNumber}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  </div>

                  {/* Resolution Note if any */}
                  {item.resolutionNotes && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <span className="font-bold text-emerald-700 block text-[11px]">
                        Tindak Lanjut Pengurus:
                      </span>
                      <p className="text-slate-600 text-xs leading-relaxed">{item.resolutionNotes}</p>
                      {item.assignedTo && (
                        <p className="text-[10px] text-slate-400 pt-0.5">
                          Petugas: {item.assignedTo}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Pelapor: <strong className="text-slate-600">{item.reporterName}</strong></span>
                    <span>{formatDate(item.submittedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
