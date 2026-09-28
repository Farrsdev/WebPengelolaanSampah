"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Coins,
  Copy,
  Check,
  Download,
  ExternalLink,
  FileCheck,
  FileText,
  Image as ImageIcon,
  Info,
  Layers,
  MapPin,
  Maximize2,
  Printer,
  QrCode,
  Recycle,
  Scale,
  ShieldCheck,
  Sparkles,
  Tag,
  User,
  X
} from "lucide-react";
import { getLaporanById } from "@/lib/actions";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";
import { cashRateLabel } from "@/lib/poin";

export default function DetailLaporanPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const { showToast } = useStore();

  const id = typeof params?.id === "string" ? params.id : "";
  const [laporan, setLaporan] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getLaporanById(id)
      .then((data) => {
        setLaporan(data);
      })
      .catch((err) => {
        console.error("Gagal memuat detail laporan:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast("Kode / ID berhasil disalin ke clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Category specific fallback image
  const getFallbackImage = (jenis?: string) => {
    const j = (jenis || "").toLowerCase();
    if (j.includes("kertas") || j.includes("kardus")) return "/uploads/sample_kertas.jpg";
    if (j.includes("logam") || j.includes("besi") || j.includes("kaleng")) return "/uploads/sample_logam.jpg";
    if (j.includes("kaca")) return "/uploads/sample_kaca.jpg";
    return "/uploads/sample_plastik.jpg";
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
        <div className="h-8 bg-slate-200/60 rounded-xl w-48 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 h-96 bg-white/70 rounded-3xl border border-slate-200/50 animate-pulse" />
          <div className="lg:col-span-6 space-y-4">
            <div className="h-40 bg-white/70 rounded-3xl border border-slate-200/50 animate-pulse" />
            <div className="h-48 bg-white/70 rounded-3xl border border-slate-200/50 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!laporan) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 space-y-6 animate-fade-in">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
          <FileText className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Laporan Tidak Ditemukan</h2>
          <p className="text-slate-500 text-sm mt-1.5">
            Data laporan sampah dengan ID tersebut tidak tersedia atau telah dihapus.
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>
      </div>
    );
  }

  const fotoUrl = laporan.fotoSampah?.urlFoto || getFallbackImage(laporan.jenisSampah?.namaJenis);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/60 text-slate-600 shadow-sm transition-all hover:scale-105"
            title="Kembali"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {isAdmin ? "Admin Panel" : "Warga Panel"} / Setoran Sampah
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                Terverifikasi
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight mt-0.5">
              Detail Laporan Sampah
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => copyToClipboard(laporan.kodeSetor || laporan.id)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/60 text-slate-700 text-xs font-bold shadow-sm transition-all"
            title="Salin Kode Setor"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-400" />}
            <span>{copied ? "Tersalin!" : "Salin Kode"}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-extrabold shadow-md shadow-emerald-800/15 transition-all hover:scale-[1.02]"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Struk</span>
          </button>
        </div>
      </div>

      {/* Main Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual Image & Photo Evidence (Relasi 1:1) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Card Bukti Foto Fisik */}
          <div className="glass-card-static p-6 bg-white shadow-sm border-slate-200/60 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800">Bukti Foto Sampah</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Relasi 1:1 (FotoSampah)
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                1 Transaksi = 1 Foto
              </span>
            </div>

            {/* Photo Container */}
            <div className="relative group rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-900/5 aspect-4/3 flex items-center justify-center">
              <img
                src={fotoUrl}
                alt="Foto Bukti Setoran Sampah"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getFallbackImage(laporan.jenisSampah?.namaJenis);
                }}
              />

              {/* Overlay on hover for preview */}
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                <button
                  onClick={() => setIsZoomed(true)}
                  className="p-3 rounded-2xl bg-white/90 text-slate-800 hover:bg-white font-bold text-xs shadow-xl flex items-center gap-2 transform hover:scale-110 transition-transform"
                >
                  <Maximize2 className="w-4 h-4 text-emerald-600" />
                  Perbesar Gambar
                </button>
              </div>

              {/* Tag di sudut gambar */}
              <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 shadow-lg border border-white/15">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Bukti Otentik Setoran</span>
              </div>
            </div>

            {/* Metadata Foto */}
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Format</span>
                <span className="font-extrabold text-slate-700 mt-0.5 block">
                  {laporan.fotoSampah?.tipeFile || "image/jpeg"}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Ukuran</span>
                <span className="font-extrabold text-slate-700 mt-0.5 block">
                  {laporan.fotoSampah?.ukuranKb ? `${laporan.fotoSampah.ukuranKb} KB` : "512 KB"}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Status</span>
                <span className="font-extrabold text-emerald-600 mt-0.5 block">Tervalidasi</span>
              </div>
            </div>
          </div>

          {/* Catatan Tambahan Card */}
          <div className="glass-card-static p-6 bg-white shadow-sm border-slate-200/60">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Info className="w-4 h-4 text-emerald-600" />
              <span>Catatan Petugas / Penyetor</span>
            </div>
            <p className="text-xs font-medium text-slate-700 leading-relaxed bg-slate-50/80 p-4 rounded-xl border border-slate-200/50">
              {laporan.catatan || "Tidak ada catatan khusus pada setoran ini."}
            </p>
          </div>
        </div>

        {/* Right Column: Transaction Details, Citizen, Points Calculation */}
        <div className="lg:col-span-6 space-y-6">
          {/* Card 1: Poin & Hasil Konversi (Highlight) */}
          <div className="p-8 rounded-3xl bg-emerald-800 text-white shadow-xl relative overflow-hidden group">
            {/* Ambient Background Blur */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-600/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/10 rounded-full blur-2xl" />

            <div className="flex items-center justify-between relative z-10">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200">
                Poin Masuk (Kredit)
              </span>
              <span className="text-[10px] font-extrabold bg-white/15 px-3 py-1 rounded-full border border-white/20">
                {cashRateLabel}
              </span>
            </div>

            <div className="mt-4 mb-6 relative z-10">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black tracking-tight">
                  +{Number(laporan.subtotalPoin).toLocaleString("id-ID")}
                </span>
                <span className="text-base font-bold text-emerald-200">Poin</span>
              </div>
              <p className="text-xs text-emerald-100/80 mt-1 font-semibold">
                Setara dengan saldo tunai:{" "}
                <span className="text-white font-extrabold">
                  Rp {Number(laporan.subtotalPoin).toLocaleString("id-ID")}
                </span>
              </p>
            </div>

            {/* Formula Perhitungan */}
            <div className="pt-4 border-t border-white/15 space-y-2 text-xs relative z-10">
              <div className="flex justify-between items-center text-emerald-100">
                <span>Berat Timbangan:</span>
                <span className="font-extrabold text-white text-sm">
                  {Number(laporan.beratKg).toFixed(2)} kg
                </span>
              </div>
              <div className="flex justify-between items-center text-emerald-100">
                <span>Harga Snapshot ({laporan.jenisSampah?.namaJenis}):</span>
                <span className="font-extrabold text-white">
                  Rp {Number(laporan.hargaSnapshot).toLocaleString("id-ID")} / kg
                </span>
              </div>
              <div className="flex justify-between items-center text-emerald-200 text-[11px] pt-1">
                <span>Perhitungan:</span>
                <span className="font-mono font-bold text-white">
                  {Number(laporan.beratKg).toFixed(2)} kg × Rp {Number(laporan.hargaSnapshot).toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Identitas Warga Penyetor */}
          <div className="glass-card-static p-6 bg-white shadow-sm border-slate-200/60">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Identitas Warga Penyetor
                </h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400">Penyetor Terdaftar</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-800 flex items-center justify-center font-extrabold text-lg shadow-sm border border-emerald-500/20">
                {(laporan.user?.nama || "W")[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-extrabold text-slate-800 truncate">
                  {laporan.user?.nama || "Warga Tanpa Nama"}
                </p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Email: <span className="text-slate-600 font-semibold">{laporan.user?.email}</span>
                </p>
                <p className="text-xs text-slate-400 font-medium">
                  No. HP: <span className="text-slate-600 font-semibold">{laporan.user?.noHp}</span>
                </p>
              </div>
            </div>

            {laporan.user?.alamat && (
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                <span>{laporan.user.alamat}</span>
              </div>
            )}
          </div>

          {/* Card 3: Spesifikasi Master Data Relasi (Jenis Sampah & Wilayah) */}
          <div className="glass-card-static p-6 bg-white shadow-sm border-slate-200/60 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Relasi Master Data (1 to N)
                </h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Foreign Keys
              </span>
            </div>

            {/* Master Jenis Sampah */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center">
                  <Recycle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-800">
                    {laporan.jenisSampah?.namaJenis || "Kategori Sampah"}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {laporan.jenisSampah?.keterangan || "Dapat didaur ulang"}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-lg">
                Rp {Number(laporan.jenisSampah?.hargaPerKg || laporan.hargaSnapshot).toLocaleString("id-ID")}/kg
              </span>
            </div>

            {/* Master Wilayah */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-700 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-800">
                    {laporan.wilayah?.namaWilayah || "Wilayah Pengumpulan"}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {laporan.wilayah?.deskripsi || "Pusat Setor RT/RW"}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-200/60 px-2.5 py-1 rounded-lg">
                {laporan.wilayah?.kodeWilayah || "WIL-01"}
              </span>
            </div>
          </div>

          {/* Card 4: Audit Trail & Timestamps */}
          <div className="glass-card-static p-6 bg-white shadow-sm border-slate-200/60 text-xs space-y-3">
            <div className="flex justify-between items-center text-slate-500">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                Tanggal Penyetoran:
              </span>
              <span className="font-bold text-slate-800">
                {new Date(laporan.tanggalSetor).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                })}
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-500">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                Waktu Transaksi:
              </span>
              <span className="font-bold text-slate-800">
                {new Date(laporan.tanggalSetor).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit"
                })}{" "}
                WIB
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-500 pt-2 border-t border-slate-100">
              <span className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-slate-400" />
                Kode / ID Laporan:
              </span>
              <span className="font-mono text-[11px] font-bold text-slate-600">
                {laporan.kodeSetor ? laporan.kodeSetor.substring(0, 16) : laporan.id.substring(0, 16)}...
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox / Zoom Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-[90] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 border border-white/20 rounded-3xl overflow-hidden shadow-2xl p-4 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-3 pb-3 border-b border-white/10 text-white">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-extrabold uppercase tracking-wider">
                  Bukti Foto Fisik Setoran (High Resolution)
                </span>
              </div>
              <button
                onClick={() => setIsZoomed(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image */}
            <div className="relative aspect-16/10 w-full flex items-center justify-center bg-black/40 rounded-2xl overflow-hidden mt-3">
              <img
                src={fotoUrl}
                alt="Bukti Foto Sampah HD"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getFallbackImage(laporan.jenisSampah?.namaJenis);
                }}
              />
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-3 pt-3 text-xs text-slate-400">
              <span>{laporan.jenisSampah?.namaJenis} • {Number(laporan.beratKg).toFixed(1)} kg • {laporan.wilayah?.namaWilayah}</span>
              <button
                onClick={() => setIsZoomed(false)}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
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
