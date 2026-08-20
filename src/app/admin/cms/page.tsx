"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store";
import { Article, UMKMItem, FacilityBooking } from "@/types";
import {
  Store,
  FileText,
  CalendarDays,
  PlusCircle,
  CheckCircle2,
  XCircle,
  Tag,
  Calendar,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminCMSPage() {
  const {
    articles,
    addArticle,
    umkms,
    facilityBookings,
    updateBookingStatus,
    rts,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"berita" | "umkm" | "booking">("berita");

  // Article Form State
  const [artModalOpen, setArtModalOpen] = useState(false);
  const [artTitle, setArtTitle] = useState("");
  const [artCategory, setArtCategory] = useState<Article["category"]>("KEGIATAN");
  const [artExcerpt, setArtExcerpt] = useState("");
  const [artContent, setArtContent] = useState("");
  const [artAuthor, setArtAuthor] = useState("Sekretariat RW 14 Padasuka");
  const [artImage, setArtImage] = useState("");
  const [artImportant, setArtImportant] = useState(false);

  const handleAddArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!artTitle || !artExcerpt || !artContent) {
      alert("Mohon lengkapi judul, ringkasan, dan konten berita!");
      return;
    }

    addArticle({
      title: artTitle,
      category: artCategory,
      excerpt: artExcerpt,
      content: artContent,
      author: artAuthor || "Sekretariat RW 14",
      coverImageUrl:
        artImage ||
        "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&auto=format&fit=crop&q=80",
      tags: ["Kegiatan", "RW 14", "Padasuka"],
      isImportant: artImportant,
    });

    setArtModalOpen(false);
    setArtTitle("");
    setArtExcerpt("");
    setArtContent("");
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            CMS Berita, UMKM & Fasilitas RW
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola konten pengumuman kegiatan warga, direktori usaha UMKM, dan persetujuan jadwal balai warga.
          </p>
        </div>

        {activeTab === "berita" && (
          <button
            type="button"
            onClick={() => setArtModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tulis Berita / Pengumuman</span>
          </button>
        )}
      </div>

      {/* Control Tabs */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-wrap bg-slate-100 p-1 rounded-xl w-fit gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("berita")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "berita"
                ? "bg-white text-slate-900 shadow"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>Berita & Pengumuman ({articles.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("umkm")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "umkm"
                ? "bg-white text-slate-900 shadow"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Store className="w-4 h-4 text-amber-600" />
            <span>Katalog UMKM Warga ({umkms.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("booking")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "booking"
                ? "bg-white text-slate-900 shadow"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <CalendarDays className="w-4 h-4 text-blue-600" />
            <span>Booking Fasilitas Balai ({facilityBookings.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Articles CMS */}
      {activeTab === "berita" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((art) => (
            <div
              key={art.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={art.coverImageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 text-emerald-400 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full backdrop-blur">
                    {art.category}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(art.publishedAt)}</span>
                    <span>•</span>
                    <span>{art.author}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {art.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="text-[11px] font-bold text-emerald-700">● Publikasi Aktif</span>
                <span>ID: {art.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: UMKM Directory */}
      {activeTab === "umkm" && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Nama Usaha / Toko</th>
                  <th className="px-6 py-3.5">Pemilik Usaha</th>
                  <th className="px-6 py-3.5">Kategori</th>
                  <th className="px-6 py-3.5">Wilayah RT</th>
                  <th className="px-6 py-3.5">WhatsApp Penjual</th>
                  <th className="px-6 py-3.5">Rentang Harga</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {umkms.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70">
                    <td className="px-6 py-3.5 font-bold text-slate-900">
                      {item.businessName}
                    </td>
                    <td className="px-6 py-3.5 text-slate-700">{item.ownerName}</td>
                    <td className="px-6 py-3.5">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-emerald-700">
                      RT {item.rtNumber}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-slate-600">
                      +{item.whatsappNumber}
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-slate-900">
                      {item.priceRange}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Facility Bookings */}
      {activeTab === "booking" && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Mobile Card Feed (< md) */}
          <div className="block md:hidden divide-y divide-slate-100">
            {facilityBookings.map((bk) => (
              <div key={bk.id} className="p-4 space-y-3 hover:bg-slate-50/70 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{bk.facilityName}</h4>
                    <p className="text-xs text-slate-600 font-semibold mt-0.5">
                      {bk.applicantName} <span className="text-slate-400 font-normal">(RT {bk.rtNumber})</span>
                    </p>
                  </div>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      bk.status === "DISETUJUI"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : bk.status === "DITOLAK"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {bk.status}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <p>Waktu: <strong className="text-slate-800">{bk.startDate}</strong></p>
                  <p>Keperluan: <strong className="text-slate-800">{bk.purpose}</strong></p>
                  <p className="font-mono text-[11px] text-slate-400">Telp: {bk.phone}</p>
                </div>

                {bk.status === "PENDING" && (
                  <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => updateBookingStatus(bk.id, "DITOLAK")}
                      className="py-2 bg-rose-50 text-rose-700 font-semibold rounded-xl text-xs"
                    >
                      Tolak
                    </button>
                    <button
                      type="button"
                      onClick={() => updateBookingStatus(bk.id, "DISETUJUI")}
                      className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow"
                    >
                      Setujui
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Table (>= md) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Fasilitas</th>
                  <th className="px-6 py-3.5">Pemohon</th>
                  <th className="px-6 py-3.5">Waktu Penggunaan</th>
                  <th className="px-6 py-3.5">Keperluan Acara</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {facilityBookings.map((bk) => (
                  <tr key={bk.id} className="hover:bg-slate-50/70">
                    <td className="px-6 py-3.5 font-bold text-slate-900">
                      {bk.facilityName}
                    </td>
                    <td className="px-6 py-3.5">
                      <p className="font-semibold text-slate-800">{bk.applicantName}</p>
                      <p className="text-[11px] text-slate-400">RT {bk.rtNumber} • {bk.phone}</p>
                    </td>
                    <td className="px-6 py-3.5 text-slate-600 font-medium whitespace-nowrap">
                      {bk.startDate}
                    </td>
                    <td className="px-6 py-3.5 text-slate-600 max-w-xs">{bk.purpose}</td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          bk.status === "DISETUJUI"
                            ? "bg-emerald-50 text-emerald-700"
                            : bk.status === "DITOLAK"
                            ? "bg-rose-50 text-rose-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {bk.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right space-x-1.5">
                      {bk.status === "PENDING" && (
                        <>
                          <button
                            type="button"
                            onClick={() => updateBookingStatus(bk.id, "DISETUJUI")}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                          >
                            Setujui
                          </button>
                          <button
                            type="button"
                            onClick={() => updateBookingStatus(bk.id, "DITOLAK")}
                            className="px-2.5 py-1 bg-rose-50 text-rose-700 rounded-lg text-xs font-semibold"
                          >
                            Tolak
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Tulis Berita Baru */}
      {artModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm overflow-y-auto p-4 flex justify-center items-start">
          <div
            className="fixed inset-0 cursor-pointer"
            onClick={() => setArtModalOpen(false)}
            aria-label="Tutup Modal"
          />
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 space-y-4 my-8 z-10">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                Tulis Berita / Pengumuman RW Baru
              </h3>
              <button
                type="button"
                onClick={() => setArtModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-slate-500 font-bold flex items-center justify-center transition-colors text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddArticle} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Artikel / Pengumuman</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kerja Bakti Massal Menyambut HUT RI"
                  value={artTitle}
                  onChange={(e) => setArtTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={artCategory}
                    onChange={(e) => setArtCategory(e.target.value as Article["category"])}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option value="KEGIATAN">Kegiatan Warga</option>
                    <option value="PENGUMUMAN">Pengumuman Resmi</option>
                    <option value="KESEHATAN">Kesehatan & Posyandu</option>
                    <option value="BERITA">Berita Lingkungan</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Penulis / Redaksi</label>
                  <input
                    type="text"
                    value={artAuthor}
                    onChange={(e) => setArtAuthor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ringkasan Singkat (Excerpt)</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ringkasan 1-2 kalimat..."
                  value={artExcerpt}
                  onChange={(e) => setArtExcerpt(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Isi Lengkap Pengumuman</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tulis rincian jadwal, lokasi, instruksi untuk warga..."
                  value={artContent}
                  onChange={(e) => setArtContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setArtModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow"
                >
                  Publikasikan Berita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
