"use client";

import { useEffect, useState } from "react";
import { 
  MessageSquare, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { submitFeedback, getFeedbackList } from "@/lib/actions";
import { useStore } from "@/lib/store";

export default function WargaFeedbackPage() {
  const { user } = useAuth();
  const { showToast } = useStore();
  const [judul, setJudul] = useState("");
  const [isiFeedback, setIsiFeedback] = useState("");
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const loadFeedbacks = async () => {
    if (!user) return;
    const data = await getFeedbackList();
    setFeedbacks(data.filter((f) => f.userId === user.id));
  };

  useEffect(() => {
    loadFeedbacks();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!judul.trim() || !isiFeedback.trim()) {
      showToast("Judul dan isi feedback wajib diisi.", "error");
      return;
    }

    setSubmitting(true);
    const res = await submitFeedback({
      userId: user.id,
      judul,
      isiFeedback
    });

    if (res.success) {
      showToast("Aspirasi/Feedback Anda berhasil dikirim!");
      setJudul("");
      setIsiFeedback("");
      loadFeedbacks();
    } else {
      showToast(res.error || "Gagal mengirimkan feedback.", "error");
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-3xl space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Kritik & Saran Warga</h1>
        <p className="text-slate-500 mt-1 text-sm font-medium">Kirimkan aspirasi atau pengaduan langsung ke pengelola Bank Sampah.</p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left: Input Form (7 columns) */}
        <form onSubmit={handleSubmit} className="md:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/50 shadow-sm space-y-5">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider pb-3 border-b border-slate-100">Kirim Feedback</h2>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">Judul Pengaduan / Aspirasi</label>
            <input
              type="text"
              required
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Contoh: Jadwal Penjemputan Terlambat"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">Isi Masukan / Saran / Kritik</label>
            <textarea
              required
              rows={4}
              value={isiFeedback}
              onChange={(e) => setIsiFeedback(e.target.value)}
              placeholder="Tuliskan keluhan atau saran Anda secara detail..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-800/10"
          >
            <Send className="w-4 h-4" />
            {submitting ? "Mengirim..." : "Kirim Aspirasi"}
          </button>
        </form>

        {/* Right: Info Box (5 columns) */}
        <div className="md:col-span-5 bg-slate-50 rounded-2xl border border-slate-200/60 p-6 space-y-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600 flex-shrink-0">
              <HelpCircle className="w-4.5 h-4.5" />
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider mb-1">Cara Kerja Feedback</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Setiap kritik dan saran yang masuk akan divalidasi oleh admin. Status penanganan dapat dipantau langsung pada daftar riwayat feedback Anda.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* List Feedbacks */}
      <div className="glass-card-static p-6 bg-white border border-slate-200/50 shadow-sm">
        <div className="border-b border-slate-100 pb-4 mb-5 flex justify-between items-center">
          <h2 className="text-sm font-bold text-slate-800">Riwayat Pengaduan Anda</h2>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200/50">
            {feedbacks.length} Pengaduan
          </span>
        </div>

        <div className="space-y-4">
          {feedbacks.length === 0 ? (
            <p className="py-8 text-center text-xs text-slate-400">Belum ada riwayat kritik/saran.</p>
          ) : (
            feedbacks.map((f) => (
              <div key={f.id} className="p-4 bg-slate-50 border border-slate-200/50 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-800">{f.judul}</h3>
                  <p className="text-2xs text-slate-400 mt-1 font-medium">
                    Dikirim: {new Date(f.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                  <p className="text-xs text-slate-500 mt-2 font-medium bg-white p-3 rounded-lg border border-slate-200/20">{f.isiFeedback}</p>
                </div>
                <div className="flex-shrink-0 self-start sm:self-center">
                  {f.status === "pending" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      <Clock className="w-3.5 h-3.5" /> Pending
                    </span>
                  )}
                  {f.status === "dibaca" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Dibaca Admin
                    </span>
                  )}
                  {f.status === "ditindaklanjuti" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ditindaklanjuti
                    </span>
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
