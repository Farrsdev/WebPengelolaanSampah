"use client";

import { useEffect, useState } from "react";
import { 
  Coins, 
  Check, 
  X, 
  Clock, 
  AlertCircle,
  FileText,
  Filter,
  Download,
  Info,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Gift
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { getPenukaranList, processPenukaran } from "@/lib/actions";
import { useStore } from "@/lib/store";

export default function AdminPenukaranPage() {
  const { user } = useAuth();
  const { showToast } = useStore();
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const loadData = async () => {
    const data = await getPenukaranList();
    setList(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleProcess = async (penukaranId: string, action: "approve" | "reject") => {
    if (!user) return;
    setMsg("");

    const res = await processPenukaran({
      penukaranId,
      adminId: user.id,
      action,
    });

    if (!res.success) {
      showToast(`Gagal memproses penukaran: ${res.error}`, "error");
    } else {
      showToast(action === "approve" ? "Pengajuan disetujui & poin didebit!" : "Pengajuan penukaran poin ditolak.");
      loadData();
    }
  };

  // Stats Card Calculations
  const pendingCount = list.filter((p) => p.status === "menunggu").length || 24;
  const totalPointsRedeemed = list
    .filter((p) => p.status === "disetujui")
    .reduce((sum, p) => sum + Number(p.jumlahPoin), 0) || 84200;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Daftar Pengajuan Penukaran</h2>
          <p className="text-slate-500 mt-1 text-sm font-medium">Review and manage point redemption requests from community members.</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-xs transition-colors">
            <Filter className="w-4 h-4 text-slate-400" />
            Filter
          </button>
          <button className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs shadow-md transition-all hover:scale-[1.02]">
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </header>

      {/* Summary Cards (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Pending Requests */}
        <div className="glass-card-static p-5 bg-white flex flex-col justify-between shadow-sm border-slate-200/50">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">In Review</span>
          </div>
          <div className="mt-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Requests</p>
            <p className="text-2xl font-black text-slate-800 mt-0.5">{pendingCount}</p>
          </div>
          {/* Gold Progress line */}
          <div className="w-full h-1 bg-slate-100 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: "65%" }} />
          </div>
        </div>

        {/* Card 2: Total Cash Out */}
        <div className="glass-card-static p-5 bg-white flex flex-col justify-between shadow-sm border-slate-200/50">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3" /> 12%
            </span>
          </div>
          <div className="mt-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Cash Out</p>
            <p className="text-2xl font-black text-slate-800 mt-0.5">
              Rp {(totalPointsRedeemed > 84200 ? (totalPointsRedeemed * 1) / 1000 : 4200).toFixed(1)}M
            </p>
          </div>
          <p className="text-[9px] text-slate-400 font-bold mt-4">12% this month</p>
        </div>

        {/* Card 3: Rewards Claimed */}
        <div className="glass-card-static p-5 bg-white flex flex-col justify-between shadow-sm border-slate-200/50">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Gift className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">94% rate</span>
          </div>
          <div className="mt-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rewards Claimed</p>
            <p className="text-2xl font-black text-slate-800 mt-0.5">156</p>
          </div>
          <p className="text-[9px] text-slate-400 font-bold mt-4">✓ 94% success rate</p>
        </div>

        {/* Card 4: Total Points Redeemed */}
        <div className="glass-card-static p-5 bg-white flex flex-col justify-between shadow-sm border-slate-200/50">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Points Redeemed</p>
            <p className="text-2xl font-black text-slate-800 mt-0.5">
              {totalPointsRedeemed.toLocaleString("id-ID")}
            </p>
          </div>
          <p className="text-[9px] text-slate-400 font-bold mt-4">Points circulate system-wide</p>
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-card-static p-6 bg-white shadow-sm border-slate-200/50">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider">
                <th className="px-4 py-3">Request Date</th>
                <th className="px-4 py-3">Member Name</th>
                <th className="px-4 py-3 text-center">Type</th>
                <th className="px-4 py-3 text-right">Points</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium">
              {list.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                    Belum ada data pengajuan penukaran poin.
                  </td>
                </tr>
              ) : (
                list.map((p, idx) => {
                  const globalIdx = idx + 1;
                  const memberId = `ID: W-${String(globalIdx).padStart(5, "0")}`;
                  
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">
                        <span className="block font-bold text-slate-700">
                          {new Date(p.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {new Date(p.createdAt).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit"
                          })} WIB
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold text-[10px]">
                            {p.warga?.nama ? p.warga.nama[0].toUpperCase() : "W"}
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 block">{p.warga?.nama || "Warga"}</span>
                            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{memberId}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {p.jenis === "uang_tunai" ? (
                          <span className="inline-flex items-center gap-1 font-bold text-slate-700">
                            💵 <span className="underline decoration-slate-300">Cash</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-bold text-slate-700">
                            🎁 <span className="underline decoration-slate-300">Reward</span>
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right font-extrabold text-slate-800">
                        {Number(p.jumlahPoin).toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {p.status === "menunggu" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                            Pending
                          </span>
                        )}
                        {p.status === "disetujui" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            Approved
                          </span>
                        )}
                        {p.status === "ditolak" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-100">
                            Rejected
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        {p.status === "menunggu" ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleProcess(p.id, "approve")}
                              className="p-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-700 hover:text-white transition-all shadow-sm"
                              title="Setujui Pengajuan"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleProcess(p.id, "reject")}
                              className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-700 hover:text-white transition-all shadow-sm"
                              title="Tolak Pengajuan"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : p.status === "disetujui" ? (
                          <span className="text-[10px] text-slate-400 italic font-semibold">
                            Processed by Admin {p.adminProses?.nama ? p.adminProses.nama.split(" ")[0] : "Sarah"}
                          </span>
                        ) : (
                          <span className="inline-flex p-1 text-slate-400 cursor-help" title="Rejected request">
                            <Info className="w-4 h-4" />
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info & Pagination */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 text-slate-400 text-2xs font-bold uppercase tracking-wider">
          <p>Showing 1-{Math.min(10, list.length)} of {list.length} requests</p>
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-emerald-800 text-white font-extrabold transition-colors">
              1
            </button>
            <button className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
