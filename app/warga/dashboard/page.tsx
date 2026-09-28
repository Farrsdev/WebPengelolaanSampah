"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Coins, TrendingUp, History, Gift, Recycle, ArrowUpRight, Calendar, MapPin } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";
import { getSaldoWarga, getKegiatan } from "@/lib/actions";
import { poinToRupiah, cashRateLabel } from "@/lib/poin";

export default function WargaDashboardPage() {
  const { user } = useAuth();
  const { berat } = useStore();
  const [saldo, setSaldo] = useState({ saldoPoin: 0, totalKredit: 0, totalDebit: 0, logs: [] as any[] });
  const [kegiatans, setKegiatans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    getSaldoWarga(user.id)
      .then((data) => setSaldo(data))
      .finally(() => setLoading(false));

    getKegiatan().then((data) => setKegiatans(data));
  }, [user]);

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
  const totalKgWarga = userRecords.reduce((sum, r) => sum + Number(r.beratKg), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in-up flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Halo, {user?.nama || "Warga"} 👋
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Dashboard Warga Penyetor Sampah</p>
        </div>
        <Link
          href="/warga/penukaran"
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all duration-300"
        >
          <Gift className="w-4.5 h-4.5" />
          Tukar Poin
        </Link>
      </div>

      {/* Saldo Poin & Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 stagger">
        {/* Main Saldo Card */}
        <div className="relative overflow-hidden glass-card p-6 bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-transparent border border-emerald-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Coins className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
              Double-Entry Ledger
            </span>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Saldo Poin Kamu</p>
            <p className="text-4xl font-black text-emerald-600 mt-1 tracking-tight">
              {saldo.saldoPoin.toLocaleString("id-ID")}{" "}
              <span className="text-sm font-semibold text-slate-400">poin</span>
            </p>
            <p className="text-xs text-slate-400 font-medium mt-2">
              ≈ Rp {poinToRupiah(saldo.saldoPoin).toLocaleString("id-ID")} jika dicairkan ({cashRateLabel})
            </p>
          </div>
        </div>

        {/* Total Setor Kg */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-600 text-white flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Recycle className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-slate-400">Total Setor</span>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Sampah Dipilah</p>
            <p className="text-3xl font-extrabold text-slate-800 mt-1 tracking-tight">
              {totalKgWarga.toFixed(1)} <span className="text-sm font-semibold text-slate-400">kg</span>
            </p>
            <p className="text-xs text-slate-400 font-medium mt-2">{userRecords.length} transaksi setor</p>
          </div>
        </div>

        {/* Total Poin Diperoleh */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 text-white flex items-center justify-center shadow-lg shadow-green-500/20">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-emerald-600">Terbanyak</span>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Poin Masuk</p>
            <p className="text-3xl font-extrabold text-slate-800 mt-1 tracking-tight">
              +{saldo.totalKredit.toLocaleString("id-ID")}
            </p>
            <p className="text-xs text-slate-400 font-medium mt-2">Dihitung dari SUM(kredit) SaldoLog</p>
          </div>
        </div>
      </div>

      {/* Agenda Kegiatan Komunitas */}
      {kegiatans.length > 0 && (
        <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
          <h2 className="text-lg font-bold text-slate-800">Agenda Kegiatan Komunitas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {kegiatans.slice(0, 3).map((k) => (
              <div key={k.id} className="bg-white rounded-2xl border border-slate-200/50 p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg w-max">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {new Date(k.tanggal).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short"
                    })}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-800 line-clamp-1">{k.judul}</h3>
                <p className="text-[11px] text-slate-500 line-clamp-2">{k.deskripsi}</p>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold pt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-350" />
                  <span>{k.lokasi}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Histori Setor Warga */}
      <div className="glass-card-static overflow-hidden animate-fade-in-up" style={{ animationDelay: "200ms" }}>
        <div className="px-7 py-6 border-b border-slate-200/60 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-transparent flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Histori Setor Sampah Kamu</h2>
            <p className="text-xs text-slate-400">Daftar setoran sampah yang sudah dicatat oleh admin</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-200/60 text-slate-600">
            {userRecords.length} setoran
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-200/60 bg-slate-50/50 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <th className="px-7 py-4">Tanggal Setor</th>
                <th className="px-6 py-4">Wilayah</th>
                <th className="px-6 py-4">Jenis Sampah</th>
                <th className="px-6 py-4 text-center">Foto</th>
                <th className="px-6 py-4 text-right">Berat (kg)</th>
                <th className="px-6 py-4 text-right">Poin Diterima</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {userRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-7 py-12 text-center text-slate-400 text-sm">
                    Belum ada riwayat setor sampah. Silakan setorkan sampah kamu ke Bank Sampah!
                  </td>
                </tr>
              ) : (
                userRecords.map((r) => {
                  const fotoSrc = r.fotoSampah?.urlFoto || getFallbackImage(r.jenisSampah?.namaJenis);
                  return (
                    <tr key={r.id} className="hover:bg-emerald-500/[0.04] transition-colors duration-150">
                      <td className="px-7 py-4 text-slate-500 text-xs font-medium">
                        {new Date(r.tanggalSetor).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700 text-xs">{r.wilayah?.namaWilayah}</td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-700">{r.jenisSampah?.namaJenis}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => setSelectedPhoto(fotoSrc)}
                            className="relative w-10 h-8 rounded-lg overflow-hidden border border-slate-200 hover:border-emerald-500 transition-colors shadow-sm group/photo flex items-center justify-center bg-slate-100"
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
                            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center text-white text-[8px] font-bold">
                              BUKA
                            </div>
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-extrabold text-slate-800">{Number(r.beratKg).toFixed(1)} kg</td>
                      <td className="px-6 py-4 text-right font-extrabold text-emerald-600">
                        +{Number(r.subtotalPoin).toLocaleString("id-ID")} poin
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link
                          href={`/laporan/${r.id}`}
                          className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200/60 transition-colors"
                        >
                          Detail
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
                <p className="text-xs text-slate-400 mt-0.5">Lampiran bukti asli setoran warga</p>
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
