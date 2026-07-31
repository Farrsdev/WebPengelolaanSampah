"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      {/* Blurred Backdrop */}
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" />

      {/* Glass Modal Card */}
      <div
        className="relative bg-white/85 backdrop-blur-2xl border border-white/80 shadow-2xl shadow-slate-900/10 rounded-3xl w-full max-w-lg overflow-hidden animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-slate-200/60 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent">
          <h2 className="font-bold text-slate-800 text-lg">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-200/50 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-7">{children}</div>
      </div>
    </div>
  );
}
