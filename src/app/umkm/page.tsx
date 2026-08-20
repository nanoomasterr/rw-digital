"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useApp } from "@/lib/store";
import { UMKMItem } from "@/types";
import {
  ShoppingBag,
  Search,
  Star,
  MessageCircle,
  PlusCircle,
  Store,
  CheckCircle2,
} from "lucide-react";

export default function UMKMPage() {
  const { umkms, addUMKM, rts, rw } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Form State
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [category, setCategory] = useState<UMKMItem["category"]>("KULINER");
  const [description, setDescription] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [rtNumber, setRtNumber] = useState("001");
  const [address, setAddress] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [addSuccess, setAddSuccess] = useState(false);

  const categories = [
    { id: "ALL", label: "Semua Kategori" },
    { id: "KULINER", label: "Kuliner & Makanan" },
    { id: "SEMBAKO", label: "Sembako & Toko" },
    { id: "JASA", label: "Jasa & Servis" },
    { id: "FASHION", label: "Fashion & Busana" },
    { id: "KERAJINAN", label: "Kerajinan Tangan" },
  ];

  const filteredUMKMs = umkms.filter((item) => {
    const matchCategory =
      selectedCategory === "ALL" || item.category === selectedCategory;
    const matchQuery =
      item.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchQuery;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !ownerName || !whatsappNumber) {
      alert("Mohon lengkapi nama usaha, nama pemilik, dan nomor WhatsApp!");
      return;
    }

    addUMKM({
      businessName,
      ownerName,
      category,
      description: description || `Produk berkualitas karya warga ${rw.name}.`,
      priceRange: priceRange || "Harga Bersahabat",
      whatsappNumber: whatsappNumber.replace(/^0/, "62"),
      rtNumber,
      address: address || `RT ${rtNumber} ${rw.name}`,
      imageUrl:
        imageUrl ||
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80",
      rating: 5.0,
      isOpen: true,
    });

    setAddSuccess(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Header Banner */}
      <div className="bg-slate-900 text-white py-12 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800">
                Pemberdayaan Ekonomi Lokal
              </span>
              <h1 className="text-3xl font-black tracking-tight mt-2 text-white">
                Direktori Pasar & UMKM Warga {rw.name}
              </h1>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                Temukan aneka kuliner, toko sembako, dan jasa profesional dari tetangga sendiri. Dukung usaha warga sekitar!
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setAddSuccess(false);
                setAddModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all self-start md:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Daftarkan Usaha Saya</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Search & Categories Filter */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8 space-y-6">
          <div className="relative w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Cari katering, laundry, servis AC, sembako, atau nama pemilik..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat.id
                    ? "bg-slate-900 text-white shadow"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* UMKM Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUMKMs.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.businessName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur text-emerald-400 font-bold text-[10px] uppercase px-2.5 py-1 rounded-full">
                    {item.category}
                  </div>
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur text-slate-800 font-bold text-xs px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{item.rating || 5.0}</span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Pemilik: {item.ownerName}</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      RT {item.rtNumber}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-emerald-700 transition-colors">
                    {item.businessName}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <p className="text-xs font-black text-emerald-700 pt-1">
                    {item.priceRange}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <a
                  href={`https://wa.me/${item.whatsappNumber}?text=Halo%20${encodeURIComponent(item.businessName)},%20saya%20warga%20RW%2005%20ingin%20tanya%20produk%20Anda`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Pesan via WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>

      </main>

      {/* Modal Daftar UMKM Baru */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Daftarkan Usaha / Produk Warga
                </h3>
                <p className="text-xs text-slate-500">
                  Produk Anda akan tampil di direktori UMKM {rw.name} dan dapat dihubungi warga lain.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            {addSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-black text-slate-900">
                  Usaha Berhasil Terdaftar!
                </h4>
                <p className="text-xs text-slate-600">
                  Produk <strong>{businessName}</strong> kini sudah tayang di etalase pasar digital warga {rw.name}.
                </p>
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-xs shadow mt-4"
                >
                  Selesai
                </button>
              </div>
            ) : (
              <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nama Usaha / Toko / Jasa <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Dapur Bu Siti / Servis AC Barokah"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Nama Pemilik Usaha <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nama Lengkap"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Kategori Usaha <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as UMKMItem["category"])}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      <option value="KULINER">Kuliner & Makanan</option>
                      <option value="SEMBAKO">Sembako & Toko</option>
                      <option value="JASA">Jasa & Servis</option>
                      <option value="FASHION">Fashion & Pakaian</option>
                      <option value="KERAJINAN">Kerajinan Tangan</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Nomor WhatsApp Penjual <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0812xxxx"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Wilayah RT <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={rtNumber}
                      onChange={(e) => setRtNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      {rts.map((rt) => (
                        <option key={rt.id} value={rt.rtNumber}>
                          RT {rt.rtNumber}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Estimasi Rentang Harga
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Rp 15.000 - Rp 35.000 / porsi"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Deskripsi Singkat Produk / Jasa
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Jelaskan keunggulan produk Anda, menu andalan, dll..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setAddModalOpen(false)}
                    className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold text-xs"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold text-xs shadow"
                  >
                    Daftarkan Produk
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
