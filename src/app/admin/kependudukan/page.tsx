"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store";
import { Family, Resident, ResidentStatus, FamilyRole, Gender } from "@/types";
import {
  Users,
  Home,
  Search,
  PlusCircle,
  Eye,
  EyeOff,
  Filter,
  Download,
  Building,
  FileSpreadsheet,
} from "lucide-react";
import { maskNik, maskFamilyCard, formatDate } from "@/lib/utils";

export default function KependudukanPage() {
  const { families, residents, rts, addResident, addFamily, currentRole, rw } = useApp();
  const [activeTab, setActiveTab] = useState<"warga" | "kk">("warga");
  const [selectedRT, setSelectedRT] = useState<string>("ALL");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFullNik, setShowFullNik] = useState(false);

  // Modal State
  const [residentModalOpen, setResidentModalOpen] = useState(false);
  const [familyModalOpen, setFamilyModalOpen] = useState(false);
  const [selectedFamilyForDetail, setSelectedFamilyForDetail] = useState<Family | null>(null);

  // Resident Form State
  const [resName, setResName] = useState("");
  const [resNik, setResNik] = useState("");
  const [resGender, setResGender] = useState<Gender>("L");
  const [resBirthPlace, setResBirthPlace] = useState("Depok");
  const [resBirthDate, setResBirthDate] = useState("1995-01-01");
  const [resReligion, setResReligion] = useState("Islam");
  const [resOccupation, setResOccupation] = useState("Karyawan Swasta");
  const [resFamilyRole, setResFamilyRole] = useState<FamilyRole>("KEPALA_KELUARGA");
  const [resStatus, setResStatus] = useState<ResidentStatus>("TETAP");
  const [resFamilyId, setResFamilyId] = useState(families[0]?.id || "fam-01");

  // Family Form State
  const [famCardNumber, setFamCardNumber] = useState("");
  const [famHeadName, setFamHeadName] = useState("");
  const [famAddress, setFamAddress] = useState("");
  const [famHouseNumber, setFamHouseNumber] = useState("");
  const [famPhone, setFamPhone] = useState("");
  const [famRtId, setFamRtId] = useState("rt-01");
  const [famStatus, setFamStatus] = useState<ResidentStatus>("TETAP");

  // Filter residents
  const filteredResidents = residents.filter((res) => {
    const matchRT = selectedRT === "ALL" || res.rtId === selectedRT;
    const matchStatus = selectedStatusFilter === "ALL" || res.status === selectedStatusFilter;
    const matchQuery =
      res.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.nik.includes(searchQuery) ||
      res.occupation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchRT && matchStatus && matchQuery;
  });

  // Filter families
  const filteredFamilies = families.filter((fam) => {
    const matchRT = selectedRT === "ALL" || fam.rtId === selectedRT;
    const matchStatus = selectedStatusFilter === "ALL" || fam.status === selectedStatusFilter;
    const matchQuery =
      fam.headOfFamilyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fam.familyCardNumber.includes(searchQuery) ||
      fam.houseNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchRT && matchStatus && matchQuery;
  });

  const handleAddResident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resName || !resNik) {
      alert("Mohon isi NIK dan Nama lengkap!");
      return;
    }

    const parentFamily = families.find((f) => f.id === resFamilyId);
    const rtId = parentFamily ? parentFamily.rtId : "rt-01";

    addResident({
      familyId: resFamilyId,
      rtId,
      nik: resNik,
      fullName: resName,
      gender: resGender,
      birthPlace: resBirthPlace,
      birthDate: resBirthDate,
      religion: resReligion,
      occupation: resOccupation,
      maritalStatus: "KAWIN",
      familyRole: resFamilyRole,
      status: resStatus,
    });

    setResidentModalOpen(false);
    setResName("");
    setResNik("");
  };

  const handleAddFamily = (e: React.FormEvent) => {
    e.preventDefault();
    if (!famCardNumber || !famHeadName) {
      alert("Mohon isi Nomor KK dan Nama Kepala Keluarga!");
      return;
    }

    addFamily({
      rtId: famRtId,
      familyCardNumber: famCardNumber,
      headOfFamilyName: famHeadName,
      address: famAddress || "Jl. Mawar No. 10",
      houseNumber: famHouseNumber || "Blok A1/10",
      phone: famPhone || "081234567890",
      status: famStatus,
    });

    setFamilyModalOpen(false);
    setFamCardNumber("");
    setFamHeadName("");
  };

  // Export to CSV
  const handleExportCSV = () => {
    let csvContent = "";
    if (activeTab === "warga") {
      csvContent = "data:text/csv;charset=utf-8,No,Nama Lengkap,NIK,Gender,Tanggal Lahir,Pekerjaan,Peran Keluarga,Status Tinggal\n";
      filteredResidents.forEach((r, idx) => {
        csvContent += `${idx + 1},"${r.fullName}","'${r.nik}",${r.gender},${r.birthDate},"${r.occupation}",${r.familyRole},${r.status}\n`;
      });
    } else {
      csvContent = "data:text/csv;charset=utf-8,No,No Kartu Keluarga,Kepala Keluarga,Alamat,No Rumah,Jumlah Jiwa,Status\n";
      filteredFamilies.forEach((f, idx) => {
        csvContent += `${idx + 1},"'${f.familyCardNumber}","${f.headOfFamilyName}","${f.address}","${f.houseNumber}",${f.residentCount},${f.status}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `data_kependudukan_rw14_${activeTab}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Title & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Buku Induk Kependudukan & Kartu Keluarga
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Database kependudukan {rw.name} untuk keperluan sensus, posyandu, bantuan sosial, dan surat pengantar.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Ekspor CSV</span>
          </button>
          <button
            type="button"
            onClick={() => setFamilyModalOpen(true)}
            className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>Tambah KK</span>
          </button>
          <button
            type="button"
            onClick={() => setResidentModalOpen(true)}
            className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Warga</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Tabs, Search, Filter RT, Privacy Toggle */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab("warga")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "warga"
                  ? "bg-white text-slate-900 shadow"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Data Jiwa Penduduk ({residents.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("kk")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "kk"
                  ? "bg-white text-slate-900 shadow"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Home className="w-4 h-4 text-blue-600" />
              <span>Kartu Keluarga ({families.length})</span>
            </button>
          </div>

          {/* Privacy Toggle */}
          <button
            type="button"
            onClick={() => setShowFullNik(!showFullNik)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold self-start md:self-auto"
          >
            {showFullNik ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-rose-500" />
                <span>Sensor NIK/KK (Kepatuhan UU PDP)</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-emerald-600" />
                <span>Buka Sensor NIK/KK Lengkap</span>
              </>
            )}
          </button>
        </div>

        {/* Search & RT Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Cari Nama, NIK, No. KK, atau Pekerjaan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedRT}
              onChange={(e) => setSelectedRT(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700 outline-none"
            >
              <option value="ALL">Semua Wilayah RT (RT 01 - RT 05)</option>
              {rts.map((rt) => (
                <option key={rt.id} value={rt.id}>
                  RT {rt.rtNumber} (Ketua: {rt.headName})
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700 outline-none"
            >
              <option value="ALL">Semua Status Hunian</option>
              <option value="TETAP">Warga Tetap</option>
              <option value="KONTRAK">Warga Kontrak / Sewa</option>
              <option value="KOS">Warga Kos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table & Mobile Card Display */}
      {activeTab === "warga" ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Mobile Card Feed (< md) */}
          <div className="block md:hidden divide-y divide-slate-100">
            {filteredResidents.map((res) => {
              const birthYear = parseInt(res.birthDate.slice(0, 4), 10);
              const age = isNaN(birthYear) ? "-" : 2026 - birthYear;
              const rtData = rts.find((r) => r.id === res.rtId);

              return (
                <div key={res.id} className="p-4 space-y-2.5 hover:bg-slate-50/70 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">{res.fullName}</h3>
                      <p className="font-mono text-xs text-slate-500 mt-0.5">
                        {showFullNik ? res.nik : maskNik(res.nik)}
                      </p>
                    </div>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                        res.status === "TETAP"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {res.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
                    <span className="font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                      RT {rtData?.rtNumber || "001"}
                    </span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                      {res.gender === "L" ? "Laki-laki" : "Perempuan"} • {age} thn
                    </span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                      {res.familyRole.replace(/_/g, " ")}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 pt-0.5">
                    Pekerjaan: <span className="text-slate-800 font-medium">{res.occupation}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table (>= md) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Nama Lengkap</th>
                  <th className="px-6 py-3.5">NIK (KTP)</th>
                  <th className="px-6 py-3.5">Gender / Usia</th>
                  <th className="px-6 py-3.5">RT</th>
                  <th className="px-6 py-3.5">Peran Keluarga</th>
                  <th className="px-6 py-3.5">Pekerjaan</th>
                  <th className="px-6 py-3.5">Status Tinggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredResidents.map((res) => {
                  const birthYear = parseInt(res.birthDate.slice(0, 4), 10);
                  const age = isNaN(birthYear) ? "-" : 2026 - birthYear;

                  return (
                    <tr key={res.id} className="hover:bg-slate-50/70">
                      <td className="px-6 py-3.5 font-bold text-slate-900">
                        {res.fullName}
                      </td>
                      <td className="px-6 py-3.5 font-mono text-slate-600">
                        {showFullNik ? res.nik : maskNik(res.nik)}
                      </td>
                      <td className="px-6 py-3.5 text-slate-600">
                        <span className="font-semibold">{res.gender === "L" ? "L" : "P"}</span> ({age} thn)
                      </td>
                      <td className="px-6 py-3.5 font-semibold text-emerald-700">
                        {rts.find((r) => r.id === res.rtId)?.rtNumber || "001"}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {res.familyRole.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-slate-600">{res.occupation}</td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            res.status === "TETAP"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {res.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Mobile Card Feed for KK (< md) */}
          <div className="block md:hidden divide-y divide-slate-100">
            {filteredFamilies.map((fam) => (
              <div key={fam.id} className="p-4 space-y-3 hover:bg-slate-50/70 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">{fam.headOfFamilyName}</h3>
                    <p className="font-mono text-xs text-slate-500 mt-0.5">
                      No. KK: {showFullNik ? fam.familyCardNumber : maskFamilyCard(fam.familyCardNumber)}
                    </p>
                  </div>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      fam.status === "TETAP"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {fam.status}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <p>Alamat: <strong className="text-slate-800">{fam.address} ({fam.houseNumber})</strong></p>
                  <p>Wilayah: <strong className="text-emerald-700">RT {rts.find((r) => r.id === fam.rtId)?.rtNumber || "001"}</strong> • {fam.residentCount} Jiwa</p>
                  <p className="font-mono text-slate-500 text-[11px]">Telp: {fam.phone}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedFamilyForDetail(fam)}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1"
                  >
                    <span>Lihat Anggota Keluarga ({fam.residentCount})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table (>= md) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Nomor Kartu Keluarga</th>
                  <th className="px-6 py-3.5">Kepala Keluarga</th>
                  <th className="px-6 py-3.5">Alamat / No. Rumah</th>
                  <th className="px-6 py-3.5">Wilayah RT</th>
                  <th className="px-6 py-3.5 text-center">Anggota Keluarga</th>
                  <th className="px-6 py-3.5">No. Telepon</th>
                  <th className="px-6 py-3.5">Status Hunian</th>
                  <th className="px-6 py-3.5 text-right">Rincian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFamilies.map((fam) => (
                  <tr key={fam.id} className="hover:bg-slate-50/70">
                    <td className="px-6 py-3.5 font-mono font-bold text-slate-900">
                      {showFullNik ? fam.familyCardNumber : maskFamilyCard(fam.familyCardNumber)}
                    </td>
                    <td className="px-6 py-3.5 font-bold text-slate-900">
                      {fam.headOfFamilyName}
                    </td>
                    <td className="px-6 py-3.5 text-slate-600">
                      {fam.address} ({fam.houseNumber})
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-emerald-700">
                      RT {rts.find((r) => r.id === fam.rtId)?.rtNumber || "001"}
                    </td>
                    <td className="px-6 py-3.5 text-center font-bold text-slate-800">
                      {fam.residentCount} Jiwa
                    </td>
                    <td className="px-6 py-3.5 text-slate-600 font-mono">
                      {fam.phone}
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          fam.status === "TETAP"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {fam.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedFamilyForDetail(fam)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs"
                      >
                        Lihat Anggota
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Detail Anggota KK */}
      {selectedFamilyForDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Susunan Anggota Kartu Keluarga
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  No. KK: {selectedFamilyForDetail.familyCardNumber} • {selectedFamilyForDetail.headOfFamilyName} ({selectedFamilyForDetail.houseNumber})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFamilyForDetail(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 border-b border-slate-200 uppercase">
                  <tr>
                    <th className="px-4 py-2.5">Nama Anggota</th>
                    <th className="px-4 py-2.5">NIK</th>
                    <th className="px-4 py-2.5">Hubungan</th>
                    <th className="px-4 py-2.5">Gender</th>
                    <th className="px-4 py-2.5">Pekerjaan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {residents
                    .filter((r) => r.familyId === selectedFamilyForDetail.id)
                    .map((member) => (
                      <tr key={member.id}>
                        <td className="px-4 py-2.5 font-bold text-slate-900">{member.fullName}</td>
                        <td className="px-4 py-2.5 font-mono text-slate-600">{member.nik}</td>
                        <td className="px-4 py-2.5 font-semibold text-emerald-700">{member.familyRole.replace("_", " ")}</td>
                        <td className="px-4 py-2.5">{member.gender === "L" ? "Laki-laki" : "Perempuan"}</td>
                        <td className="px-4 py-2.5 text-slate-600">{member.occupation}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedFamilyForDetail(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Warga */}
      {residentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                Pencatatan Data Warga Baru
              </h3>
              <button
                type="button"
                onClick={() => setResidentModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddResident} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap Sesuai KTP"
                  value={resName}
                  onChange={(e) => setResName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">NIK (16 Digit)</label>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    placeholder="320101..."
                    value={resNik}
                    onChange={(e) => setResNik(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pilih Kartu Keluarga (KK)</label>
                  <select
                    value={resFamilyId}
                    onChange={(e) => setResFamilyId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    {families.map((f) => (
                      <option key={f.id} value={f.id}>
                        KK {f.headOfFamilyName} ({f.houseNumber})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={resGender}
                    onChange={(e) => setResGender(e.target.value as Gender)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={resBirthDate}
                    onChange={(e) => setResBirthDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Peran dalam Keluarga</label>
                  <select
                    value={resFamilyRole}
                    onChange={(e) => setResFamilyRole(e.target.value as FamilyRole)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option value="KEPALA_KELUARGA">Kepala Keluarga</option>
                    <option value="ISTRI">Istri</option>
                    <option value="ANAK">Anak</option>
                    <option value="ORANG_TUA">Orang Tua</option>
                    <option value="FAMILI_LAIN">Famili Lain</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pekerjaan</label>
                  <input
                    type="text"
                    value={resOccupation}
                    onChange={(e) => setResOccupation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResidentModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow"
                >
                  Simpan Data Warga
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah KK */}
      {familyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                Tambah Kartu Keluarga (KK) Baru
              </h3>
              <button
                type="button"
                onClick={() => setFamilyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddFamily} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nomor Kartu Keluarga (16 Digit)</label>
                <input
                  type="text"
                  required
                  maxLength={16}
                  placeholder="320101..."
                  value={famCardNumber}
                  onChange={(e) => setFamCardNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Kepala Keluarga</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rudi Hartono"
                  value={famHeadName}
                  onChange={(e) => setFamHeadName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Wilayah RT</label>
                  <select
                    value={famRtId}
                    onChange={(e) => setFamRtId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    {rts.map((rt) => (
                      <option key={rt.id} value={rt.id}>
                        RT {rt.rtNumber} (Ketua: {rt.headName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Blok / Nomor Rumah</label>
                  <input
                    type="text"
                    placeholder="Contoh: Blok A1/12"
                    value={famHouseNumber}
                    onChange={(e) => setFamHouseNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setFamilyModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-white font-bold rounded-xl shadow"
                >
                  Simpan KK
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
