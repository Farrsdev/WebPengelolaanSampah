"use client";

import { useState } from "react";
import Link from "next/link";
import { Leaf, UserPlus, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function RegisterPage() {
  const { register } = useAuth();
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [noHp, setNoHp] = useState("");
  const [password, setPassword] = useState("");
  const [alamat, setAlamat] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await register({ nama, email, noHp, password, alamat });
      if (!res.success) {
        setError(res.error || "Pendaftaran gagal.");
      }
    } catch {
      setError("Terjadi kesalahan sistem saat mendaftar.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md glass-card-static p-8 sm:p-10 animate-fade-in-up mx-4">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 shadow-xl shadow-emerald-500/30 flex items-center justify-center text-white mb-3">
            <Leaf className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Daftar Akun Warga</h1>
          <p className="text-xs text-slate-500 mt-1">Bergabung dengan Bank Sampah Komunitas</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-700 flex items-center gap-3 text-xs font-semibold animate-fade-in">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Nama Lengkap</label>
            <input
              type="text"
              required
              minLength={3}
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Siti Nurhaliza"
              className="w-full px-4 py-3 glass-input text-slate-800 text-sm font-semibold placeholder:text-slate-300"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Email (Unique)</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="siti@ecowaste.id"
              className="w-full px-4 py-3 glass-input text-slate-800 text-sm font-semibold placeholder:text-slate-300"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Nomor HP (Unique)</label>
            <input
              type="tel"
              required
              minLength={9}
              value={noHp}
              onChange={(e) => setNoHp(e.target.value)}
              placeholder="081298765432"
              className="w-full px-4 py-3 glass-input text-slate-800 text-sm font-semibold placeholder:text-slate-300"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="w-full px-4 py-3 glass-input text-slate-800 text-sm font-semibold placeholder:text-slate-300"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Alamat (Opsional)</label>
            <input
              type="text"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              placeholder="Contoh: RT 03 / RW 05"
              className="w-full px-4 py-3 glass-input text-slate-800 text-sm font-medium placeholder:text-slate-300"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-bold text-sm shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 mt-2 disabled:opacity-50"
          >
            <UserPlus className="w-5 h-5" />
            {submitting ? "Mendaftarkan..." : "Daftar Akun Warga"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-bold text-emerald-600 hover:underline">
            Login di sini
          </Link>
        </div>
    </div>
  );
}
