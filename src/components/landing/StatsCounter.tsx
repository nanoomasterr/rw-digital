"use client";

import React from "react";
import { Users, Home, Building, AlertCircle, Wallet } from "lucide-react";
import { useApp } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

export function StatsCounter() {
  const { rts, families, residents, complaints, cashTransactions } = useApp();

  const totalRT = rts.length;
  const totalKK = families.length;
  const totalWarga = residents.length;
  const totalComplaints = complaints.length;
  const currentBalance =
    cashTransactions.length > 0
      ? cashTransactions[cashTransactions.length - 1].balanceAfter
      : 0;

  const stats = [
    {
      label: "Rukun Tetangga (RT)",
      value: `${totalRT} RT`,
      sub: "Wilayah Administratif",
      icon: Building,
      color: "from-blue-500 to-indigo-600",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Kepala Keluarga (KK)",
      value: `${totalKK} KK`,
      sub: "Keluarga Terdaftar",
      icon: Home,
      color: "from-teal-500 to-emerald-600",
      textColor: "text-teal-600",
      bgColor: "bg-teal-50",
    },
    {
      label: "Total Jiwa Penduduk",
      value: `${totalWarga} Jiwa`,
      sub: "Warga Tetap & Kontrak",
      icon: Users,
      color: "from-emerald-500 to-green-600",
      textColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      label: "Laporan & Aduan Warga",
      value: `${totalComplaints} Tiket`,
      sub: "Aspirasi & Penanganan",
      icon: AlertCircle,
      color: "from-rose-500 to-orange-600",
      textColor: "text-rose-600",
      bgColor: "bg-rose-50",
    },
    {
      label: "Saldo Kas Terbuka RW",
      value: formatCurrency(currentBalance),
      sub: "Kas Umum Transparan",
      icon: Wallet,
      color: "from-purple-500 to-pink-600",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="relative -mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className={`p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-md hover:shadow-lg transition-all ${
                i === 4 ? "col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl ${stat.bgColor} ${stat.textColor} flex items-center justify-center`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Live Data
                </span>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs font-semibold text-slate-700 mt-0.5">
                  {stat.label}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">{stat.sub}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
