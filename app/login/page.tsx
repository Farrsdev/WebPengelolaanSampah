"use client";

import { useState } from "react";
import Link from "next/link";
import { Leaf, LogIn, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const { login } = useAuth();
  const [emailOrHp, setEmailOrHp] = useState("admin@ecowaste.id");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await login(emailOrHp, password);
      if (!res.success) {
        setError(res.error || "Login gagal.");
      }
    } catch {
      setError("Terjadi kesalahan sistem saat login.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md glass-card-static p-8 sm:p-10 animate-fade-in-up mx-4">
        {/* Logo Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 shadow-xl shadow-emerald-500/30 flex items-center justify-center text-white mb-3">
            <Leaf className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Selamat Datang</h1>
          <p className="text-xs text-slate-500 mt-1">Masuk ke Sistem Bank Sampah Digital</p>
        </div>

        {/* Demo Account Tip Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs space-y-1">
          <p className="font-bold">🔑 Akun Uji Coba Demo:</p>
          <p>• <b>Admin</b>: <code>admin@ecowaste.id</code> / <code>password123</code></p>
          <p>• <b>Warga</b>: <code>user@ecowaste.id</code> / <code>password123</code></p>
        </div>

        {/* Error Warning Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-700 flex items-center gap-3 text-xs font-semibold animate-fade-in">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Email atau Nomor HP</label>
            <input
              type="text"
              required
              value={emailOrHp}
              onChange={(e) => setEmailOrHp(e.target.value)}
              placeholder="Contoh: admin@ecowaste.id"
              className="w-full px-4 py-3.5 glass-input text-slate-800 text-sm font-semibold placeholder:text-slate-300"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3.5 glass-input text-slate-800 text-sm font-semibold placeholder:text-slate-300"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-bold text-sm shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 disabled:opacity-50"
          >
            <LogIn className="w-5 h-5" />
            {submitting ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-slate-500">
          Belum punya akun warga?{" "}
          <Link href="/register" className="font-bold text-emerald-600 hover:underline">
            Daftar Akun Warga
          </Link>
        </div>
    </div>
  );
}
