"use client";

import React from "react";
import { initialEmergencyContacts } from "@/data/mockData";
import { PhoneCall, ShieldAlert, Shield, Flame, Ambulance, Flag } from "lucide-react";
import { useApp } from "@/lib/store";

export function EmergencyBar() {
  const { rw } = useApp();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "ShieldAlert":
        return <ShieldAlert className="w-5 h-5 text-rose-600" />;
      case "Shield":
        return <Shield className="w-5 h-5 text-blue-600" />;
      case "Flag":
        return <Flag className="w-5 h-5 text-emerald-600" />;
      case "Flame":
        return <Flame className="w-5 h-5 text-amber-600" />;
      case "Ambulance":
        return <Ambulance className="w-5 h-5 text-red-600" />;
      default:
        return <PhoneCall className="w-5 h-5 text-rose-600" />;
    }
  };

  return (
    <section id="kontak-darurat" className="bg-rose-50 border-y border-rose-200 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-widest">
              <PhoneCall className="w-4 h-4 animate-pulse" />
              Layanan Siaga 24 Jam
            </div>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              Kontak Darurat Terpadu {rw.name}
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Hubungi nomor berikut jika terjadi insiden keamanan, kebakaran, bencana, atau keadaan darurat medis di lingkungan.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {initialEmergencyContacts.map((contact) => (
            <div
              key={contact.id}
              className="p-4 rounded-xl bg-white border border-rose-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
                  {getIcon(contact.icon)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">
                    {contact.name}
                  </h4>
                  <p className="text-xs text-slate-500">{contact.role}</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {contact.available}
                  </span>
                </div>
              </div>

              <a
                href={`tel:${contact.phone.replace(/[^0-9]/g, "")}`}
                className="flex items-center gap-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold text-xs transition-colors shrink-0 shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Panggil</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
