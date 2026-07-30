'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { AgendaItem } from '@/types/kas';

const CalendarWrapper = dynamic(() => import('@/components/CalendarWrapper'), {
  ssr: false,
  loading: () => <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>Memuat kalender kelas...</p>
});

interface KalenderSectionProps {
  dataAgendaKalenderCloud: Record<string, AgendaItem>;
  statusAdmin: boolean;
  tambahAgendaKalenderCloud: (tanggal: string, nama: string, warna: string) => void;
  hapusAgendaKalender: (key: string, title: string) => void;
  tampilkanInfoAgenda: (judul: string, tanggal: string) => void;
}

export default function KalenderSection({
  dataAgendaKalenderCloud,
  statusAdmin,
  tambahAgendaKalenderCloud,
  hapusAgendaKalender,
  tampilkanInfoAgenda
}: KalenderSectionProps) {
  const [calTanggal, setCalTanggal] = useState('');
  const [calNama, setCalNama] = useState('');
  const [calWarna, setCalWarna] = useState('#2563eb');
  const [formTertutup, setFormTertutup] = useState(false);

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setFormTertutup(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!calTanggal || !calNama.trim()) return;
    tambahAgendaKalenderCloud(calTanggal, calNama.trim(), calWarna);
    setCalTanggal('');
    setCalNama('');
  };

  const pilihWarnaTeksEvent = (hexWarna?: string) => {
    if (!hexWarna) return '#ffffff';
    let hex = hexWarna.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    let kecerahan = (r * 299 + g * 587 + b * 114) / 1000;
    return kecerahan > 150 ? '#1f2937' : '#ffffff';
  };

  const events = Object.keys(dataAgendaKalenderCloud || {}).map(k => {
    let item = dataAgendaKalenderCloud[k];
    return {
      id: k,
      title: item.title,
      start: item.start,
      backgroundColor: item.backgroundColor,
      borderColor: item.backgroundColor,
      textColor: pilihWarnaTeksEvent(item.backgroundColor)
    };
  });

  return (
    <div id="halaman-kalender">
      {statusAdmin && (
        <div id="admin-form-kalender" className={`form-box ${formTertutup ? 'tertutup' : ''}`}>
          <div className="kalender-form-header" onClick={() => setFormTertutup(!formTertutup)}>
            <h3 style={{ marginBottom: 0 }}>
              <i className="fa-solid fa-calendar-plus"></i> Tandai Kegiatan / Hari Wajib Kas (Bendahara)
            </h3>
            <i className="fa-solid fa-chevron-down kalender-form-toggle" style={{ transform: formTertutup ? 'rotate(0deg)' : 'rotate(180deg)' }}></i>
          </div>
          {!formTertutup && (
            <div className="kalender-form-konten">
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '10px 0 12px' }}>
                Pilih tanggal, lalu masukkan detail agenda atau nominal kas kelas yang harus dibawa hari itu.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div>
                    <label className="form-label">Tanggal</label>
                    <input
                      type="date"
                      value={calTanggal}
                      onChange={(e) => setCalTanggal(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Nama Kegiatan</label>
                    <input
                      type="text"
                      placeholder="Contoh: Bayar Kas Mingguan / Beli Kado Ultah Wali Kelas"
                      value={calNama}
                      onChange={(e) => setCalNama(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Kategori</label>
                    <select
                      value={calWarna}
                      onChange={(e) => setCalWarna(e.target.value)}
                    >
                      <option value="#2563eb">🔵 Kas Mingguan (Biru)</option>
                      <option value="#ef4444">🔴 Agenda Mendesak (Merah)</option>
                      <option value="#10b981">🟢 Event Kelas / Iuran Khusus (Hijau)</option>
                      <option value="#f59e0b">🟡 Pengumuman / Lainnya (Kuning)</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn btn-success btn-auto">
                  Tandai Hari Kalender
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      <div id="kalender-box" style={{ marginBottom: '20px' }}>
        <CalendarWrapper
          events={events}
          statusAdmin={statusAdmin}
          tampilkanInfoAgenda={tampilkanInfoAgenda}
          hapusAgendaKalender={hapusAgendaKalender}
        />
      </div>
    </div>
  );
}
