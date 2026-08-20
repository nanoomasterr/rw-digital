"use client";

import React from "react";
import { Quote, Target, Award, MapPin, CheckCircle2 } from "lucide-react";
import { useApp } from "@/lib/store";

export function ProfileSection() {
  const { rw } = useApp();

  return (
    <section className="py-16 sm:py-20 bg-white w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Sambutan Ketua RW & Visi Misi */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Card Sambutan Ketua RW */}
          <div className="lg:col-span-5 bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-100 rounded-3xl p-8 border border-emerald-100 shadow-md relative">
            <Quote className="w-12 h-12 text-emerald-300 absolute top-6 right-6 opacity-60" />
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg shrink-0">
                TA
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  {rw.headName}
                </h3>
                <p className="text-xs font-semibold text-emerald-700">
                  Ketua {rw.name}
                </p>
                <p className="text-xs text-slate-500">Masa Bakti 2024 - 2029</p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-700 leading-relaxed italic">
              <p>
                &ldquo;Sampurasun! Assalamu’alaikum Warahmatullahi Wabarakatuh, salam sejahtera untuk seluruh warga {rw.name} yang kami banggakan.
              </p>
              <p>
                Portal digital {rw.name} ini kami hadirkan sebagai ikhtiar bersama menuju lingkungan yang modern, guyub rukun, transparan, dan berdaya. Warga kini dapat mengurus surat pengantar kapan saja tanpa kendala jarak, melihat pertanggungjawaban kas secara terbuka, serta bergotong royong memajukan UMKM tetangga sekitar.&rdquo;
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-emerald-200/60 flex items-center justify-between text-xs text-slate-500">
              <span>Sekretariat {rw.name}</span>
              <span className="font-semibold text-emerald-800">#PadasukaJuara #RWSadarDigital</span>
            </div>
          </div>

          {/* Visi, Misi & Keunggulan Lingkungan */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
                Profil Lingkungan
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
                Mewujudkan {rw.name} yang Harmonis, Aman, dan Berbasis Digital
              </h2>
            </div>

            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Visi Lingkungan</h4>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    Terwujudnya {rw.name} Kelurahan Padasuka yang religius, aman, bersih, transparan dalam tata kelola keuangan, serta unggul dalam pelayanan publik berbasis teknologi informasi.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Misi Utama</h4>
                  <ul className="mt-2 space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Memberikan pelayanan administrasi warga yang cepat, tepat, transparan, dan tanpa pungli.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Menjaga keamanan 24 jam dengan sistem siskamling terpadu dan CCTV lingkungan.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Mendukung pemberdayaan ekonomi lokal melalui katalog produk UMKM antar warga Padasuka.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
