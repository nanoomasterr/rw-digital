"use client";

import React from "react";
import { Users, Phone, Building2, ShieldCheck } from "lucide-react";
import { useApp } from "@/lib/store";

export function StructureSection() {
  const { rw, rts } = useApp();

  const mainExecutives = [
    { role: "Ketua RW", name: rw.headName, phone: rw.headPhone, badge: "Pimpinan RW" },
    { role: "Sekretaris RW", name: "Surya Dharma, S.Kom.", phone: "081211223344", badge: "Administrasi" },
    { role: "Bendahara RW", name: "Hj. Ratna Wulandari", phone: "081344556677", badge: "Keuangan" },
    { role: "Seksi Keamanan & Ketertiban", name: "Mayor (Purn) Sukardi", phone: "081299887711", badge: "Siskamling & Satpam" },
    { role: "Seksi Kebersihan & Lingkungan", name: "Bambang Triyono", phone: "081577889900", badge: "Pengelolaan Sampah" },
    { role: "Seksi Pembangunan & Sarpras", name: "Ir. Gunawan Wibowo", phone: "081622334455", badge: "Fasilitas & Balai" },
  ];

  return (
    <section className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
            Struktur Organisasi
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
            Susunan Pengurus RW & Ketua RT
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Jajaran kepengurusan {rw.name} yang siap melayani kebutuhan administrasi dan kerukunan warga.
          </p>
        </div>

        {/* Pengurus Inti RW */}
        <div className="mb-12">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Pengurus Harian & Seksi {rw.name}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mainExecutives.map((exec, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all flex items-center justify-between"
              >
                <div>
                  <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full mb-1.5">
                    {exec.badge}
                  </span>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    {exec.name}
                  </h4>
                  <p className="text-xs font-semibold text-slate-600">{exec.role}</p>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {exec.phone}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Jajaran Ketua RT */}
        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-600" />
            Daftar Ketua Rukun Tetangga (RT 01 - RT 0{rts.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {rts.map((rt) => (
              <div
                key={rt.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all text-center"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-slate-900 text-emerald-400 font-black text-sm flex items-center justify-center mb-3">
                  RT {rt.rtNumber}
                </div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                  {rt.headName}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Ketua RT {rt.rtNumber}</p>
                <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-600 flex items-center justify-center gap-1">
                  <Users className="w-3 h-3 text-emerald-600" />
                  <span>{rt.totalFamilies} KK ({rt.totalResidents} Warga)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
