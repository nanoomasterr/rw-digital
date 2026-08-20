"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store";
import { CashCategory, CashTransaction, Invoice, TransactionType } from "@/types";
import {
  CreditCard,
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  PlusCircle,
  CheckCircle2,
  Clock,
  Search,
  FileSpreadsheet,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AdminKeuanganPage() {
  const {
    invoices,
    cashTransactions,
    verifyInvoice,
    addCashTransaction,
    currentRole,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"iuran" | "kas">("iuran");
  const [selectedInvoiceStatus, setSelectedInvoiceStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State Tambah Transaksi Kas
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [txType, setTxType] = useState<TransactionType>("MASUK");
  const [txCategory, setTxCategory] = useState<CashCategory>("IURAN_WARGA");
  const [txTitle, setTxTitle] = useState("");
  const [txDescription, setTxDescription] = useState("");
  const [txAmount, setTxAmount] = useState<number>(100000);
  const [txDate, setTxDate] = useState(new Date().toISOString().slice(0, 10));
  const [notice, setNotice] = useState<string | null>(null);

  const currentBalance =
    cashTransactions.length > 0
      ? cashTransactions[cashTransactions.length - 1].balanceAfter
      : 0;

  const totalIncome = cashTransactions
    .filter((t) => t.type === "MASUK")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = cashTransactions
    .filter((t) => t.type === "KELUAR")
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Filter invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchStatus =
      selectedInvoiceStatus === "ALL" || inv.status === selectedInvoiceStatus;
    const matchQuery =
      inv.headOfFamilyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.familyCardNumber.includes(searchQuery) ||
      inv.houseNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchQuery;
  });

  const handleVerify = (inv: Invoice) => {
    const verifier = currentRole === "BENDAHARA" ? "Hj. Ratna (Bendahara RW)" : "Pengurus RW";
    verifyInvoice(inv.id, verifier);
    setNotice(`Iuran ${inv.headOfFamilyName} (${inv.houseNumber}) berhasil diverifikasi lunas & masuk Buku Kas.`);
    setTimeout(() => setNotice(null), 4000);
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txTitle || !txAmount) {
      alert("Mohon lengkapi judul dan nominal transaksi!");
      return;
    }

    addCashTransaction({
      date: txDate,
      type: txType,
      category: txCategory,
      title: txTitle,
      description: txDescription || "Pencatatan kas operasional lingkungan",
      amount: Number(txAmount),
      recordedBy: currentRole === "BENDAHARA" ? "Hj. Ratna (Bendahara RW)" : "Pengurus RW",
    });

    setTxModalOpen(false);
    setTxTitle("");
    setTxDescription("");
    setNotice("Transaksi kas berhasil disimpan ke Buku Kas Umum.");
    setTimeout(() => setNotice(null), 4000);
  };

  const handleExportCashCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,No,Tanggal,No Bukti,Uraian Transaksi,Kategori Pos,Tipe,Pemasukan,Pengeluaran,Saldo Akhir,Pencatat\n";
    cashTransactions.forEach((tx, idx) => {
      const masuk = tx.type === "MASUK" ? tx.amount : 0;
      const keluar = tx.type === "KELUAR" ? tx.amount : 0;
      csvContent += `${idx + 1},${tx.date},${tx.transactionNumber},"${tx.title}",${tx.category},${tx.type},${masuk},${keluar},${tx.balanceAfter},"${tx.recordedBy}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `buku_kas_umum_rw14_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Keuangan, E-Kas & Billing Iuran RW
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manajemen penagihan iuran warga bulanan dan pembukuan kas umum lingkungan secara transparan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeTab === "kas" && (
            <button
              type="button"
              onClick={handleExportCashCSV}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Ekspor Buku Kas (CSV)</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setTxModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Catat Transaksi Kas</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-emerald-700 font-bold">✕</button>
        </div>
      )}

      {/* Summary 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-md">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Saldo Kas RW Saat Ini
          </span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-2">
            {formatCurrency(currentBalance)}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Status: Siap Dialokasikan</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Kas Masuk
          </span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">
            +{formatCurrency(totalIncome)}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Iuran Warga & Donasi Pembangunan</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Kas Keluar
          </span>
          <p className="text-2xl sm:text-3xl font-black text-rose-600 mt-2">
            -{formatCurrency(totalExpense)}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Honor Satpam & Truk Sampah</p>
        </div>
      </div>

      {/* Control Tabs */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
          <button
            type="button"
            onClick={() => setActiveTab("iuran")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "iuran"
                ? "bg-white text-slate-900 shadow"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span>Tagihan Iuran Warga ({invoices.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("kas")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "kas"
                ? "bg-white text-slate-900 shadow"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Wallet className="w-4 h-4 text-blue-600" />
            <span>Buku Kas Umum ({cashTransactions.length} Mutasi)</span>
          </button>
        </div>

        {/* Filters for Iuran */}
        {activeTab === "iuran" && (
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Cari Nama Kepala Keluarga, No. KK, atau Blok..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
              {[
                { id: "ALL", label: "Semua Tagihan" },
                { id: "LUNAS", label: "Lunas" },
                { id: "MENUNGGU_VERIFIKASI", label: "Menunggu Verifikasi" },
                { id: "BELUM_BAYAR", label: "Belum Bayar" },
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setSelectedInvoiceStatus(st.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedInvoiceStatus === st.id
                      ? "bg-slate-900 text-white font-bold"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tab 1: Invoices Table & Mobile Cards */}
      {activeTab === "iuran" ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Mobile Card Feed (< md) */}
          <div className="block md:hidden divide-y divide-slate-100">
            {filteredInvoices.map((inv) => (
              <div key={inv.id} className="p-4 space-y-3 hover:bg-slate-50/70 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-[10px] text-slate-400 font-bold block">
                      {inv.invoiceNumber}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-sm">{inv.headOfFamilyName}</h3>
                    <p className="text-xs text-slate-500">{inv.houseNumber} (RT {inv.rtNumber})</p>
                  </div>
                  <div>
                    {inv.status === "LUNAS" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Lunas
                      </span>
                    ) : inv.status === "MENUNGGU_VERIFIKASI" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3 h-3" /> Menunggu
                      </span>
                    ) : (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        Belum Bayar
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500">Periode: <strong>{inv.billingPeriod}</strong></span>
                  <span className="font-black text-sm text-slate-900">{formatCurrency(inv.totalAmount)}</span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  {inv.status === "MENUNGGU_VERIFIKASI" ? (
                    <button
                      type="button"
                      onClick={() => handleVerify(inv)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow"
                    >
                      Verifikasi Lunas ({inv.paymentMethod})
                    </button>
                  ) : inv.status === "LUNAS" ? (
                    <span className="text-[11px] text-slate-400 font-medium">Pembayaran Sah</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleVerify(inv)}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                    >
                      Tandai Lunas
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table (>= md) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">No. Tagihan</th>
                  <th className="px-6 py-3.5">Kepala Keluarga</th>
                  <th className="px-6 py-3.5">Blok / RT</th>
                  <th className="px-6 py-3.5">Periode Tagihan</th>
                  <th className="px-6 py-3.5 text-right">Nominal</th>
                  <th className="px-6 py-3.5">Status Pembayaran</th>
                  <th className="px-6 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70">
                    <td className="px-6 py-3.5 font-mono font-bold text-slate-900">
                      {inv.invoiceNumber}
                    </td>
                    <td className="px-6 py-3.5 font-bold text-slate-900">
                      {inv.headOfFamilyName}
                    </td>
                    <td className="px-6 py-3.5 text-slate-600">
                      {inv.houseNumber} (RT {inv.rtNumber})
                    </td>
                    <td className="px-6 py-3.5 text-slate-600 font-medium">
                      {inv.billingPeriod}
                    </td>
                    <td className="px-6 py-3.5 text-right font-black text-slate-900">
                      {formatCurrency(inv.totalAmount)}
                    </td>
                    <td className="px-6 py-3.5">
                      {inv.status === "LUNAS" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Lunas ({inv.paymentMethod})
                        </span>
                      ) : inv.status === "MENUNGGU_VERIFIKASI" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3" /> Menunggu Verifikasi
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          Belum Bayar
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      {inv.status === "MENUNGGU_VERIFIKASI" ? (
                        <button
                          type="button"
                          onClick={() => handleVerify(inv)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow"
                        >
                          Verifikasi Lunas
                        </button>
                      ) : inv.status === "LUNAS" ? (
                        <span className="text-[11px] text-slate-400 font-medium">Sah</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleVerify(inv)}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                        >
                          Tandai Lunas
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Tab 2: Buku Kas Umum */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Mobile Card Feed for BKU (< md) */}
          <div className="block md:hidden divide-y divide-slate-100">
            {cashTransactions.map((tx) => (
              <div key={tx.id} className="p-4 space-y-2 hover:bg-slate-50/70 transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-slate-500 font-medium">
                      {formatDate(tx.date)}
                    </span>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {tx.category.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div>
                    {tx.type === "MASUK" ? (
                      <span className="inline-flex items-center gap-0.5 font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded text-[10px]">
                        <ArrowDownRight className="w-3 h-3" /> Masuk
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded text-[10px]">
                        <ArrowUpRight className="w-3 h-3" /> Keluar
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="font-bold text-slate-900 text-xs leading-snug">{tx.title}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {tx.description} <span className="font-mono text-[10px] text-slate-400">({tx.transactionNumber})</span>
                  </p>
                </div>

                <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-[11px] text-slate-500">
                    Saldo: <strong className="text-slate-800">{formatCurrency(tx.balanceAfter)}</strong>
                  </div>
                  <div
                    className={`font-black text-xs sm:text-sm ${
                      tx.type === "MASUK" ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {tx.type === "MASUK" ? "+" : "-"}
                    {formatCurrency(tx.amount)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table for BKU (>= md) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Tanggal</th>
                  <th className="px-6 py-3.5">No. Bukti & Uraian</th>
                  <th className="px-6 py-3.5">Kategori Pos</th>
                  <th className="px-6 py-3.5">Tipe</th>
                  <th className="px-6 py-3.5 text-right">Pemasukan / Pengeluaran</th>
                  <th className="px-6 py-3.5 text-right">Saldo Kas Berjalan</th>
                  <th className="px-6 py-3.5">Petugas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cashTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/70">
                    <td className="px-6 py-3.5 text-slate-600 whitespace-nowrap">
                      {formatDate(tx.date)}
                    </td>
                    <td className="px-6 py-3.5">
                      <p className="font-bold text-slate-900">{tx.title}</p>
                      <p className="text-[11px] text-slate-500">{tx.description} ({tx.transactionNumber})</p>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700">
                        {tx.category.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      {tx.type === "MASUK" ? (
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                          <ArrowDownRight className="w-3 h-3" /> Kas Masuk
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-[11px]">
                          <ArrowUpRight className="w-3 h-3" /> Kas Keluar
                        </span>
                      )}
                    </td>
                    <td
                      className={`px-6 py-3.5 text-right font-black whitespace-nowrap ${
                        tx.type === "MASUK" ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {tx.type === "MASUK" ? "+" : "-"}
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="px-6 py-3.5 text-right font-black text-slate-900 whitespace-nowrap">
                      {formatCurrency(tx.balanceAfter)}
                    </td>
                    <td className="px-6 py-3.5 text-slate-500 text-[11px]">
                      {tx.recordedBy}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Tambah Transaksi Kas */}
      {txModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                Pencatatan Buku Kas RW
              </h3>
              <button
                type="button"
                onClick={() => setTxModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jenis Transaksi</label>
                  <select
                    value={txType}
                    onChange={(e) => setTxType(e.target.value as TransactionType)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option value="MASUK">Pemasukan (+)</option>
                    <option value="KELUAR">Pengeluaran (-)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori Pos</label>
                  <select
                    value={txCategory}
                    onChange={(e) => setTxCategory(e.target.value as CashCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option value="IURAN_WARGA">Iuran Warga</option>
                    <option value="KAS_PEMBANGUNAN">Kas Pembangunan</option>
                    <option value="DANA_SOSIAL">Dana Sosial & Santunan</option>
                    <option value="KEBERSIHAN_SAMPAH">Kebersihan & Sampah</option>
                    <option value="KEAMANAN_RONDA">Keamanan & Satpam</option>
                    <option value="OPERASIONAL_RW">Operasional RW</option>
                    <option value="KEGIATAN_WARGA">Kegiatan 17-an / Posyandu</option>
                    <option value="LAINNYA">Lainnya</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Uraian Transaksi</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pembelian lampu sorot lapangan RT 02"
                  value={txTitle}
                  onChange={(e) => setTxTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nominal (Rupiah)</label>
                  <input
                    type="number"
                    required
                    min={1000}
                    value={txAmount}
                    onChange={(e) => setTxAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal Transaksi</label>
                  <input
                    type="date"
                    required
                    value={txDate}
                    onChange={(e) => setTxDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Catatan Keterangan</label>
                <textarea
                  rows={2}
                  placeholder="Keterangan tambahan atau nomor nota toko..."
                  value={txDescription}
                  onChange={(e) => setTxDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTxModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow"
                >
                  Simpan ke Buku Kas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
