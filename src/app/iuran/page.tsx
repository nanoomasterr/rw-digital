"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useApp } from "@/lib/store";
import { Invoice } from "@/types";
import {
  CreditCard,
  Search,
  CheckCircle2,
  Clock,
  QrCode,
  Building,
  Upload,
  ShieldCheck,
  Receipt,
  FileCheck,
} from "lucide-react";
import { formatCurrency, formatDate, maskFamilyCard } from "@/lib/utils";

export default function IuranPage() {
  const { invoices, payInvoice, rw, rts } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [payMethod, setPayMethod] = useState<"QRIS" | "TRANSFER_BANK">("QRIS");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Filter invoices
  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.headOfFamilyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.familyCardNumber.includes(searchQuery) ||
      inv.houseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenPayment = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setPaymentSuccess(false);
    setPaymentModalOpen(true);
  };

  const handleExecutePayment = () => {
    if (!selectedInvoice) return;
    setIsProcessing(true);

    setTimeout(() => {
      payInvoice(selectedInvoice.id, payMethod);
      setIsProcessing(false);
      setPaymentSuccess(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Header Banner */}
      <div className="bg-slate-900 text-white py-12 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-teal-400 uppercase tracking-widest bg-teal-950/60 px-3 py-1 rounded-full border border-teal-800">
                Transparansi Iuran Warga
              </span>
              <h1 className="text-3xl font-black tracking-tight mt-2 text-white">
                Cek & Bayar Iuran Lingkungan (IPL)
              </h1>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                Cek tagihan rutin bulanan (Keamanan, Kebersihan Sampah & Kas Sosial) per Kepala Keluarga serta bayar langsung via QRIS / Transfer.
              </p>
            </div>

            <div className="p-3 bg-slate-800/90 rounded-2xl border border-slate-700 text-xs space-y-1 self-start md:self-auto">
              <p className="text-slate-400">Tarif Iuran Rutin / KK / Bulan:</p>
              <p className="font-extrabold text-teal-400 text-base">
                Rp 100.000 <span className="text-xs text-slate-400 font-normal">/ bulan</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Cari Nama Kepala Keluarga / No. KK / Blok..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 self-end sm:self-auto">
              <span>Menampilkan: <strong>{filteredInvoices.length} Data Tagihan</strong></span>
            </div>
          </div>
        </div>

        {/* Invoices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvoices.map((inv) => {
            const isPaid = inv.status === "LUNAS";
            const isPending = inv.status === "MENUNGGU_VERIFIKASI";

            return (
              <div
                key={inv.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar */}
                  <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-mono text-slate-400 font-bold block">
                        {inv.invoiceNumber}
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-base mt-0.5">
                        {inv.headOfFamilyName}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {inv.houseNumber} (RT {inv.rtNumber})
                      </p>
                    </div>

                    <div>
                      {isPaid ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Lunas
                        </span>
                      ) : isPending ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3.5 h-3.5" /> Verifikasi
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          Belum Bayar
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="p-6 space-y-2.5 text-xs text-slate-600 bg-slate-50/50">
                    <div className="flex justify-between items-center">
                      <span>Periode Tagihan:</span>
                      <strong className="text-slate-900">{inv.billingPeriod}</strong>
                    </div>
                    <div className="flex justify-between items-center text-slate-500">
                      <span>• Keamanan & Ronda:</span>
                      <span>{formatCurrency(inv.breakdown.securityFee)}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-500">
                      <span>• Kebersihan & Truk Sampah:</span>
                      <span>{formatCurrency(inv.breakdown.cleanlinessFee)}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-500">
                      <span>• Dana Sosial & Kas RW:</span>
                      <span>{formatCurrency(inv.breakdown.communityFee)}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-black text-slate-900">
                      <span>Total Tagihan:</span>
                      <span className="text-emerald-700">{formatCurrency(inv.totalAmount)}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 pt-4 border-t border-slate-100 bg-white">
                  {isPaid ? (
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Metode: <strong>{inv.paymentMethod}</strong></span>
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <FileCheck className="w-4 h-4" /> Kwitansi Sah
                      </span>
                    </div>
                  ) : isPending ? (
                    <p className="text-xs text-amber-700 text-center font-medium">
                      Bukti transfer sedang diperiksa oleh Bendahara RW.
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenPayment(inv)}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Bayar Sekarang</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </main>

      {/* Payment Modal */}
      {paymentModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Pembayaran Iuran Warga
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedInvoice.headOfFamilyName} ({selectedInvoice.houseNumber})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPaymentModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            {paymentSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-black text-slate-900">
                  Pembayaran Berhasil Dikonfirmasi!
                </h4>
                <p className="text-xs text-slate-600">
                  Terima kasih! Iuran periode <strong>{selectedInvoice.billingPeriod}</strong> telah tercatat lunas dan otomatis masuk ke Buku Kas RW.
                </p>
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(false)}
                  className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-xs shadow mt-4"
                >
                  Tutup Jendela
                </button>
              </div>
            ) : (
              <>
                {/* Amount Box */}
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                  <span className="text-xs text-emerald-800 font-semibold">Total Tagihan</span>
                  <p className="text-2xl font-black text-emerald-700 mt-0.5">
                    {formatCurrency(selectedInvoice.totalAmount)}
                  </p>
                  <p className="text-[11px] text-emerald-600 mt-1">Periode: {selectedInvoice.billingPeriod}</p>
                </div>

                {/* Select Payment Method */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Pilih Metode Pembayaran:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPayMethod("QRIS")}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                        payMethod === "QRIS"
                          ? "border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <QrCode className="w-5 h-5 text-emerald-600" />
                      <span>QRIS (Otomatis)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPayMethod("TRANSFER_BANK")}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                        payMethod === "TRANSFER_BANK"
                          ? "border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <Building className="w-5 h-5 text-blue-600" />
                      <span>Transfer Bank</span>
                    </button>
                  </div>
                </div>

                {/* QRIS View */}
                {payMethod === "QRIS" ? (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
                    <p className="text-xs text-slate-600">
                      Scan QRIS berikut menggunakan BCA Mobile, Mandiri Livin, GoPay, OVO, ShopeePay, atau DANA:
                    </p>
                    <div className="w-44 h-44 bg-white p-3 rounded-xl mx-auto border border-slate-200 shadow-sm flex items-center justify-center">
                      <div className="space-y-1 text-center">
                        <QrCode className="w-28 h-28 mx-auto text-slate-900" />
                        <span className="text-[10px] font-mono text-slate-500 font-bold block">
                          NMID: ID1029384756
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Atas Nama: <strong>{rw.bankAccount.accountHolder}</strong>
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-700">
                    <p className="font-semibold text-slate-900">Rekening Resmi RW 05:</p>
                    <p>Bank: <strong>{rw.bankAccount.bankName}</strong></p>
                    <p>No. Rekening: <strong className="text-emerald-700 font-mono text-sm">{rw.bankAccount.accountNumber}</strong></p>
                    <p>Atas Nama: <strong>{rw.bankAccount.accountHolder}</strong></p>
                  </div>
                )}

                {/* Submit Action */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleExecutePayment}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Memproses Konfirmasi Pembayaran...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{payMethod === "QRIS" ? "Simulasi Bayar Lunas Sekarang" : "Konfirmasi Pembayaran Transfer"}</span>
                    </>
                  )}
                </button>
              </>
            )}

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}


