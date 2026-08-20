"use client";

import React from "react";
import { Wallet, ArrowDownRight, ArrowUpRight, ShieldCheck, FileSpreadsheet } from "lucide-react";
import { useApp } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";

export function CashTransparencyWidget() {
  const { cashTransactions } = useApp();

  const currentBalance =
    cashTransactions.length > 0
      ? cashTransactions[cashTransactions.length - 1].balanceAfter
      : 0;

  // Calculate this month totals (August 2026)
  const incomeTotal = cashTransactions
    .filter((t) => t.type === "MASUK")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const expenseTotal = cashTransactions
    .filter((t) => t.type === "KELUAR")
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Latest 5 transactions
  const latestTransactions = [...cashTransactions].reverse().slice(0, 5);

  return (
    <section id="transparansi-kas" className="py-16 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-widest bg-emerald-100/70 px-3 py-1 rounded-full mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Prinsip Keterbukaan Publik
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Transparansi Keuangan & Kas RW
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              Setiap rupiah uang kas dari iuran dan donasi warga dilaporkan secara terbuka, jujur, dan dapat diaudit oleh seluruh warga RW 05.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Periode: <strong>Agustus 2026</strong></span>
          </div>
        </div>

        {/* 3 Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Card 1: Saldo Kas */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-emerald-500/20 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Saldo Kas RW Saat Ini
              </span>
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {formatCurrency(currentBalance)}
            </p>
            <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
              <span>● Status Rekening: <strong>Aktif & Terverifikasi</strong></span>
            </p>
          </div>

          {/* Card 2: Total Pemasukan */}
          <div className="p-6 rounded-2xl bg-white border border-emerald-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Pemasukan Bulan Ini
              </span>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ArrowDownRight className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black tracking-tight text-emerald-600">
              +{formatCurrency(incomeTotal)}
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Dari iuran warga RT 01-05 & kas pembangunan
            </p>
          </div>

          {/* Card 3: Total Pengeluaran */}
          <div className="p-6 rounded-2xl bg-white border border-rose-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Pengeluaran Bulan Ini
              </span>
              <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black tracking-tight text-rose-600">
              -{formatCurrency(expenseTotal)}
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Gaji satpam, operasional truk sampah & HUT RI
            </p>
          </div>
        </div>

        {/* Live Transaction Ledger Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              5 Mutasi Transaksi Kas Terakhir
            </h3>
            <span className="text-xs text-slate-500">Diperbarui real-time</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3">Tanggal</th>
                  <th className="px-6 py-3">No. Bukti & Uraian</th>
                  <th className="px-6 py-3">Kategori</th>
                  <th className="px-6 py-3">Tipe</th>
                  <th className="px-6 py-3 text-right">Nominal</th>
                  <th className="px-6 py-3 text-right">Saldo Kas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {latestTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-3.5 text-xs text-slate-600 whitespace-nowrap">
                      {formatDate(tx.date)}
                    </td>
                    <td className="px-6 py-3.5">
                      <p className="font-semibold text-slate-900 text-xs sm:text-sm">
                        {tx.title}
                      </p>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {tx.description} ({tx.transactionNumber})
                      </p>
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
                        {tx.category.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap">
                      {tx.type === "MASUK" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded">
                          <ArrowDownRight className="w-3.5 h-3.5" /> Masuk
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-700 font-bold text-xs bg-rose-50 px-2 py-0.5 rounded">
                          <ArrowUpRight className="w-3.5 h-3.5" /> Keluar
                        </span>
                      )}
                    </td>
                    <td
                      className={`px-6 py-3.5 text-right font-bold text-xs sm:text-sm whitespace-nowrap ${
                        tx.type === "MASUK" ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {tx.type === "MASUK" ? "+" : "-"}
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="px-6 py-3.5 text-right font-semibold text-slate-900 text-xs sm:text-sm whitespace-nowrap">
                      {formatCurrency(tx.balanceAfter)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}
