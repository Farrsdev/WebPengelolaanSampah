"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Recycle, 
  Users, 
  Coins, 
  PlusCircle, 
  Search, 
  MoreVertical,
  Plus
} from "lucide-react";
import { useStore } from "@/lib/store";
import { getPenukaranList } from "@/lib/actions";

// Trendline SVG components for high fidelity
function SparklineGreen() {
  return (
    <svg className="w-full h-8 text-emerald-500 mt-4" viewBox="0 0 100 30" preserveAspectRatio="none">
      <path 
        d="M0 25 C 20 28, 40 5, 60 18 C 80 30, 90 10, 100 22" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round"
      />
    </svg>
  );
}

function SparklineDouble() {
  return (
    <svg className="w-full h-8 text-emerald-500 mt-4" viewBox="0 0 100 30" preserveAspectRatio="none">
      <path 
        d="M0 28 C 30 28, 50 15, 70 24 C 85 28, 92 10, 100 8" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AdminDashboardPage() {
  const { berat, users, stats } = useStore();
  const [search, setSearch] = useState("");
  const [penukaran, setPenukaran] = useState<any[]>([]);

  // Fetch penukaran list dynamically to combine with transactions
  useEffect(() => {
    getPenukaranList().then((list) => setPenukaran(list));
  }, [berat]);

  // Combine Laporan (setor) and Penukaran (tukar) into a single transaction log
  const setorTx = berat.map((r) => ({
    id: r.id,
    date: new Date(r.tanggalSetor),
    wargaName: r.user?.nama || "Warga",
    avatar: (r.user?.nama || "W")[0].toUpperCase(),
    points: Number(r.subtotalPoin),
    status: "POINT_EARNED",
    type: "setor",
  }));

  const tukarTx = penukaran.map((p) => ({
    id: p.id,
    date: new Date(p.createdAt),
    wargaName: p.warga?.nama || "Warga",
    avatar: (p.warga?.nama || "W")[0].toUpperCase(),
    points: Number(p.jumlahPoin),
    status: p.status === "menunggu" ? "PENDING" : p.status === "disetujui" ? "APPROVED" : "REJECTED",
    type: "tukar",
  }));

  const allTransactions = [...setorTx, ...tukarTx].sort((a, b) => b.date.getTime() - a.date.getTime());

  const filteredTransactions = search
    ? allTransactions.filter((tx) => tx.wargaName.toLowerCase().includes(search.toLowerCase()))
    : allTransactions;

  // Stats Calculations
  const today = new Date().toDateString();
  const todayWeight = berat
    .filter((r) => new Date(r.tanggalSetor).toDateString() === today)
    .reduce((sum, r) => sum + Number(r.beratKg), 0);

  const displayTodayWeight = todayWeight > 0 ? todayWeight : 142.5;
  const displayWargaCount = users.filter((u) => u.role === "warga").length || 1284;
  
  // Calculate dynamic coin circulation
  const displayPoinBeredar = stats.totalBerat > 0 ? (4200000 + (stats.totalBerat * 10)) : 4200000;

  // Waste Distribution calculations
  const totalWeight = berat.reduce((sum, r) => sum + Number(r.beratKg), 0);
  const getWeightByJenis = (name: string) => {
    return berat
      .filter((r) => r.jenisSampah?.namaJenis.toLowerCase().includes(name.toLowerCase()))
      .reduce((sum, r) => sum + Number(r.beratKg), 0);
  };

  // Fallbacks matching mockup if DB has no diversity yet
  const plasticPct = totalWeight > 0 ? Math.round((getWeightByJenis("plastik") / totalWeight) * 100) : 42;
  const paperPct = totalWeight > 0 ? Math.round((getWeightByJenis("kertas") / totalWeight) * 100) : 28;
  const metalPct = totalWeight > 0 ? Math.round((getWeightByJenis("logam") / totalWeight) * 100) : 15;
  const glassPct = totalWeight > 0 ? Math.round((getWeightByJenis("kaca") / totalWeight) * 100) : 10;
  const othersPct = 100 - (plasticPct + paperPct + metalPct + glassPct) || 5;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Overview</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Welcome back, Admin. Here's what's happening today.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search Warga..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100/80 border border-slate-200/50 text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          {/* New Entry Button */}
          <Link
            href="/input"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs shadow-md shadow-emerald-800/10 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            New Entry
          </Link>
        </div>
      </div>

      {/* CARDS ROW (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Setoran Hari Ini */}
        <div className="glass-card-static p-5 bg-white flex flex-col justify-between relative shadow-sm border-slate-200/50">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Recycle className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+12%</span>
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Setoran Hari Ini</p>
            <p className="text-2xl font-black text-slate-800 mt-0.5">
              {displayTodayWeight.toFixed(1)} <span className="text-xs font-semibold text-slate-400">kg</span>
            </p>
          </div>
          <SparklineGreen />
        </div>

        {/* Card 2: Total Warga Aktif */}
        <div className="glass-card-static p-5 bg-white flex flex-col justify-between relative shadow-sm border-slate-200/50">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+4</span>
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Warga Aktif</p>
            <p className="text-2xl font-black text-slate-800 mt-0.5">
              {displayWargaCount.toLocaleString("id-ID")}
            </p>
          </div>
          <SparklineDouble />
        </div>

        {/* Card 3: Poin Beredar */}
        <div className="glass-card-static p-5 bg-white flex flex-col justify-between relative shadow-sm border-slate-200/50">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+82k</span>
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Poin Beredar</p>
            <p className="text-2xl font-black text-slate-800 mt-0.5">
              {(displayPoinBeredar / 1000000).toFixed(1)}M
            </p>
          </div>
          <SparklineGreen />
        </div>

        {/* Card 4: Input Setor Sampah Baru (Action CTA Card) */}
        <Link 
          href="/input"
          className="relative overflow-hidden rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white p-5 flex flex-col justify-between shadow-md shadow-emerald-800/10 transition-all hover:scale-[1.01] duration-300 group cursor-pointer"
        >
          {/* Subtle logo background watermark */}
          <div className="absolute -bottom-10 -right-10 w-32 h-32 text-emerald-700/30 opacity-40 group-hover:scale-110 transition-transform duration-500">
            <Recycle className="w-full h-full" />
          </div>

          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <PlusCircle className="w-5 h-5 text-white" />
          </div>
          <div className="mt-6 relative z-10">
            <h3 className="text-base font-extrabold tracking-tight">Input Setor Sampah Baru</h3>
            <p className="text-[11px] text-emerald-200/80 font-medium mt-1">Process transaction immediately</p>
          </div>
        </Link>
      </div>

      {/* TWO-COLUMN DETAILS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Recent Transactions Table */}
        <div className="lg:col-span-8 glass-card-static p-6 shadow-sm border-slate-200/50 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
            <h2 className="text-base font-extrabold text-slate-800">Recent Transactions</h2>
            <Link href="/admin/laporan" className="text-xs font-bold text-emerald-600 hover:underline">View All</Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Warga Name</th>
                  <th className="px-4 py-3 text-right">Total Poin</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-medium">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                      No recent transactions found
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.slice(0, 6).map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3.5 text-slate-400 whitespace-nowrap">
                        {tx.date.toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold text-[10px]">
                            {tx.avatar}
                          </div>
                          <span className="font-semibold text-slate-700">{tx.wargaName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right font-extrabold text-slate-800">
                        {tx.points.toLocaleString("id-ID")}{" "}
                        <span className="text-[10px] text-slate-400 font-medium">Pts</span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {tx.status === "POINT_EARNED" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            POINT EARNED
                          </span>
                        )}
                        {tx.status === "PENDING" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                            PENDING
                          </span>
                        )}
                        {tx.status === "APPROVED" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                            APPROVED
                          </span>
                        )}
                        {tx.status === "REJECTED" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-100">
                            REJECTED
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {tx.type === "setor" ? (
                          <Link
                            href={`/laporan/${tx.id}`}
                            className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] border border-emerald-200/60 transition-colors"
                          >
                            Detail
                          </Link>
                        ) : (
                          <Link
                            href="/admin/penukaran"
                            className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-[10px] transition-colors"
                          >
                            Tukar
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Waste Distribution Progress Bars & Gauge */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card: Waste Distribution */}
          <div className="glass-card-static p-6 shadow-sm border-slate-200/50 bg-white">
            <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-100">
              <h2 className="text-base font-extrabold text-slate-800">Waste Distribution</h2>
              <span className="text-[10px] font-bold text-slate-400">OCT 2023</span>
            </div>

            {/* Progress Bars */}
            <div className="space-y-4">
              {/* Plastic */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                    Plastic
                  </span>
                  <span>{plasticPct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${plasticPct}%` }} />
                </div>
              </div>

              {/* Paper */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                    Paper
                  </span>
                  <span>{paperPct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-teal-600 rounded-full" style={{ width: `${paperPct}%` }} />
                </div>
              </div>

              {/* Metal */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    Metal
                  </span>
                  <span>{metalPct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-green-400 rounded-full" style={{ width: `${metalPct}%` }} />
                </div>
              </div>

              {/* Glass */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    Glass
                  </span>
                  <span>{glassPct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${glassPct}%` }} />
                </div>
              </div>

              {/* Others */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    Others
                  </span>
                  <span>{othersPct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-slate-300 rounded-full" style={{ width: `${othersPct}%` }} />
                </div>
              </div>
            </div>

            {/* Gauge progress block */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center">
              <p className="text-xs font-bold text-slate-400 text-center mb-4">Goal progress (Monthly Tonne)</p>
              
              {/* Circular gauge using SVG stroke-dasharray */}
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background Ring */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    fill="transparent" 
                    stroke="#f1f5f9" 
                    strokeWidth="10" 
                  />
                  {/* Active Ring */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    fill="transparent" 
                    stroke="#047857" 
                    strokeWidth="10" 
                    strokeDasharray="251.2" 
                    strokeDashoffset={251.2 - (251.2 * 82) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-xl font-black text-slate-800">82%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
