"use client";

import { User, Bell, Shield, Palette, ChevronRight, Mail, MapPin } from "lucide-react";
import { useAuth } from "@/lib/auth";

const sections = [
  {
    icon: User,
    title: "Profil Pengguna",
    description: "Kelola informasi akun dan preferensi pribadi",
    accent: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  {
    icon: Bell,
    title: "Notifikasi",
    description: "Atur pemberitahuan dan reminder harian",
    accent: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  {
    icon: Shield,
    title: "Keamanan",
    description: "Password, autentikasi dua faktor, dan log aktivitas",
    accent: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  {
    icon: Palette,
    title: "Tampilan",
    description: "Tema, bahasa, dan preferensi tampilan Glassmorphism",
    accent: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  },
];

export default function SettingsPage() {
  const { user } = useAuth();

  const userInitial = user?.nama ? user.nama[0].toUpperCase() : "U";
  const userRoleText = user?.role === "admin" ? "Administrator" : "Warga Penyetor";

  return (
    <div className="max-w-2xl space-y-8">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Pengaturan</h1>
        <p className="text-slate-500 mt-1 text-sm">Kelola preferensi dan konfigurasi sistem</p>
      </div>

      {/* User Profile Card */}
      <div className="glass-card-static p-8 animate-fade-in-up">
        <div className="flex items-center gap-6">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white font-extrabold text-3xl flex items-center justify-center shadow-xl shadow-emerald-500/30 ring-4 ring-white">
              {userInitial}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-white" />
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-slate-800 truncate">{user?.nama || "Loading..."}</h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1 text-xs text-slate-400">
              <span className="flex items-center gap-1 truncate"><Mail className="w-3.5 h-3.5 flex-shrink-0" /> {user?.email || "-"}</span>
              <span className="flex items-center gap-1 truncate"><MapPin className="w-3.5 h-3.5 flex-shrink-0" /> {user?.alamat || "Alamat belum diisi"}</span>
            </div>
            <span className="inline-block mt-3 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
              {userRoleText} (`User` Model)
            </span>
          </div>

          <button className="hidden sm:block px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100/60 transition-colors flex-shrink-0">
            Edit Profil
          </button>
        </div>
      </div>

      {/* Settings Navigation Cards */}
      <div className="space-y-4 stagger">
        {sections.map((sec) => (
          <button
            key={sec.title}
            className="w-full glass-card p-6 flex items-center justify-between text-left animate-fade-in-up group"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl ${sec.accent} border flex items-center justify-center shadow-md`}>
                <sec.icon className="w-5.5 h-5.5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors text-base">{sec.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">{sec.description}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all duration-200" />
          </button>
        ))}
      </div>
    </div>
  );
}
