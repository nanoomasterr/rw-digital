"use client";

import React from "react";
import Link from "next/link";
import { Calendar, User, ArrowRight, Tag } from "lucide-react";
import { useApp } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export function ArticlesSection() {
  const { articles, rw } = useApp();

  return (
    <section id="berita" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
              Papan Informasi & Agenda
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
              Berita & Kegiatan Terkini {rw.name}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Ketahui agenda kerja bakti, posyandu, peringatan hari besar, dan pengumuman resmi lingkungan.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((art) => (
            <article
              key={art.id}
              className="group rounded-3xl bg-slate-50 border border-slate-200/80 overflow-hidden hover:shadow-xl hover:border-emerald-200 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Image & Badge */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-200">
                  <img
                    src={art.coverImageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-slate-900/80 text-emerald-400 backdrop-blur">
                      {art.category}
                    </span>
                    {art.isImportant && (
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-rose-600 text-white shadow-md animate-pulse">
                        Penting
                      </span>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(art.publishedAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {art.author}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug line-clamp-2">
                    {art.title}
                  </h3>

                  <p className="text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {art.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {art.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-white px-2.5 py-0.5 rounded-md border border-slate-200"
                      >
                        <Tag className="w-2.5 h-2.5 text-emerald-600" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <div className="w-full pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-emerald-700 group-hover:text-emerald-800">
                  <span>Baca Rincian Pengumuman</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
