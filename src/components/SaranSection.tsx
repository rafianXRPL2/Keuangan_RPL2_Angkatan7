'use client';

import React, { useState } from 'react';

interface SaranSectionProps {
  dataSaranCloud: Record<string, string>;
  statusAdmin: boolean;
  kirimSaranCloud: (teks: string) => void;
  hapusSaranCloud: (key: string) => void;
}

export default function SaranSection({
  dataSaranCloud,
  statusAdmin,
  kirimSaranCloud,
  hapusSaranCloud
}: SaranSectionProps) {
  const [saranTeks, setSaranTeks] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saranTeks.trim()) return;
    kirimSaranCloud(saranTeks.trim());
    setSaranTeks('');
  };

  const saranKeys = Object.keys(dataSaranCloud || {});

  return (
    <div id="halaman-saran">
      <div className="form-box">
        <h3>
          <i className="fa-solid fa-comment-slash"></i> Kotak Suara Anonim (Kritik &amp; Saran Bebas)
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
          Identitas kamu dirahasiakan total. Bendahara/anak lain cuma bisa baca isinya tanpa tahu siapa pengirimnya.
        </p>
        <form onSubmit={handleSubmit}>
          <label className="form-label">Kritik &amp; Saran</label>
          <textarea
            rows={4}
            style={{ width: '100%', marginBottom: '10px' }}
            placeholder="Tulis masukan kamu di sini..."
            value={saranTeks}
            onChange={(e) => setSaranTeks(e.target.value)}
            required
          ></textarea>
          <button type="submit" className="btn btn-primary btn-auto">
            Kirim Suara Saya
          </button>
        </form>
      </div>

      {statusAdmin && (
        <div id="admin-view-saran">
          <h3 style={{ marginBottom: '10px' }}>
            <i className="fa-solid fa-inbox"></i> Daftar Aspirasi Masuk (Hanya Bendahara):
          </h3>
          <div id="list-saran-box">
            {saranKeys.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Belum ada aspirasi masuk.</p>
            ) : (
              saranKeys.map(k => (
                <div key={k} className="riwayat-item" style={{ marginBottom: '8px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                    <i className="fa-solid fa-message" style={{ color: 'var(--text-muted)', marginRight: '8px' }}></i> "{dataSaranCloud[k]}"
                  </span>
                  <button
                    className="btn-hapus-sm"
                    onClick={() => hapusSaranCloud(k)}
                  >
                    Hapus
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
