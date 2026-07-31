"use client";

import Modal from "./modal";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

export default function DeleteConfirm({
  open,
  onClose,
  onConfirm,
  itemName,
}: DeleteConfirmProps) {
  return (
    <Modal open={open} onClose={onClose} title="Hapus Data">
      <div className="flex flex-col items-center gap-4 py-2">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/10">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <p className="text-center text-slate-700 font-medium leading-relaxed">
          Apakah kamu yakin ingin menghapus <span className="font-bold text-slate-900">{itemName}</span>?
          <br />
          <span className="text-xs text-slate-400">
            Tindakan ini permanen dan tidak dapat dibatalkan.
          </span>
        </p>
        <div className="flex gap-3 w-full mt-4">
          <button
            onClick={onClose}
            className="flex-1 px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-100/60 transition-all duration-200"
          >
            Batal
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white font-semibold text-sm shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            Hapus
          </button>
        </div>
      </div>
    </Modal>
  );
}
