'use client';

import React from 'react';
import { ToastMessage } from '@/types/kas';

interface ToastProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export default function Toast({ toasts, removeToast }: ToastProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-[10000] flex flex-col gap-2.5 max-w-[340px] w-full pointer-events-none">
      {toasts.map(t => {
        const icon = t.tipe === 'success' ? 'fa-circle-check text-emerald-500' : (t.tipe === 'error' ? 'fa-circle-exclamation text-rose-500' : 'fa-circle-info text-blue-500');
        const borderColor = t.tipe === 'success' ? 'border-l-emerald-500' : (t.tipe === 'error' ? 'border-l-rose-500' : 'border-l-blue-500');

        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-2.5 bg-[var(--surface)] text-[var(--text-main)] border border-[var(--border-color)] ${borderColor} border-l-4 rounded-xl p-3.5 shadow-lg text-xs font-semibold animate-slide-in`}
          >
            <i className={`fa-solid ${icon} text-base mt-0.5 flex-shrink-0`}></i>
            <span className="flex-grow leading-snug">{t.pesan}</span>
            <button
              onClick={() => removeToast(t.id)}
              className="text-[var(--text-muted)] hover:text-[var(--text-main)] text-sm ml-auto p-0 flex-shrink-0"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        );
      })}
    </div>
  );
}
