"use client";

import { useState } from "react";
import Link from "next/link";
import { History, Search, ImagePlus, Eye, ArrowUpRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";

export default function WargaSetoranPage() {
  const { user } = useAuth();
  const { berat } = useStore();
  const [search, setSearch] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const getFallbackImage = (jenis?: string) => {
    const j = (jenis || "").toLowerCase();
    if (j.includes("kertas") || j.includes("kardus")) return "/uploads/sample_kertas.jpg";
    if (j.includes("logam") || j.includes("besi") || j.includes("kaleng")) return "/uploads/sample_logam.jpg";
    if (j.includes("kaca")) return "/uploads/sample_kaca.jpg";
    return "/uploads/sample_plastik.jpg";
  };

  const userRecords = user
    ? berat.filter(
        (r: any) =>
          r.user?.id === user.id ||
          r.userId === user.id ||
          (r.user?.email && user?.email && r.user.email.toLowerCase() === user.email.toLowerCase())
      )
    : [];

  const filtered = search
    ? userRecords.filter((r) => {
        const q = search.toLowerCase();
        const namaWil = (r.wilayah?.namaWilayah || "").toLowerCase();
        const kodeWil = (r.wilayah?.kodeWilayah || "").toLowerCase();
        const namaJenis = (r.jenisSampah?.namaJenis || "").toLowerCase();
        const catatan = (r.catatan || "").toLowerCase();
        return (
          namaWil.includes(q) ||
          kodeWil.includes(q) ||
          namaJenis.includes(q) ||
          catatan.includes(q)
        );
      })
    : userRecords;

  return (
    <div className="max-w-5xl space-y-8 animate-fade-in">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Setoran Saya</h1>
        <p className="text-slate-500 mt-1 text-sm">Riwayat lengkap setoran sampah kamu yang tercatat di sistem</p>
      </div>

      {/* Table Container */}
      <div className="glass-card-static overflow-hidden animate-fade-in-up">
        <div className="px-7 py-6 border-b border-slate-200/60 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-transparent flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Daftar Setoran</h2>
            <p className="text-xs text-slate-400 mt-0.5">Total {userRecords.length} transaksi setor sampah</p>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari wilayah, jenis, catatan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 glass-input text-xs font-medium text-slate-700 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-200/60 bg-slate-50/50 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <th className="px-7 py-4">Tanggal Setor</th>
                <th className="px-6 py-4">Wilayah</th>
                <th className="px-6 py-4">Jenis Sampah</th>
                <th className="px-6 py-4 text-center">Foto Sampah</th>
                <th className="px-6 py-4 text-right">Berat (kg)</th>
                <th className="px-6 py-4 text-right">Poin Diperoleh</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-7 py-12 text-center text-slate-400 text-sm">
                    {search ? "Data tidak ditemukan" : "Belum ada riwayat setor sampah"}
                  </td>
                </tr>
              ) : (
                filtered.map((r) => {
                  const fotoSrc = r.fotoSampah?.urlFoto || getFallbackImage(r.jenisSampah?.namaJenis);
                  return (
                    <tr key={r.id} className="hover:bg-emerald-500/[0.04] transition-colors duration-150">
                      <td className="px-7 py-4 text-slate-500 text-xs font-medium">
                        {new Date(r.tanggalSetor).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-700 text-xs block">{r.wilayah?.namaWilayah}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{r.wilayah?.kodeWilayah}</span>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-700">{r.jenisSampah?.namaJenis}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => setSelectedPhoto(fotoSrc)}
                            className="relative w-12 h-10 rounded-lg overflow-hidden border border-slate-200 hover:border-emerald-500 transition-colors shadow-sm group/photo flex items-center justify-center bg-slate-100"
                            title="Klik untuk melihat foto"
                          >
                            <img
                              src={fotoSrc}
                              alt="Sampah"
                              className="w-full h-full object-cover group-hover/photo:scale-110 transition-transform duration-300"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = getFallbackImage(r.jenisSampah?.namaJenis);
                              }}
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center text-white text-[8px] font-bold">
                              LIHAT
                            </div>
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-extrabold text-slate-800">
                        {Number(r.beratKg).toFixed(1)} kg
                      </td>
                      <td className="px-6 py-4 text-right font-extrabold text-emerald-600">
                        +{Number(r.subtotalPoin).toLocaleString("id-ID")} poin
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link
                          href={`/laporan/${r.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200/60 transition-all hover:scale-105"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detail</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Glassmorphism Photo Preview Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[80] bg-slate-950/65 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-lg w-full glass-card overflow-hidden p-3 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/20 bg-slate-900 flex items-center justify-center">
              <img
                src={selectedPhoto}
                alt="Pratinjau Foto Sampah"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%2310b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';
                }}
              />
            </div>
            <div className="mt-4 flex items-center justify-between px-2 pb-1">
              <div>
                <p className="text-sm font-bold text-slate-800">Bukti Foto Setor Sampah</p>
                <p className="text-xs text-slate-400 mt-0.5">Lampiran bukti asli setoran kamu</p>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white hover:bg-slate-700 font-semibold text-xs transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
