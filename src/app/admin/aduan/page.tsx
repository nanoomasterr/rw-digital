"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store";
import { Complaint, ComplaintStatus } from "@/types";
import {
  AlertCircle,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Shield,
  Trash2,
  Wrench,
  Lightbulb,
  Send,
  UserCheck,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminAduanPage() {
  const { complaints, updateComplaintStatus, currentRole } = useApp();
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal Update Status
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);
  const [newStatus, setNewStatus] = useState<ComplaintStatus>("DIPROSES");
  const [assignedTo, setAssignedTo] = useState("Seksi Keamanan & Ketertiban");
  const [resolutionNotes, setResolutionNotes] = useState("");

  const filteredComplaints = complaints.filter((c) => {
    const matchStatus = selectedStatus === "ALL" || c.status === selectedStatus;
    const matchQuery =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchQuery;
  });

  const handleOpenUpdate = (cmp: Complaint) => {
    setActiveComplaint(cmp);
    setNewStatus(cmp.status === "TERKIRIM" ? "DIPROSES" : "SELESAI");
    setAssignedTo(cmp.assignedTo || "Seksi Lingkungan Hidup");
    setResolutionNotes(cmp.resolutionNotes || "");
    setUpdateModalOpen(true);
  };

  const handleSaveUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeComplaint) return;

    updateComplaintStatus(
      activeComplaint.id,
      newStatus,
      assignedTo,
      resolutionNotes
    );

    setUpdateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Helpdesk & Penanganan Aduan Warga
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola laporan kerusakan fasilitas umum, lampu jalan, sampah liar, dan ketertiban lingkungan.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Total Aduan: <strong>{complaints.length} Tiket</strong></span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "ALL", label: "Semua Laporan" },
            { id: "TERKIRIM", label: "1. Baru Terkirim" },
            { id: "DIPROSES", label: "2. Sedang Diproses" },
            { id: "SELESAI", label: "3. Selesai Ditangani" },
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
            placeholder="Cari Nomor Tiket (ADU-...), Judul, Lokasi, atau Rincian Masalah..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>

      {/* Complaints Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredComplaints.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-slate-400">
                  {item.ticketNumber}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    item.status === "SELESAI"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : item.status === "DIPROSES"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {item.status.replace("_", " ")}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <span>{item.category}</span>
                <span>•</span>
                <span>RT {item.rtNumber}</span>
              </div>

              <h3 className="font-extrabold text-slate-900 text-base leading-snug">
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
                <span className="font-bold text-emerald-700 block">
                  Tindak Lanjut Pengurus:
                </span>
                <p className="text-slate-600">{item.resolutionNotes}</p>
                {item.assignedTo && (
                  <p className="text-[10px] text-slate-400">
                    Petugas: {item.assignedTo}
                  </p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                {formatDate(item.submittedAt)}
              </span>

              <button
                type="button"
                onClick={() => handleOpenUpdate(item)}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow"
              >
                Update Penanganan
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Update Status Aduan */}
      {updateModalOpen && activeComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm overflow-y-auto p-4 flex justify-center items-start">
          <div
            className="fixed inset-0 cursor-pointer"
            onClick={() => setUpdateModalOpen(false)}
            aria-label="Tutup Modal"
          />
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 space-y-4 my-8 z-10">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Update Tindak Lanjut Aduan
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {activeComplaint.ticketNumber}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setUpdateModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-slate-500 font-bold flex items-center justify-center transition-colors text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUpdate} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Status Penanganan</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-bold text-slate-800"
                >
                  <option value="DIPROSES">Sedang Diproses / Dikerjakan</option>
                  <option value="SELESAI">Selesai Ditangani (Tuntas)</option>
                  <option value="DITOLAK">Ditolak / Tidak Relevan</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Petugas / Seksi Penanggung Jawab</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Seksi Lingkungan Hidup / Regu Satpam"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Catatan Tindak Lanjut</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Contoh: Bohlam lampu LED 50W telah diganti baru oleh teknisi..."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setUpdateModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow"
                >
                  Simpan Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
