"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useApp } from "@/lib/store";
import { Facility, FacilityBooking } from "@/types";
import {
  CalendarDays,
  MapPin,
  Users,
  CheckCircle2,
  Clock,
  Send,
  Building,
  ShieldCheck,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function FasilitasPage() {
  const { facilities, facilityBookings, addFacilityBooking, rts, rw } = useApp();
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  // Booking Form State
  const [applicantName, setApplicantName] = useState("");
  const [phone, setPhone] = useState("");
  const [rtNumber, setRtNumber] = useState("001");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [purpose, setPurpose] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleOpenBooking = (fac: Facility) => {
    setSelectedFacility(fac);
    setBookingSuccess(false);
    setBookingModalOpen(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFacility || !applicantName || !startDate || !purpose) {
      alert("Mohon lengkapi seluruh formulir reservasi!");
      return;
    }

    addFacilityBooking({
      facilityId: selectedFacility.id,
      facilityName: selectedFacility.name,
      applicantName,
      phone: phone || "081234567890",
      rtNumber,
      startDate,
      endDate: endDate || startDate,
      purpose,
    });

    setBookingSuccess(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 overflow-x-hidden w-full max-w-full">
      <Navbar />

      {/* Header Banner */}
      <div className="bg-slate-900 text-white py-12 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest bg-blue-950/60 px-3 py-1 rounded-full border border-blue-800">
                Sarana & Prasarana Lingkungan
              </span>
              <h1 className="text-3xl font-black tracking-tight mt-2 text-white">
                Fasilitas Umum & Balai {rw.name}
              </h1>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                Daftar fasilitas bersama milik warga {rw.name} yang dapat dipinjam untuk acara tasyakuran keluarga, arisan, olahraga, posyandu, dan rapat lingkungan.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Facilities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {facilities.map((fac) => (
            <div
              key={fac.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                  <img
                    src={fac.imageUrl}
                    alt={fac.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur text-emerald-400 font-bold text-[10px] uppercase px-3 py-1 rounded-full">
                    {fac.category.replace("_", " ")}
                  </div>
                  <div className="absolute top-3 right-3 bg-white/95 text-slate-900 font-extrabold text-xs px-3 py-1 rounded-full shadow-sm">
                    {fac.rentalFee === 0 ? "Gratis untuk Warga" : `${formatCurrency(fac.rentalFee)} / Sewa`}
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-3">
                  <h3 className="font-extrabold text-slate-900 text-lg leading-snug">
                    {fac.name}
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      {fac.location}
                    </span>
                    {fac.capacity && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-blue-500" />
                        Kapasitas: {fac.capacity}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    {fac.description}
                  </p>

                  {/* Fasilitas & Ketentuan */}
                  <div className="pt-3 border-t border-slate-100">
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Fasilitas & Ketentuan:
                    </h4>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {(fac.facilitiesIncluded || fac.rules || []).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="p-6 pt-0">
                <button
                  type="button"
                  onClick={() => handleOpenBooking(fac)}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition-all flex items-center justify-center gap-2"
                >
                  <CalendarDays className="w-4 h-4 text-emerald-400" />
                  <span>Ajukan Peminjaman</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Jadwal Pemakaian Terjadwal */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">
                Jadwal Pemakaian Fasilitas Terdaftar
              </h3>
              <p className="text-xs text-slate-500">
                Daftar agenda kegiatan warga yang telah disetujui oleh pengurus RW.
              </p>
            </div>
          </div>

          {/* Mobile Card Feed for Bookings (< md) */}
          <div className="block md:hidden divide-y divide-slate-100">
            {facilityBookings.map((bk) => (
              <div key={bk.id} className="p-4 space-y-2 hover:bg-slate-50/70 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{bk.facilityName}</h4>
                    <p className="text-xs text-slate-600 font-semibold mt-0.5">
                      {bk.applicantName} <span className="text-slate-400 font-normal">(RT {bk.rtNumber})</span>
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    <CheckCircle2 className="w-3 h-3" /> Disetujui
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-0.5">
                  <p className="flex items-center gap-1.5 text-slate-500 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{bk.startDate}</span>
                  </p>
                  <p className="text-slate-700 pt-1">
                    <strong>Keperluan:</strong> {bk.purpose}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table (>= md) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3">Fasilitas</th>
                  <th className="px-6 py-3">Peminjam / Pemohon</th>
                  <th className="px-6 py-3">Waktu Pelaksanaan</th>
                  <th className="px-6 py-3">Keperluan Acara</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {facilityBookings.map((bk) => (
                  <tr key={bk.id} className="hover:bg-slate-50/70">
                    <td className="px-6 py-3.5 font-bold text-slate-900">
                      {bk.facilityName}
                    </td>
                    <td className="px-6 py-3.5">
                      <p className="font-semibold text-slate-800">{bk.applicantName}</p>
                      <p className="text-slate-400 text-[11px]">RT {bk.rtNumber}</p>
                    </td>
                    <td className="px-6 py-3.5 text-slate-600 font-medium whitespace-nowrap">
                      {bk.startDate}
                    </td>
                    <td className="px-6 py-3.5 text-slate-600 max-w-xs">
                      {bk.purpose}
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Disetujui
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Booking Modal */}
      {bookingModalOpen && selectedFacility && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Formulir Peminjaman Fasilitas
                </h3>
                <p className="text-xs text-slate-500 font-semibold text-emerald-700">
                  {selectedFacility.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setBookingModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            {bookingSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-black text-slate-900">
                  Pengajuan Peminjaman Berhasil Dikirim!
                </h4>
                <p className="text-xs text-slate-600">
                  Pengurus Seksi Sarana & Prasarana RW akan meninjau ketersediaan jadwal dan menghubungi Anda melalui WhatsApp.
                </p>
                <button
                  type="button"
                  onClick={() => setBookingModalOpen(false)}
                  className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-xs shadow mt-4"
                >
                  Selesai
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nama Pemohon / Organisasi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso / Panitia Arisan RT 01"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      No. WhatsApp Aktif <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0812xxxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Asal RT <span className="text-rose-500">*</span>
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
                    Tanggal & Jam Pemakaian <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tujuan & Jenis Acara <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Contoh: Rapat koordinasi panitia 17-an / Tasyakuran khitanan keluarga"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingModalOpen(false)}
                    className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold text-xs"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim Pengajuan</span>
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
