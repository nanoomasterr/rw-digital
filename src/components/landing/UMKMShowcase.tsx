"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag, Star, MessageCircle, ArrowRight, Store } from "lucide-react";
import { useApp } from "@/lib/store";

export function UMKMShowcase() {
  const { umkms, rw } = useApp();

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full mb-2">
              <Store className="w-4 h-4 text-amber-600" />
              Pemberdayaan Ekonomi Warga
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Pojok UMKM & Pasar Digital {rw.name}
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              Beli dari tetangga sendiri! Temukan katering lezat, jasa servis AC, toko sembako, dan laundry terpercaya di sekitar rumah Anda.
            </p>
          </div>

          <Link
            href="/umkm"
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800"
          >
            <span>Jelajahi Semua Produk ({umkms.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {umkms.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Image */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.businessName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur text-emerald-400 font-bold text-[10px] uppercase px-2.5 py-1 rounded-full">
                    {item.category}
                  </div>
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur text-slate-800 font-bold text-xs px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{item.rating || 5.0}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Pemilik: {item.ownerName}</span>
                    <span className="font-semibold text-emerald-700">RT {item.rtNumber}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-emerald-700 transition-colors line-clamp-1">
                    {item.businessName}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <p className="text-xs font-extrabold text-emerald-700 pt-1">
                    {item.priceRange}
                  </p>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <div className="p-4 pt-0">
                <a
                  href={`https://wa.me/${item.whatsappNumber}?text=Halo%20${encodeURIComponent(item.businessName)},%20saya%20warga%20RW%2005%20ingin%20tanya%20produk%20Anda`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
