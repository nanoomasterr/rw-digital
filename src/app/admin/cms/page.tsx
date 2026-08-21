"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/lib/store";
import { Article, UMKMItem, Facility, FacilityBooking } from "@/types";
import {
  Store,
  FileText,
  CalendarDays,
  Building,
  PlusCircle,
  Pencil,
  Trash2,
  Image as ImageIcon,
  Upload,
  CheckCircle2,
  MapPin,
  Users,
  Phone,
  Calendar,
  Search,
} from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";

export default function AdminCMSPage() {
  const {
    articles,
    addArticle,
    updateArticle,
    deleteArticle,
    umkms,
    addUMKM,
    updateUMKM,
    deleteUMKM,
    facilities,
    addFacility,
    updateFacility,
    deleteFacility,
    facilityBookings,
    updateBookingStatus,
    rts,
    currentRole,
    activeRTId,
    rw,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"berita" | "umkm" | "fasilitas" | "booking">("berita");
  const [searchQuery, setSearchQuery] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  const isRW = currentRole === "KETUA_RW";
  const isRT = currentRole === "KETUA_RT";
  const currentRTUnit = rts.find((r) => r.id === activeRTId) || rts[0];

  // Helper notice
  const showToast = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 4000);
  };

  // Helper file upload to base64
  const handleImageFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar terlalu besar! Maksimal 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setter(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // -------------------------------------------------------------
  // 1. STATE ARTICLE (BERITA)
  // -------------------------------------------------------------
  const [artModalOpen, setArtModalOpen] = useState(false);
  const [editArtModalOpen, setEditArtModalOpen] = useState(false);
  const [editArtId, setEditArtId] = useState("");

  const [artTitle, setArtTitle] = useState("");
  const [artCategory, setArtCategory] = useState<Article["category"]>("KEGIATAN");
  const [artExcerpt, setArtExcerpt] = useState("");
  const [artContent, setArtContent] = useState("");
  const [artAuthor, setArtAuthor] = useState(`Sekretariat ${rw.name || "RW 14"}`);
  const [artImage, setArtImage] = useState("");
  const [artImportant, setArtImportant] = useState(false);

  const resetArtForm = () => {
    setArtTitle("");
    setArtCategory("KEGIATAN");
    setArtExcerpt("");
    setArtContent("");
    setArtAuthor(`Sekretariat ${rw.name || "RW 14"}`);
    setArtImage("");
    setArtImportant(false);
    setEditArtId("");
  };

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
      author: artAuthor || `Sekretariat ${rw.name || "RW 14"}`,
      coverImageUrl:
        artImage ||
        "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&auto=format&fit=crop&q=80",
      tags: [artCategory, rw.name || "RW 14", "Padasuka"],
      isImportant: artImportant,
    });

    setArtModalOpen(false);
    resetArtForm();
    showToast(`Berita "${artTitle}" berhasil dipublikasikan.`);
  };

  const handleOpenEditArticle = (art: Article) => {
    setEditArtId(art.id);
    setArtTitle(art.title);
    setArtCategory(art.category);
    setArtExcerpt(art.excerpt);
    setArtContent(art.content);
    setArtAuthor(art.author);
    setArtImage(art.coverImageUrl);
    setArtImportant(Boolean(art.isImportant));
    setEditArtModalOpen(true);
  };

  const handleSaveEditArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editArtId || !artTitle || !artExcerpt || !artContent) {
      alert("Mohon lengkapi judul, ringkasan, dan konten berita!");
      return;
    }

    updateArticle(editArtId, {
      title: artTitle,
      category: artCategory,
      excerpt: artExcerpt,
      content: artContent,
      author: artAuthor,
      coverImageUrl:
        artImage ||
        "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&auto=format&fit=crop&q=80",
      isImportant: artImportant,
    });

    setEditArtModalOpen(false);
    resetArtForm();
    showToast(`Berita "${artTitle}" berhasil diperbarui.`);
  };

  const handleDeleteArticle = (id: string, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus artikel "${title}"?`)) {
      deleteArticle(id);
      showToast(`Artikel "${title}" berhasil dihapus.`);
    }
  };

  // -------------------------------------------------------------
  // 2. STATE UMKM
  // -------------------------------------------------------------
  const [umkmModalOpen, setUmkmModalOpen] = useState(false);
  const [editUmkmModalOpen, setEditUmkmModalOpen] = useState(false);
  const [editUmkmId, setEditUmkmId] = useState("");

  const [umkmName, setUmkmName] = useState("");
  const [umkmOwner, setUmkmOwner] = useState("");
  const [umkmCategory, setUmkmCategory] = useState<UMKMItem["category"]>("KULINER");
  const [umkmRtNumber, setUmkmRtNumber] = useState(currentRTUnit.rtNumber || "001");
  const [umkmPhone, setUmkmPhone] = useState("");
  const [umkmPrice, setUmkmPrice] = useState("");
  const [umkmAddress, setUmkmAddress] = useState("");
  const [umkmDescription, setUmkmDescription] = useState("");
  const [umkmImage, setUmkmImage] = useState("");

  const resetUmkmForm = () => {
    setUmkmName("");
    setUmkmOwner("");
    setUmkmCategory("KULINER");
    setUmkmRtNumber(isRT ? currentRTUnit.rtNumber : "001");
    setUmkmPhone("");
    setUmkmPrice("");
    setUmkmAddress("");
    setUmkmDescription("");
    setUmkmImage("");
    setEditUmkmId("");
  };

  const handleAddUMKM = (e: React.FormEvent) => {
    e.preventDefault();
    if (!umkmName || !umkmOwner || !umkmPhone) {
      alert("Mohon isi Nama Usaha, Nama Pemilik, dan Nomor WhatsApp!");
      return;
    }

    addUMKM({
      businessName: umkmName,
      ownerName: umkmOwner,
      category: umkmCategory,
      rtNumber: isRT ? currentRTUnit.rtNumber : umkmRtNumber,
      whatsappNumber: umkmPhone.replace(/[^0-9]/g, ""),
      priceRange: umkmPrice || "Rp 10.000 - Rp 50.000",
      address: umkmAddress || `Jl. Mawar No. 12, RT ${isRT ? currentRTUnit.rtNumber : umkmRtNumber}`,
      description: umkmDescription || "Usaha warga lingkungan RW 14 Padasuka.",
      imageUrl:
        umkmImage ||
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
      rating: 4.8,
      isOpen: true,
      isVerified: true,
    });

    setUmkmModalOpen(false);
    resetUmkmForm();
    showToast(`UMKM "${umkmName}" berhasil ditambahkan ke katalog.`);
  };

  const handleOpenEditUMKM = (item: UMKMItem) => {
    setEditUmkmId(item.id);
    setUmkmName(item.businessName);
    setUmkmOwner(item.ownerName);
    setUmkmCategory(item.category);
    setUmkmRtNumber(item.rtNumber);
    setUmkmPhone(item.whatsappNumber);
    setUmkmPrice(item.priceRange);
    setUmkmAddress(item.address);
    setUmkmDescription(item.description);
    setUmkmImage(item.imageUrl);
    setEditUmkmModalOpen(true);
  };

  const handleSaveEditUMKM = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUmkmId || !umkmName || !umkmOwner || !umkmPhone) {
      alert("Mohon isi Nama Usaha, Nama Pemilik, dan Nomor WhatsApp!");
      return;
    }

    updateUMKM(editUmkmId, {
      businessName: umkmName,
      ownerName: umkmOwner,
      category: umkmCategory,
      rtNumber: isRT ? currentRTUnit.rtNumber : umkmRtNumber,
      whatsappNumber: umkmPhone.replace(/[^0-9]/g, ""),
      priceRange: umkmPrice,
      address: umkmAddress,
      description: umkmDescription,
      imageUrl:
        umkmImage ||
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
    });

    setEditUmkmModalOpen(false);
    resetUmkmForm();
    showToast(`Data UMKM "${umkmName}" berhasil diperbarui.`);
  };

  const handleDeleteUMKM = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data UMKM "${name}"?`)) {
      deleteUMKM(id);
      showToast(`UMKM "${name}" berhasil dihapus.`);
    }
  };

  // -------------------------------------------------------------
  // 3. STATE FASILITAS (FACILITY)
  // -------------------------------------------------------------
  const [facModalOpen, setFacModalOpen] = useState(false);
  const [editFacModalOpen, setEditFacModalOpen] = useState(false);
  const [editFacId, setEditFacId] = useState("");

  const [facName, setFacName] = useState("");
  const [facCategory, setFacCategory] = useState("Gedung Pertemuan");
  const [facCapacity, setFacCapacity] = useState("100 Orang");
  const [facRentalFee, setFacRentalFee] = useState<number>(0);
  const [facLocation, setFacLocation] = useState("Kompleks Balai Warga RW 14");
  const [facDescription, setFacDescription] = useState("");
  const [facIncluded, setFacIncluded] = useState("100 Kursi Lipat, Sound System, Kipas Angin, Toilet");
  const [facImage, setFacImage] = useState("");

  const resetFacForm = () => {
    setFacName("");
    setFacCategory("Gedung Pertemuan");
    setFacCapacity("100 Orang");
    setFacRentalFee(0);
    setFacLocation("Kompleks Balai Warga RW 14");
    setFacDescription("");
    setFacIncluded("100 Kursi Lipat, Sound System, Kipas Angin, Toilet");
    setFacImage("");
    setEditFacId("");
  };

  const handleAddFacility = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facName || !facLocation) {
      alert("Mohon lengkapi nama fasilitas dan lokasi!");
      return;
    }

    addFacility({
      name: facName,
      category: facCategory,
      capacity: facCapacity,
      rentalFee: Number(facRentalFee) || 0,
      location: facLocation,
      description: facDescription || "Fasilitas umum bersama warga RW 14 Padasuka.",
      facilitiesIncluded: facIncluded
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      imageUrl:
        facImage ||
        "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop&q=80",
      isAvailable: true,
    });

    setFacModalOpen(false);
    resetFacForm();
    showToast(`Fasilitas "${facName}" berhasil ditambahkan.`);
  };

  const handleOpenEditFacility = (fac: Facility) => {
    setEditFacId(fac.id);
    setFacName(fac.name);
    setFacCategory(fac.category);
    setFacCapacity(fac.capacity || "100 Orang");
    setFacRentalFee(fac.rentalFee || 0);
    setFacLocation(fac.location);
    setFacDescription(fac.description);
    setFacIncluded((fac.facilitiesIncluded || []).join(", "));
    setFacImage(fac.imageUrl);
    setEditFacModalOpen(true);
  };

  const handleSaveEditFacility = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFacId || !facName || !facLocation) {
      alert("Mohon lengkapi nama fasilitas dan lokasi!");
      return;
    }

    updateFacility(editFacId, {
      name: facName,
      category: facCategory,
      capacity: facCapacity,
      rentalFee: Number(facRentalFee) || 0,
      location: facLocation,
      description: facDescription,
      facilitiesIncluded: facIncluded
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      imageUrl:
        facImage ||
        "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop&q=80",
    });

    setEditFacModalOpen(false);
    resetFacForm();
    showToast(`Data Fasilitas "${facName}" berhasil diperbarui.`);
  };

  const handleDeleteFacility = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus fasilitas "${name}"? Seluruh riwayat booking terkait fasilitas ini juga akan terhapus.`)) {
      deleteFacility(id);
      showToast(`Fasilitas "${name}" berhasil dihapus.`);
    }
  };

  // Keyboard shortcut Esc to close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setArtModalOpen(false);
        setEditArtModalOpen(false);
        setUmkmModalOpen(false);
        setEditUmkmModalOpen(false);
        setFacModalOpen(false);
        setEditFacModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filtered queries
  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUMKMs = umkms.filter((u) => {
    const matchQuery =
      u.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchQuery;
  });

  const filteredFacilities = facilities.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Toast Notice */}
      {notice && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs font-semibold">{notice}</p>
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="text-slate-400 hover:text-white ml-2 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              CMS Publikasi RW 14
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {isRW ? "Hak Penuh RW (Superadmin)" : isRT ? `Hak RT (${currentRTUnit.headName})` : "Monitoring"}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            CMS Berita, UMKM & Fasilitas RW
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola artikel pengumuman warga, katalog usaha UMKM lokal, fasilitas umum RW, dan verifikasi izin booking balai.
          </p>
        </div>

        {/* Action Button for Active Tab */}
        <div className="flex items-center gap-2">
          {activeTab === "berita" && (
            <button
              type="button"
              onClick={() => {
                resetArtForm();
                setArtModalOpen(true);
              }}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Tulis Berita / Pengumuman</span>
            </button>
          )}

          {activeTab === "umkm" && (
            <button
              type="button"
              onClick={() => {
                resetUmkmForm();
                setUmkmModalOpen(true);
              }}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Tambah UMKM Warga</span>
            </button>
          )}

          {activeTab === "fasilitas" && (
            <button
              type="button"
              onClick={() => {
                resetFacForm();
                setFacModalOpen(true);
              }}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Tambah Fasilitas RW</span>
            </button>
          )}
        </div>
      </div>

      {/* Control Tabs & Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap bg-slate-100 p-1 rounded-2xl gap-1">
            <button
              type="button"
              onClick={() => setActiveTab("berita")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
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
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
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
              onClick={() => setActiveTab("fasilitas")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "fasilitas"
                  ? "bg-white text-slate-900 shadow"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Building className="w-4 h-4 text-blue-600" />
              <span>Fasilitas RW ({facilities.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("booking")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "booking"
                  ? "bg-white text-slate-900 shadow"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <CalendarDays className="w-4 h-4 text-purple-600" />
              <span>Jadwal Booking ({facilityBookings.length})</span>
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Cari konten di tab ini..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: ARTICLES (BERITA & PENGUMUMAN)                      */}
      {/* ========================================================= */}
      {activeTab === "berita" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((art) => (
            <div
              key={art.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={art.coverImageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 text-emerald-400 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full backdrop-blur">
                    {art.category}
                  </div>
                  {art.isImportant && (
                    <div className="absolute top-3 right-3 bg-rose-600 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-full shadow">
                      Penting
                    </div>
                  )}
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

              <div className="p-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-700">● Publikasi Aktif</span>
                
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEditArticle(art)}
                    className="p-1.5 bg-slate-100 hover:bg-emerald-100 hover:text-emerald-700 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="Edit Berita"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteArticle(art.id, art.title)}
                    className="p-1.5 bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="Hapus Berita"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Hapus</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredArticles.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs">
              Tidak ada berita atau pengumuman yang sesuai kata kunci pencarian.
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: UMKM DIRECTORY                                     */}
      {/* ========================================================= */}
      {activeTab === "umkm" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUMKMs.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.businessName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow">
                    {item.category}
                  </div>
                  <div className="absolute top-3 right-3 bg-slate-900/80 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur">
                    RT {item.rtNumber}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-slate-900 text-sm leading-snug">
                      {item.businessName}
                    </h3>
                    <span className="text-xs font-bold text-emerald-700">{item.priceRange}</span>
                  </div>

                  <p className="text-[11px] text-slate-500 font-semibold">
                    Pemilik: <span className="text-slate-800">{item.ownerName}</span>
                  </p>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="pt-2 text-[11px] text-slate-500 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{item.address}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>+{item.whatsappNumber}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-700">● Terverifikasi RW</span>
                
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEditUMKM(item)}
                    className="p-1.5 bg-slate-100 hover:bg-amber-100 hover:text-amber-800 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="Edit UMKM"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteUMKM(item.id, item.businessName)}
                    className="p-1.5 bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="Hapus UMKM"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Hapus</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredUMKMs.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs">
              Tidak ada data UMKM yang sesuai kata kunci pencarian.
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: FASILITAS RW                                       */}
      {/* ========================================================= */}
      {activeTab === "fasilitas" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFacilities.map((fac) => (
            <div
              key={fac.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={fac.imageUrl}
                    alt={fac.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-full shadow">
                    {fac.category}
                  </div>
                  <div className="absolute top-3 right-3 bg-slate-900/80 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur">
                    {fac.rentalFee === 0 ? "Gratis Warga" : `${formatCurrency(fac.rentalFee)} / Acara`}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-slate-900 text-sm leading-snug">
                      {fac.name}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {fac.description}
                  </p>

                  <div className="pt-2 text-[11px] text-slate-500 space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate font-medium">{fac.location}</span>
                    </div>
                    {fac.capacity && (
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Kapasitas: {fac.capacity}</span>
                      </div>
                    )}

                    {fac.facilitiesIncluded && fac.facilitiesIncluded.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {fac.facilitiesIncluded.slice(0, 3).map((inc, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-medium"
                          >
                            ✓ {inc}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-700">● Status: Tersedia</span>
                
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEditFacility(fac)}
                    className="p-1.5 bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="Edit Fasilitas"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteFacility(fac.id, fac.name)}
                    className="p-1.5 bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="Hapus Fasilitas"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Hapus</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredFacilities.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs">
              Tidak ada fasilitas yang sesuai kata kunci pencarian.
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: FACILITY BOOKINGS                                  */}
      {/* ========================================================= */}
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
                      onClick={() => {
                        updateBookingStatus(bk.id, "DITOLAK");
                        showToast(`Izin booking untuk ${bk.applicantName} telah ditolak.`);
                      }}
                      className="py-2 bg-rose-50 text-rose-700 font-semibold rounded-xl text-xs"
                    >
                      Tolak
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateBookingStatus(bk.id, "DISETUJUI");
                        showToast(`Izin booking untuk ${bk.applicantName} disetujui.`);
                      }}
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
                            onClick={() => {
                              updateBookingStatus(bk.id, "DISETUJUI");
                              showToast(`Izin booking untuk ${bk.applicantName} disetujui.`);
                            }}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                          >
                            Setujui
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              updateBookingStatus(bk.id, "DITOLAK");
                              showToast(`Izin booking untuk ${bk.applicantName} ditolak.`);
                            }}
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

      {/* ========================================================= */}
      {/* MODAL 1: TAMBAH BERITA                                    */}
      {/* ========================================================= */}
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
                Tulis Berita / Pengumuman Baru
              </h3>
              <button
                type="button"
                onClick={() => setArtModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-slate-500 font-bold flex items-center justify-center transition-colors text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddArticle} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Artikel / Pengumuman</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kerja Bakti Massal Menyambut HUT RI"
                  value={artTitle}
                  onChange={(e) => setArtTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={artCategory}
                    onChange={(e) => setArtCategory(e.target.value as Article["category"])}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
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

              {/* Upload Foto Berita */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="block font-bold text-slate-700 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  <span>Foto Sampul Berita (Upload atau URL)</span>
                </label>
                
                {artImage ? (
                  <div className="relative rounded-xl overflow-hidden h-36 bg-slate-200 border border-slate-300">
                    <img src={artImage} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setArtImage("")}
                      className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-[10px] shadow"
                    >
                      Hapus Foto
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-4 cursor-pointer bg-white transition-colors text-center">
                      <Upload className="w-5 h-5 text-slate-400 mb-1" />
                      <span className="text-xs font-bold text-emerald-600">Klik untuk upload foto dari galeri/kamera</span>
                      <span className="text-[10px] text-slate-400">Format PNG, JPG, JPEG (Maks. 5MB)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageFileUpload(e, setArtImage)}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="url"
                      placeholder="Atau masukkan tautan URL gambar (https://...)"
                      value={artImage}
                      onChange={(e) => setArtImage(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                    />
                  </div>
                )}
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

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="artImportantCheck"
                  checked={artImportant}
                  onChange={(e) => setArtImportant(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                />
                <label htmlFor="artImportantCheck" className="font-semibold text-slate-700 cursor-pointer">
                  Tandai sebagai Pengumuman Penting (Muncul di banner utama)
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setArtModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow"
                >
                  Publikasikan Berita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: EDIT BERITA                                      */}
      {/* ========================================================= */}
      {editArtModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm overflow-y-auto p-4 flex justify-center items-start">
          <div
            className="fixed inset-0 cursor-pointer"
            onClick={() => setEditArtModalOpen(false)}
            aria-label="Tutup Modal"
          />
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 space-y-4 my-8 z-10">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                Edit Berita / Pengumuman
              </h3>
              <button
                type="button"
                onClick={() => setEditArtModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-slate-500 font-bold flex items-center justify-center transition-colors text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditArticle} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Artikel / Pengumuman</label>
                <input
                  type="text"
                  required
                  value={artTitle}
                  onChange={(e) => setArtTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={artCategory}
                    onChange={(e) => setArtCategory(e.target.value as Article["category"])}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
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

              {/* Upload Foto Berita */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="block font-bold text-slate-700 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  <span>Foto Sampul Berita</span>
                </label>
                
                {artImage ? (
                  <div className="relative rounded-xl overflow-hidden h-36 bg-slate-200 border border-slate-300">
                    <img src={artImage} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setArtImage("")}
                      className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-[10px] shadow"
                    >
                      Ganti Foto
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-4 cursor-pointer bg-white transition-colors text-center">
                      <Upload className="w-5 h-5 text-slate-400 mb-1" />
                      <span className="text-xs font-bold text-emerald-600">Klik untuk upload foto baru</span>
                      <span className="text-[10px] text-slate-400">Format PNG, JPG, JPEG (Maks. 5MB)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageFileUpload(e, setArtImage)}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="url"
                      placeholder="Atau masukkan tautan URL gambar (https://...)"
                      value={artImage}
                      onChange={(e) => setArtImage(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ringkasan Singkat (Excerpt)</label>
                <textarea
                  rows={2}
                  required
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
                  value={artContent}
                  onChange={(e) => setArtContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="editArtImportantCheck"
                  checked={artImportant}
                  onChange={(e) => setArtImportant(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                />
                <label htmlFor="editArtImportantCheck" className="font-semibold text-slate-700 cursor-pointer">
                  Tandai sebagai Pengumuman Penting
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditArtModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: TAMBAH UMKM                                      */}
      {/* ========================================================= */}
      {umkmModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm overflow-y-auto p-4 flex justify-center items-start">
          <div
            className="fixed inset-0 cursor-pointer"
            onClick={() => setUmkmModalOpen(false)}
            aria-label="Tutup Modal"
          />
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 space-y-4 my-8 z-10">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                Pendaftaran UMKM Warga Baru
              </h3>
              <button
                type="button"
                onClick={() => setUmkmModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-slate-500 font-bold flex items-center justify-center transition-colors text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddUMKM} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Usaha / Toko</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dapur Mama Rani - Aneka Kue Basah"
                  value={umkmName}
                  onChange={(e) => setUmkmName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Pemilik</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Ibu Rani"
                    value={umkmOwner}
                    onChange={(e) => setUmkmOwner(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori Usaha</label>
                  <select
                    value={umkmCategory}
                    onChange={(e) => setUmkmCategory(e.target.value as UMKMItem["category"])}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                  >
                    <option value="KULINER">Kuliner & Makanan</option>
                    <option value="SEMBAKO">Sembako & Toko</option>
                    <option value="JASA">Jasa & Servis</option>
                    <option value="FASHION">Fashion & Busana</option>
                    <option value="KERAJINAN">Kerajinan Tangan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Wilayah RT</label>
                  {isRT ? (
                    <div className="px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800">
                      RT {currentRTUnit.rtNumber} ({currentRTUnit.headName})
                    </div>
                  ) : (
                    <select
                      value={umkmRtNumber}
                      onChange={(e) => setUmkmRtNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                    >
                      {rts.map((rt) => (
                        <option key={rt.id} value={rt.rtNumber}>
                          RT {rt.rtNumber} ({rt.headName})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">No. WhatsApp</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 081234567890"
                    value={umkmPhone}
                    onChange={(e) => setUmkmPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rentang Harga</label>
                  <input
                    type="text"
                    placeholder="Contoh: Rp 15.000 - Rp 50.000"
                    value={umkmPrice}
                    onChange={(e) => setUmkmPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Alamat / Lokasi</label>
                  <input
                    type="text"
                    placeholder="Contoh: Jl. Mawar Blok B No. 4"
                    value={umkmAddress}
                    onChange={(e) => setUmkmAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              {/* Upload Foto Produk / Banner UMKM */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="block font-bold text-slate-700 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-amber-600" />
                  <span>Foto Produk / Toko (Upload atau URL)</span>
                </label>
                
                {umkmImage ? (
                  <div className="relative rounded-xl overflow-hidden h-36 bg-slate-200 border border-slate-300">
                    <img src={umkmImage} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setUmkmImage("")}
                      className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-[10px] shadow"
                    >
                      Hapus Foto
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-xl p-4 cursor-pointer bg-white transition-colors text-center">
                      <Upload className="w-5 h-5 text-slate-400 mb-1" />
                      <span className="text-xs font-bold text-amber-600">Klik untuk upload foto produk/toko</span>
                      <span className="text-[10px] text-slate-400">Format PNG, JPG, JPEG (Maks. 5MB)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageFileUpload(e, setUmkmImage)}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="url"
                      placeholder="Atau masukkan tautan URL gambar (https://...)"
                      value={umkmImage}
                      onChange={(e) => setUmkmImage(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi Produk / Usaha</label>
                <textarea
                  rows={3}
                  placeholder="Ceritakan produk unggulan, menu, jam buka, atau layanan..."
                  value={umkmDescription}
                  onChange={(e) => setUmkmDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setUmkmModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow"
                >
                  Simpan UMKM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: EDIT UMKM                                        */}
      {/* ========================================================= */}
      {editUmkmModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm overflow-y-auto p-4 flex justify-center items-start">
          <div
            className="fixed inset-0 cursor-pointer"
            onClick={() => setEditUmkmModalOpen(false)}
            aria-label="Tutup Modal"
          />
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 space-y-4 my-8 z-10">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                Edit Data UMKM Warga
              </h3>
              <button
                type="button"
                onClick={() => setEditUmkmModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-slate-500 font-bold flex items-center justify-center transition-colors text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditUMKM} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Usaha / Toko</label>
                <input
                  type="text"
                  required
                  value={umkmName}
                  onChange={(e) => setUmkmName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Pemilik</label>
                  <input
                    type="text"
                    required
                    value={umkmOwner}
                    onChange={(e) => setUmkmOwner(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori Usaha</label>
                  <select
                    value={umkmCategory}
                    onChange={(e) => setUmkmCategory(e.target.value as UMKMItem["category"])}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                  >
                    <option value="KULINER">Kuliner & Makanan</option>
                    <option value="SEMBAKO">Sembako & Toko</option>
                    <option value="JASA">Jasa & Servis</option>
                    <option value="FASHION">Fashion & Busana</option>
                    <option value="KERAJINAN">Kerajinan Tangan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Wilayah RT</label>
                  {isRT ? (
                    <div className="px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800">
                      RT {currentRTUnit.rtNumber} ({currentRTUnit.headName})
                    </div>
                  ) : (
                    <select
                      value={umkmRtNumber}
                      onChange={(e) => setUmkmRtNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                    >
                      {rts.map((rt) => (
                        <option key={rt.id} value={rt.rtNumber}>
                          RT {rt.rtNumber} ({rt.headName})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">No. WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={umkmPhone}
                    onChange={(e) => setUmkmPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rentang Harga</label>
                  <input
                    type="text"
                    value={umkmPrice}
                    onChange={(e) => setUmkmPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Alamat / Lokasi</label>
                  <input
                    type="text"
                    value={umkmAddress}
                    onChange={(e) => setUmkmAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              {/* Upload Foto Produk / Banner UMKM */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="block font-bold text-slate-700 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-amber-600" />
                  <span>Foto Produk / Toko</span>
                </label>
                
                {umkmImage ? (
                  <div className="relative rounded-xl overflow-hidden h-36 bg-slate-200 border border-slate-300">
                    <img src={umkmImage} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setUmkmImage("")}
                      className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-[10px] shadow"
                    >
                      Ganti Foto
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-xl p-4 cursor-pointer bg-white transition-colors text-center">
                      <Upload className="w-5 h-5 text-slate-400 mb-1" />
                      <span className="text-xs font-bold text-amber-600">Klik untuk upload foto baru</span>
                      <span className="text-[10px] text-slate-400">Format PNG, JPG, JPEG (Maks. 5MB)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageFileUpload(e, setUmkmImage)}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="url"
                      placeholder="Atau masukkan tautan URL gambar (https://...)"
                      value={umkmImage}
                      onChange={(e) => setUmkmImage(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi Produk / Usaha</label>
                <textarea
                  rows={3}
                  value={umkmDescription}
                  onChange={(e) => setUmkmDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditUmkmModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 5: TAMBAH FASILITAS                                 */}
      {/* ========================================================= */}
      {facModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm overflow-y-auto p-4 flex justify-center items-start">
          <div
            className="fixed inset-0 cursor-pointer"
            onClick={() => setFacModalOpen(false)}
            aria-label="Tutup Modal"
          />
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 space-y-4 my-8 z-10">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                Tambah Fasilitas Lingkungan RW Baru
              </h3>
              <button
                type="button"
                onClick={() => setFacModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-slate-500 font-bold flex items-center justify-center transition-colors text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddFacility} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Fasilitas</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Balai Warga Serbaguna RW 14"
                  value={facName}
                  onChange={(e) => setFacName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={facCategory}
                    onChange={(e) => setFacCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                  >
                    <option value="Gedung Pertemuan">Gedung Pertemuan</option>
                    <option value="Lapangan Olahraga">Lapangan Olahraga</option>
                    <option value="Posyandu & Kesehatan">Posyandu & Kesehatan</option>
                    <option value="Taman & Ruang Terbuka">Taman & Ruang Terbuka</option>
                    <option value="Inventaris RW">Inventaris RW</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kapasitas</label>
                  <input
                    type="text"
                    placeholder="Contoh: 100 Orang / 2 Lapangan"
                    value={facCapacity}
                    onChange={(e) => setFacCapacity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Biaya Sewa Warga (Rp)</label>
                  <input
                    type="number"
                    placeholder="0 jika gratis untuk warga"
                    value={facRentalFee}
                    onChange={(e) => setFacRentalFee(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lokasi Fasilitas</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Jl. Mawar Depan Pos Satpam"
                    value={facLocation}
                    onChange={(e) => setFacLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              {/* Upload Foto Fasilitas */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="block font-bold text-slate-700 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  <span>Foto Fasilitas (Upload atau URL)</span>
                </label>
                
                {facImage ? (
                  <div className="relative rounded-xl overflow-hidden h-36 bg-slate-200 border border-slate-300">
                    <img src={facImage} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFacImage("")}
                      className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-[10px] shadow"
                    >
                      Hapus Foto
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-4 cursor-pointer bg-white transition-colors text-center">
                      <Upload className="w-5 h-5 text-slate-400 mb-1" />
                      <span className="text-xs font-bold text-blue-600">Klik untuk upload foto fasilitas</span>
                      <span className="text-[10px] text-slate-400">Format PNG, JPG, JPEG (Maks. 5MB)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageFileUpload(e, setFacImage)}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="url"
                      placeholder="Atau masukkan tautan URL gambar (https://...)"
                      value={facImage}
                      onChange={(e) => setFacImage(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Perlengkapan yang Termasuk (Pisahkan koma)</label>
                <input
                  type="text"
                  placeholder="Contoh: 100 Kursi Lipat, Sound System Wireless, 2 Kipas Angin, Toilet"
                  value={facIncluded}
                  onChange={(e) => setFacIncluded(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi Fasilitas & Tata Tertib</label>
                <textarea
                  rows={3}
                  placeholder="Penjelasan fungsi, ketentuan kebersihan, aturan pemakaian..."
                  value={facDescription}
                  onChange={(e) => setFacDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setFacModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow"
                >
                  Simpan Fasilitas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 6: EDIT FASILITAS                                   */}
      {/* ========================================================= */}
      {editFacModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm overflow-y-auto p-4 flex justify-center items-start">
          <div
            className="fixed inset-0 cursor-pointer"
            onClick={() => setEditFacModalOpen(false)}
            aria-label="Tutup Modal"
          />
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 space-y-4 my-8 z-10">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                Edit Data Fasilitas RW
              </h3>
              <button
                type="button"
                onClick={() => setEditFacModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-slate-500 font-bold flex items-center justify-center transition-colors text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditFacility} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Fasilitas</label>
                <input
                  type="text"
                  required
                  value={facName}
                  onChange={(e) => setFacName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={facCategory}
                    onChange={(e) => setFacCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                  >
                    <option value="Gedung Pertemuan">Gedung Pertemuan</option>
                    <option value="Lapangan Olahraga">Lapangan Olahraga</option>
                    <option value="Posyandu & Kesehatan">Posyandu & Kesehatan</option>
                    <option value="Taman & Ruang Terbuka">Taman & Ruang Terbuka</option>
                    <option value="Inventaris RW">Inventaris RW</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kapasitas</label>
                  <input
                    type="text"
                    value={facCapacity}
                    onChange={(e) => setFacCapacity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Biaya Sewa Warga (Rp)</label>
                  <input
                    type="number"
                    value={facRentalFee}
                    onChange={(e) => setFacRentalFee(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lokasi Fasilitas</label>
                  <input
                    type="text"
                    required
                    value={facLocation}
                    onChange={(e) => setFacLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              {/* Upload Foto Fasilitas */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="block font-bold text-slate-700 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  <span>Foto Fasilitas</span>
                </label>
                
                {facImage ? (
                  <div className="relative rounded-xl overflow-hidden h-36 bg-slate-200 border border-slate-300">
                    <img src={facImage} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFacImage("")}
                      className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-[10px] shadow"
                    >
                      Ganti Foto
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-4 cursor-pointer bg-white transition-colors text-center">
                      <Upload className="w-5 h-5 text-slate-400 mb-1" />
                      <span className="text-xs font-bold text-blue-600">Klik untuk upload foto baru</span>
                      <span className="text-[10px] text-slate-400">Format PNG, JPG, JPEG (Maks. 5MB)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageFileUpload(e, setFacImage)}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="url"
                      placeholder="Atau masukkan tautan URL gambar (https://...)"
                      value={facImage}
                      onChange={(e) => setFacImage(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Perlengkapan yang Termasuk (Pisahkan koma)</label>
                <input
                  type="text"
                  value={facIncluded}
                  onChange={(e) => setFacIncluded(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi Fasilitas & Tata Tertib</label>
                <textarea
                  rows={3}
                  value={facDescription}
                  onChange={(e) => setFacDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditFacModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

