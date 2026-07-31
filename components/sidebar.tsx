"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Recycle,
  Users,
  Coins,
  History,
  Database,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Calendar,
  MessageSquare
} from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function Sidebar() {
  const pathname = usePathname();
  const { user, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass = (href: string) => {
    const active = pathname === href;
    return `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200 ${
      active
        ? "bg-emerald-100 text-emerald-800 shadow-sm"
        : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
    }`;
  };

  const nav = (
    <div className="flex flex-col h-full bg-slate-50 border-r border-slate-200/60 p-4">
      {/* Title Header */}
      <div className="px-3 py-6">
        <h1 className="text-base font-black text-slate-800 tracking-tight leading-none">
          {isAdmin ? "Admin Panel" : "Warga Panel"}
        </h1>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">
          Waste Bank Manager
        </p>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 space-y-1 mt-4">
        {isAdmin ? (
          <>
            {/* Admin Menu */}
            <Link href="/admin/dashboard" className={linkClass("/admin/dashboard")} onClick={() => setMobileOpen(false)}>
              <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
              Dashboard
            </Link>

            <Link href="/input" className={linkClass("/input")} onClick={() => setMobileOpen(false)}>
              <Recycle className="w-4 h-4 flex-shrink-0" />
              Setor Sampah
            </Link>

            <Link href="/admin/warga" className={linkClass("/admin/warga")} onClick={() => setMobileOpen(false)}>
              <Users className="w-4 h-4 flex-shrink-0" />
              Data Warga
            </Link>

            <Link href="/admin/penukaran" className={linkClass("/admin/penukaran")} onClick={() => setMobileOpen(false)}>
              <Coins className="w-4 h-4 flex-shrink-0" />
              Penukaran
            </Link>

            <Link href="/admin/laporan" className={linkClass("/admin/laporan")} onClick={() => setMobileOpen(false)}>
              <History className="w-4 h-4 flex-shrink-0" />
              Laporan
            </Link>

            <Link href="/jenis-sampah" className={linkClass("/jenis-sampah")} onClick={() => setMobileOpen(false)}>
              <Database className="w-4 h-4 flex-shrink-0" />
              Kategori
            </Link>

            <Link href="/admin/kegiatan" className={linkClass("/admin/kegiatan")} onClick={() => setMobileOpen(false)}>
              <Calendar className="w-4 h-4 flex-shrink-0" />
              Kegiatan
            </Link>

            <Link href="/admin/feedback" className={linkClass("/admin/feedback")} onClick={() => setMobileOpen(false)}>
              <MessageSquare className="w-4 h-4 flex-shrink-0" />
              Feedback Warga
            </Link>
          </>
        ) : (
          <>
            {/* Warga Menu */}
            <Link href="/warga/dashboard" className={linkClass("/warga/dashboard")} onClick={() => setMobileOpen(false)}>
              <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
              Dashboard
            </Link>

            <Link href="/warga/penukaran" className={linkClass("/warga/penukaran")} onClick={() => setMobileOpen(false)}>
              <Coins className="w-4 h-4 flex-shrink-0" />
              Penukaran Poin
            </Link>

            <Link href="/warga/setoran" className={linkClass("/warga/setoran")} onClick={() => setMobileOpen(false)}>
              <History className="w-4 h-4 flex-shrink-0" />
              Setoran Saya
            </Link>

            <Link href="/warga/feedback" className={linkClass("/warga/feedback")} onClick={() => setMobileOpen(false)}>
              <MessageSquare className="w-4 h-4 flex-shrink-0" />
              Feedback / Saran
            </Link>
          </>
        )}

        <Link href="/settings" className={linkClass("/settings")} onClick={() => setMobileOpen(false)}>
          <Settings className="w-4 h-4 flex-shrink-0" />
          Settings
        </Link>
      </nav>

      {/* Footer Sidebar */}
      <div className="pt-4 border-t border-slate-200/60 space-y-1">
        <div className="px-3 py-2 flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            {(user?.nama || "A")[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate leading-none">{user?.nama || "Tamu"}</p>
            <p className="text-[9px] text-slate-400 font-semibold capitalize mt-1">{user?.role || "warga"}</p>
          </div>
        </div>

        <button 
          onClick={() => {}} 
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 transition-colors"
        >
          <HelpCircle className="w-4 h-4 text-slate-400" />
          Help Center
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-500 hover:text-white hover:bg-rose-500 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-xl bg-slate-900 text-white border border-slate-800 shadow-md"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Aside Container */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-[240px] flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {nav}
      </aside>
    </>
  );
}
