"use client";

import { useEffect, useState } from "react";
import { 
  MessageSquare, 
  Check, 
  Eye, 
  Clock, 
  CheckCircle2, 
  HelpCircle,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { getFeedbackList, updateFeedbackStatus } from "@/lib/actions";
import { useStore } from "@/lib/store";

export default function AdminFeedbackPage() {
  const { showToast } = useStore();
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState("semua");

  const loadFeedbacks = async () => {
    const data = await getFeedbackList();
    setFeedbacks(data);
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const handleUpdateStatus = async (id: string, nextStatus: string) => {
    const res = await updateFeedbackStatus(id, nextStatus);
    if (res.success) {
      showToast("Status feedback berhasil diperbarui!");
      loadFeedbacks();
    } else {
      showToast(res.error || "Gagal mengubah status.", "error");
    }
  };

  // Filter feedbacks
  const filtered = feedbacks.filter((f) => {
    if (filterStatus === "semua") return true;
    return f.status === filterStatus;
  });

  const pendingCount = feedbacks.filter(f => f.status === "pending").length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Kritik & Saran Warga</h2>
          <p className="text-slate-500 mt-1 text-sm font-medium">Lihat dan tindaklanjuti feedback, kritik, dan saran yang dikirimkan oleh warga.</p>
        </div>
      </header>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card-static p-5 bg-white flex items-center gap-4 shadow-sm border-slate-200/50">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Masukan</p>
            <p className="text-2xl font-black text-slate-800 mt-0.5">{feedbacks.length}</p>
          </div>
        </div>

        <div className="glass-card-static p-5 bg-white flex items-center gap-4 shadow-sm border-slate-200/50">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Masukan</p>
            <p className="text-2xl font-black text-slate-800 mt-0.5">{pendingCount}</p>
          </div>
        </div>

        <div className="glass-card-static p-5 bg-white flex items-center gap-4 shadow-sm border-slate-200/50">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Selesai Ditangani</p>
            <p className="text-2xl font-black text-slate-800 mt-0.5">{feedbacks.filter(f => f.status === "ditindaklanjuti").length}</p>
          </div>
        </div>
      </div>

      {/* Filter / Actions */}
      <div className="flex justify-between items-center pb-2">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 appearance-none"
        >
          <option value="semua">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="dibaca">Dibaca</option>
          <option value="ditindaklanjuti">Ditindaklanjuti</option>
        </select>
        <span className="text-xs font-semibold text-slate-400">Menampilkan {filtered.length} feedback</span>
      </div>

      {/* Feedback List */}
      <div className="glass-card-static p-6 bg-white shadow-sm border-slate-200/50">
        <div className="divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <p className="py-12 text-center text-xs text-slate-400">Tidak ada saran/kritik warga.</p>
          ) : (
            filtered.map((f) => (
              <div key={f.id} className="py-5 first:pt-0 last:pb-0 flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-800">{f.judul}</span>
                    <span className="text-[10px] font-medium text-slate-400">
                      Oleh: <span className="font-bold text-slate-600">{f.user?.nama || "Warga"}</span> ({f.user?.noHp})
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium bg-slate-50 p-3 rounded-lg border border-slate-200/20">{f.isiFeedback}</p>
                  <p className="text-[10px] text-slate-400 font-bold">
                    Dikirim: {new Date(f.createdAt).toLocaleString("id-ID")}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 self-start md:self-center">
                  <div className="mr-2">
                    {f.status === "pending" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        PENDING
                      </span>
                    )}
                    {f.status === "dibaca" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        DIBACA
                      </span>
                    )}
                    {f.status === "ditindaklanjuti" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        SELESAI
                      </span>
                    )}
                  </div>

                  {f.status === "pending" && (
                    <button
                      onClick={() => handleUpdateStatus(f.id, "dibaca")}
                      className="px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> Tandai Dibaca
                    </button>
                  )}

                  {f.status !== "ditindaklanjuti" && (
                    <button
                      onClick={() => handleUpdateStatus(f.id, "ditindaklanjuti")}
                      className="px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center gap-1 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" /> Tindaklanjuti
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
